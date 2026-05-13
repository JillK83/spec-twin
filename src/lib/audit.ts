// src/lib/audit.ts
// Full audit flow: fetch anchor → parse target → run engine → save to product_audits → return verdict

import { supabase } from './supabase'
import { parseProductDetails } from './parser'
import { getSizeRangeFromLabel, checkSizeCap, getFabricClass, getRecoveryClass, parseWaistSize, parseInseam } from './engine/normalization'
import { getBrandOffset } from './engine/brandOffset'
import { calculateFitDelta, mapDeltaToSizeAdjustment } from './engine/fitDelta'
import { evaluateFabricGate, evaluateContractGate, evaluateRiseGate, evaluateRecoveryWarning } from './engine/gates'
import { resolveOutputState } from './engine/resolver'
import type { OutputState, ConfidenceLevel, FabricClass, RecoveryClass, ContractType, Rise, Gender, GateInputs, ResolverResult } from './engine/types'
import type { UserAnchor } from './database.types'

export type AuditInput = {
  anchorId: string
  targetBrand: string
  targetModel?: string
  targetSize: string
  targetSilhouette: string
  targetFiberText: string
  targetRise: Rise
  targetUrl?: string
  userPrimaryRise: Rise
  userHeightInches?: number | null
}

export type AuditOutput = {
  auditId: string
  outputState: OutputState
  confidenceLevel: ConfidenceLevel
  recommendedSize: string
  fabricGate: boolean
  fabricGateReason: string | null
  fabricGateUserText: string | null
  contractGate: boolean
  contractGateReason: string | null
  contractGateUserText: string | null
  riseMismatchWarning: boolean
  riseMismatchNote: string | null
  recoveryWarning: boolean
  recoveryNote: string | null
  targetFabricClass: FabricClass
  targetRecoveryClass: RecoveryClass
  parserConfidence: number
  parserError?: string
  inseamNote: string | null
  inseamAvailable: boolean
  coldStart: boolean
}

const ENGINE_VERSION = 'open-mode-v1'

