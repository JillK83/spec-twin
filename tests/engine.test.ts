// Engine unit tests + demo scenario dry-run.
// Run: npm test

import assert from 'node:assert/strict'
import type { BrandOffset } from '../src/lib/database.types'
import {
  getSizeRangeFromLabel,
  checkSizeCap,
  getFabricClass,
  getRecoveryClass,
  inseamToDescriptor,
  normalizeBrandName,
} from '../src/lib/engine/normalization'
import { getBrandOffset } from '../src/lib/engine/brandOffset'
import { calculateFitDelta, mapDeltaToSizeAdjustment } from '../src/lib/engine/fitDelta'
import {
  evaluateFabricGate,
  evaluateContractGate,
  evaluateRiseGate,
  evaluateRecoveryWarning,
} from '../src/lib/engine/gates'
import { resolveOutputState } from '../src/lib/engine/resolver'

// ─── Test runner ──────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(label: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`  ✓  ${label}`)
  } catch (err) {
    failed++
    console.error(`  ✗  ${label}`)
    console.error(`     ${err instanceof Error ? err.message : String(err)}`)
  }
}

// ─── Mock brand offset rows ───────────────────────────────────────────────────

function mockRow(override: Partial<BrandOffset>): BrandOffset {
  return {
    id: 'mock',
    brand_name: 'Test',
    category: 'Denim',
    gender: 'womens',
    weighted_offset: 0,
    drift_adjustment: 0,
    default_fabric_class: null,
    default_contract_type: null,
    sample_size: 0,
    last_validated: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    structure_class: null,
    fit_tag: null,
    tier: null,
    notes: null,
    ...override,
  }
}

const MOCK_ROWS: BrandOffset[] = [
  mockRow({ brand_name: 'J Brand',  category: 'Denim',  gender: 'womens', weighted_offset:  0.0, tier: 'C', fit_tag: 'true_spec'  }),
  mockRow({ brand_name: 'Everlane', category: 'Denim',  gender: 'womens', weighted_offset:  0.0, tier: 'C', fit_tag: 'true_spec'  }),
  mockRow({ brand_name: 'Madewell', category: 'Denim',  gender: 'womens', weighted_offset: -1.5, tier: 'B', fit_tag: 'vanity_high' }),
  mockRow({ brand_name: 'Madewell', category: 'All',    gender: 'mens',   weighted_offset: -0.5, tier: 'B', fit_tag: 'vanity_high' }),
  mockRow({ brand_name: "Levi's",   category: 'Denim',  gender: 'womens', weighted_offset:  0.5, tier: 'C', fit_tag: 'rigid_bias'  }),
  mockRow({ brand_name: 'Theory',   category: 'All',    gender: 'womens', weighted_offset:  0.0, tier: 'C', fit_tag: 'true_spec'  }),
  mockRow({ brand_name: 'AG Jeans', category: 'Denim',  gender: 'womens', weighted_offset:  0.0, tier: 'C', fit_tag: 'true_spec'  }),
]

// ─── 1. Normalization ─────────────────────────────────────────────────────────

console.log('\n── normalization ────────────────────────────────────────────────')

test('getSizeRangeFromLabel("10") → {low:30.5, high:32}', () => {
  const r = getSizeRangeFromLabel('10')
  assert.ok(r)
  assert.equal(r.low,  30.5)
  assert.equal(r.high, 32.0)
})

test('getSizeRangeFromLabel("28") → {low:28, high:28}', () => {
  const r = getSizeRangeFromLabel('28')
  assert.ok(r)
  assert.equal(r.low,  28)
  assert.equal(r.high, 28)
})

test('getSizeRangeFromLabel("W30") → {low:30, high:30}', () => {
  const r = getSizeRangeFromLabel('W30')
  assert.ok(r)
  assert.equal(r.low,  30)
  assert.equal(r.high, 30)
})

test('getSizeRangeFromLabel("XS") → null (unrecognized)', () => {
  assert.equal(getSizeRangeFromLabel('XS'), null)
})

