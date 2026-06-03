# CLAUDE.md — The Spec-Twin Fit Auditor (MVP)

Behavioral guidelines for Claude when working on this project. These rules merge general coding discipline with project-specific contracts. **When in doubt, re-read this file before writing any code.**

---

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing anything:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

**Project-specific rules:**

- **Deterministic logic first.** The fit recommendation engine is measurement-free and photo-free. Never suggest body-scanning or manual measurement inputs.
- **The three-layer audit is sequential and non-negotiable.** Every recommendation flows through: Fit Contract → Fabric Performance Gate → Recovery & Aging. Do not skip or reorder layers. `size_up_2` (`fit_delta` ≥ +1.5) and `size_down_2` (`fit_delta` ≤ −1.5) are independent `smart_estimate` triggers. Neither requires a simultaneous Soft Warning gate to escalate. A Soft Warning that fires alongside a size delta still adds advisory copy to the fabric pillar on the verdict card.
- **Ambiguity is a signal, not a default.** If data is missing (e.g. `poly_pct`), use the `unknown` state and surface an amber dot in the UI. Never silently default to a value.

---

## 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: *"Would a senior engineer say this is overcomplicated?"* If yes, simplify.

**Project-specific rules:**

- **MVP scope is fixed.** Do not implement men's denim logic, tops, trousers, outerwear, or multi-anchor blending.
- **Y2K Neo-Retro UI aesthetic.** Maintain high-contrast, energetic, tactile feel. Use `shadcn/ui` and Tailwind CSS with confirmed design tokens from `SPEC_TWIN_DESIGN_SYSTEM.md`. Do not introduce new component libraries or override established design tokens.
- **TypeScript only.** No JavaScript patterns. All engine rules use the confirmed pure TypeScript implementation.

---

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

**When editing existing code:**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

**When your changes create orphans:**

- Remove imports/variables/functions that **your** changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

**Project-specific rules:**

