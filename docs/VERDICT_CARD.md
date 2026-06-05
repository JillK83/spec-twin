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

Always use `"your ${anchorBrand}"` not bare `"${anchorBrand}"`.
Fallback `"your item"` must never combine with a "your" already in the template — producing `"your your item"` is a bug.

---

## Fabric Behavior Pillar

**Lime — same fabric class**
- Status: `verified`
- Headline: `"Fabric matches your ${anchorBrand}"`
- Detail: `"Both items have the same amount of stretch. The fabric won't be a factor in how this fits compared to your ${anchorBrand}."`

**Lime — rigid → comfort_stretch**
- Status: `verified`
- Headline: `"Similar feel to your ${anchorBrand}"`
- Detail: `"This item has a little more give than your ${anchorBrand}. If anything, it may feel slightly more forgiving — not enough to change your size."`

**Lime — comfort_stretch → high_stretch**
- Status: `verified`
- Headline: `"Similar feel to your ${anchorBrand}"`
- Detail: `"This item has a bit more stretch than your ${anchorBrand}. The fit should still feel comparable — slightly more movement, same basic size."`

**Amber — comfort_stretch → rigid**
- Status: `advisory`
- Headline: `"Less stretch than your ${anchorBrand}"`
- Detail: `"This item has less give than your ${anchorBrand} and may feel tighter or more structured. Rigid denim softens with wear — if you're between sizes, lean toward the larger one."`

**Amber — high_stretch → comfort_stretch**
- Status: `advisory`
- Headline: `"Less stretch than your ${anchorBrand}"`
- Detail: `"This item has less give than your ${anchorBrand} and may feel slightly firmer through the hip and thigh. The difference is moderate — your usual size should still work."`

**Amber — rigid → high_stretch**
- Status: `advisory`
- Headline: `"More stretch than your ${anchorBrand}"`
- Detail: `"This item is softer and more forgiving than your ${anchorBrand}. You may want to size down if you prefer a snug fit."`

**Purple — Hard Stop (high_stretch or comfort_stretch → rigid)**
- Status: `estimate`
- Headline: `"Very different fabric from your ${anchorBrand}"`
- Detail: `"Your ${anchorBrand} has ${anchorStretchDesc}. This item has none — it will feel noticeably more structured and may fit very differently through the waist and hip. Check the brand's size guide before buying."`

---

## Waist and Hip Fit Pillar

**Lime — clean match, no adjustment**
- Status: `verified`
- Headline: `"Fits like your ${anchorBrand}"`
- Detail: `"This sits and fits the same way as your ${anchorBrand}. You should be able to order your usual size with confidence."`

**Lime — size adjustment, no gates**
- Status: `verified`
- Headline: `"Runs ${smaller/larger} than your ${anchorBrand}"`
- Detail: `"The shape and rise match your ${anchorBrand}. We've adjusted the size to account for how this brand typically cuts."`

**Amber — rise mismatch only**
- Status: `advisory`
- Headline: `"Different rise than your ${anchorBrand}"`
- Detail: `"The recommended size accounts for how this brand cuts — the waist estimate is still valid. This style sits differently than your ${anchorBrand}, so the rise and hip feel may vary. Check the return policy before ordering."` (note: `"differently"` is a placeholder — `${higher/lower}` pending riseDirection wiring)

**Amber — rise mismatch + brand offset combined**
- Status: `advisory`
- Headline: `"Different rise and cut than your ${anchorBrand}"`
- Detail: `"This style sits ${higher/lower} than your ${anchorBrand} and this brand tends to cut ${smaller/larger}. Both factors affect how the waist and hips will feel — we've adjusted the size to compensate for the cut, but the rise difference is worth trying before buying."`

**Amber — brand runs small (`euro_slim`)**
- Status: `advisory`
- Headline: `"Runs smaller than your ${anchorBrand}"`
- Detail: `"This brand cuts narrower than the label suggests. We've sized up to compensate — the waist and hips should have comparable give to your ${anchorBrand}."`