test('getSizeRangeFromLabel("4 regular") → {low:27.5, high:28.5} (strips descriptor)', () => {
  const r = getSizeRangeFromLabel('4 regular')
  assert.ok(r)
  assert.equal(r.low,  27.5)
  assert.equal(r.high, 28.5)
})

test('getSizeRangeFromLabel("10 tall") → {low:30.5, high:32} (strips descriptor)', () => {
  const r = getSizeRangeFromLabel('10 tall')
  assert.ok(r)
  assert.equal(r.low,  30.5)
  assert.equal(r.high, 32.0)
})

test('getSizeRangeFromLabel("4 reg") → {low:27.5, high:28.5} (strips abbreviated descriptor)', () => {
  const r = getSizeRangeFromLabel('4 reg')
  assert.ok(r)
  assert.equal(r.low,  27.5)
  assert.equal(r.high, 28.5)
})

test('checkSizeCap("18") → true (women\'s numeric ≥ 18)', () => {
  assert.equal(checkSizeCap('18'), true)
})

test('checkSizeCap("16") → false (women\'s numeric < 18)', () => {
  assert.equal(checkSizeCap('16'), false)
})

test('checkSizeCap("16 regular") → false (strips descriptor, numeric < 18)', () => {
  assert.equal(checkSizeCap('16 regular'), false)
})

test('checkSizeCap("16 reg") → false (strips abbreviated descriptor, numeric < 18)', () => {
  assert.equal(checkSizeCap('16 reg'), false)
})

test('checkSizeCap("4 short") → false (strips descriptor, numeric < 18)', () => {
  assert.equal(checkSizeCap('4 short'), false)
})

test('checkSizeCap("33") → false (waist < 36")', () => {
  assert.equal(checkSizeCap('33'), false)
})

test('checkSizeCap("36") → true (waist ≥ 36")', () => {
  assert.equal(checkSizeCap('36'), true)
})

test('checkSizeCap("32") → false (waist < 33")', () => {
  assert.equal(checkSizeCap('32'), false)
})

test('inseamToDescriptor(28) → short (boundary ≤28)', () => {
  assert.equal(inseamToDescriptor(28), 'short')
})

test('inseamToDescriptor(26) → short', () => {
  assert.equal(inseamToDescriptor(26), 'short')
})

test('inseamToDescriptor(30) → regular', () => {
  assert.equal(inseamToDescriptor(30), 'regular')
})

test('inseamToDescriptor(29) → regular (boundary 29)', () => {
  assert.equal(inseamToDescriptor(29), 'regular')
})

test('inseamToDescriptor(32) → long (boundary ≥32)', () => {
  assert.equal(inseamToDescriptor(32), 'long')
})

test('inseamToDescriptor(34) → long', () => {
  assert.equal(inseamToDescriptor(34), 'long')
})

test('getFabricClass(0) → rigid', () => {
  assert.equal(getFabricClass(0), 'rigid')
})

test('getFabricClass(2.95) → comfort_stretch', () => {
  assert.equal(getFabricClass(2.95), 'comfort_stretch')
})

test('getFabricClass(3.0) → high_stretch', () => {
  assert.equal(getFabricClass(3.0), 'high_stretch')
})

test('getFabricClass(10) → high_stretch', () => {
  assert.equal(getFabricClass(10), 'high_stretch')
})

test('getRecoveryClass(null) → unknown', () => {
  assert.equal(getRecoveryClass(null), 'unknown')
})

test('getRecoveryClass(0) → low', () => {
  assert.equal(getRecoveryClass(0), 'low')
})

test('getRecoveryClass(2) → moderate', () => {
  assert.equal(getRecoveryClass(2), 'moderate')
})

test('getRecoveryClass(4) → high', () => {
  assert.equal(getRecoveryClass(4), 'high')
})

// ─── 2. Brand offset ──────────────────────────────────────────────────────────

console.log('\n── brandOffset ──────────────────────────────────────────────────')

