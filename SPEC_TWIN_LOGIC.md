# SPEC_TWIN_LOGIC.md

Core fit recommendation logic for The Spec-Twin Fit Auditor.

**MVP scope: Women's denim only.**
Sections marked `[FULL VISION]` are documented for reference but must not be implemented in the MVP build.

---

## 1. Fit Delta Calculation [MVP]

```
effective_offset = weighted_offset + drift_adjustment
fit_delta = target_effective_offset − anchor_effective_offset
```

### Size Adjustment Decision

| fit_delta range | Adjustment | Label |
|---|---|---|
| −0.5 to +0.5 | 0 | `stay_true` |
| +0.5 to +1.5 | +1 | `size_up_1` |
| ≥ +1.5 | +2 | `size_up_2` |
| −1.5 to −0.5 | −1 | `size_down_1` |
| ≤ −1.5 | −2 | `size_down_2` |

### Interpretation
- Positive `fit_delta` → target runs smaller than anchor → size up
- Negative `fit_delta` → target runs larger than anchor → size down
- Near-zero `fit_delta` → target should fit similarly to anchor

---

## 2. Fabric Classification [MVP]

Derived from normalized `elastane_pct`:

| elastane_pct | fabric_class |
|---|---|
| 0.0% | `rigid` |
| 0.1% – 2.9% | `comfort_stretch` |
| ≥ 3.0% | `high_stretch` |

**Note:** Very low elastane (0.5%–1.0%) may feel structurally close to rigid. `comfort_stretch` is a mild stretch class, not equivalent to high-stretch fabric.

---

## 3. Recovery Classification [MVP]

Derived from `poly_pct`:

| poly_pct | recovery_class |
|---|---|
| `null` | `unknown` — amber dot, no hard stop |
| 0.0% | `low` |
| 0.1% – 3.9% | `moderate` |
| ≥ 4.0% | `high` |

**`null` and `0` are not equivalent.** See `ENGINEERING_NOTES.md` Section 4 for the full parser contract.

### Poly Blend Behavior Note
Even low poly percentages (2–4%) in a high stretch blend meaningfully affect:
- Recovery behavior — how quickly the fabric returns to its original shape after stretching
- Waistband tension curve — how the waist tightens and releases through the day
- How brands grade sizes — high stretch blends are often graded across a wider range per size

This is why `poly_pct ≥ 4.0` is classified as `high` recovery — not because 4% is a large amount, but because at that threshold poly is actively changing how the fabric behaves under tension. In cotton/poly/spandex blends, poly and elastane work together: elastane provides stretch, poly provides snap-back. Removing or reducing poly from a high-elastane blend increases the risk of bag-out over the day.

This reinforces why `rigid` ↔ `high_stretch` crossings are model mismatches (see Section 4) — poly blend behavior compounds the unpredictability of cross-boundary size translation.

---

## 4. Fabric Gate Matrix [MVP]

| Anchor fabric_class | Target fabric_class | Gate | Output State |
|---|---|---|---|
| `high_stretch` | `rigid` | Hard Stop | `smart_estimate` |
| `rigid` | `high_stretch` | Hard Stop | `smart_estimate` |
| `high_stretch` | `comfort_stretch` | Soft Warning | `fit_advisory` |
| `comfort_stretch` | `rigid` | Soft Warning | `fit_advisory` |
| `comfort_stretch` | `high_stretch` | No Gate | — |
| `rigid` | `comfort_stretch` | No Gate | — |
| same | same | No Gate | — |

**Sizing Model Mismatch Principle:** `rigid` ↔ `high_stretch` crossings in either direction are Hard Stops because the anchor loses its predictive value — these are different sizing systems, not just different stretch amounts.
- `rigid` → waist = fixed circumference
- `high_stretch` → waist = range of accommodation

A rigid anchor cannot reliably predict fit in a high stretch garment (signal dilutes into a range). A high stretch anchor cannot reliably predict fit in a rigid garment (over-precise signal applied to a fixed system). Both directions fail for different reasons.

**`comfort_stretch` acts as a bridge category** — limited elasticity, still size-specific, gradient difference only → Soft Warning.

### Confirmed FABRIC_GATES Constant

