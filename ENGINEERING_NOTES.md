# ENGINEERING_NOTES.md
## Overview

This document captures implementation notes, field derivation rules, and practical engineering guidance for The Spec-Twin Fit Auditor MVP.

Complements:
- `SCHEMA_REFERENCE.md` for database structure
- `SPEC_TWIN_LOGIC.md` for recommendation and fit logic
- `PRD_SpecTwin_4.28_v13.md` for full product requirements

---

## How `product_audits` Works

The `product_audits` table stores a full snapshot of each recommendation event. It is designed to preserve:
- the anchor used for comparison (`reference_anchor_id`)
- the target product specifications (all `target_*` fields)
- the recommendation math applied (`fit_delta`, `effective_offset`, `size_adjustment`)
- the gate logic triggered (`fabric_gate`, `contract_gate`, `rise_mismatch_warning`, etc.)
- the downstream user feedback (`feedback_outcome`, `user_fit_rating`, etc.)

This makes each recommendation traceable, debuggable, and useful for future drift calibration.

---

## Section 1: Relationship Fields

- `user_id` — identifies the user the recommendation belongs to.
- `reference_anchor_id` — identifies the specific `user_anchors` row used as the comparison baseline.

Every recommendation traces back to the exact garment the system treated as the user's trusted fit reference. This allows reproducibility of recommendation math, better debugging, and future comparison across multiple anchors per user.

> Use `reference_anchor_id` — never `anchor_id`. `anchor_id` is a retired column name.

---

## Section 2: Target Product Info

These fields store everything the Gemini API parser extracted from the product details text the user pasted or entered.

- `target_brand` — brand of the target product.
- `target_model` — model or product name.
- `target_category` — category used for comparison and offset lookup.
- `target_size_original` — raw size label from the product page, unmodified before normalization (e.g. `"M"` or `"27"`).
- `target_contract_type` — `precision` or `range`; determines which comparison rules apply.
- `target_size_range_low` / `target_size_range_high` — normalized numeric range for comparison. Example: `"M"` → `30–34`, `"27"` → `27–27`.
- `target_fiber_content` — raw composition string preserved for auditability and future parser improvements (e.g. `"98% Cotton / 2% Elastane"`).
- `target_elastane_pct` — parsed from `target_fiber_content`; used to derive `target_fabric_class`.
- `target_poly_pct` — parsed from `target_fiber_content`; used to derive `target_recovery_class`.
- `target_fabric_class` — derived from `target_elastane_pct` (see Section 3).
- `target_recovery_class` — derived from `target_poly_pct` (see Section 4).

---

## Section 3: Fabric Class Derivation

`fabric_class` is derived from normalized `elastane_pct`:

| elastane_pct | fabric_class |
|---|---|
| 0.0% | `rigid` |
| 0.1% – 2.9% | `comfort_stretch` |
| ≥ 3.0% | `high_stretch` |

### Stretch Fiber Normalization
The parser normalizes all equivalent stretch-fiber terms into `elastane_pct`. These include:
`elastane`, `spandex`, `lycra`, `elaspan`, `creora`, `ROICA`, `dorlastan`, `linel`, `ESPA`

### Interpretation Note
Very low elastane (0.5%–1.0%) may still feel structurally close to rigid. `comfort_stretch` should be treated as a mild stretch class, not equivalent to highly elastic fabric.

---

## Section 4: Recovery Class Derivation

`recovery_class` is derived from normalized `poly_pct`:

| poly_pct | recovery_class |
|---|---|
| `null` | `unknown` |
| 0.0% | `low` |
| 0.1% – 3.9% | `moderate` |
| ≥ 4.0% | `high` |

### poly_pct Null Contract — Critical

```typescript
// null  = poly_pct absent from product data → recovery_class = 'unknown'
// 0     = confirmed 0% polyester            → recovery_class = 'low'
// Never treat null and 0 as equivalent.
const getRecoveryClass = (polyPct: number | null): string => {
  if (polyPct === null || polyPct === undefined) return 'unknown'
  if (polyPct === 0) return 'low'
  if (polyPct < 4) return 'moderate'
  return 'high'
}
```