**Amber — brand runs small (`rigid_bias`)**
- Status: `advisory`
- Headline: `"Runs smaller than your ${anchorBrand}"`
- Detail: `"This brand's fabric construction makes it fit smaller than the label suggests. We've sized up to compensate — expect a firmer feel through the waist and hips than your ${anchorBrand}."`

**Amber — brand runs large (`vanity_high`)**
- Status: `advisory`
- Headline: `"Runs larger than your ${anchorBrand}"`
- Detail: `"This brand sizes generously. We've sized down to compensate — the waist and hips should feel comparable to your ${anchorBrand}."`

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
- Detail: `"Because the fabric is very different from your ${anchorBrand}, we can't predict how the waist and hips will actually feel. Check the brand's size guide before ordering."`

---

## Shape Retention Pillar

**Amber — `recovery_class: unknown`**
- Status: `advisory`
- Headline: `"Recovery data unavailable"`
- Detail: `"Most denim relaxes a little with wear. We don't have recovery data for this item, so we can't say how much — if fit staying snug through the day matters to you, check the fabric label before buying."`

**Amber — `RECOVERY_PRESENT_TO_ABSENT`**
- Status: `advisory`
- Headline: `"May loosen more than your ${anchorBrand}"`
- Detail: `"Your ${anchorBrand} has recovery fiber that helps it hold its shape. This item doesn't — you may notice it feeling slightly looser by evening."`

**Lime — low/low**
- Status: `verified`
- Headline: `"Matches your ${anchorBrand}"`
- Detail: `"Both items lack recovery fiber. Like your ${anchorBrand}, expect this to relax and soften as you wear it — that's normal behavior for this fabric type."`

**Lime — moderate/moderate**
- Status: `verified`
- Headline: `"Matches your ${anchorBrand}"`
- Detail: `"Recovery is similar to your ${anchorBrand}. Expect it to hold its shape through the day about the same way — some relaxation by evening, recovers after washing."`

**Lime — high/high**
- Status: `verified`
- Headline: `"Matches your ${anchorBrand}"`
- Detail: `"Like your ${anchorBrand}, this fabric bounces back after stretching. Expect it to stay snug and consistent from morning to evening."`

**Lime — upgrade (low → moderate or high)**
- Status: `verified`
- Headline: `"Holds shape better than your ${anchorBrand}"`
- Detail: `"This fabric has better recovery than your ${anchorBrand} and will stay more consistent through the day. If your ${anchorBrand} tends to loosen by evening, this one should hold up better."`

**Purple — clean pass, smart_estimate override (fabric Hard Stop)**
- Status: `estimate` (overridden by `output_state = smart_estimate`)
- Headline: `"Recovery data unavailable"`
- Detail: `"We don't have recovery data for this item. Given the fabric difference from your ${anchorBrand}, check the brand's size guide before buying."`

---

## Banner Text by Output State

| Output state | Trigger | Banner text |
|---|---|---|
| `verified_fit` | — | No banner |
| `fit_advisory` | Rise mismatch | `"This style sits differently than your usual preference, which may affect how the waist and hip feel."` |
| `fit_advisory` | Fabric soft warning | `"This item has a different amount of stretch than your reference item — it may feel slightly different."` |
| `smart_estimate` | Fabric Hard Stop | `"This item will likely feel much firmer and less stretchy than your reference item."` |
| `smart_estimate` | Contract Hard Stop | `"This item uses a very different sizing system — your usual size may not translate cleanly."` |
| `reduced` | Incomplete anchor | `"Incomplete anchor — material data missing"` |

---

## Size Display by Output State

| Output state | Display | Format |
|---|---|---|
| `verified_fit` | Recommended size | `"27 x 30"` large heading, ink color |
| `fit_advisory` | Recommended size | `"27 x 30"` large heading, ink color |
| `smart_estimate` | No specific size | `"See brand size guide"` mono text, muted |
| `reduced` | No size shown | — |

---

## CTA by Output State

| Output state | CTA label |
|---|---|
| `verified_fit` | `SAVE FIT TO VAULT` |
| `fit_advisory` | `SAVE FIT TO VAULT` |
| `smart_estimate` | `VERIFY BEFORE SAVING` |
| `reduced` | `UPDATE ANCHOR` |
