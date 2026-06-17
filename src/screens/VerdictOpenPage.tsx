import { useNavigate, useLocation } from 'react-router-dom'
import { VerdictCard } from '@/components/VerdictCard'
import type { VerdictState, Pillar, PillarStatus } from '@/components/VerdictCard'
import { Button } from '@/components/ui/magic/Button'
import type { AuditOutput } from '@/lib/audit'

function getFabricBehaviorPillar(
  output: AuditOutput,
  verdictState: VerdictState,
  anchorBrand: string,
  targetBrand: string,
): Pillar {
  const { fabricGate, fabricGateReason, targetFabricClass } = output

  const resolvedStatus: PillarStatus =
    (fabricGate || targetFabricClass === 'unknown') ? 'advisory' : 'verified'
  const status: PillarStatus = verdictState === 'estimate' ? 'estimate' : resolvedStatus

  const anchorStretchDesc = fabricGateReason === 'FABRIC_HIGH_STRETCH_TO_RIGID'
    ? 'significant stretch'
    : 'a little stretch'

  const isSameBrand = anchorBrand.toLowerCase() === targetBrand.toLowerCase()
  const brandRef = isSameBrand ? 'your anchor' : anchorBrand
  const brandRefTitle = isSameBrand ? 'Your anchor' : anchorBrand

  // State 7 — unknown fabric class: composition unparseable (amber)
  if (targetFabricClass === 'unknown') {
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: 'Fabric data unavailable',
      detail: `We couldn't read the fabric composition for this item. Check the label before buying — the fit and feel may differ from ${brandRef}.`,
    }
  }

  // State 1 — Hard Stop: high_stretch → rigid (always smart_estimate)
  if (fabricGateReason === 'FABRIC_HIGH_STRETCH_TO_RIGID') {
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: `Very different fabric from ${brandRef}`,
      detail: `${brandRefTitle} has ${anchorStretchDesc}. This item has none — it will feel noticeably more structured and may fit very differently through the waist and hip.`,
    }
  }

  // State 2 — comfort_stretch → rigid: Hard Stop (escalated) or Soft Warning
  if (fabricGateReason === 'FABRIC_COMFORT_TO_RIGID') {
    if (verdictState === 'estimate') {
      return {
        id: 'fabric',
        name: 'Fabric Behavior',
        status,
        headline: `Very different fabric from ${brandRef}`,
        detail: `${brandRefTitle} has ${anchorStretchDesc}. This item has none — it will feel noticeably more structured and may fit very differently through the waist and hip.`,
      }
    }
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: `Less stretch than ${brandRef}`,
      detail: `This item has no elastane — it will feel more structured than ${brandRef}. The waist and hip fit may feel tighter, especially after a few hours of wear.`,
    }
  }

  // State 3 — high_stretch → comfort_stretch: Soft Warning (amber)
  if (fabricGateReason === 'FABRIC_HIGH_STRETCH_TO_COMFORT') {
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: `Less stretch than ${brandRef}`,
      detail: `This item has less give than ${brandRef} and may feel slightly firmer through the hip and thigh. The difference is moderate — your usual size should still work.`,
    }
  }

  // State 4 — rigid → high_stretch: Soft Warning (amber)
  if (fabricGateReason === 'FABRIC_RIGID_TO_HIGH_STRETCH') {
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: `More stretch than ${brandRef}`,
      detail: `This item is softer and more forgiving than ${brandRef}. You may want to size down if you prefer a snug fit.`,
    }
  }

  // State 4b — rigid → comfort_stretch: Soft Warning (amber)
  if (fabricGateReason === 'FABRIC_RIGID_TO_COMFORT') {
    return {
      id: 'fabric',
      name: 'Fabric Behavior',
      status,
      headline: `Has a little more give than ${brandRef}`,
      detail: `${brandRefTitle} has no stretch fiber. This item has a small amount — it will feel slightly softer and more forgiving, but the difference is mild. Size as recommended.`,
    }
  }

  // States 5–6 — no gate: same class or compatible upgrade (lime)
  return {
    id: 'fabric',
    name: 'Fabric Behavior',
    status,
    headline: `Fabric matches ${brandRef}`,
    detail: `Both items have the same amount of stretch. The fabric won't be a factor in how this fits compared to ${brandRef}.`,
  }
}

