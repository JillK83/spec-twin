{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
# GLOSSARY.md \'97 The Spec-Twin Fit Auditor\
\
This glossary maps internal technical terms to plain-language customer-facing equivalents.\
\
**Purpose:**\
- Keeps engineering, product, and design aligned on what terms mean\
- Provides the foundation for verdict card copy, pillar labels, and tooltips\
- Required for every new category before it ships \'97 see `ENGINEERING_NOTES.md` Section 12\
\
**MVP scope:** Women's denim only.\
Future category sections are templated at the bottom \'97 populate before each category ships.\
\
---\
\
## Women's Denim\
\
### Output States\
\
| Technical term | DB value | Customer-facing label | Badge color | What it means to the customer |\
|---|---|---|---|---|\
| Verified Fit | `verified_fit` | Verified Fit | Green | Your anchor and this item are a strong match \'97 order your usual size with confidence |\
| Fit Advisory | `fit_advisory` | Fit Advisory | Amber | There's a meaningful difference worth knowing about \'97 read the details before ordering |\
| Smart Estimate | `smart_estimate` | Smart Estimate | Purple | We can make an educated guess but can't give a confident call \'97 verify before buying |\
\
---\
\
### Fabric Behavior\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `fabric_class: rigid` | Holds its shape | No stretch \'97 fits exactly as cut, may feel snug at first and soften slightly with wear |\
| `fabric_class: comfort_stretch` | Soft with a little give | A small amount of stretch that makes movement easier without changing the overall fit |\
| `fabric_class: high_stretch` | Stretchy, moves with you | Significant stretch \'97 hugs the body and moves with you throughout the day |\
| Fabric gate: Hard Stop | Fabric Contradiction | This item is made very differently from your reference item \'97 the fit and feel will be noticeably different |\
| Fabric gate: Soft Warning | Fabric Difference | This item has a different amount of stretch than your reference item \'97 it may feel slightly different |\
\
---\
\
### Recovery & Aging\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `recovery_class: high` | Holds its shape all day | Fabric bounces back after stretching \'97 stays snug and consistent from morning to evening |\
| `recovery_class: moderate` | Mostly holds its shape | Some relaxation with wear \'97 may feel slightly looser by end of day, usually recovers after washing |\
| `recovery_class: low` | May loosen with wear | Little recovery fiber \'97 expect the fabric to relax and feel looser as the day goes on |\
| `recovery_class: unknown` | Recovery data unavailable | We don't have fiber data for this item \'97 expect standard denim behavior |\
\
---\
\
### Fit Contract\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `contract_type: precision` | Exact sizing | Numeric sizing (e.g. waist 27") \'97 size translates directly and predictably |\
| `contract_type: range` | Flexible sizing | Alpha sizing (e.g. S/M/L) \'97 size covers a range and may feel different at each end |\
| Contract gate: Hard Stop | Sizing System Mismatch | This item uses a very different sizing system than your reference item \'97 your usual size may not translate cleanly |\
| Contract gate: Soft Warning | Different Sizing System | This item uses a more flexible size system than your reference item \'97 the fit may feel less exact |\
\
---\
\
### Brand Offset\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `tier: A` / `fit_tag: euro_slim` | Runs small | This brand cuts narrower than the label suggests \'97 you may want to size up |\
| `tier: B` / `fit_tag: vanity_high` | Runs large | This brand sizes generously \'97 you may want to size down |\
| `tier: C` / `fit_tag: true_spec` | True to size | This brand cuts close to standard sizing |\
| `fit_tag: rigid_bias` | Runs small due to fabric | No stretch in the fabric makes it feel smaller \'97 consider sizing up |\
| `fit_tag: oversize_design` | Intentionally oversized | This style is designed to be roomy \'97 this is intentional, not a sizing error |\
| Cold start | New to our system | We don't have enough data on this brand yet \'97 treat this as a starting point |\
| `weighted_offset` | Brand fit tendency | How this brand typically fits compared to standard sizing |\
| `drift_adjustment` | Updated based on feedback | Our recommendation has been refined based on real customer outcomes |\
\
---\
\
### Size Recommendation\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `size_adjustment: 0` | Your usual size | This item should fit the same as your reference item |\
| `size_adjustment: +1` | Size up one | This item runs smaller \'97 go one size up from your reference |\
| `size_adjustment: +2` | Size up two | This item runs noticeably smaller \'97 go two sizes up from your reference |\
| `size_adjustment: -1` | Size down one | This item runs larger \'97 go one size down from your reference |\
| `size_adjustment: -2` | Size down two | This item runs noticeably larger \'97 go two sizes down from your reference |\
| Size cap triggered | Extended size \'97 estimate only | Our confidence is reduced at this size range \'97 verify with the brand's size guide before ordering |\
\
---\
\
### Rise\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| Rise mismatch | Different rise than usual | This style sits higher or lower than your usual preference \'97 the waist and hip fit will feel different |\
| High rise | High rise | Sits at or above the natural waist |\
| Mid rise | Mid rise | Sits between the hip and natural waist |\
| Low rise | Low rise | Sits below the hip |\
\
---\
\
### Confidence Level\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| `confidence_level: HIGH` | High confidence | Strong match across fabric, sizing, and brand data |\
| `confidence_level: MEDIUM` | Some uncertainty | One difference worth knowing about \'97 read the details |\
| `confidence_level: LOW` | Low confidence | Multiple differences \'97 treat this as a starting point only |\
\
---\
\
### Verdict Card Elements\
\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| Anchor | Your reference item | The item you already own and trust that we're comparing against |\
| Pillar | Fit factor | One of the three areas we check: Fabric Behavior, Waist & Hip Fit, Recovery & Aging |\
| Green dot | Pass | This factor looks good \'97 no issues found |\
| Amber dot | Note | Something worth knowing about this factor |\
| Purple dot | Flagged | A meaningful difference that affects our confidence |\
| Reduced card | Incomplete data | We're missing anchor details \'97 update your reference item for a full recommendation |\
\
---\
\
## Future Category Templates\
\
When a new category is ready to ship, copy this template and complete it before any code is written for that category.\
\
```\
## [Category Name]\
\
### Fabric Behavior\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| | | |\
\
### Fit Contract\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| | | |\
\
### Size Recommendation\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| | | |\
\
### [Category-specific section \'97 e.g. Shoulder & Chest for tops]\
| Technical term | Customer-facing label | Plain-language explanation |\
|---|---|---|\
| | | |\
```\
\
**Categories queued for full vision:** Women's trousers, knitwear, structured blazers, outerwear, men's denim.}