The Gemini API system prompt must include: *"If polyester percentage is not present in the material composition, return null for poly_pct. Do not return 0 or an empty string."*

`recovery_class = 'unknown'` renders an amber dot on the Recovery and Aging pillar with the note: *"Recovery data unavailable for this item; expect standard denim behavior."* It is a valid, explicit, traceable state — not a fallback default.

---

## Section 5: Contract Type Derivation

`contract_type` is derived from garment construction signals:

| Signals | contract_type |
|---|---|
| Numeric sizing + woven fabric + button or zip closure | `precision` |
| Alpha sizing + knit or elastic fabric + drawstring or no closure | `range` |

If ambiguous: default to `precision` for tailored categories, `range` for lounge/athletic categories.

---

## Section 6: Closure Type — MVP Note

`closure_type` is **not collected from the anchor input form at MVP**. It has been removed to minimize data entry. Most denim uses zipper or button fly and the difference does not meaningfully affect fit recommendations for this category.

The hardware warning gate is **inactive at MVP**. The `closure_type` column is reserved in the schema for full vision use.

---

## Section 7: Parser Confidence

`parser_confidence` is stored on `user_anchors` for every anchor submission. It reflects the Gemini API's confidence in the parsed output (0–1 scale).

- If `parser_confidence < 0.8`, the UI surfaces amber "Confirm" chips on low-confidence fields.
- The user may save the anchor regardless — saving with unconfirmed fields is allowed.
- Unconfirmed fields at low confidence contribute to a reduced output state.

---

## Section 8: Size Cap Rule

Any recommendation where the anchor or target size falls into the extended size range must automatically return `smart_estimate` with a disclaimer. Either condition alone triggers it:

- Waist ≥ 33"
- Women's numeric size ≥ 18

This applies regardless of gate logic or brand offset results.

---

## Section 9: Brand Offset Lookup Pattern

Always use `LOWER()` for case-insensitive brand name matching. Try specific category first, fall back to `'All'`:

```sql
-- Step 1: specific category
SELECT * FROM brand_offsets
  WHERE LOWER(brand_name) = LOWER(:brand)
  AND LOWER(category) = LOWER(:category)
  AND gender = :gender
  LIMIT 1;

-- Step 2: fallback to 'All' if Step 1 returns null
SELECT * FROM brand_offsets
  WHERE LOWER(brand_name) = LOWER(:brand)
  AND LOWER(category) = 'all'
  AND gender = :gender
  LIMIT 1;
```

If neither query returns a result: zero offset applies and a cold start disclaimer renders in the verdict card footer.

---

## Section 10: Drift Adjustment — Schema Present, Logic Post-MVP

The `drift_adjustment` column is present in `brand_offsets` and `product_audits` from day one. Post-purchase feedback (`feedback_outcome`, `user_fit_rating`) is collected at MVP and stored for future use.

The drift calculation engine — directional imbalance logic, activation threshold (min `sample_size = 10`), bounding at ±0.5, rolling recalculation — is **post-MVP**. At MVP, `drift_adjustment` is always `0` for all seed rows.

---

## Section 11: Inseam Constants — Do Not Change

Height-derived inseam subtraction constants are confirmed build-ready. Do not adjust once validated.

Silhouette values match onboarding Screen 2 selections exactly:

| Silhouette value | Display label | Subtraction |
|---|---|---|
| `skinny` | Skinny | H − 36" |
| `straight` | Straight | H − 35–36" |
| `relaxed_loose` | Relaxed / Loose | H − 35–36" |
| `bootcut_flare` | Bootcut / Flare | H − 35" |
| `wide_leg` | Wide Leg | H − 34–35" |

Note: True Crop and Ankle/Grazing from original constants are not onboarding options at MVP — deferred to full vision when additional silhouettes are added.