test('Everlane Denim womens → weightedOffset 0.0, not cold start', () => {
  const r = getBrandOffset('Everlane', 'Denim', 'womens', MOCK_ROWS)
  assert.equal(r.weightedOffset,  0.0)
  assert.equal(r.effectiveOffset, 0.0)
  assert.equal(r.coldStart,       false)
})

test('Madewell Denim womens → weightedOffset -1.5, not cold start', () => {
  const r = getBrandOffset('Madewell', 'Denim', 'womens', MOCK_ROWS)
  assert.equal(r.weightedOffset,  -1.5)
  assert.equal(r.effectiveOffset, -1.5)
  assert.equal(r.coldStart,       false)
})

test('Madewell Tops mens → falls back to All/mens row', () => {
  const r = getBrandOffset('Madewell', 'Tops', 'mens', MOCK_ROWS)
  assert.equal(r.weightedOffset,  -0.5)
  assert.equal(r.coldStart,       false)
})

test('Unknown brand → weightedOffset 0.0, cold start true', () => {
  const r = getBrandOffset('NoSuchBrand', 'Denim', 'womens', MOCK_ROWS)
  assert.equal(r.weightedOffset,  0.0)
  assert.equal(r.effectiveOffset, 0.0)
  assert.equal(r.coldStart,       true)
})

test('Case-insensitive match: "everlane" matches "Everlane"', () => {
  const r = getBrandOffset('everlane', 'denim', 'womens', MOCK_ROWS)
  assert.equal(r.coldStart, false)
})

test('Theory Tops womens → falls back to All/womens row', () => {
  const r = getBrandOffset('Theory', 'Tops', 'womens', MOCK_ROWS)
  assert.equal(r.weightedOffset, 0.0)
  assert.equal(r.coldStart,      false)
})

// ─── 3. Fit delta ─────────────────────────────────────────────────────────────

console.log('\n── fitDelta ─────────────────────────────────────────────────────')

test('calculateFitDelta(0.0, 0.0) → 0.0', () => {
  assert.equal(calculateFitDelta(0, 0), 0)
})

test('calculateFitDelta(0.0, -1.5) → -1.5  (Madewell scenario)', () => {
  assert.equal(calculateFitDelta(0, -1.5), -1.5)
})

test('calculateFitDelta(0.0, 0.5) → 0.5  (Levi\'s scenario)', () => {
  assert.equal(calculateFitDelta(0, 0.5), 0.5)
})

test('mapDeltaToSizeAdjustment(0.0) → stay_true / 0', () => {
  const r = mapDeltaToSizeAdjustment(0)
  assert.equal(r.adjustment, 0)
  assert.equal(r.label,      'stay_true')
})

test('mapDeltaToSizeAdjustment(0.5) → size_up_1 / +1', () => {
  const r = mapDeltaToSizeAdjustment(0.5)
  assert.equal(r.adjustment, 1)
  assert.equal(r.label,      'size_up_1')
})

test('mapDeltaToSizeAdjustment(1.5) → size_up_1 / +1', () => {
  const r = mapDeltaToSizeAdjustment(1.5)
  assert.equal(r.adjustment, 1)
  assert.equal(r.label,      'size_up_1')
})

test('mapDeltaToSizeAdjustment(-0.5) → size_down_1 / -1', () => {
  const r = mapDeltaToSizeAdjustment(-0.5)
  assert.equal(r.adjustment, -1)
  assert.equal(r.label,      'size_down_1')
})

test('mapDeltaToSizeAdjustment(-1.5) → size_down_2 / -2', () => {
  const r = mapDeltaToSizeAdjustment(-1.5)
  assert.equal(r.adjustment, -2)
  assert.equal(r.label,      'size_down_2')
})

test('mapDeltaToSizeAdjustment(-0.49) → stay_true', () => {
  assert.equal(mapDeltaToSizeAdjustment(-0.49).adjustment, 0)
})

// ─── 4. Gates ─────────────────────────────────────────────────────────────────

console.log('\n── gates ────────────────────────────────────────────────────────')

