# GLOSSARY.md — The Spec-Twin Fit Auditor

This glossary maps internal technical terms to plain-language customer-facing equivalents.

**Purpose:**
- Keeps engineering, product, and design aligned on what terms mean
- Provides the foundation for verdict card copy, pillar labels, and tooltips
- Required for every new category before it ships — see `ENGINEERING_NOTES.md` Section 12

**MVP scope:** Women's denim only.
Future category sections are templated at the bottom — populate before each category ships.

---

## Women's Denim

### Output States

| Technical term | DB value | Customer-facing label | Badge color | What it means to the customer |
|---|---|---|---|---|
| Verified Fit | `verified_fit` | Verified Fit | Electric Lime | Your anchor and this item are a strong match — order your usual size with confidence |
| Fit Advisory | `fit_advisory` | Fit Advisory | Amber | There's a meaningful difference worth knowing about — read the details before ordering |
| Smart Estimate | `smart_estimate` | Smart Estimate | Purple | We can make an educated guess but can't give a confident call — verify before buying |

---

### Fabric Behavior

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `fabric_class: rigid` | Holds its shape | No stretch — fits exactly as cut, may feel snug at first and soften slightly with wear |
| `fabric_class: comfort_stretch` | Soft with a little give | A small amount of stretch that makes movement easier without changing the overall fit |
| `fabric_class: high_stretch` | Stretchy, moves with you | Significant stretch — hugs the body and moves with you throughout the day |
| Fabric gate: Hard Stop | Fabric Contradiction | This item is made very differently from your reference item — the fit and feel will be noticeably different |
| Fabric gate: Soft Warning | Fabric Difference | This item has a different amount of stretch than your reference item — it may feel slightly different |

---

### Shape Retention (formerly Recovery & Aging)

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `recovery_class: high` | Holds its shape all day | Fabric bounces back after stretching — stays snug and consistent from morning to evening |
| `recovery_class: moderate` | Mostly holds its shape | Some relaxation with wear — may feel slightly looser by end of day, usually recovers after washing |
| `recovery_class: low` | May loosen with wear | Little recovery fiber — expect the fabric to relax and feel looser as the day goes on |
| `recovery_class: unknown` | Recovery data unavailable | We don't have fiber data for this item — expect standard denim behavior |

---