`preferred_inseam_overrides` JSONB map always takes precedence over these defaults. Scalar `preferred_inseam_override` field is retired.

---

## Section 12: Category Expansion — Full Vision Note

**MVP scope is women's denim only.** This section documents decisions made now to avoid painful schema migrations later.

### The Problem
Different apparel categories require fundamentally different fit variables. A t-shirt fits around chest and shoulder width. A structured blazer adds suppression, lining, and shoulder construction. Denim fits around waist, inseam, rise, and fabric behavior. A single flat schema cannot cleanly serve all of these without becoming either bloated or misleading.

### Provisional Approach (Option A — Single Schema with Nullable Columns)
For full vision, category-specific fields will be added as nullable columns to `user_anchors` and `product_audits`. Fields irrelevant to a given category are left null. This is the simpler path and appropriate while the category set is small and well-understood.

### Anticipated Fit Variables by Category

| Category | Key fit variables |
|---|---|
| Denim | Waist, inseam, rise, fabric_class, recovery_class |
| Trousers | Waist, inseam, rise, seat, taper, structure_class |
| T-shirt / Casual tops | Chest, shoulder width, body length, fabric weight |
| Knitwear | Chest, ease preference, drape, fiber weight |
| Structured blazer | Chest, shoulder width, sleeve length, suppression, lining |
| Outerwear | Chest, shoulder width, layering_intent, structure_class |

### Glossary Requirement
Before any category beyond women's denim ships, a plain-language glossary mapping every technical fit term to its customer-facing equivalent must be completed for that category. See `GLOSSARY.md` for the women's denim foundation and the template for future categories.

### What Not to Build at MVP
- Do not add chest, shoulder, or suppression columns to the schema at MVP
- Do not implement any category selector beyond denim on the anchor or target forms
- Do not build category-specific pillar logic for tops or outerwear

---

## Section 13: Inseam Capture, Derivation, and Display

### Capture — Anchor Form
The anchor form Size field accepts a combined waist x inseam entry: `"27x30"` or `"27 x 30"`. On Save Anchor, the parser splits this into two stored values:
- `size` — raw string preserved as entered (e.g. `"27x30"`)
- `anchor_inseam` — numeric inseam extracted (e.g. `30`)

The anchor form also captures `silhouette` (leg shape) and `rise` (High / Mid / Low) as separate fields stored on `user_anchors`. These are required inputs for inseam derivation at audit time.

### Derivation — Audit Time
When Run Audit fires, `target_inseam_suggested` is derived using this priority order:

1. **User override wins always** — if `preferred_inseam_overrides` JSONB map contains an entry for the target silhouette, use that value. Example: `{ bootcut: 32, straight: 30 }` → use `32` for a bootcut target.
2. **Same silhouette as anchor** — if target silhouette matches anchor silhouette, carry `anchor_inseam` forward unchanged. No note shown on verdict card.
3. **Different silhouette** — apply the Section 11 subtraction constant for the target silhouette using the user's height from onboarding. Example: user is 5'6" (66"), target is wide leg → 66 − 34.5 = 31.5 → round to nearest whole number → `32`.

The derived value is stored as `target_inseam_suggested` on `product_audits`.

### Display — Verdict Card
Recommended size displays as waist x inseam: `"27 x 30"`

| Condition | Note shown below size value |
|---|---|
| Same silhouette, inseam carried forward | No note shown |
| Silhouette adjustment applied | "Inseam adjusted for silhouette" (Geist Mono small) |
| User override applied | "Based on your inseam preference" (Geist Mono small) |

### Display — Other Surfaces

| Surface | Format |
|---|---|
| Fit Vault dashboard anchor card | "Size 27x30" |
| Audit form anchor reference bar | "Comparing against: Madewell Perfect Vintage Straight, Size 27x29" |
| Audit form Size field | Waist only — "e.g. 27 or M, L" — inseam never entered on audit form |
| Anchor form Size field | "e.g. 27x30 or 28x32" |