test('fabricGate: same class → NO_GATE', () => {
  const r = evaluateFabricGate('comfort_stretch', 'comfort_stretch')
  assert.equal(r.fired, false)
  assert.equal(r.type,  'NO_GATE')
  assert.equal(r.classesApart, 0)
})

test('fabricGate: comfort_stretch → high_stretch → NO_GATE (tolerated upgrade)', () => {
  const r = evaluateFabricGate('comfort_stretch', 'high_stretch')
  assert.equal(r.fired, false)
  assert.equal(r.type,  'NO_GATE')
  assert.equal(r.classesApart, 1)
})

test('fabricGate: rigid → comfort_stretch → SOFT_WARNING (FABRIC_RIGID_TO_COMFORT)', () => {
  const r = evaluateFabricGate('rigid', 'comfort_stretch')
  assert.equal(r.fired, true)
  assert.equal(r.type,  'SOFT_WARNING')
})

test('fabricGate: comfort_stretch → rigid → SOFT_WARNING (spec §4)', () => {
  const r = evaluateFabricGate('comfort_stretch', 'rigid')
  assert.equal(r.fired,        true)
  assert.equal(r.type,         'SOFT_WARNING')
  assert.equal(r.outputState,  'fit_advisory')
  assert.equal(r.reasonCode,   'FABRIC_COMFORT_TO_RIGID')
  assert.equal(r.classesApart, 1)
})

test('fabricGate: high_stretch → rigid → HARD_STOP (two-class going firmer)', () => {
  const r = evaluateFabricGate('high_stretch', 'rigid')
  assert.equal(r.fired,       true)
  assert.equal(r.type,        'HARD_STOP')
  assert.equal(r.outputState, 'smart_estimate')
  assert.equal(r.classesApart, 2)
})

test('fabricGate: rigid → high_stretch → SOFT_WARNING (classesApart=2)', () => {
  const r = evaluateFabricGate('rigid', 'high_stretch')
  assert.equal(r.fired,        true)
  assert.equal(r.type,         'SOFT_WARNING')
  assert.equal(r.classesApart, 2)
})

test('fabricGate: high_stretch → comfort_stretch → SOFT_WARNING', () => {
  const r = evaluateFabricGate('high_stretch', 'comfort_stretch')
  assert.equal(r.fired, true)
  assert.equal(r.type,  'SOFT_WARNING')
})

test('contractGate: precision → precision → NO_GATE', () => {
  const r = evaluateContractGate('precision', 'precision')
  assert.equal(r.fired, false)
  assert.equal(r.type,  'NO_GATE')
})

test('contractGate: precision → range → SOFT_WARNING', () => {
  const r = evaluateContractGate('precision', 'range')
  assert.equal(r.fired,       true)
  assert.equal(r.type,        'SOFT_WARNING')
  assert.equal(r.outputState, 'fit_advisory')
})

test('contractGate: range → precision → HARD_STOP', () => {
  const r = evaluateContractGate('range', 'precision')
  assert.equal(r.fired,       true)
  assert.equal(r.type,        'HARD_STOP')
  assert.equal(r.outputState, 'smart_estimate')
})

test('riseGate: mid → mid → NO_GATE', () => {
  const r = evaluateRiseGate('mid', 'mid')
  assert.equal(r.fired, false)
})

test('riseGate: mid → high → SOFT_WARNING', () => {
  const r = evaluateRiseGate('mid', 'high')
  assert.equal(r.fired,       true)
  assert.equal(r.type,        'SOFT_WARNING')
  assert.equal(r.outputState, 'fit_advisory')
  assert.equal(r.reasonCode,  'RISE_MISMATCH')
})

test('recoveryWarning: high → low → true', () => {
  assert.equal(evaluateRecoveryWarning('high', 'low'), true)
})

test('recoveryWarning: high → moderate → false', () => {
  assert.equal(evaluateRecoveryWarning('high', 'moderate'), false)
})

test('recoveryWarning: unknown → low → false (null anchor not high)', () => {
  assert.equal(evaluateRecoveryWarning('unknown', 'low'), false)
})