// Waist and Hip Fit copy map — 9 states per locked voice spec.
// Pending wiring (requires AuditOutput extension):
//   - riseDirection (higher/lower): needs userPrimaryRise + targetRise comparison
//   - fitDirection (smaller/larger): needs fitDelta sign exposed in AuditOutput
//   - targetSizeOriginal: needs product_audits.target_size_original in AuditOutput
//   - brand offset reason codes (euro_slim, rigid_bias, vanity_high): not yet in AuditOutput
// anchorBrand: passed via pageState.anchorBrand — needs wiring from AuditNewItemForm
function getWaistHipPillar(
  output: AuditOutput,
  verdictState: VerdictState,
  anchorBrand: string,
  targetBrand: string,
): Pillar {
  const { riseMismatchWarning, contractGate, contractGateReason, fabricGateReason, coldStart, fitDeltaSign } = output

  const triggered = riseMismatchWarning || contractGate
  const resolvedStatus: PillarStatus = triggered ? 'advisory' : 'verified'
  const status: PillarStatus = verdictState === 'estimate' ? 'estimate' : resolvedStatus

  const isSameBrand = anchorBrand.toLowerCase() === targetBrand.toLowerCase()
  const brandRef = isSameBrand ? 'your anchor' : anchorBrand

  // State 9 — range → precision HARD_STOP: sizing systems incompatible (purple)
  if (contractGateReason === 'CONTRACT_RANGE_TO_PRECISION') {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: "Can't confirm waist fit",
      detail: "This item's sizing system doesn't translate cleanly to your numeric anchor size. We can't confidently resolve the waist and hip fit.",
    }
  }

  // estimate override — no contract gate, not driven by fabric HARD_STOP: fabric diverges, waist fit unconfirmable
  if (verdictState === 'estimate' && !contractGate && fabricGateReason !== 'FABRIC_HIGH_STRETCH_TO_RIGID') {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: 'Waist fit uncertain',
      detail: `Because the fabric is very different from ${brandRef}, we can't predict how the waist and hips will actually feel. Brand sizing differences may also apply — check the size guide before ordering.`,
    }
  }

  // State 8 — cold start, no waist-hip gate (amber)
  if (coldStart && !riseMismatchWarning && !contractGate) {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: 'New to our system',
      detail: "We don't have enough data on how this brand fits yet. The waist and hip recommendation is a starting point.",
    }
  }

  // State 3 — rise mismatch (amber)
  // State 4 (rise + brand offset) collapses here until fitDirection is wired
  // {higher/lower} in detail pending riseDirection wiring
  if (riseMismatchWarning) {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: `Different rise than ${brandRef}`,
      detail: `The recommended size accounts for how this brand cuts — the waist estimate is still valid. This style sits differently than ${brandRef}, so the rise and hip feel may vary. Check the return policy before ordering.`,
    }
  }

  // States 5–7 — brand offset reason codes (euro_slim, rigid_bias, vanity_high)
  // Not yet implementable — requires reason codes in AuditOutput

  // State 2a — target brand runs smaller, size adjusted up (lime)
  if (fitDeltaSign === 'up') {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: `Runs smaller than ${brandRef}`,
      detail: `This brand cuts slightly smaller than ${brandRef}. We've accounted for that in the recommended size.`,
    }
  }

  // State 2b — target brand runs larger, size adjusted down (lime)
  if (fitDeltaSign === 'down') {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: `Runs larger than ${brandRef}`,
      detail: `This brand cuts slightly larger than ${brandRef}. We've accounted for that in the recommended size.`,
    }
  }

  // State 1 — clean match, no size adjustment (lime)
  return {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    status,
    headline: `Fits like ${brandRef}`,
    detail: `This sits and fits the same way as ${brandRef}. You should be able to order your usual size with confidence.`,
  }
}