### Known Gap — Brand Inseam Availability
The engine derives a suggested inseam from height and silhouette but has no visibility into what inseam lengths a brand actually offers. If a user enters an available inseam that differs from their derived preference (e.g. their usual is 29" but the brand only offers 30" or 32"), the engine cannot flag that gap.
The audit form currently captures waist only — inseam is never entered on the audit form. To surface this advisory, a future version would need to either:

Add an optional inseam field to the audit form so the user can enter what's available
Compare entered inseam against derived inseam and flag gaps beyond 1"

Priority: post-MVP. Relevant especially for petite and tall users where brand inseam options are limited.

---

## Section 14: API Call Architecture

The Gemini API (`gemini-3.1-flash-lite`) is called at exactly two points in the MVP. All other logic — gate evaluation, fit delta calculation, output state resolution, verdict copy rendering — is deterministic TypeScript running client-side. No additional API calls are needed.

### Call 1 — Anchor Parse (triggered on Save Anchor)
**Trigger:** User taps "Lock In First Anchor" on the anchor form.
**Input:** Raw `fiber_content` string from the Material Composition field.
**System prompt instructs the model to:** Parse fiber percentages and closure type. Return only JSON. If polyester is absent from the label, return `null` for `poly_pct` — never `0`.
**Output — structured JSON:**
```json
{
  "elastane_pct": 1,
  "poly_pct": null,
  "closure_type": "zipper",
  "parser_confidence": 0.92
}
```
**Storage:** All values written to `user_anchors` row on save. `parser_confidence < 0.8` surfaces amber confirm chips on low-confidence fields in the UI.

**Note:** At MVP, the anchor form does not call the parser on save. `fabric_class` and `recovery_class` are derived at audit time in `audit.ts` via regex on `fiber_content` when the column is null. Full parser integration on anchor save is post-MVP.

### Call 2 — Target Parse (triggered on Run Audit)
**Trigger:** User taps "Run Audit" on the audit form.
**Input:** Raw fabric/care paste text from the audit form fabric field.
**System prompt instructs the model to:** Same parsing rules as Call 1. Return only JSON. If polyester is absent, return `null` for `poly_pct`.
**Output — structured JSON:**
```json
{
  "elastane_pct": 2,
  "poly_pct": 0,
  "closure_type": "zipper",
  "parser_confidence": 0.88
}
```
**Storage:** All values written to `product_audits` snapshot fields (`target_elastane_pct`, `target_fabric_class`, `target_recovery_class`, etc.).

### Gemini Request Format
```typescript
const body = {
  system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
  contents: [{ parts: [{ text: rawText }] }]
}

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
)
```

### Response Extraction
```typescript
const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()
const parsed = JSON.parse(cleaned)
```

### What Does NOT Need an API Call
- Brand offset lookup → Supabase query only
- Fit delta calculation → deterministic TypeScript
- Gate logic evaluation → deterministic TypeScript switch statement
- Output state resolution → priority order from SPEC_TWIN_LOGIC.md Section 10
- Verdict card copy → templated strings from gate reason templates (Section 11)
- Loading state → deliberate 600–800ms artificial pause, not real processing time

### Parser System Prompt Requirements
Both calls must include these instructions in the system prompt:
- Return only valid JSON — no preamble, no markdown, no backticks
- If a fiber type is not present in the label, return `null` for that field — never `0` or empty string
- Normalize all elastane synonyms: elastane, spandex, lycra, elaspan, creora, ROICA, dorlastan, linel, ESPA → `elastane_pct`
- `fabric_class` and `recovery_class` are derived in the engine from `elastane_pct` and `poly_pct` — do not return them from the parser
- `parser_confidence` must be a float between 0 and 1

### Environment Variable
```
VITE_GEMINI_API_KEY=your_key_here
```
The key is passed as a URL query parameter per Gemini API spec — not as an auth header.
