# Verdict Card Copy Reference
## The Spec-Twin Fit Auditor — MVP

Single source of truth for all verdict card copy.
All pillar headlines, details, banner text, size display, and CTA labels.
Read this before writing or editing any verdict card copy.

---

## Voice Map

| Pillar | Term | Register | Source |
|---|---|---|---|
| Fabric Behavior | Stretch | Material fact | `fabric_class` delta |
| Waist and Hip Fit | Give | Body interaction | `brand_offset` + `contract_type` + rise |
| Shape Retention | Recovery | Time-based behavior | `recovery_class` |

---

## Rules

**Accordion hierarchy**
- Headline = the what — always visible in collapsed state, must work as standalone verdict
- Detail = the why or when — only visible on expand, must add new information not restate the headline
- Never restate the headline in the detail

**Sizing redirect rule**
- Sizing redirects (e.g. "lean toward the larger one") only allowed in `verified_fit` and `fit_advisory` states
- Never include a specific size number or sizing direction in a `smart_estimate` detail

**Pillar status override rule**
- When `output_state = smart_estimate` all three pillar dots must return `estimate` (purple)
- No lime dots on a purple card regardless of individual gate resolution

**Token rules**
| Token | Resolves from | Fallback |
|---|---|---|
| `${anchorBrand}` | `user_anchors.brand_name` | `"your item"` |
| `${anchorStretchDesc}` | `high_stretch` → `"significant stretch"` / `comfort_stretch` → `"a little stretch"` | `"some stretch"` |
| `${higher/lower}` | `target_rise` vs user primary rise preference | `"differently"` |
| `${smaller/larger}` | sign of `fit_delta` or `fit_tag` direction | omit sizing direction |
| `${target_size_original}` | `product_audits.target_size_original` raw string | `"this size"` |

Use bare `${anchorBrand}` (no leading "your") in all headlines and details.
Fallback `"your item"` must never combine with a "your" already in the template — producing `"your your item"` is a bug.
<!-- TODO: fallback "your item" may need revisiting now that templates don't prepend "your" -->

---

## Fabric Behavior Pillar

**Lime — same fabric class**
- Status: `verified`
- Headline: `"Fabric matches ${anchorBrand}"`
- Detail: `"Both items have the same amount of stretch. The fabric won't be a factor in how this fits compared to ${anchorBrand}."`

**Lime — comfort_stretch → high_stretch**
- Status: `verified`
- Headline: `"Similar feel to ${anchorBrand}"`
- Detail: `"This item has a bit more stretch than ${anchorBrand}. The fit should still feel comparable — slightly more movement, same basic size."`

**Amber — comfort_stretch → rigid**
- Status: `advisory`
- Headline: `"Less stretch than ${anchorBrand}"`
- Detail: `"This item has less give than ${anchorBrand} and may feel tighter or more structured. Rigid denim softens with wear — if you're between sizes, lean toward the larger one."`

**Amber — high_stretch → comfort_stretch**
- Status: `advisory`
- Headline: `"Less stretch than ${anchorBrand}"`
- Detail: `"This item has less give than ${anchorBrand} and may feel slightly firmer through the hip and thigh. The difference is moderate — your usual size should still work."`

**Amber — rigid → high_stretch**
- Status: `advisory`
- Headline: `"More stretch than ${anchorBrand}"`
- Detail: `"This item is softer and more forgiving than ${anchorBrand}. You may want to size down if you prefer a snug fit."`

**Amber — rigid → comfort_stretch**
- Status: `advisory`
- Headline: `"Has a little more give than ${anchorBrand}"`
- Detail: `"${anchorBrand} has no stretch fiber. This item has a small amount — it will feel slightly softer and more forgiving, but the difference is mild. Size as recommended."`

<!-- Reclassified from Lime/verified to Amber/advisory to match gates.ts FABRIC_RIGID_TO_COMFORT SOFT_WARNING (commit 7330b5c). Doc was previously out of sync with implemented gate behavior. -->

**Purple — Hard Stop (high_stretch → rigid)**
- Status: `estimate`
- Headline: `"Very different fabric from ${anchorBrand}"`
- Detail: `"${anchorBrand} has ${anchorStretchDesc}. This item has none — it will feel noticeably more structured and may fit very differently through the waist and hip. Check the brand's size guide before buying."`

---

## Waist and Hip Fit Pillar