### Fit Contract

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `contract_type: precision` | Exact sizing | Numeric sizing (e.g. waist 27") — size translates directly and predictably |
| `contract_type: range` | Flexible sizing | Alpha sizing (e.g. S/M/L) — size covers a range and may feel different at each end |
| Contract gate: Hard Stop | Sizing System Mismatch | This item uses a very different sizing system than your reference item — your usual size may not translate cleanly |
| Contract gate: Soft Warning | Different Sizing System | This item uses a more flexible size system than your reference item — the fit may feel less exact |

---

### Brand Offset

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `tier: A` / `fit_tag: euro_slim` | Runs small | This brand cuts narrower than the label suggests — you may want to size up |
| `tier: B` / `fit_tag: vanity_high` | Runs large | This brand sizes generously — you may want to size down |
| `tier: C` / `fit_tag: true_spec` | True to size | This brand cuts close to standard sizing |
| `fit_tag: rigid_bias` | Runs small due to fabric | No stretch in the fabric makes it feel smaller — consider sizing up |
| `fit_tag: oversize_design` | Intentionally oversized | This style is designed to be roomy — this is intentional, not a sizing error |
| Cold start | New to our system | We don't have enough data on this brand yet — treat this as a starting point |
| `weighted_offset` | Brand fit tendency | How this brand typically fits compared to standard sizing |
| `drift_adjustment` | Updated based on feedback | Our recommendation has been refined based on real customer outcomes |

---

### Size Recommendation

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `size_adjustment: 0` | Your usual size | This item should fit the same as your reference item |
| `size_adjustment: +1` | Size up one | This item runs smaller — go one size up from your reference |
| `size_adjustment: +2` | Size up two | This item runs noticeably smaller — go two sizes up from your reference |
| `size_adjustment: -1` | Size down one | This item runs larger — go one size down from your reference |
| `size_adjustment: -2` | Size down two | This item runs noticeably larger — go two sizes down from your reference |
| Size cap triggered | Extended size — estimate only | Our confidence is reduced at this size range — verify with the brand's size guide before ordering |

---

### Rise

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| Rise mismatch | Different rise than usual | This style sits higher or lower than your usual preference — the waist and hip fit will feel different |
| High rise | High rise | Sits at or above the natural waist |
| Mid rise | Mid rise | Sits between the hip and natural waist |
| Low rise | Low rise | Sits below the hip |

---

### Confidence Level

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| `confidence_level: HIGH` | High confidence | Strong match across fabric, sizing, and brand data |
| `confidence_level: MEDIUM` | Some uncertainty | One difference worth knowing about — read the details |
| `confidence_level: LOW` | Low confidence | Multiple differences — treat this as a starting point only |

---

### Verdict Card Elements

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| Anchor | Your reference item | The item you already own and trust that we're comparing against |
| Pillar | Fit factor | One of the three areas we check: Fabric Behavior, Waist and Hip Fit, Shape Retention |
| Green dot | Pass | This factor looks good — no issues found |
| Amber dot | Note | Something worth knowing about this factor |
| Purple dot | Flagged | A meaningful difference that affects our confidence |
| Reduced card | Incomplete data | We're missing anchor details — update your reference item for a full recommendation |

---

## Future Category Templates

When a new category is ready to ship, copy this template and complete it before any code is written for that category.

```
## [Category Name]

### Fabric Behavior
| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| | | |

### Fit Contract
| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| | | |

### Size Recommendation
| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| | | |

### [Category-specific section — e.g. Shoulder & Chest for tops]
| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| | | |
```

**Categories queued for full vision:** Women's trousers, knitwear, structured blazers, outerwear, men's denim.

---

### Size Display

| Technical term | Customer-facing format | Plain-language explanation |
|---|---|---|
| `waist_size` x `anchor_inseam` | "27x30" (anchor form) | Combined waist and inseam entry — enter both together |
| `recommended_size` x `target_inseam_suggested` | "27 x 30" (verdict card) | Recommended waist size and suggested inseam for this item |
| Inseam carry-forward | No note shown | Target silhouette matches anchor — inseam unchanged |
| Silhouette adjustment | "Inseam adjusted for silhouette" | Target leg shape differs from anchor — inseam recalculated |
| User inseam override | "Based on your inseam preference" | Your saved preference for this silhouette was applied |

---

### Loading State

| Technical term | Customer-facing text | When shown |
|---|---|---|
| Loading state line 1 | "Checking your anchor fit…" | First 250ms after Run Audit tapped |
| Loading state line 2 | "Reading the fabric details…" | Second 250ms |
| Loading state line 3 | "Working out your size…" | Third 250ms |
| Segmented progress bar | Three amber blocks filling left to right | Accompanies cycling text, one block per step |

---

### Demo Mode

| Technical term | Customer-facing label | Plain-language explanation |
|---|---|---|
| Scripted Demo Mode | Demo | Three pre-loaded scenarios with fixed anchor and target data |
| Scenario 1 | Scenario 1 | Verified Fit — Everlane 90s Cheeky Straight against Madewell anchor |
| Scenario 2 | Scenario 2 | Fit Advisory — AG Jeans Farrah Boot Jean, rise mismatch |
| Scenario 3 | Scenario 3 | Smart Estimate — Levi's 501 Original, fabric Hard Stop |
| Open Mode | (no label) | Real user flow — free entry anchor and target |
| Reset button | Reset | Returns to empty audit form for next scenario run |

---

### Onboarding — Denim Feel Preference (Screen 5)

| Onboarding label | Engine value | Plain-language explanation |
|---|---|---|
| Rigid and Authentic | `rigid` | Classic non-stretch denim — structured, breaks in with wear |
| Classic Comfort | `comfort_stretch` | A small amount of stretch — moves with you without feeling stretchy |
| Stretchy and Forgiving | `high_stretch` | Significant stretch — hugs the body and moves with you all day |
| Skipped | `null` | No fabric preference stored — advisory copy uses generic gate language |

---

### Onboarding — Body Shape (Screen 4)

| Onboarding label | Engine value | Plain-language explanation |
|---|---|---|
| Athletic / Straight | `athletic_straight` | Similar width through waist and hips |
| Pear | `pear` | Hips wider than waist — more room needed through the hip and thigh |
| Apple | `apple` | Fuller through the midsection — waist fit is the primary concern |
| Hourglass | `hourglass` | Defined waist with fuller bust and hips — waist-to-hip ratio matters most |
| Skipped | `null` | Body shape not stored — confidence drops to MEDIUM |
