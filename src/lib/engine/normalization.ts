import type { FabricClass, RecoveryClass } from './types'

// ─── Size range lookup ────────────────────────────────────────────────────────
// Discrete table only — no arithmetic at query time.
// Women's numeric sizes: even US 0–18.
// Waist precision sizes: 22–42" (with and without "W" prefix).
// Size cap thresholds: waist ≥ 36" OR women's numeric ≥ 18.

type SizeRange = { low: number; high: number }

const WOMENS_NUMERIC: Record<string, SizeRange> = {
  '00': { low: 22.5, high: 24.0 },   // kept — no brand data point
  '0':  { low: 24.0, high: 26.0 },   // mid: 25
  '2':  { low: 26.0, high: 27.5 },   // mid: 27
  '4':  { low: 27.5, high: 28.5 },   // mid: 28
  '6':  { low: 28.5, high: 29.5 },   // mid: 29
  '8':  { low: 29.5, high: 30.5 },   // mid: 30
  '10': { low: 30.5, high: 32.0 },   // mid: 31
  '12': { low: 32.0, high: 33.5 },   // mid: 33
  '14': { low: 33.5, high: 35.0 },   // mid: 34
  '16': { low: 35.0, high: 37.0 },   // mid: 36
  '18': { low: 37.0, high: 39.0 },   // extrapolated (above size cap)
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

export function isWomensNumericSize(sizeFirstSegment: string): boolean {
  return WOMENS_NUMERIC_KEYS.has(stripLengthDescriptor(sizeFirstSegment.trim()))
}

export function getWomensNumericFromWaist(waist: number): string | null {
  for (const [key, range] of Object.entries(WOMENS_NUMERIC)) {
    if (waist >= range.low && waist <= range.high) return key
  }
  return null
}

// Strips inseam/length descriptors so "4 regular" and "16 short" resolve as numeric sizes.
// Applied before key lookups in getSizeRangeFromLabel and checkSizeCap.
// parseWaistSize is unaffected — its regex already ignores non-numeric tokens.
// Longer tokens (extra short, x-short) must appear before shorter ones (short, xs) to match greedily.
const LENGTH_DESCRIPTOR_RE = /\b(extra\s+short|x-short|petite|regular|reg|short|sht|long|lng|tall|tll|xs)\b/gi
function stripLengthDescriptor(size: string): string {
  return size.replace(LENGTH_DESCRIPTOR_RE, '').trim()
}

export function getSizeRangeFromLabel(size: string): SizeRange | null {
  return SIZE_RANGE_LOOKUP[stripLengthDescriptor(size)] ?? null
}

// Returns true when either size-cap condition is met:
//   waist ≥ 36"  OR  women's numeric size ≥ 18
export function checkSizeCap(size: string): boolean {
  const cleaned = stripLengthDescriptor(size)
  if (WOMENS_NUMERIC_KEYS.has(cleaned)) {
    const n = cleaned === '00' ? 0 : parseInt(cleaned, 10)
    return n >= 18
  }
  const range = getSizeRangeFromLabel(cleaned)
  return range !== null && range.low >= 36
}

// ─── Waist size extraction ────────────────────────────────────────────────────
// Returns the first number in 24–40 found in any size format.
// Women's numeric sizes (0–16) are mapped to their midpoint waist before the range check.
// '29' → 29, '29x30' → 29, 'size 30 (US 10)' → 30, '10 regular' → 30, 'M' → null

export const WOMENS_NUMERIC_TO_WAIST: Record<number, number> = {
  0: 25, 2: 27, 4: 28, 6: 29, 8: 30,
  10: 31, 12: 33, 14: 34, 16: 35
}

export function parseWaistSize(sizeString: string): number | null {
  const matches = sizeString.match(/\d+(?:\.\d+)?/g)
  if (!matches) return null
  for (const m of matches) {
    const n = parseFloat(m)
    const mapped = WOMENS_NUMERIC_TO_WAIST[n]
    if (mapped !== undefined) return mapped
    if (n >= 24 && n <= 40) return n
  }
  return null
}

// ─── Inseam extraction ───────────────────────────────────────────────────────
// Numeric extraction (x-split) takes precedence. Falls back to descriptor aliases.
// '29x30' → 30, '28 short' → 28, '10 regular' → 30, 'M' → null

type InseamDescriptor = 'extra_short' | 'short' | 'regular' | 'long' | 'tall'

const INSEAM_MAP: Record<InseamDescriptor, number> = {
  extra_short: 26, short: 28, regular: 30, long: 32, tall: 34
}

const INSEAM_ALIASES: Record<string, InseamDescriptor> = {
  xs: 'extra_short', xshort: 'extra_short',
  'x-short': 'extra_short', 'extra short': 'extra_short', 'extra_short': 'extra_short',
  s: 'short', short: 'short',
  r: 'regular', reg: 'regular', regular: 'regular',
  l: 'long', long: 'long',
  t: 'tall', tall: 'tall'
}

export function parseInseam(sizeString: string): number | null {
  // Numeric extraction — segment after x separator takes precedence
  const segments = sizeString.split(/x/i)
  if (segments.length >= 2) {
    const n = parseInt(segments[1].trim(), 10)
    if (!isNaN(n) && n >= 20 && n <= 40) return n
  }

  // Descriptor alias scan — longest alias key first to prevent short keys matching first
  const lower = sizeString.toLowerCase()
  const aliasKeys = Object.keys(INSEAM_ALIASES).sort((a, b) => b.length - a.length)
  for (const key of aliasKeys) {
    if (lower.includes(key)) return INSEAM_MAP[INSEAM_ALIASES[key]]
  }

  return null
}

// Maps a resolved inseam value to a display descriptor for numeric-format recommended sizes.
// Boundaries: ≤28 → short, 29–31 → regular, ≥32 → long.
// These are single representative values — real brand inseams vary within these ranges.
// Known simplification at MVP.
export function inseamToDescriptor(inseam: number): 'short' | 'regular' | 'long' {
  if (inseam <= 28) return 'short'
  if (inseam <= 31) return 'regular'
  return 'long'
}

// ─── Fabric classification ────────────────────────────────────────────────────
// Derived from normalized elastane_pct. Thresholds per SPEC_TWIN_LOGIC.md §2.

export function getFabricClass(elastanePct: number | null): FabricClass {
  if (elastanePct === null || elastanePct === 0) return 'rigid'
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

// ─── Brand name normalization ─────────────────────────────────────────────────
// Canonical casing for known all-caps and mixed-case brand abbreviations.
// Rule order: trim → collapse spaces → per-token title case with exceptions.

const KNOWN_BRAND_NAMES: { pattern: RegExp; canonical: string }[] = [
  { pattern: /^ag$/i,      canonical: 'AG'     },
  { pattern: /^h&m$/i,     canonical: 'H&M'    },
  { pattern: /^apc$/i,     canonical: 'APC'    },
  { pattern: /^nydj$/i,    canonical: 'NYDJ'   },
  // Note: only matches "J.Crew" with literal dot — "J Crew"
  // and "Jcrew" variants require a pre-split whole-string
  // check (future improvement)
  { pattern: /^j\.crew$/i, canonical: 'J.Crew' },
]

function titleCaseToken(token: string): string {
  for (const { pattern, canonical } of KNOWN_BRAND_NAMES) {
    if (pattern.test(token)) return canonical
  }
  // Capitalize first char, lowercase rest — handles apostrophe-S (e.g. "levi'S" → "Levi's")
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

export function normalizeBrandName(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(titleCaseToken)
    .join(' ')
}