```typescript
const FABRIC_GATES = {
  HIGH_STRETCH_TO_RIGID:   { type: 'HARD_STOP',    outputState: 'smart_estimate', sizingAdj: 'size_up_1_or_2',    userText: 'This item will likely feel much firmer and less stretchy than your reference item.' },
  RIGID_TO_HIGH_STRETCH:   { type: 'HARD_STOP',    outputState: 'smart_estimate', sizingAdj: 'verify_sizing',      userText: 'This item uses a very different sizing system than your reference item — the stretch range means your usual size may not translate cleanly.' },
  HIGH_STRETCH_TO_COMFORT: { type: 'SOFT_WARNING', outputState: 'fit_advisory',   sizingAdj: 'stay_or_size_up_1', userText: 'This item has less give than your reference item and may feel slightly firmer.' },
  COMFORT_TO_RIGID:        { type: 'SOFT_WARNING', outputState: 'fit_advisory',   sizingAdj: 'stay_or_size_up_1', userText: 'This item has less stretch than your reference item and may feel tighter or more structured.' },
  COMFORT_TO_HIGH_STRETCH: { type: 'NO_GATE' },
  RIGID_TO_COMFORT:        { type: 'NO_GATE' },
}
```

---

## 5. Contract Type Classification [MVP]

| Signals | contract_type |
|---|---|
| Numeric sizing + woven + button or zip | `precision` |
| Alpha sizing + knit/elastic + drawstring or none | `range` |

If ambiguous: default `precision` for tailored categories, `range` for lounge/athletic.

---

## 6. Contract Gate Matrix [MVP]

| Anchor contract | Target contract | Gate | Output State |
|---|---|---|---|
| `precision` | `precision` | No Gate | — |
| `range` | `range` | No Gate | — |
| `precision` | `range` | Soft Warning | `fit_advisory` |
| `range` | `precision` | Hard Stop | `smart_estimate` |

---

## 7. Recovery Warning Trigger [MVP]

- If anchor `recovery_class = 'high'` AND target `recovery_class = 'low'`
- → Surface warning note: *"This item may feel tighter at first and may loosen more through the day than your reference item."*
- Does not block recommendation. Surfaces in Recovery and Aging pillar.

---

## 8. Rise Mismatch Gate [MVP]

- User's primary rise preference (from onboarding Screen 1) acts as a hard filter.
- If target rise differs from user's primary preference → `fit_advisory`
- This is the primary gate for Demo Scenario 2 (AG Jeans Farrah Boot Jean — mid-rise target vs high-rise anchor).

### Primary vs Secondary Rise Preference
Onboarding Screen 1 ("Where do you like your waistband to sit?") allows the user to select one primary and optionally one secondary rise from four options:
- "At or above my natural waist" → `high`
- "At my navel" → `mid`
- "Just below my navel" → `mid`
- "Low on my hips" → `low`

Note: "At my navel" and "Just below my navel" both map to `mid` — two options collapse to one engine value.

**Only the primary rise selection fires the gate.** Secondary rise is stored for future use but does not affect gate logic at MVP. A target matching the user's secondary but not primary preference still fires `fit_advisory`.

---

## 9. Size Cap Rule [MVP]

Either condition alone triggers `smart_estimate` with disclaimer:
- Waist ≥ 33"
- Women's numeric size ≥ 18

Applies regardless of gate logic or brand offset results.

---

## 10. Output States [MVP]

| DB value | Display name | Badge | Dot color |
|---|---|---|---|
| `verified_fit` | Verified Fit | Green | Green |
| `fit_advisory` | Fit Advisory | Amber | Amber |
| `smart_estimate` | Smart Estimate | Purple | Purple |

**Retired names — must not appear anywhere in code, queries, or UI:**
`RECOMMENDED_HIGH`, `RECOMMENDED_MEDIUM`, `RECOMMENDED_LOW`, `BLOCKED`, `HIGH_VARIANCE`, `REVIEW_CUT`, `NO_DIRECT_MATCH`

### Output State Resolution Logic

Apply gates in this order. The most severe gate wins:

1. Size cap triggered → `smart_estimate`
2. Hard Stop gate triggered (contract or fabric) → `smart_estimate`
3. Size delta escalation (`size_up_2` or `size_down_2`) → `smart_estimate`
4. Soft Warning gate triggered (fabric, contract, rise, recovery) → `fit_advisory`
5. No gates, clean match → `verified_fit`

### Size Delta Escalation Rule [MVP]

Either condition alone triggers `smart_estimate`:

- `fit_delta` ≥ +1.5 → `size_up_2`
- `fit_delta` ≤ −1.5 → `size_down_2`

User-facing message: "A size difference this large is worth verifying — check the brand's size guide before buying."

The fabric Soft Warning (`COMFORT_TO_RIGID` etc.) still fires independently and adds advisory copy to the fabric pillar but is no longer required to trigger `smart_estimate`.

---

## 11. Gate Reason Templates [MVP]

Each gate reason has a `reason_code`, `internal_text` (for debugging), and `user_text` (for verdict card).

### Fabric Gate Reasons

