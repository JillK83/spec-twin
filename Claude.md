{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # CLAUDE.md \'97 The Spec-Twin Fit Auditor (MVP)\
\
Behavioral guidelines for Claude when working on this project.\
These rules merge general coding discipline with project-specific contracts.\
**When in doubt, re-read this file before writing any code.**\
\
---\
\
## 1. Think Before Coding\
\
Don't assume. Don't hide confusion. Surface tradeoffs.\
\
Before implementing anything:\
- State your assumptions explicitly. If uncertain, ask.\
- If multiple interpretations exist, present them \'97 don't pick silently.\
- If a simpler approach exists, say so. Push back when warranted.\
- If something is unclear, stop. Name what's confusing. Ask.\
\
**Project-specific rules:**\
- **Deterministic logic first.** The fit recommendation engine is measurement-free and photo-free. Never suggest body-scanning or manual measurement inputs.\
- **The three-layer audit is sequential and non-negotiable.** Every recommendation flows through: Fit Contract \uc0\u8594  Fabric Performance Gate \u8594  Recovery & Aging. Do not skip or reorder layers.\
- **Ambiguity is a signal, not a default.** If data is missing (e.g. `poly_pct`), use the `unknown` state and surface an amber dot in the UI. Never silently default to a value.\
\
---\
\
## 2. Simplicity First\
\
Minimum code that solves the problem. Nothing speculative.\
\
- No features beyond what was asked.\
- No abstractions for single-use code.\
- No "flexibility" or "configurability" that wasn't requested.\
- No error handling for impossible scenarios.\
- If you write 200 lines and it could be 50, rewrite it.\
\
Ask yourself: *"Would a senior engineer say this is overcomplicated?"* If yes, simplify.\
\
**Project-specific rules:**\
- **MVP scope is fixed.** Do not implement men's denim logic, tops, trousers, outerwear, or multi-anchor blending.\
- **Atelier UI aesthetic.** Maintain the minimalist luxury feel. Use `shadcn/ui` and Tailwind CSS with the confirmed design tokens: `--ink`, `--paper`, `--accent-green`. Do not introduce new component libraries.\
- **TypeScript only.** No JavaScript patterns. All engine rules use the confirmed pure TypeScript implementation.\
\
---\
\
## 3. Surgical Changes\
\
Touch only what you must. Clean up only your own mess.\
\
When editing existing code:\
- Don't "improve" adjacent code, comments, or formatting.\
- Don't refactor things that aren't broken.\
- Match existing style, even if you'd do it differently.\
- If you notice unrelated dead code, mention it \'97 don't delete it.\
\
When your changes create orphans:\
- Remove imports/variables/functions that **your** changes made unused.\
- Don't remove pre-existing dead code unless asked.\
\
**The test:** Every changed line should trace directly to the user's request.\
\
**Project-specific rules:**\
- **Schema stewardship.** Strictly follow `brand_offsets`, `user_anchors`, and `product_audits` schemas as defined in the PRD v13. Use `weighted_offset` \'97 never `baseline_offset`. Use `reference_anchor_id` \'97 never `anchor_id`. Use `sample_size` for the drift feedback event count in `brand_offsets`.\
- **Hardware gate is inactive at MVP.** `closure_type` is not collected on the anchor input form. Do not implement hardware warnings or trigger any hardware gate logic.\
- **Output state snake_case enforcement.** The `output_state` field must strictly use: `verified_fit`, `fit_advisory`, `smart_estimate`. Any other value is wrong. See retired names below.\
- **Do not touch inseam constants once validated.** The height-derived subtraction constants (e.g. Skinny/Slim = Height \uc0\u8722  36") are confirmed build-ready. Do not adjust them unless explicitly asked.\
- **Do not touch gate logic after dry-run passes.** Once Antigravity dry-run confirms correct output for all three demo scenarios, the gate logic is frozen.\
\
---\
\
## 4. Goal-Driven Execution\
\
Define success criteria. Loop until verified.\
\
Transform tasks into verifiable goals:\
- "Add validation" \uc0\u8594  "Write tests for invalid inputs, then make them pass"\
- "Fix the bug" \uc0\u8594  "Write a test that reproduces it, then make it pass"\
- "Refactor X" \uc0\u8594  "Ensure tests pass before and after"\
\
For multi-step tasks, state a brief plan:\
1. [Step] \uc0\u8594  verify: [check]\
2. [Step] \uc0\u8594  verify: [check]\
3. [Step] \uc0\u8594  verify: [check]\
\
**Phase A \'97 Logic Validation (Antigravity)**\
- Goal: Dry-run gate logic against static JSON denim specs using the Antigravity Agent (Claude Pro). No API key required.\
- Success criteria: Agent correctly triggers Hard Stops, Soft Warnings, and fabric class deltas for all three demo scenarios.\
- Verification: All three scenarios resolve to the correct `output_state` before any code moves to the standalone app.\
\
**Phase B \'97 Live Implementation (Standalone App)**\
- Goal: Port validated Antigravity logic into the React/Vite build and connect the Anthropic API key.\
- Success criteria: All three demo scenarios produce the correct output state (`verified_fit`, `fit_advisory`, `smart_estimate`), badge color, pillar dot states, and copy. Verdict Card renders in under 2 seconds on desktop.\
\
---\
\
## Key Contracts \'97 Never Break These\
\
### Output State Naming\
```\
verified_fit    \uc0\u8594   Verified Fit   (green)\
fit_advisory    \uc0\u8594   Fit Advisory   (amber)\
smart_estimate  \uc0\u8594   Smart Estimate (purple)\
```\
**Retired \'97 must not appear anywhere in code, queries, or UI switch statements:**\
`RECOMMENDED_HIGH`, `RECOMMENDED_MEDIUM`, `RECOMMENDED_LOW`, `BLOCKED`, `HIGH_VARIANCE`, `REVIEW_CUT`, `NO_DIRECT_MATCH`\
\
### poly_pct Null Contract\
```typescript\
// null  = poly_pct absent from product data \uc0\u8594  recovery_class = 'unknown'\
// 0     = confirmed 0% polyester            \uc0\u8594  recovery_class = 'low'\
// Never treat null and 0 as equivalent.\
const getRecoveryClass = (polyPct: number | null): string => \{\
  if (polyPct === null || polyPct === undefined) return 'unknown'\
  if (polyPct === 0) return 'low'\
  if (polyPct < 4) return 'moderate'\
  return 'high'\
\}\
```\
\
### Inseam Override Contract\
- `preferred_inseam_overrides` is a **JSONB map** keyed by silhouette: `\{ straight: 30, wide_leg: 32, cropped: 26 \}`\
- Override always takes precedence over height-derived defaults.\
- Scalar `preferred_inseam_override` field is **retired** \'97 do not use it.\
\
### Size Cap Contract\
- Waist \uc0\u8805  33" or women's numeric size \u8805  18 \u8594  automatically return `smart_estimate` with disclaimer. Either condition alone triggers it.\
\
### Loading State Contract\
- Always include the deliberate 600\'96800ms pause with DM Mono text cycling:\
  1. "Reading anchor specs\'85"\
  2. "Comparing fabric class\'85"\
  3. "Calculating fit delta\'85"\
- Applies in both Scripted Mode and Open Mode.\
\
### UI / Magic Patterns Contract\
- Magic Patterns is the lead for UI components.\
- Do not manually override generated Tailwind classes unless adjusting for Atelier design tokens.\
- Keep exported Magic Patterns components in `/src/components/ui/magic`.\
- Before final styling, check `theme.json` or CSS variables to confirm the exported UI matches the minimalist luxury aesthetic.\
\
---\
\
## Tech Stack (Confirmed)\
\
| Layer | Choice |\
|---|---|\
| Platform | Antigravity / VS Code with Claude CLI |\
| Bundler | Vite |\
| Framework | React |\
| Language | TypeScript |\
| CSS / Components | Tailwind CSS + shadcn/ui |\
| Database | Supabase (MCP-connected) |\
| UI Generation | Magic Patterns |\
| Parser / AI | Anthropic API `claude-sonnet-4-20250514` |\
| Typography | Geist | Geist Mono\
| Deployment | Vercel |}