function getShapeRetentionPillar(output: AuditOutput, verdictState: VerdictState, anchorBrand: string, targetBrand: string): Pillar {
  const { recoveryWarning, targetRecoveryClass } = output

  const resolvedStatus: PillarStatus =
    (targetRecoveryClass === 'unknown' || (recoveryWarning && targetRecoveryClass === 'low'))
      ? 'advisory'
      : 'verified'
  const status: PillarStatus = verdictState === 'estimate' ? 'estimate' : resolvedStatus

  const isSameBrand = anchorBrand.toLowerCase() === targetBrand.toLowerCase()
  const brandRef = isSameBrand ? 'your anchor' : anchorBrand
  const brandRefTitle = isSameBrand ? 'Your anchor' : anchorBrand

  // State 1a — rigid target, no recovery data: 100% cotton specific behavior
  if (targetRecoveryClass === 'unknown' && output.targetFabricClass === 'rigid') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: 'Will loosen with wear',
      detail: '100% cotton denim has no elastic fiber to snap back into shape. Expect the waist to relax up to an inch after a full day of wear, with some bagging at the knees and seat. Washing resets the fit — many people intentionally size down on first wear knowing this.',
    }
  }

  // State 1b — unknown recovery data, other fabric classes (amber)
  if (targetRecoveryClass === 'unknown') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: 'Standard stretch behavior',
      detail: "Most denim relaxes a little with wear. We don't have recovery data for this item, so we can't say how much — if fit staying snug through the day matters to you, check the fabric label before buying.",
    }
  }

  // State 2 — downgrade: target has no recovery, anchor does (amber)
  if (recoveryWarning && targetRecoveryClass === 'low') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `May loosen more than ${brandRef}`,
      detail: `${brandRefTitle} has recovery fiber that helps it bounce back. This item doesn't — it may relax and loosen slightly over time.`,
    }
  }

  // State 6 — upgrade: target has more recovery than anchor (lime)
  if (recoveryWarning) {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Holds shape better than ${brandRef}`,
      detail: `This item has more recovery fiber than ${brandRef}. It should bounce back more reliably and hold its shape through wear.`,
    }
  }

  // State 3 — both low (lime)
  if (targetRecoveryClass === 'low') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Matches ${brandRef}`,
      detail: `Both items have no recovery fiber. Expect a similar break-in pattern — the fabric may relax slightly with wear over time.`,
    }
  }

  // State 4 — both moderate (lime)
  if (targetRecoveryClass === 'moderate') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Matches ${brandRef}`,
      detail: `Both items have a similar fiber profile. Shape retention should be consistent — expect the fit to hold through the day.`,
    }
  }

  // State 5 — both high (lime)
  return {
    id: 'shape',
    name: 'Shape Retention',
    status,
    headline: `Matches ${brandRef}`,
    detail: `Both items have strong recovery fiber. The fit should snap back and hold its shape reliably through wear.`,
  }
}

export default function VerdictOpenPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const pageState = location.state as {
    auditOutput?: AuditOutput
    targetBrand?: string
    targetModel?: string
    anchorLabel?: string
    anchorBrand?: string
  } | null

  const auditOutput = pageState?.auditOutput

  if (!auditOutput) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl mx-auto text-center space-y-6">
          <p className="font-black text-2xl uppercase tracking-tight">No audit result found</p>
          <p className="text-muted-foreground font-mono text-sm">
            Navigate here from the audit form to see your verdict.
          </p>
          <Button
            className="bg-primary text-primary-foreground border-2 border-border font-black text-base py-6 px-8 uppercase tracking-wide shadow-hard"
            onClick={() => navigate('/audit/new')}
          >
            Run an Audit
          </Button>
        </div>
      </div>
    )
  }

  console.log('anchorRise:', auditOutput.anchorRise, 'targetRise:', auditOutput.targetRise)
  const verdictStateMap: Record<string, VerdictState> = {
    verified_fit: 'verified',
    fit_advisory: 'advisory',
    smart_estimate: 'estimate',
  }
  const verdictState: VerdictState = verdictStateMap[auditOutput.outputState] ?? 'estimate'

  const rawAnchorBrand = pageState?.anchorBrand
  const anchorBrand = rawAnchorBrand
    ? rawAnchorBrand.replace(/\b\w/g, c => c.toUpperCase())
    : 'item'

  const rawTargetBrand = pageState?.targetBrand
  const targetBrand = rawTargetBrand
    ? rawTargetBrand.replace(/\b\w/g, c => c.toUpperCase())
    : ''

  const pillars: Pillar[] = [
    getFabricBehaviorPillar(auditOutput, verdictState, anchorBrand, targetBrand),
    getWaistHipPillar(auditOutput, verdictState, anchorBrand, targetBrand),
    getShapeRetentionPillar(auditOutput, verdictState, anchorBrand, targetBrand),
  ]

  const garmentName =
    ([pageState?.targetBrand, pageState?.targetModel].filter(Boolean).join(' ') || 'Audited Item')
      .replace(/\b\w/g, c => c.toUpperCase())

  const recommendedSize = auditOutput.outputState === 'smart_estimate'
    ? 'See brand size guide'
    : auditOutput.recommendedSize

  // Severity-tier banner resolution per VERDICT_CARD.md Banner Text — Severity Tier System.
  // Tier 1 (size delta escalation) requires a sizeEscalation flag not yet in AuditOutput —
  // wiring it requires touching resolver.ts/audit.ts (engine-side, out of scope this session).
  // Implementing Tiers 2–5.
  const bannerCandidates: Array<{ tier: number; text: string; pillar: string }> = []

  if (auditOutput.fabricGateReason === 'FABRIC_HIGH_STRETCH_TO_RIGID' && auditOutput.fabricGateUserText) {
    bannerCandidates.push({ tier: 2, text: auditOutput.fabricGateUserText, pillar: 'Fabric Behavior' })
  }

  if (!!auditOutput.anchorRise && auditOutput.anchorRise !== auditOutput.targetRise && auditOutput.riseMismatchNote) {
    bannerCandidates.push({ tier: 3, text: auditOutput.riseMismatchNote, pillar: 'Waist and Hip Fit' })
  }

  if (auditOutput.contractGate && auditOutput.contractGateUserText) {
    bannerCandidates.push({ tier: 4, text: auditOutput.contractGateUserText, pillar: 'Waist and Hip Fit' })
  }

  const tier5Reasons = ['FABRIC_HIGH_STRETCH_TO_COMFORT', 'FABRIC_COMFORT_TO_RIGID', 'FABRIC_RIGID_TO_HIGH_STRETCH']
  if (auditOutput.fabricGate && auditOutput.fabricGateReason && tier5Reasons.includes(auditOutput.fabricGateReason) && auditOutput.fabricGateUserText) {
    bannerCandidates.push({ tier: 5, text: auditOutput.fabricGateUserText, pillar: 'Fabric Behavior' })
  }

  let advisoryBannerText: string | undefined
  if (bannerCandidates.length > 0) {
    const sorted = [...bannerCandidates].sort((a, b) => a.tier - b.tier)
    const primary = sorted[0]
    const secondary = sorted[1]
    advisoryBannerText = secondary && secondary.pillar !== primary.pillar
      ? `${primary.text} — also check ${secondary.pillar} below.`
      : primary.text
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <VerdictCard
        state={verdictState}
        garmentName={garmentName}
        anchorLabel={pageState?.anchorLabel ?? 'Your anchor'}
        recommendedSize={recommendedSize}
        sizeNote={
          !auditOutput.inseamAvailable
            ? 'Inseam not available — check brand size guide'
            : (auditOutput.inseamNote ?? undefined)
        }
        pillars={pillars}
        advisoryBannerText={advisoryBannerText}
        onReset={() => navigate('/audit/new')}
        footerNote={
          auditOutput.coldStart
            ? 'New to our system — treat this as a starting point.'
            : auditOutput.parserError
              ? `Parser note: ${auditOutput.parserError}`
              : undefined
        }
      />
    </div>
  )
}
