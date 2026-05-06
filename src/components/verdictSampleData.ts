import type { Pillar } from './VerdictCard'

export const VERDICT_SAMPLE = {
  garmentName: 'AGOLDE 90s Jean',
  anchorLabel: 'Madewell Perfect Vintage Straight, Size 27x29',
  recommendedSize: '27',
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
    headline: 'Sits where you expect it to sit.',
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

export const advisoryPillars: Pillar[] = [
  {
    id: 'fabric',
    name: 'Fabric Behavior',
    headline: 'Similar stretch to your anchor.',
    status: 'advisory',
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

export const reducedPillars: Pillar[] = [
  {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    headline: 'Estimated from category average.',
    status: 'estimate',
    detail: 'Brand size chart not available — using category benchmarks for waist and hip.',
  },
  {
    id: 'shape',
    name: 'Shape Retention',
    headline: 'Estimated from category average.',
    status: 'estimate',
    detail: 'Without weave details, retention is projected from similar silhouettes.',
  },
]

export const ADVISORY_BANNER_TEXT =
  'This style sits differently than your usual preference, which may affect how the waist and hip feel.'
