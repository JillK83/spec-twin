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
    status: 'verified',
    headline: 'Fabric matches your Madewell',
    detail: 'Both items have the same amount of stretch. The fabric won\'t be a factor in how this fits compared to your Madewell.',
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
  recommendedSize: '28 x 30',
  sizeNote: 'INSEAM ADJUSTED FOR SILHOUETTE',
  footerNote: 'New to our system — treat this as a starting point',
}

export const ADVISORY_BANNER_TEXT =
  'This style sits differently than your usual preference, which may affect how the waist and hip feel.'

export const advisoryPillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    status: 'verified',
    headline: 'Fabric matches your Madewell',
    detail: 'Both items have the same amount of stretch. The fabric won\'t be a factor in how this fits compared to your Madewell.',
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
  footerNote: 'VERIFY BEFORE BUYING',
  bannerText: 'This item will likely feel much firmer and less stretchy than your reference item.',
}

export const estimatePillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    status: 'estimate',
    headline: 'Very different fabric from your Madewell',
    detail: 'Your Madewell has a little stretch. This item has none — it will feel noticeably more structured and may fit very differently through the waist and hip. Check the brand\'s size guide before buying.',
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
    status: 'estimate',
    headline: 'May loosen more than your Madewell',
    detail: "Your Madewell has a small amount of recovery fiber that helps it hold its shape. This item has none — expect it to relax and feel looser through the day, especially at the knees and seat.",
  },
]