- **Schema stewardship.** Strictly follow `brand_offsets`, `user_anchors`, and `product_audits` schemas as defined in the PRD v13. Use `weighted_offset` — never `baseline_offset`. Use `reference_anchor_id` — never `anchor_id`. Use `sample_size` for the drift feedback event count in `brand_offsets`.
- **Hardware gate is inactive at MVP.** `closure_type` is not collected on the anchor input form. Do not implement hardware warnings or trigger any hardware gate logic.
- **Output state snake_case enforcement.** The `output_state` field must strictly use: `verified_fit`, `fit_advisory`, `smart_estimate`. Any other value is wrong. See retired names below.
- **Do not touch inseam constants once validated.** The height-derived subtraction constants (e.g. Skinny/Slim = Height − 36") are confirmed build-ready. Do not adjust them unless explicitly asked.
- **Do not touch gate logic after dry-run passes.** Once Antigravity dry-run confirms correct output for all three demo scenarios, the gate logic is frozen.

---

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

**Phase A — Logic Validation (Antigravity)**

- Goal: Dry-run gate logic against static JSON denim specs using the Antigravity Agent (Claude Pro). No API key required.
- Success criteria: Agent correctly triggers Hard Stops, Soft Warnings, and fabric class deltas for all three demo scenarios.
- Verification: All three scenarios resolve to the correct `output_state` before any code moves to the standalone app.

**Phase B — Live Implementation (Standalone App)**

- Goal: Port validated Antigravity logic into the React/Vite build and connect the Anthropic API key.
- Success criteria: All three demo scenarios produce the correct output state (`verified_fit`, `fit_advisory`, `smart_estimate`), badge color, pillar dot states, and copy. Verdict Card renders in under 2 seconds on desktop.

**Pre-Commit Review (All Phases)**

- Before any `git commit`, spawn a subagent to review all staged files with fresh context.
- The subagent has no session history — it reads the code cold and reports findings without bias.
- The subagent must check: logic errors, schema contract violations (see Key Contracts), output state naming, TypeScript correctness, and UI token compliance.
- Address any HIGH severity findings before committing. LOW severity findings may be noted in the commit message.
- The subagent report summary should be included in the commit message.

---

## Key Contracts — Never Break These

### Output State Naming

```
verified_fit    →  Verified Fit   (Electric Lime badge)
fit_advisory    →  Fit Advisory   (Amber badge)
smart_estimate  →  Smart Estimate (Purple badge)
```

**Retired — must not appear anywhere in code, queries, or UI switch statements:** `RECOMMENDED_HIGH`, `RECOMMENDED_MEDIUM`, `RECOMMENDED_LOW`, `BLOCKED`, `HIGH_VARIANCE`, `REVIEW_CUT`, `NO_DIRECT_MATCH`

---

### poly_pct Null Contract

```ts
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

---

### Inseam Override Contract

- `preferred_inseam_overrides` is a JSONB map keyed by silhouette: `{ straight: 30, wide_leg: 32, cropped: 26 }`
- Override always takes precedence over height-derived defaults.
- Scalar `preferred_inseam_override` field is **retired** — do not use it.

---

### Size Display Contract

- **Anchor form** Size field accepts waist x inseam format: `"27x30"` or `"27 x 30"`
- Parser splits into `waist_size` and `anchor_inseam` on Save Anchor
- **Audit form** Size field accepts waist only: `"27"` or `"28"` — inseam is never entered manually on the audit form
- **Verdict card** displays recommended size as waist x inseam: `"27 x 30"`
- If target silhouette matches anchor silhouette → carry anchor inseam forward unchanged
- If target silhouette differs → apply Section 11 subtraction constants from `ENGINEERING_NOTES.md`
- If `preferred_inseam_overrides` present for that silhouette → override wins, always
- When silhouette adjustment applied → show Geist Mono small note below size value: `"Inseam adjusted for silhouette"`
- When user override applied → show: `"Based on your inseam preference"`
- **Fit Vault dashboard** anchor cards display size as: `"Size 27x30"`
- **Audit form anchor reference bar** displays as: `"Madewell Perfect Vintage Straight · High rise Straight · Size 27x29"`

---

### Size Cap Contract

- Waist ≥ 36" or women's numeric size ≥ 16 → automatically return `smart_estimate` with disclaimer. Either condition alone triggers it.

---

### Loading State Contract

Always include the deliberate 600–800ms pause with a three-block segmented Amber progress bar (14px height, border-2, 2px hard ink shadow) filling one block per step, with Geist Mono text cycling below:

1. "Checking your anchor fit…"
2. "Reading the fabric details…"
3. "Working out your size…"

- Each line displays for approximately 250ms
- After third step → verdict card fades in (opacity 0 → 1, 200ms transition)
- Applies in both Scripted Demo Mode and Open Mode

---

### Verdict Card Pillar Names Contract

The three pillars are named exactly as follows — do not rename, abbreviate, or reorder:

1. Fabric Behavior
2. Waist and Hip Fit
3. Shape Retention

Pillar dot colors by output state:

- `verified_fit` → all three dots Electric Lime `#BFFF00`
- `fit_advisory` → mix of Amber `#FFBF00` and Electric Lime depending on which pillars flagged
- `smart_estimate` → all three dots Purple `#7C3AED`
- Reduced Card (anchor incomplete) → two dots Purple, Fabric Behavior pillar absent entirely

---

### Verdict Card Copy Rules

Full copy reference lives in `/docs/VERDICT_CARD.md` — read before writing or editing any pillar copy.

**Accordion hierarchy** Headline = the what. Detail = the why or when. Never restate the headline in the detail. The headline must work as a standalone verdict for users who never expand.

**Sizing redirect rule** Sizing redirects only allowed in `verified_fit` and `fit_advisory` states. Never include a specific size number or sizing direction in a `smart_estimate` detail.

**Pillar status override rule** When `output_state = smart_estimate` all three pillar dots must return `estimate` (purple) regardless of individual gate resolution. No lime dots on a purple card.

**Voice map**

| Pillar | Term | Register |
|--------|------|----------|
| Fabric Behavior | Stretch | Material fact — what the fabric is made of |
| Waist and Hip Fit | Give | Body interaction — how it feels on |
| Shape Retention | Recovery | Time-based — how it behaves through the day |

**Token rules**

- `${anchorBrand}` resolves from `user_anchors.brand_name` — always use `"your ${anchorBrand}"` not bare `"${anchorBrand}"`
- Fallback is `"your item"` — template strings must never contain "your" AND resolve to "your item" producing "your your item"
- `${anchorStretchDesc}` — `high_stretch` anchor → `"significant stretch"` / `comfort_stretch` anchor → `"a little stretch"`

---

### Verdict Card CTA Contract

| Output State | CTA Label |
|--------------|-----------|
| `verified_fit` | SAVE FIT TO VAULT |
| `fit_advisory` | SAVE FIT TO VAULT |
| `smart_estimate` | VERIFY BEFORE SAVING |
| Reduced Card | UPDATE ANCHOR |

---

### Demo Scenarios Contract (Scripted Demo Mode)

**Anchor — fixed across all three scenarios:**

- Brand: Madewell
- Model: Perfect Vintage Straight Jean
- Size: 27x29 (waist x inseam)
- Fabric: 99% Cotton, 1% Elastane
- `fabric_class`: `comfort_stretch`
- `elastane_pct`: 1
- `poly_pct`: null → `recovery_class`: `unknown`
- Rise: high
- Silhouette: straight
- `contract_type`: precision
- `weighted_offset`: -1.5

**Scenario 1 — Verified Fit (`/verdict/1`):**

- Target brand: Everlane
- Target model: 90s Cheeky Straight
- Target size: 27x31
- Fabric: 98% Organic Cotton, 2% Elastane
- `fabric_class`: `comfort_stretch`
- `elastane_pct`: 2
- Rise: high (matches anchor → no rise mismatch)
- Silhouette: straight (matches anchor → inseam carries forward)
- `weighted_offset`: 0.0
- Fit delta: 0.0 − (−1.5) = +1.5 → `size_up_1`
- Expected gates: none fired
- Expected `output_state`: `verified_fit`
- All pillar dots: Electric Lime
- Badge: VERIFIED FIT (Electric Lime)
- CTA: SAVE FIT TO VAULT

**Scenario 2 — Fit Advisory (`/verdict/2`):**

- Target brand: AG Jeans
- Target model: Farrah Boot Jean (Journey Denim)
- Target size: 27x32
- Fabric: 98% Cotton, 2% Elastane
- `fabric_class`: `comfort_stretch`
- `elastane_pct`: 2
- Rise: mid (MISMATCH vs high-rise anchor → rise gate fires)
- Silhouette: bootcut (differs from anchor straight → inseam adjustment note)
- `weighted_offset`: 0.0 (cold start — no sample data yet)
- Expected gates: `RISE_MISMATCH` → `fit_advisory`
- Expected `output_state`: `fit_advisory`
- Fabric Behavior dot: Amber
- Waist and Hip Fit dot: Amber
- Shape Retention dot: Electric Lime
- Badge: FIT ADVISORY (Amber)
- Amber warning banner: "This style sits differently than your usual preference, which may affect how the waist and hip feel."
- Cold start disclaimer in footer: "New to our system — treat this as a starting point"
- CTA: SAVE FIT TO VAULT

**Scenario 3 — Smart Estimate (`/verdict/3`):**

- Target brand: Levi's
- Target model: 501 Original
- Target size: 27x30
- Fabric: 100% Cotton
- `fabric_class`: `rigid`
- `elastane_pct`: 0
- Rise: high (matches anchor → no rise gate)
- Silhouette: straight (matches anchor → inseam carries forward)
- `weighted_offset`: +0.5
- Expected gates: `FABRIC_COMFORT_TO_RIGID` Soft Warning fires independently and adds fabric advisory copy to the pillar. `size_up_2` (fit_delta +2.0 ≥ +1.5) is the independent `smart_estimate` trigger via Size Delta Escalation Rule (§10 priority 3). Both are logged separately in `product_audits`.
- Expected `output_state`: `smart_estimate`
- All pillar dots: Purple
- Badge: SMART ESTIMATE (Purple)
- Purple banner: "This item will likely feel much firmer and less stretchy than your reference item."
- CTA: VERIFY BEFORE SAVING

---

### Onboarding Screen Contract

Five screens captured in order. Rise and Height are required and load-bearing. Body shape and Denim feel are optional but affect confidence scoring and advisory copy respectively.

| Screen | Question | Required | Stores | Engine impact |
|--------|----------|----------|--------|---------------|
| 1 | Where do you like your waistband to sit? | Yes | `rise` (primary), secondary stored for future | Primary rise fires rise mismatch gate |
| 2 | What is your go-to leg shape? | Yes (at least 1) | `silhouette` (primary), secondary stored for future | Primary silhouette used for inseam derivation |
| 3 | Height | Yes | User profile height | Feeds inseam subtraction constants (Section 11, ENGINEERING_NOTES.md) |
| 4 | Body shape | No (skip allowed) | `body_shape` | Skipping drops confidence to MEDIUM |
| 5 | How do you like your denim to feel? | No (skip allowed) | `fabric_preference` (primary), `fabric_preference_secondary` JSONB | Enriches advisory copy tone — does NOT affect gate logic |

**Screen 1 rise options → engine values:**

- "At or above my natural waist" → `high`
- "At my navel" → `mid`
- "Just below my navel" → `mid`
- "Low on my hips" → `low`

**Screen 2 silhouette options → engine values:**

- "Skinny" → `skinny`
- "Straight" → `straight`
- "Relaxed / Loose" → `relaxed_loose`
- "Bootcut / Flare" → `bootcut_flare`
- "Wide Leg" → `wide_leg`

**Screen 4 body shape options → engine values:**

- "Athletic / Straight" → `athletic_straight`
- "Pear" → `pear`
- "Apple" → `apple`
- "Hourglass" → `hourglass`

**Screen 5 denim feel options → engine values:**

- "Rigid and Authentic" → `rigid`
- "Classic Comfort" → `comfort_stretch`
- "Stretchy and Forgiving" → `high_stretch`

---

- Desktop-first, responsive to tablet via `sm:` breakpoints. Max width: `max-w-2xl` (672px), centered.
- Full design system is documented in `SPEC_TWIN_DESIGN_SYSTEM.md` — read before building any UI component
- Typography: Geist (700–900) for all headings and labels, Geist Mono (400) for monospace and helper text
- Core tokens: Paper `#F5F0E8`, Ink `#1A1A1A`, Amber `#FFBF00`, Electric Lime `#BFFF00`, Vibrant Teal `#00BCD4`
- Magic Patterns is the lead for UI components, connected via MCP
- Keep exported Magic Patterns components in `/src/components/ui/magic`
- Do not manually override generated Tailwind classes unless adjusting for confirmed design tokens
- Do not introduce new component libraries

---

## App Routes Contract

| Route | Screen |
|-------|--------|
| `/` | Cover screen |
| `/onboarding/1` – `/onboarding/5` | Five onboarding screens |
| `/bridge` | Profile Synced screen |
| `/anchor/new` | New Anchor form |
| `/vault` | Fit Vault dashboard |
| `/audit/new` | Audit New Item form |
| `/verdict/1` | Verified Fit verdict card |
| `/verdict/2` | Fit Advisory verdict card |
| `/verdict/3` | Smart Estimate verdict card |
| `/verdict/4` | Reduced Card (anchor incomplete) |

---

## Tech Stack (Confirmed)

| Layer | Choice |
|-------|--------|
| Platform | VS Code with Claude Code |
| Bundler | Vite |
| Framework | React |
| Language | TypeScript |
| CSS / Components | Tailwind CSS + `shadcn/ui` |
| Database | Supabase (MCP-connected) |
| UI Generation | Magic Patterns (MCP-connected) |
| Parser / AI | Gemini API `gemini-3.1-flash-lite` |
| Typography | Geist, Geist Mono |
| Deployment | Vercel |
