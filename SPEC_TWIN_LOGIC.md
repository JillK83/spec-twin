{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # SPEC_TWIN_LOGIC.md\
\
Core fit recommendation logic for The Spec-Twin Fit Auditor.\
\
**MVP scope: Women's denim only.**\
Sections marked `[FULL VISION]` are documented for reference but must not be implemented in the MVP build.\
\
---\
\
## 1. Fit Delta Calculation [MVP]\
\
```\
effective_offset = weighted_offset + drift_adjustment\
fit_delta = target_effective_offset \uc0\u8722  anchor_effective_offset\
```\
\
### Size Adjustment Decision\
\
| fit_delta range | Adjustment | Label |\
|---|---|---|\
| \uc0\u8722 0.5 to +0.5 | 0 | `stay_true` |\
| +0.5 to +1.5 | +1 | `size_up_1` |\
| \uc0\u8805  +1.5 | +2 | `size_up_2` |\
| \uc0\u8722 1.5 to \u8722 0.5 | \u8722 1 | `size_down_1` |\
| \uc0\u8804  \u8722 1.5 | \u8722 2 | `size_down_2` |\
\
### Interpretation\
- Positive `fit_delta` \uc0\u8594  target runs smaller than anchor \u8594  size up\
- Negative `fit_delta` \uc0\u8594  target runs larger than anchor \u8594  size down\
- Near-zero `fit_delta` \uc0\u8594  target should fit similarly to anchor\
\
---\
\
## 2. Fabric Classification [MVP]\
\
Derived from normalized `elastane_pct`:\
\
| elastane_pct | fabric_class |\
|---|---|\
| 0.0% | `rigid` |\
| 0.1% \'96 2.9% | `comfort_stretch` |\
| \uc0\u8805  3.0% | `high_stretch` |\
\
**Note:** Very low elastane (0.5%\'961.0%) may feel structurally close to rigid. `comfort_stretch` is a mild stretch class, not equivalent to high-stretch fabric.\
\
---\
\
## 3. Recovery Classification [MVP]\
\
Derived from `poly_pct`:\
\
| poly_pct | recovery_class |\
|---|---|\
| `null` | `unknown` \'97 amber dot, no hard stop |\
| 0.0% | `low` |\
| 0.1% \'96 3.9% | `moderate` |\
| \uc0\u8805  4.0% | `high` |\
\
**`null` and `0` are not equivalent.** See `ENGINEERING_NOTES.md` Section 4 for the full parser contract.\
\
---\
\
## 4. Fabric Gate Matrix [MVP]\
\
| Anchor fabric_class | Target fabric_class | Gate | Output State |\
|---|---|---|---|\
| `high_stretch` | `rigid` | Hard Stop | `smart_estimate` |\
| `high_stretch` | `comfort_stretch` | Soft Warning | `fit_advisory` |\
| `comfort_stretch` | `rigid` | Soft Warning | `fit_advisory` |\
| `rigid` | `high_stretch` | Soft Warning | `fit_advisory` |\
| `comfort_stretch` | `high_stretch` | No Gate | \'97 |\
| `rigid` | `comfort_stretch` | No Gate | \'97 |\
| same | same | No Gate | \'97 |\
\
**Two-class delta always triggers a Hard Stop** (`smart_estimate`).\
**One-class delta triggers a Soft Warning** (`fit_advisory`).\
\
### Confirmed FABRIC_GATES Constant\
\
```typescript\
const FABRIC_GATES = \{\
  HIGH_STRETCH_TO_RIGID:   \{ type: 'HARD_STOP',    outputState: 'smart_estimate', sizingAdj: 'size_up_1_or_2',    userText: 'This item will likely feel much firmer and less stretchy than your reference item.' \},\
  HIGH_STRETCH_TO_COMFORT: \{ type: 'SOFT_WARNING', outputState: 'fit_advisory',   sizingAdj: 'stay_or_size_up_1', userText: 'This item has less give than your reference item and may feel slightly firmer.' \},\
  COMFORT_TO_RIGID:        \{ type: 'SOFT_WARNING', outputState: 'fit_advisory',   sizingAdj: 'stay_or_size_up_1', userText: 'This item has less stretch than your reference item and may feel tighter or more structured.' \},\
  RIGID_TO_HIGH_STRETCH:   \{ type: 'SOFT_WARNING', outputState: 'fit_advisory',   sizingAdj: 'size_down_for_snug', userText: 'This item will likely feel softer and more forgiving than your reference item.' \},\
  COMFORT_TO_HIGH_STRETCH: \{ type: 'NO_GATE' \},\
  RIGID_TO_COMFORT:        \{ type: 'NO_GATE' \},\
\}\
```\
\
---\
\
## 5. Contract Type Classification [MVP]\
\
| Signals | contract_type |\
|---|---|\
| Numeric sizing + woven + button or zip | `precision` |\
| Alpha sizing + knit/elastic + drawstring or none | `range` |\
\
If ambiguous: default `precision` for tailored categories, `range` for lounge/athletic.\
\
---\
\
## 6. Contract Gate Matrix [MVP]\
\
| Anchor contract | Target contract | Gate | Output State |\
|---|---|---|---|\
| `precision` | `precision` | No Gate | \'97 |\
| `range` | `range` | No Gate | \'97 |\
| `precision` | `range` | Soft Warning | `fit_advisory` |\
| `range` | `precision` | Hard Stop | `smart_estimate` |\
\
---\
\
## 7. Recovery Warning Trigger [MVP]\
\
- If anchor `recovery_class = 'high'` AND target `recovery_class = 'low'`\
- \uc0\u8594  Surface warning note: *"This item may feel tighter at first and may loosen more through the day than your reference item."*\
- Does not block recommendation. Surfaces in Recovery and Aging pillar.\
\
---\
\
## 8. Rise Mismatch Gate [MVP]\
\
- User's primary rise preference (from onboarding Screen 1) acts as a hard filter.\
- If target rise differs from user's primary preference \uc0\u8594  `fit_advisory`\
- This is the primary gate for Demo Scenario 2 (Madewell Curvy High Rise).\
\
---\
\
## 9. Size Cap Rule [MVP]\
\
Either condition alone triggers `smart_estimate` with disclaimer:\
- Waist \uc0\u8805  33"\
- Women's numeric size \uc0\u8805  18\
\
Applies regardless of gate logic or brand offset results.\
\
---\
\
## 10. Output States [MVP]\
\
| DB value | Display name | Badge | Dot color |\
|---|---|---|---|\
| `verified_fit` | Verified Fit | Green | Green |\
| `fit_advisory` | Fit Advisory | Amber | Amber |\
| `smart_estimate` | Smart Estimate | Purple | Purple |\
\
**Retired names \'97 must not appear anywhere in code, queries, or UI:**\
`RECOMMENDED_HIGH`, `RECOMMENDED_MEDIUM`, `RECOMMENDED_LOW`, `BLOCKED`, `HIGH_VARIANCE`, `REVIEW_CUT`, `NO_DIRECT_MATCH`\
\
### Output State Resolution Logic\
\
Apply gates in this order. The most severe gate wins:\
\
1. Size cap triggered \uc0\u8594  `smart_estimate`\
2. Hard Stop gate triggered (contract or fabric) \uc0\u8594  `smart_estimate`\
3. Soft Warning gate triggered (fabric, contract, rise, recovery) \uc0\u8594  `fit_advisory`\
4. No gates, clean match \uc0\u8594  `verified_fit`\
\
---\
\
## 11. Gate Reason Templates [MVP]\
\
Each gate reason has a `reason_code`, `internal_text` (for debugging), and `user_text` (for verdict card).\
\
### Fabric Gate Reasons\
\
- `FABRIC_HIGH_STRETCH_TO_RIGID`\
  - internal: "Anchor fabric_class=high_stretch, target fabric_class=rigid. Large reduction in stretch."\
  - user: "This item will likely feel much firmer and less stretchy than your reference item."\
\
- `FABRIC_RIGID_TO_HIGH_STRETCH`\
  - internal: "Anchor fabric_class=rigid, target fabric_class=high_stretch. Large increase in stretch."\
  - user: "This item will likely feel softer and more forgiving than your reference item."\
\
- `FABRIC_COMFORT_TO_RIGID`\
  - internal: "Anchor fabric_class=comfort_stretch, target fabric_class=rigid. Reduced give."\
  - user: "This item has less stretch than your reference item and may feel tighter or more structured."\
\
- `FABRIC_HIGH_STRETCH_TO_COMFORT`\
  - internal: "Anchor fabric_class=high_stretch, target fabric_class=comfort_stretch. Moderate reduction in stretch."\
  - user: "This item has less give than your reference item and may feel slightly firmer."\
\
### Contract Gate Reasons\
\
- `CONTRACT_PRECISION_TO_RANGE`\
  - internal: "Anchor contract=precision, target contract=range."\
  - user: "This item uses a more flexible size system than your reference item, so the fit may feel less exact."\
\
- `CONTRACT_RANGE_TO_PRECISION`\
  - internal: "Anchor contract=range, target contract=precision."\
  - user: "This item uses a more exact size system than your reference item, so your usual size may not translate as cleanly."\
\
### Recovery Reasons\
\
- `RECOVERY_PRESENT_TO_ABSENT`\
  - internal: "Anchor has recovery fiber, target does not."\
  - user: "This item may feel tighter at first and may loosen more through the day than your reference item."\
\
- `RECOVERY_GROWTH_RISK`\
  - internal: "Target has lower recovery and may relax with wear."\
  - user: "This item may loosen slightly with wear and feel different by the end of the day."\
\
- `RECOVERY_OVERSIZE_RISK`\
  - internal: "Low recovery target increases risk of bag-out if oversized."\
  - user: "Sizing up too much may cause this item to feel looser over time."\
\
### Rise Reason\
\
- `RISE_MISMATCH`\
  - internal: "Target rise differs from user's primary rise preference."\
  - user: "This style sits differently than your usual preference, which may affect how the waist and hip feel."\
\
---\
\
## 12. Confidence Level Rules [MVP]\
\
### HIGH Confidence \'97 all of the following must be true:\
- Same contract type (`precision \uc0\u8594  precision`)\
- Same fabric class or one class apart\
- No gates triggered\
- No rise mismatch\
- Brand offset present (not cold start)\
\
### MEDIUM Confidence \'97 any of the following:\
- One Soft Warning gate triggered\
- One class apart on fabric\
- Contract mismatch (`precision \uc0\u8594  range`)\
- Rise mismatch present\
- Brand offset is cold start\
- Body architecture skipped at onboarding\
\
### LOW Confidence \'97 any of the following:\
- Hard Stop gate triggered\
- Two classes apart on fabric\
- Contract mismatch (`range \uc0\u8594  precision`)\
- Multiple gates triggered simultaneously\
- Size cap triggered (waist \uc0\u8805  33" or size \u8805  18)\
- `poly_pct = null` on both anchor and target\
\
---\
\
## 13. User-Facing Messaging Rules [MVP]\
\
- Never expose internal terms: `soft warning`, `hard stop`, `contract`, `gate`, `fit_delta`, `weighted_offset`, `fabric_class`\
- Explain feel differences in plain language\
- Avoid absolute claims ("will fit the same") \'97 use probabilistic language\
- Guidance must be brief and must not contradict the primary recommendation\
- Confidence label must be paired with a plain-language explanation\
\
---\
\
## 14. Sections Deferred to Full Vision\
\
The following logic is documented in the original spec but is **not active in the MVP build**:\
\
- **Section 9 (Size System Normalization)** \'97 full ease adjustment tables, fit intent modifiers, rise impact modifiers, waistband construction modifiers, women's bottoms hip sensitivity, cross-contract translation rules. MVP uses waist-based normalization only.\
- **Section 10 (Drift Adjustment Calculation)** \'97 schema present, feedback collected, calculation engine post-MVP.\
- **Hardware warning gate** \'97 `closure_type` not collected at MVP anchor form. Hardware warnings inactive.\
- **Tops and outerwear logic** \'97 geometry mismatch, bust distribution, layering intent. Full vision only.\
- **Men's denim engine** \'97 full vision only.\
- **Multi-anchor blending** \'97 one anchor per recommendation at MVP.\
- **Full hip calculation** \'97 waist normalization is provisional for women's bottoms at MVP.\
- **Confidence scoring from `sample_size`** \'97 all seed rows have `sample_size = 0`; sample-based confidence thresholds are full vision.}