**Lime — clean match, no adjustment**
- Status: `verified`
- Headline: `"Fits like ${anchorBrand}"`
- Detail: `"This sits and fits the same way as ${anchorBrand}. You should be able to order your usual size with confidence."`

**Lime — size adjustment, no gates**
- Status: `verified`
- Headline: `"Runs ${smaller/larger} than ${anchorBrand}"`
- Detail: `"The shape and rise match ${anchorBrand}. We've adjusted the size to account for how this brand typically cuts."`

**Amber — rise mismatch only**
- Status: `advisory`
- Headline: `"Different rise than ${anchorBrand}"`
- Detail: `"The recommended size accounts for how this brand cuts — the waist estimate is still valid. This style sits differently than ${anchorBrand}, so the rise and hip feel may vary. Check the return policy before ordering."` (note: `"differently"` is a placeholder — `${higher/lower}` pending riseDirection wiring)

**Amber — rise mismatch + brand offset combined**
- Status: `advisory`
- Headline: `"Different rise and cut than ${anchorBrand}"`
- Detail: `"This style sits ${higher/lower} than ${anchorBrand} and this brand tends to cut ${smaller/larger}. Both factors affect how the waist and hips will feel — we've adjusted the size to compensate for the cut, but the rise difference is worth trying before buying."`

**Amber — brand runs small (`euro_slim`)**
- Status: `advisory`
- Headline: `"Runs smaller than ${anchorBrand}"`
- Detail: `"This brand cuts narrower than the label suggests. We've sized up to compensate — the waist and hips should have comparable give to ${anchorBrand}."`

**Amber — brand runs small (`rigid_bias`)**
- Status: `advisory`
- Headline: `"Runs smaller than ${anchorBrand}"`
- Detail: `"This brand's fabric construction makes it fit smaller than the label suggests. We've sized up to compensate — expect a firmer feel through the waist and hips than ${anchorBrand}."`

**Amber — brand runs large (`vanity_high`)**
- Status: `advisory`
- Headline: `"Runs larger than ${anchorBrand}"`
- Detail: `"This brand sizes generously. We've sized down to compensate — the waist and hips should feel comparable to ${anchorBrand}."`

**Amber — cold start**
- Status: `advisory`
- Headline: `"New to our system"`
- Detail: `"We don't have enough data on how this brand fits yet. The waist and hip recommendation is a starting point — check the brand's size guide before ordering."`

**Purple — range → precision, unresolvable**
- Status: `estimate`
- Headline: `"Can't confirm waist fit"`
- Detail: `"This item is sized as ${target_size_original} which doesn't translate cleanly to your numeric anchor size. We can't confidently resolve the waist and hip fit. Check the brand's measurement guide before buying."`

**Purple — clean pass, smart_estimate override (fabric Hard Stop)**
- Status: `estimate` (overridden by `output_state = smart_estimate`)
- Headline: `"Waist fit uncertain"`
- Detail: `"Because the fabric is very different from ${anchorBrand}, we can't predict how the waist and hips will actually feel. Check the brand's size guide before ordering."`

---

## Shape Retention Pillar

> **Note:** `estimate` (purple) status on this pillar is a dot-color override only — applied per the Pillar status override rule when `output_state = smart_estimate`. Headlines and details are state-driven (1a/1b/2/3/4/5/6 below) regardless of dot color; there is no separate purple-only headline for this pillar.

**Amber — State 1a: `recovery_class: unknown`, target fabric is `rigid`**
- Status: `advisory`
- Headline: `"Will loosen with wear"`
- Detail: `"100% cotton denim has no elastic fiber to snap back into shape. Expect the waist to relax up to an inch after a full day of wear, with some bagging at the knees and seat. Washing resets the fit — many people intentionally size down on first wear knowing this."`

**Amber — State 1b: `recovery_class: unknown`, other fabric classes**
- Status: `advisory`
- Headline: `"Standard stretch behavior"`
- Detail: `"Most denim relaxes a little with wear. We don't have recovery data for this item, so we can't say how much — if fit staying snug through the day matters to you, check the fabric label before buying."`

**Amber — `RECOVERY_PRESENT_TO_ABSENT` (anchor has recovery, target does not)**
- Status: `advisory`
- Headline: `"May loosen more than ${anchorBrand}"`
- Detail: `"${anchorBrand} has recovery fiber that helps it hold its shape. This item doesn't — you may notice it feeling slightly looser by evening."`

