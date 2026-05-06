import type { Pillar } from './VerdictCard'

const ANCHOR_LABEL = 'Madewell Perfect Vintage Straight, Size 27x29'

// ── Scenario 1 — Verified Fit ──────────────────────────────────────────────────
export const SCENARIO_1 = {
  garmentName: 'Everlane 90s Cheeky Straight',
  anchorLabel: ANCHOR_LABEL,
  recommendedSize: '28 x 29',
}

export const verifiedPillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    headline: 'Stretch and recovery match your anchor.',
    status: 'verified',
    detail: 'Both items are cotton-elastane comfort stretch — the fit and feel should be consistent.',
  },
  {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    headline: 'Rise and fit match your anchor.',
    status: 'verified',
    detail: 'High rise, straight cut — matches your anchor rise and silhouette.',
  },
  {
    id: 'shape',
    name: 'Shape Retention',
    headline: 'Holds its shape through wear.',
    status: 'verified',
    detail: 'Similar fiber profile to your anchor — expect consistent fit throughout the day.',
  },
]

// ── Scenario 2 — Fit Advisory ──────────────────────────────────────────────────
export const SCENARIO_2 = {
  garmentName: 'AG Jeans Farrah Boot Jean',
  anchorLabel: ANCHOR_LABEL,
  recommendedSize: '28 x 32',
  sizeNote: 'INSEAM ADJUSTED FOR SILHOUETTE',
  footerNote: 'New to our system — treat this as a starting point',
}

export const ADVISORY_BANNER_TEXT =
  'This style sits differently than your usual preference, which may affect how the waist and hip feel.'

export const advisoryPillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    headline: 'Similar stretch to your anchor.',
    status: 'verified',
    detail: 'Both items are comfort stretch — fabric feel should be close.',
  },
  {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    headline: 'Rise is different from your usual.',
    status: 'advisory',
    detail: 'This is a mid-rise style. Your anchor sits high rise — the waist and hip fit will feel different.',
  },
  {
    id: 'shape',
    name: 'Shape Retention',
    headline: 'Holds its shape through wear.',
    status: 'verified',
    detail: 'Similar fiber profile — expect consistent fit throughout the day.',
  },
]

// ── Scenario 3 — Smart Estimate ────────────────────────────────────────────────
export const SCENARIO_3 = {
  garmentName: "Levi's 501 Original Jean",
  anchorLabel: ANCHOR_LABEL,
  recommendedSize: '29 x 30',
  footerNote: 'VERIFY BEFORE BUYING',
  bannerText: 'This item will likely feel much firmer and less stretchy than your reference item.',
}

export const estimatePillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    headline: 'Very different fabric from your anchor.',
    status: 'estimate',
    detail: "Your anchor has stretch. The Levi's 501 is 100% cotton — rigid, no give. The fit and feel will be noticeably different.",
  },
  {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    headline: 'High rise, straight cut — matches your rise.',
    status: 'estimate',
    detail: 'Rise and silhouette align with your anchor, but the rigid fabric will make the waist feel more structured.',
  },
  {
    id: 'shape',
    name: 'Shape Retention',
    headline: 'May soften slightly with wear.',
    status: 'estimate',
    detail: '100% cotton with no recovery fiber — expect the fabric to relax and loosen slightly over time.',
  },
]