- `FABRIC_HIGH_STRETCH_TO_RIGID`
  - internal: "Anchor fabric_class=high_stretch, target fabric_class=rigid. Large reduction in stretch."
  - user: "This item will likely feel much firmer and less stretchy than your reference item."

- `FABRIC_RIGID_TO_HIGH_STRETCH`
  - internal: "Anchor fabric_class=rigid, target fabric_class=high_stretch. Sizing model mismatch — rigid anchor signal dilutes into stretch range."
  - user: "This item uses a very different sizing system than your reference item — the stretch range means your usual size may not translate cleanly."

- `FABRIC_COMFORT_TO_RIGID`
  - internal: "Anchor fabric_class=comfort_stretch, target fabric_class=rigid. Reduced give."
  - user: "This item has less stretch than your reference item and may feel tighter or more structured."

- `FABRIC_HIGH_STRETCH_TO_COMFORT`
  - internal: "Anchor fabric_class=high_stretch, target fabric_class=comfort_stretch. Moderate reduction in stretch."
  - user: "This item has less give than your reference item and may feel slightly firmer."

### Contract Gate Reasons

- `CONTRACT_PRECISION_TO_RANGE`
  - internal: "Anchor contract=precision, target contract=range."
  - user: "This item uses a more flexible size system than your reference item, so the fit may feel less exact."

- `CONTRACT_RANGE_TO_PRECISION`
  - internal: "Anchor contract=range, target contract=precision."
  - user: "This item uses a more exact size system than your reference item, so your usual size may not translate as cleanly."

### Recovery Reasons

- `RECOVERY_PRESENT_TO_ABSENT`
  - internal: "Anchor has recovery fiber, target does not."
  - user: "This item may feel tighter at first and may loosen more through the day than your reference item."

- `RECOVERY_GROWTH_RISK`
  - internal: "Target has lower recovery and may relax with wear."
  - user: "This item may loosen slightly with wear and feel different by the end of the day."

- `RECOVERY_OVERSIZE_RISK`
  - internal: "Low recovery target increases risk of bag-out if oversized."
  - user: "Sizing up too much may cause this item to feel looser over time."

### Rise Reason

- `RISE_MISMATCH`
  - internal: "Target rise differs from user's primary rise preference."
  - user: "This style sits differently than your usual preference, which may affect how the waist and hip feel."

---

## 12. Confidence Level Rules [MVP]

### HIGH Confidence — all of the following must be true:
- Same contract type (`precision → precision`)
- Same fabric class or one class apart
- No gates triggered
- No rise mismatch
- Brand offset present (not cold start)

### MEDIUM Confidence — any of the following:
- One Soft Warning gate triggered
- One class apart on fabric
- Contract mismatch (`precision → range`)
- Rise mismatch present
- Brand offset is cold start
- Body shape skipped at onboarding (Screen 4 — optional)
- Denim feel preference skipped at onboarding (Screen 5 — optional, affects advisory copy tone only, not gate logic)

### LOW Confidence — any of the following:
- Hard Stop gate triggered
- Sizing model mismatch (`rigid` ↔ `high_stretch` in either direction)
- Contract mismatch (`range → precision`)
- Multiple gates triggered simultaneously
- Size cap triggered (waist ≥ 33" or size ≥ 18)
- `poly_pct = null` on both anchor and target
- Size delta escalation triggered (`size_up_2` or `size_down_2`)

---

## 13. User-Facing Messaging Rules [MVP]

- Never expose internal terms: `soft warning`, `hard stop`, `contract`, `gate`, `fit_delta`, `weighted_offset`, `fabric_class`
- Explain feel differences in plain language
- Avoid absolute claims ("will fit the same") — use probabilistic language
- Guidance must be brief and must not contradict the primary recommendation
- Confidence label must be paired with a plain-language explanation

---

## 14. Sections Deferred to Full Vision

The following logic is documented in the original spec but is **not active in the MVP build**:

- **Section 9 (Size System Normalization)** — full ease adjustment tables, fit intent modifiers, rise impact modifiers, waistband construction modifiers, women's bottoms hip sensitivity, cross-contract translation rules. MVP uses waist-based normalization only.
- **Section 10 (Drift Adjustment Calculation)** — schema present, feedback collected, calculation engine post-MVP.
- **Hardware warning gate** — `closure_type` not collected at MVP anchor form. Hardware warnings inactive.
- **Tops and outerwear logic** — geometry mismatch, bust distribution, layering intent. Full vision only.
- **Men's denim engine** — full vision only.
- **Multi-anchor blending** — one anchor per recommendation at MVP.
- **Full hip calculation** — waist normalization is provisional for women's bottoms at MVP.
- **Confidence scoring from `sample_size`** — all seed rows have `sample_size = 0`; sample-based confidence thresholds are full vision.
