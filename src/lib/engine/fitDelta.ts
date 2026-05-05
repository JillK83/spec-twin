import type { SizeAdjustment } from './types'

// effective_offset = weighted_offset + drift_adjustment
// fit_delta = target_effective_offset − anchor_effective_offset
//
// Positive delta → target runs smaller than anchor → user sizes up
// Negative delta → target runs larger (more vanity) → user sizes down

export function calculateFitDelta(
  anchorEffectiveOffset: number,
  targetEffectiveOffset: number
): number {
  return targetEffectiveOffset - anchorEffectiveOffset
}

// Threshold table from SPEC_TWIN_LOGIC.md §1.
// Boundary convention: ±0.5 leans toward the adjustment (not stay_true).
// Zone:   (−∞, −1.5] → −2  |  (−1.5, −0.5] → −1  |  (−0.5, 0.5) → 0
//         [0.5, 1.5)  → +1  |  [1.5, +∞)    → +2

export function mapDeltaToSizeAdjustment(delta: number): SizeAdjustment {
  if (delta > 1.5)   return { adjustment:  2, label: 'size_up_2'   }
  if (delta >= 0.5)  return { adjustment:  1, label: 'size_up_1'   }
  if (delta > -0.5)  return { adjustment:  0, label: 'stay_true'   }
  if (delta > -1.5)  return { adjustment: -1, label: 'size_down_1' }
  return               { adjustment: -2, label: 'size_down_2' }
}
