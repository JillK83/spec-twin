# The Spec-Twin Fit Auditor

A standalone web app that eliminates sizing guesswork by auditing new apparel against garments the user already owns and trusts. No body measurements. No photos. The engine compares the technical DNA of a user's anchor item against a target product and returns a fit verdict.

**MVP scope:** Women's denim only. 48–72 hour demo build.

---

## How the Engine Works

Every recommendation flows through three sequential layers. Do not skip or reorder them.

**Layer 1 — Fit Contract**
Classifies each garment as `precision` (numeric, woven, zip/button) or `range` (alpha, knit, elastic/drawstring). A `range → precision` mismatch is a Hard Stop. A `precision → range` mismatch is a Soft Warning.

**Layer 2 — Fabric Performance Gate**
Derives `fabric_class` from `elastane_pct`: `rigid` (0%) / `comfort_stretch` (0.1–2.9%) / `high_stretch` (≥3%). `rigid` ↔ `high_stretch` crossings in either direction are Hard Stops — these are different sizing systems (fixed circumference vs. range of accommodation), not just different stretch amounts. `comfort_stretch` acts as a bridge category — gradient differences only, Soft Warning. See Compounding Uncertainty rule below.

**Layer 3 — Recovery & Aging**
Derives `recovery_class` from `poly_pct`: `low` (0%) / `moderate` (0.1–3.9%) / `high` (≥4%). If `poly_pct` is absent, `recovery_class` is `unknown` — never defaulted. Surfaces amber dot in UI.

**Rise Mismatch Gate**
User's primary rise preference from onboarding acts as a hard filter. If the target rise differs → `fit_advisory`. Primary gate for Scenario 2.

**Size Cap**
Waist ≥ 33" or women's numeric size ≥ 18 → always `smart_estimate` with disclaimer. Either condition alone triggers it.

**Size Delta Escalation**
A `fit_delta` of ≥ +1.5 (`size_up_2`) or ≤ −1.5 (`size_down_2`) independently triggers `smart_estimate` with no specific size recommendation. A size difference this large exceeds the confidence threshold for a firm recommendation regardless of other gate results. The user is directed to verify with the brand's size guide before buying.

**Hardware warnings are inactive at MVP.** Closure type is not collected from the anchor form.

---

## Output States

| DB value (`output_state`) | Display name | Badge |
|---|---|---|
| `verified_fit` | Verified Fit | Green |
| `fit_advisory` | Fit Advisory | Amber |
| `smart_estimate` | Smart Estimate | Purple |

**Retired names — must not appear in code or queries:**
`RECOMMENDED_HIGH`, `RECOMMENDED_MEDIUM`, `RECOMMENDED_LOW`, `BLOCKED`, `HIGH_VARIANCE`, `REVIEW_CUT`, `NO_DIRECT_MATCH`

---

## Demo Scenarios (Confirmed)

All three use **Madewell Perfect Vintage Straight · High rise Straight · Size 27x29** as the anchor.

| # | Target | Expected output | Primary gate |
|---|---|---|---|
| 1 | Everlane 90s Cheeky Straight, 27x29 | `verified_fit` | None |
| 2 | AG Jeans Farrah Boot Jean, 27x32 | `fit_advisory` | Rise mismatch |
| 3 | Levi's 501 Original, 27x30 | `smart_estimate` | Compounding uncertainty (`COMFORT_TO_RIGID` + `size_up_2`) |

Scenario selector buttons are labeled **Scenario 1 / 2 / 3 only** — no outcome names in the UI.

---

## File Structure

```
/
├── CLAUDE.md                  # Coding rules and key contracts for Claude
├── README.md                  # This file
├── /build                     # All MVP source code lives here
│   ├── /src
│   │   ├── /engine            # Fit logic: gates, delta calc, output state resolution
│   │   ├── /components
│   │   │   ├── /ui/magic      # Magic Patterns exported components (do not manually edit)
│   │   │   └── /auditor       # Logic-heavy auditor components (verdict card, forms, etc.)
│   │   ├── /lib               # Supabase client, API helpers, parser
│   │   └── /types             # Shared TypeScript types and enums
│   └── /supabase              # Schema, seed data, addenda
└── /docs                      # Full vision PRD, specs, design decisions
    └── PRD_SpecTwin_4.28_v13.md
```

