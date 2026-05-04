import type { FabricClass, RecoveryClass } from './types'

// ─── Size range lookup ────────────────────────────────────────────────────────
// Discrete table only — no arithmetic at query time.
// Women's numeric sizes: even US 0–18.
// Waist precision sizes: 22–42" (with and without "W" prefix).
// Size cap thresholds: waist ≥ 33" OR women's numeric ≥ 18.

type SizeRange = { low: number; high: number }

const WOMENS_NUMERIC: Record<string, SizeRange> = {
  '00': { low: 22.5, high: 23.5 },
  '0':  { low: 23.5, high: 24.5 },
  '2':  { low: 24.5, high: 25.5 },
  '4':  { low: 25.5, high: 26.5 },
  '6':  { low: 26.5, high: 27.5 },
  '8':  { low: 27.5, high: 29.0 },
  '10': { low: 29.0, high: 30.5 },
  '12': { low: 30.5, high: 32.0 },
  '14': { low: 32.0, high: 33.5 },
  '16': { low: 33.5, high: 35.0 },
  '18': { low: 35.0, high: 36.5 },
}

// Build waist precision entries 22–42 (and W-prefixed variants) programmatically.
// The lookup values are hard-coded constants; this just saves 42 lines of repetition.
const WAIST_PRECISION: Record<string, SizeRange> = {}
for (let n = 22; n <= 42; n++) {
  WAIST_PRECISION[`${n}`]  = { low: n, high: n }
  WAIST_PRECISION[`W${n}`] = { low: n, high: n }
}

// Waist precision fills first; women's numeric keys overwrite any collision.
// In practice there is no collision: numeric keys are ≤ 18, waist starts at 22.
const SIZE_RANGE_LOOKUP: Record<string, SizeRange> = {
  ...WAIST_PRECISION,
  ...WOMENS_NUMERIC,
}

const WOMENS_NUMERIC_KEYS = new Set(Object.keys(WOMENS_NUMERIC))

export function getSizeRangeFromLabel(size: string): SizeRange | null {
  return SIZE_RANGE_LOOKUP[size.trim()] ?? null
}

// Returns true when either size-cap condition is met:
//   waist ≥ 33"  OR  women's numeric size ≥ 18
export function checkSizeCap(size: string): boolean {
  const cleaned = size.trim()
  if (WOMENS_NUMERIC_KEYS.has(cleaned)) {
    const n = cleaned === '00' ? 0 : parseInt(cleaned, 10)
    return n >= 18
  }
  const range = getSizeRangeFromLabel(cleaned)
  return range !== null && range.low >= 33
}

// ─── Fabric classification ────────────────────────────────────────────────────
// Derived from normalized elastane_pct. Thresholds per SPEC_TWIN_LOGIC.md §2.

export function getFabricClass(elastanePct: number): FabricClass {
  if (elastanePct === 0) return 'rigid'
  if (elastanePct < 3.0) return 'comfort_stretch'
  return 'high_stretch'
}

// ─── Recovery classification ──────────────────────────────────────────────────
// poly_pct null contract: null ≠ 0. See CLAUDE.md Key Contracts.
// null  → unknown  (data absent — amber dot, no hard stop)
// 0     → low      (confirmed 0% polyester)
// <4    → moderate
// ≥4    → high

export function getRecoveryClass(polyPct: number | null): RecoveryClass {
  if (polyPct === null || polyPct === undefined) return 'unknown'
  if (polyPct === 0) return 'low'
  if (polyPct < 4) return 'moderate'
  return 'high'
}
