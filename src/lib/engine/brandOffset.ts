import type { Gender, BrandOffsetResult } from './types'
import type { BrandOffset } from '../database.types'

// Lookup pattern per ADDENDUM_V2:
//   Step 1 — exact match: brand (case-insensitive) + specific category + gender
//   Step 2 — fallback: brand (case-insensitive) + category='All' + gender
//   Step 3 — cold start: no row found, return 0.0 offset with coldStart flag
//
// Database calls happen at the component level; this function receives the
// pre-fetched rows array and does not query Supabase directly.

export function getBrandOffset(
  brand: string,
  category: string,
  gender: Gender,
  rows: BrandOffset[]
): BrandOffsetResult {
  const normalize = (s: string) => s.toLowerCase().replace(/['\u2018\u2019`]/g, '')
  const brandNorm     = normalize(brand)
  const categoryLower = category.toLowerCase()

  const find = (cat: string): BrandOffset | undefined =>
    rows.find(
      r =>
        normalize(r.brand_name)  === brandNorm &&
        r.category.toLowerCase() === cat &&
        r.gender                 === gender
    )

  const row = find(categoryLower) ?? find('all') ?? null

  if (!row) {
    return { weightedOffset: 0, driftAdjustment: 0, effectiveOffset: 0, coldStart: true }
  }

  const weightedOffset   = row.weighted_offset ?? 0
  const driftAdjustment  = row.drift_adjustment ?? 0
  const effectiveOffset  = weightedOffset + driftAdjustment
  return { weightedOffset, driftAdjustment, effectiveOffset, coldStart: false }
}