export async function runAudit(input: AuditInput): Promise<AuditOutput | { error: string }> {

  // ── Step 1: Fetch anchor from Supabase ──────────────────────────────────────
  const { data: anchorData, error: anchorError } = await supabase
    .from('user_anchors')
    .select('*')
    .eq('id', input.anchorId)
    .single()

  if (anchorError || !anchorData) {
    return { error: 'Anchor not found' }
  }
  // Supabase generic resolves to never in this client version; cast explicitly
  const anchor = anchorData as unknown as UserAnchor

  // ── Step 2: Parse target fiber text via Gemini ───────────────────────────────
  const parseResult = await parseProductDetails(input.targetFiberText)
  const parserError = parseResult.success ? undefined : parseResult.parser_error
  const parsed = parseResult.success ? parseResult.data : null

  // ── Step 3: Derive target fabric and recovery class ──────────────────────────
  const targetElastanePct = parsed?.elastane_pct ?? null
  const targetPolyPct = parsed?.poly_pct ?? null
  // rayon_pct parsed for future gate logic — not yet stored (column pending schema extension)
  // const targetRayonPct = parsed?.rayon_pct ?? null
  const targetClosureType = parsed?.closure_type ?? 'zipper'
  const parserConfidence = parsed?.parser_confidence ?? 0

  const targetFabricClass = getFabricClass(targetElastanePct)
  const targetRecoveryClass = getRecoveryClass(targetPolyPct)

  // ── Step 4: Normalize target size ───────────────────────────────────────────
  const targetSizeRange = getSizeRangeFromLabel(input.targetSize)
  const sizeCapped = checkSizeCap(input.targetSize)

  // ── Step 5: Brand offset lookup ──────────────────────────────────────────────
  const anchorGender = anchor.gender as string | null
  const gender: Gender = (anchorGender === 'mens' || anchorGender === 'womens') ? anchorGender : 'womens'
  const { data: offsetRows } = await supabase
    .from('brand_offsets')
    .select('*')
    .eq('gender', gender)

  // Fetch offset for anchor brand and target brand from the same pre-fetched rows
  const anchorBrandOffsetResult = getBrandOffset(
    anchor.brand_name,
    'denim',
    gender,
    offsetRows ?? []
  )

  const brandOffsetResult = getBrandOffset(
    input.targetBrand,
    'denim',
    gender,
    offsetRows ?? []
  )
  // BrandOffsetResult uses camelCase; effectiveOffset = weightedOffset + driftAdjustment
  const anchorEffectiveOffset = anchorBrandOffsetResult.effectiveOffset
  const targetEffectiveOffset = brandOffsetResult.effectiveOffset

  // ── Step 6: Fit delta + size adjustment ─────────────────────────────────────
  const fitDelta = calculateFitDelta(anchorEffectiveOffset, targetEffectiveOffset)
  const sizeAdjustment = mapDeltaToSizeAdjustment(fitDelta)

  // ── Step 7: Gate evaluation ──────────────────────────────────────────────────
  const anchorFabricClass: FabricClass = (anchor.fabric_class as FabricClass) ?? 'unknown'
  const anchorContractType = anchor.contract_type as ContractType
  const targetSizeFirstSegment = input.targetSize.trim().split(/x/i)[0]
  const targetContractType: ContractType = /\d/.test(targetSizeFirstSegment) ? 'precision' : 'range'

  const fabricGateResult = evaluateFabricGate(anchorFabricClass, targetFabricClass)
  const contractGateResult = evaluateContractGate(anchorContractType, targetContractType)
  const riseGateResult = evaluateRiseGate(input.userPrimaryRise, input.targetRise)
  const recoveryResult = evaluateRecoveryWarning(
    anchor.recovery_class as RecoveryClass,
    targetRecoveryClass
  )
  const recoveryWarning = recoveryResult.warned
  const recoveryNote = recoveryResult.note

  // ── Step 8: Resolve output state ─────────────────────────────────────────────
  const gateInputs: GateInputs = {
    fabricGate: fabricGateResult,
    contractGate: contractGateResult,
    riseGate: riseGateResult,
    recoveryWarning,
    coldStart: brandOffsetResult.coldStart,
    sizeCap: sizeCapped,
    sizeAdjustment: fitDelta,
  }

  const resolved: ResolverResult = resolveOutputState(gateInputs)

  // ── Step 9: Build recommended size string ────────────────────────────────────
  const anchorWaist = parseWaistSize(anchor.size ?? '')
  const targetWaist = parseWaistSize(input.targetSize)

  const INSEAM_SUBTRACTION: Record<string, number> = {
    skinny: 36,
    straight: 35.5,
    relaxed_loose: 35.5,
    bootcut_flare: 35,
    wide_leg: 34.5,
  }

  const anchorInseam = anchor.anchor_inseam ?? parseInseam(anchor.size ?? '')

  const overrides = anchor.preferred_inseam_overrides as Record<string, number> | null
  const overrideInseam = overrides?.[input.targetSilhouette] ?? null

  const targetSizeInseam = parseInseam(input.targetSize)

  let targetInseam: number | null
  let inseamNote: string | null = null

  if (overrideInseam !== null) {
    targetInseam = overrideInseam
  } else if (targetSizeInseam !== null) {
    targetInseam = targetSizeInseam
  } else if (input.targetSilhouette === anchor.silhouette) {
    targetInseam = anchorInseam
  } else {
    const userHeight = input.userHeightInches ?? null
    if (userHeight !== null && INSEAM_SUBTRACTION[input.targetSilhouette] !== undefined) {
      targetInseam = Math.round(userHeight - INSEAM_SUBTRACTION[input.targetSilhouette])
      inseamNote = 'INSEAM ADJUSTED FOR SILHOUETTE'
    } else {
      targetInseam = anchorInseam
    }
  }

  const inseamAvailable = targetInseam !== null

  const recommendedSize =
    anchorWaist === null || targetWaist === null
      ? 'See brand size guide'
      : inseamAvailable
        ? `${anchorWaist + sizeAdjustment.adjustment} x ${targetInseam as number}`
        : `${anchorWaist + sizeAdjustment.adjustment}`

  // ── Step 10: Save to product_audits ─────────────────────────────────────────
  const { data: savedAuditRaw, error: saveError } = await supabase
    .from('product_audits')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      reference_anchor_id: input.anchorId,
      target_brand: input.targetBrand,
      target_model: input.targetModel ?? null,
      target_category: 'denim',
      target_url: input.targetUrl ?? null,
      target_size_original: input.targetSize,
      target_size_range_low: targetSizeRange?.low ?? null,
      target_size_range_high: targetSizeRange?.high ?? null,
      target_fiber_content: input.targetFiberText,
      target_elastane_pct: targetElastanePct,
      target_poly_pct: targetPolyPct,
      // TODO: add rayon_pct column to product_audits when schema is extended
      // target_rayon_pct: parsed?.rayon_pct ?? null,
      target_fabric_class: targetFabricClass,
      target_recovery_class: targetRecoveryClass,
      target_closure_type: targetClosureType,
      target_rise: input.targetRise,
      target_contract_type: targetContractType,
      target_silhouette: input.targetSilhouette,
      target_inseam_suggested: targetInseam,
      brand_offset_used: brandOffsetResult.weightedOffset,
      brand_offset_id: brandOffsetResult.offsetId,
      drift_adjustment_used: brandOffsetResult.driftAdjustment,
      effective_offset: targetEffectiveOffset,
      fit_delta: fitDelta,
      size_adjustment: sizeAdjustment.adjustment,
      output_state: resolved.outputState,
      recommended_size: recommendedSize,
      confidence_score: parserConfidence,
      confidence_level: resolved.confidenceLevel,
      fabric_gate: fabricGateResult.type !== 'NO_GATE',
      fabric_gate_reason: fabricGateResult.reasonCode ?? null,
      contract_gate: contractGateResult.type !== 'NO_GATE',
      contract_gate_reason: contractGateResult.reasonCode ?? null,
      rise_mismatch_warning: riseGateResult.type !== 'NO_GATE',
      rise_mismatch_note: riseGateResult.type !== 'NO_GATE'
        ? 'This style sits differently than your usual preference, which may affect how the waist and hip feel.'
        : null,
      recovery_warning: recoveryWarning,
      recovery_note: recoveryNote,
      engine_version: ENGINE_VERSION,
    } as any)
    .select('id')
    .single()

  // Supabase insert returns never for product_audits in this client version; cast explicitly
  const savedAudit = savedAuditRaw as { id: string } | null

  if (saveError || !savedAudit) {
    return { error: `Failed to save audit: ${saveError?.message}` }
  }

  // ── Step 11: Return verdict to UI ────────────────────────────────────────────
  return {
    auditId: savedAudit.id,
    outputState: resolved.outputState,
    confidenceLevel: resolved.confidenceLevel,
    recommendedSize,
    fabricGate: fabricGateResult.type !== 'NO_GATE',
    fabricGateReason: fabricGateResult.reasonCode ?? null,
    fabricGateUserText: fabricGateResult.userText ?? null,
    contractGate: contractGateResult.type !== 'NO_GATE',
    contractGateReason: contractGateResult.reasonCode ?? null,
    contractGateUserText: contractGateResult.userText ?? null,
    riseMismatchWarning: riseGateResult.type !== 'NO_GATE',
    riseMismatchNote: riseGateResult.type !== 'NO_GATE'
      ? 'This style sits differently than your usual preference, which may affect how the waist and hip feel.'
      : null,
    recoveryWarning,
    recoveryNote,
    targetFabricClass,
    targetRecoveryClass,
    parserConfidence,
    parserError,
    inseamNote,
    inseamAvailable,
    coldStart: resolved.coldStart,
  }
}
