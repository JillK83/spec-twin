import type { UserAnchor } from './database.types'

export const RISE_LABELS: Record<string, string> = {
  high: 'High',
  mid: 'Mid',
  low: 'Low',
}

export const SILHOUETTE_LABELS: Record<string, string> = {
  skinny: 'Skinny',
  straight: 'Straight',
  relaxed_loose: 'Relaxed / Loose',
  bootcut_flare: 'Bootcut / Flare',
  wide_leg: 'Wide Leg',
}

export function buildAnchorLabel(anchor: UserAnchor): string {
  const name = [anchor.brand_name, anchor.model_name].filter(Boolean).join(' ')
  const riseLabel = anchor.rise ? (RISE_LABELS[anchor.rise] ?? anchor.rise) : null
  const silhouetteLabel = anchor.silhouette ? (SILHOUETTE_LABELS[anchor.silhouette] ?? anchor.silhouette) : null
  const fitDesc = [riseLabel ? `${riseLabel} rise` : null, silhouetteLabel].filter(Boolean).join(' ')
  return [name || null, fitDesc || null, `Size ${anchor.size}`].filter(Boolean).join(' · ')
}