// ─── 5. Demo scenarios ────────────────────────────────────────────────────────

console.log('\n── demo scenarios ───────────────────────────────────────────────')

// Scenario 1 ─────────────────────────────────────────────────────────────────
// Madewell Perfect Vintage Straight (comfort_stretch, offset -1.5, high-rise)
//   → Everlane (comfort_stretch, offset 0.0, high-rise)
// Expected: verified_fit, HIGH confidence, no gates
// Note: delta=+1.5 → size_up_2, but no gates fire → no compounding escalation

test('Scenario 1 — verified_fit, no gates', () => {
  const anchor = getBrandOffset('Madewell', 'Denim', 'womens', MOCK_ROWS)
  const target = getBrandOffset('Everlane', 'Denim', 'womens', MOCK_ROWS)

  const delta        = calculateFitDelta(anchor.effectiveOffset, target.effectiveOffset)
  const sizeAdj      = mapDeltaToSizeAdjustment(delta)
  const fabricGate   = evaluateFabricGate('comfort_stretch', 'comfort_stretch')
  const contractGate = evaluateContractGate('precision', 'precision')
  const riseGate     = evaluateRiseGate('high', 'high')
  const recovery     = evaluateRecoveryWarning('unknown', 'moderate')

  const result = resolveOutputState({
    fabricGate,
    contractGate,
    riseGate,
    recoveryWarning: recovery as boolean,
    coldStart: anchor.coldStart || target.coldStart,
    sizeCap: false,
    sizeAdjustment: sizeAdj.adjustment,
  })

  assert.equal(delta,                  1.5)
  assert.equal(sizeAdj.adjustment,     1)
  assert.equal(result.outputState,     'verified_fit')
  assert.equal(result.confidenceLevel, 'HIGH')
  assert.equal(result.firedGates.length, 0)
})

// Scenario 2 ─────────────────────────────────────────────────────────────────
// Madewell Perfect Vintage Straight (comfort_stretch, offset -1.5, high-rise)
//   → AG Jeans Farrah Boot Jean (comfort_stretch, offset 0.0, mid-rise)
// Expected: fit_advisory, MEDIUM confidence, RISE_MISMATCH gate
// Note: delta=+1.5 → size_up_2, but fabric gate is NO_GATE → no compounding escalation

test('Scenario 2 — fit_advisory, rise mismatch', () => {
  const anchor = getBrandOffset('Madewell',  'Denim', 'womens', MOCK_ROWS)
  const target = getBrandOffset('AG Jeans',  'Denim', 'womens', MOCK_ROWS)

  const delta        = calculateFitDelta(anchor.effectiveOffset, target.effectiveOffset)
  const sizeAdj      = mapDeltaToSizeAdjustment(delta)
  const fabricGate   = evaluateFabricGate('comfort_stretch', 'comfort_stretch')
  const contractGate = evaluateContractGate('precision', 'precision')
  const riseGate     = evaluateRiseGate('high', 'mid')  // anchor high-rise, target mid-rise
  const recovery     = evaluateRecoveryWarning('unknown', 'moderate')

  const result = resolveOutputState({
    fabricGate,
    contractGate,
    riseGate,
    recoveryWarning: recovery as boolean,
    coldStart: anchor.coldStart || target.coldStart,
    sizeCap: false,
    sizeAdjustment: sizeAdj.adjustment,
  })

  assert.equal(delta,                  1.5)
  assert.equal(sizeAdj.adjustment,     1)        // AG Jeans true-spec vs Madewell vanity → size up 1
  assert.equal(result.outputState,     'fit_advisory')
  assert.equal(result.confidenceLevel, 'MEDIUM')
  assert.ok(result.firedGates.includes('RISE_MISMATCH'))
})

// Scenario 3 ─────────────────────────────────────────────────────────────────
// Madewell Perfect Vintage Straight (comfort_stretch, offset -1.5, high-rise)
//   → Levi's 501 (rigid, offset +0.5, high-rise)
// comfort_stretch → rigid = SOFT_WARNING + delta=+2.0 (size_up_2)
// → compounding uncertainty escalation → smart_estimate, LOW confidence