**Lime — low/low**
- Status: `verified`
- Headline: `"Matches ${anchorBrand}"`
- Detail: `"Both items lack recovery fiber. Like ${anchorBrand}, expect this to relax and soften as you wear it — that's normal behavior for this fabric type."`

**Lime — moderate/moderate**
- Status: `verified`
- Headline: `"Matches ${anchorBrand}"`
- Detail: `"Recovery is similar to ${anchorBrand}. Expect it to hold its shape through the day about the same way — some relaxation by evening, recovers after washing."`

**Lime — high/high**
- Status: `verified`
- Headline: `"Matches ${anchorBrand}"`
- Detail: `"Like ${anchorBrand}, this fabric bounces back after stretching. Expect it to stay snug and consistent from morning to evening."`

**Lime — upgrade (low → moderate or high)**
- Status: `verified`
- Headline: `"Holds shape better than ${anchorBrand}"`
- Detail: `"This fabric has better recovery than ${anchorBrand} and will stay more consistent through the day. If ${anchorBrand} tends to loosen by evening, this one should hold up better."`

---

## Banner Text — Severity Tier System

The verdict card has a single banner slot. When multiple gate conditions are
active simultaneously, the highest-severity tier's text wins the slot. If a
second, lower-tier condition is also active, a pointer suffix is appended
naming the pillar where that information lives.

| Tier | Condition | Banner text | Points to (if also active) |
|---|---|---|---|
| 1 | Size delta escalation (`size_up_2` or `size_down_2`) | `"A size difference this large is worth verifying — check the brand's size guide before buying."` | Waist and Hip Fit |
| 2 | Fabric Hard Stop — `FABRIC_HIGH_STRETCH_TO_RIGID` | `"This item will likely feel much firmer and less stretchy than your reference item."` | Fabric Behavior |
| 3 | Rise mismatch | `"This style sits differently than your usual preference, which may affect how the waist and hip feel."` | Waist and Hip Fit |
| 4 | Fabric Soft Warning — `FABRIC_HIGH_STRETCH_TO_COMFORT` | `fabricGateUserText` per gate reason (retain distinct userText — do not replace with FABRIC_COMFORT_TO_RIGID string) | Fabric Behavior |
| 4 | Fabric Soft Warning — `FABRIC_COMFORT_TO_RIGID` | `"This item has less stretch than your reference item and may feel slightly firmer."` | Fabric Behavior |
| 4 | Fabric Soft Warning — `FABRIC_RIGID_TO_HIGH_STRETCH` | `"This item will likely feel softer and more forgiving than your current size."` | Fabric Behavior |
| — | Nothing above active (includes: brand-offset-only adjustments, `FABRIC_RIGID_TO_COMFORT`, cold start alone, contract gates) | No banner | — |

**Pointer suffix:** when a second, lower-tier condition is active, append a
suffix naming the relevant pillar. Exact suffix wording/formatting (plain
text vs. styled element) is TBD — confirm against `VerdictCard.tsx` banner
component capabilities during implementation. Suggested content: "Also check
{Pillar Name} below."

**Tier 1 note:** Size delta escalation banner text is not currently wired in
`VerdictOpenPage.tsx` — this is a known gap to address during the Phase 2
code session, not yet implemented.

<!-- Matches live gates.ts (SOFT_WARNING/fit_advisory since engine-freeze b05b6d4).
   Spec (spec_twin_logic.md) documents this as HARD_STOP — divergence logged as a
   separate engine backlog item, not corrected here. -->

**Out of scope:** Contract gate (`precision`↔`range`) banner wiring is not
included in this tier system yet — logged separately as LM-5.

**Example — Rise mismatch + rigid→high_stretch soft warning:**
Active: Tier 3 (rise mismatch) + Tier 4 (FABRIC_RIGID_TO_HIGH_STRETCH).
Tier 3 wins the primary slot.
Banner: "This style sits differently than your usual preference, which may affect how the waist and hip feel. — also check Fabric Behavior below."

---

## Size Display by Output State

| Output state | Display | Format |
|---|---|---|
| `verified_fit` | Recommended size | `"27 x 30"` large heading, ink color |
| `fit_advisory` | Recommended size | `"27 x 30"` large heading, ink color |
| `smart_estimate` | No specific size | `"See brand size guide"` mono text, muted |

---

## CTA by Output State

| Output state | CTA label |
|---|---|
| `verified_fit` | `SAVE FIT TO VAULT` |
| `fit_advisory` | `SAVE FIT TO VAULT` |
| `smart_estimate` | `VERIFY BEFORE SAVING` |