---

## Where to Start

### Phase A — Logic Validation (Antigravity, no API key needed)

1. Open Antigravity and load this project.
2. Run the engine dry against static JSON for all three demo scenarios.
3. Confirm each scenario resolves to the correct `output_state`, gate trigger, and size adjustment.
4. **Do not proceed to Phase B until all three pass.**

Validation target to confirm before moving on:
> `comfort_stretch` anchor (2% elastane) + `rigid` target (0% elastane) → must return `smart_estimate`

### Phase B — Live App Build

1. Port validated gate logic from Phase A into `/build/src/engine`.
2. Connect Gemini API key for the parser (`gemini-3.1-flash-lite`).
3. Wire Supabase for `user_anchors`, `product_audits`, `brand_offsets`.
4. Build onboarding flow (5 screens), anchor form, target form, verdict card.
5. QA all three demo scenarios end-to-end in Scripted Mode.

---

## Key Contracts

### Schema column names — use these exactly

| Use this | Not this |
|---|---|
| `weighted_offset` | `baseline_offset` |
| `reference_anchor_id` | `anchor_id` |
| `preferred_inseam_overrides` (JSONB map) | `preferred_inseam_override` (scalar, retired) |

### poly_pct null rule
- `null` = polyester data absent from product page → `recovery_class = 'unknown'`
- `0` = confirmed 0% polyester → `recovery_class = 'low'`
- These are not the same. Never default `null` to `0`.

### Size cap rule
- Waist ≥ 33" or women's numeric size ≥ 18 → always return `smart_estimate` with disclaimer. Either condition alone triggers it.

### Inseam constants — confirmed, do not change
```
True Crop:      H − 38–40"
Ankle/Grazing:  H − 37–38"
Skinny/Slim:    H − 36"
Straight:       H − 35–36"
Flare/Bootcut:  H − 35"
Wide Leg:       H − 34–35"
```
`preferred_inseam_overrides` JSONB map always takes precedence over these defaults.

### Loading state — always present
600–800ms deliberate pause. Geist Mono text cycles at ~350ms each:
1. "Checking your anchor fit…"
2. "Reading the fabric details…"
3. "Working out your size…"

---

## Do Not Touch (Once Validated)

- Inseam subtraction constants — confirmed build-ready, do not adjust
- Gate logic in `/engine` — frozen after Phase A dry-run passes
- Seed data `weighted_offset` values — calibrated, do not change without explicit instruction
- Magic Patterns component classes in `/src/components/ui/magic` — do not manually override Tailwind unless applying Y2K Neo-Retro design tokens

---

## Database Tables (Quick Reference)

**`user_anchors`** — technical DNA of the user's trusted garments
**`brand_offsets`** — expert baseline offsets by brand + category + gender; unique on `(brand_name, category, gender)`
**`product_audits`** — full snapshot of every recommendation event; source of truth for debugging and drift calibration

Full schema: see `/build/supabase/` and `PRD_SpecTwin_4.28_v13.md`

---

## Design System

Full token reference, typography, component specs, and aesthetic rules are documented in `Spec_Twin_Design_System.md`. Read that file before building any UI component.

**Quick reference:**
- Aesthetic: Y2K Neo-Retro — high contrast, energetic, tactile
- Typography: Geist (700–900) for headings and labels, Geist Mono (400) for loading states, tooltips, disclaimers
- Verdict badge colors: Electric Lime `#BFFF00` = `verified_fit` · Amber `#FFBF00` = `fit_advisory` · Purple `#7C3AED` = `smart_estimate`
- No grey dot. Accordion details expand on tap/click only — no hover for MVP.