test('Scenario 3 — smart_estimate, compounding uncertainty (COMFORT_TO_RIGID + size_up_2)', () => {
  const anchor = getBrandOffset('Madewell', 'Denim', 'womens', MOCK_ROWS)
  const target = getBrandOffset("Levi's",   'Denim', 'womens', MOCK_ROWS)

  const delta        = calculateFitDelta(anchor.effectiveOffset, target.effectiveOffset)
  const sizeAdj      = mapDeltaToSizeAdjustment(delta)
  const fabricGate   = evaluateFabricGate('comfort_stretch', 'rigid')
  const contractGate = evaluateContractGate('precision', 'precision')
  const riseGate     = evaluateRiseGate('high', 'high')
  const recovery     = evaluateRecoveryWarning('unknown', 'low')

  const result = resolveOutputState({
    fabricGate,
    contractGate,
    riseGate,
    recoveryWarning: recovery as boolean,
    coldStart: anchor.coldStart || target.coldStart,
    sizeCap: false,
    sizeAdjustment: sizeAdj.adjustment,
  })

  assert.equal(delta,                  2.0)
  assert.equal(sizeAdj.adjustment,     2)        // Madewell vanity + Levi's rigid bias → size up 2
  assert.equal(fabricGate.type,        'SOFT_WARNING')
  assert.equal(result.outputState,     'smart_estimate')
  assert.equal(result.confidenceLevel, 'LOW')
  assert.ok(result.firedGates.includes('FABRIC_COMFORT_TO_RIGID'))
})

// ─── 6. Resolver — cold-start edge cases ──────────────────────────────────────

test('cold start with no other gates → fit_advisory (State 8 reachable)', () => {
  const noGate = { fired: false, type: 'NO_GATE' as const, outputState: null, reasonCode: null, userText: null }
  const result = resolveOutputState({
    fabricGate:      { ...noGate, classesApart: 0 },
    contractGate:    noGate,
    riseGate:        noGate,
    recoveryWarning: false,
    coldStart:       true,
    sizeCap:         false,
    sizeAdjustment:  0,
  })
  assert.equal(result.outputState,     'fit_advisory')
  assert.equal(result.confidenceLevel, 'MEDIUM')
  assert.equal(result.coldStart,       true)
})

// ─── 7. Brand name normalization ──────────────────────────────────────────────

console.log('\n── normalizeBrandName ───────────────────────────────────────────')

test('normalizeBrandName("madewell") → "Madewell"', () => {
  assert.equal(normalizeBrandName('madewell'), 'Madewell')
})

test('normalizeBrandName("MADEWELL") → "Madewell"', () => {
  assert.equal(normalizeBrandName('MADEWELL'), 'Madewell')
})

test('normalizeBrandName("ag jeans") → "AG Jeans"', () => {
  assert.equal(normalizeBrandName('ag jeans'), 'AG Jeans')
})

test("normalizeBrandName(\"levi'S\") → \"Levi's\"", () => {
  assert.equal(normalizeBrandName("levi'S"), "Levi's")
})

test('normalizeBrandName("GAP") → "Gap"', () => {
  assert.equal(normalizeBrandName('GAP'), 'Gap')
})

test('normalizeBrandName("abercrombie & fitch") → "Abercrombie & Fitch"', () => {
  assert.equal(normalizeBrandName('abercrombie & fitch'), 'Abercrombie & Fitch')
})

test('normalizeBrandName("  zara  ") → "Zara" (trims whitespace)', () => {
  assert.equal(normalizeBrandName('  zara  '), 'Zara')
})

test('normalizeBrandName("h&m") → "H&M"', () => {
  assert.equal(normalizeBrandName('h&m'), 'H&M')
})

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n── results: ${passed} passed, ${failed} failed ──────────────────────────────────\n`)
if (failed > 0) process.exit(1)
