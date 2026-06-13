# UI Updates — Pending
Last updated: 2026-06-12

See also: CLAUDE.md "Open Items / Carry-Forward Backlog" for the engine-side
FABRIC_RIGID_TO_HIGH_STRETCH gate type reconciliation item (separate dedicated
session, never on main — not a UI item, tracked in CLAUDE.md only).

Work through in session order below. Each session is a separate Claude Code prompt.

---

## Session 2 — Wire localStorage for onboarding
- [x] Onboarding Screen 1 (rise): save rise_primary and rise_secondary 
      to localStorage key 'spec_twin_profile' on Continue
- [x] Onboarding Screen 2 (silhouette): save silhouette_primary and 
      silhouette_secondary to localStorage on Continue
- [x] Onboarding Screen 3 (height): save height_inches to localStorage on Continue
- [ ] Screens 4 and 5: wire after 1–3 confirmed working
- [x] Audit engine: replace hardcoded profileRise = 'high' in 
      AuditNewItemForm.tsx with localStorage read from 
      spec_twin_profile.rise_primary

---

## Session 3 — Anchor form fields
- [x] Add Rise toggle (High / Mid / Low) — required, saves to 
      user_anchors.rise. Pre-populate from localStorage rise_primary.
      User can override for this specific garment.
- [x] Add Silhouette dropdown — required, saves to user_anchors.silhouette.
      Pre-populate from localStorage silhouette_primary.
      User can override for this specific garment.
- [x] Remove Fit Allowance toggle entirely — not wired to engine logic,
      creates false expectations
- [x] Expand Material Composition maxLength from 68 to 90

---

## Session 4 — UI cleanup pass
- [ ] Audit form: leg shape dropdown width — should match brand/style 
      field width, not full width
- [x] Audit form: leg shape dropdown display labels — show 'Bootcut / Flare'
      not 'bootcut_flare', 'Relaxed / Loose' not 'relaxed_loose', etc.
      Apply same label mapping to all engine value dropdowns
- [x] Audit form: Product URL helper text — replace 
      'Stored for reference only — no scraping' with 
      'Save the link to revisit this item later.'
- [x] Audit form: Product URL field — add onPaste handler to strip query 
      parameters. Keep base URL only, discard everything after '?'
- [ ] Anchor form: Category dropdown — fix formatting and styling issues
- [ ] Vault dashboard: anchor cards — read rise and silhouette from 
      user_anchors row, not hardcoded display strings
- [ ] Vault dashboard: anchor cards fabric class badge colors — confirm
      Rigid = teal, Comfort Stretch = amber, High Stretch = lime
- [ ] Global: audit all dropdowns and select fields for engine values 
      leaking into UI — apply display label mapping everywhere

---

## Session 5 — Pillar copy rewrite
- [ ] All three pillars: detail text is identical to headline text
      Detail text should add information, not repeat the headline
- [ ] Fabric Behavior: write distinct detail copy for each gate state
- [ ] Waist and Hip Fit: write distinct detail copy for each gate state  
- [ ] Shape Retention: write distinct detail copy for each gate state
      Constraint added during VERDICT_CARD.md reconciliation: 2-sentence
      maximum per detail string; remove redundant per-pillar "check the
      brand's size guide" CTAs — banner/size-block now handles this
      universally (see VERDICT_CARD.md Banner Text — Severity Tier System).
      Cross-ref: B5 in CLAUDE.md backlog.
- [x] Smart estimate banner: 'Incomplete data — verify before buying' 
      should only show for cold start, not fabric hard stop
      Fabric hard stop should show fabric-specific banner copy
      Superseded and resolved by Phase 2 severity-tier banner rewrite
      (VerdictOpenPage.tsx, commit landed, 63/63 tests passing — Tier 2 =
      fabric hard stop gets fabricGateUserText; cold-start-alone produces
      no banner per VERDICT_CARD.md Banner Text — Severity Tier System).

---

## Session 6 — Performance
- [ ] Anchor save lag: 6–7 second delay on Gemini parse call —
      investigate whether parse can be made non-blocking
- [ ] Verdict loader lag: confirm parallel Promise.all fix held from 
      earlier session — re-test loading state timing
- [ ] Loading state: confirm three Geist Mono lines cycle at ~250ms each
      and verdict card fades in at 200ms after third step

---

## Session 7 — Verdict card copy follow-ups (from VERDICT_CARD.md reconciliation)
- [ ] isSameBrand conditional copy: when anchorBrand === targetBrand, pillar
      copy referencing ${anchorBrand} needs a same-brand-aware variant to
      avoid broken sentences (e.g., "less stretchy than Levi's" when both
      items are Levi's). Requires exposing targetBrand to pillar functions
      alongside anchorBrand (similar shape to riseDirection wiring — small
      AuditOutput/prop addition + conditional branches in the three pillar
      functions). UI/data-passing layer only, no engine logic.
- [ ] LM-5 — Contract gate banner wiring: precision<->range contract gates
      (gates.ts) already fire and produce userText, but are not wired into
      advisoryBannerText / the severity-tier system in VerdictOpenPage.tsx.
      Wire as an additional tier (display-only, no new engine logic) — Tier
      1-4 wiring confirmed stable as of Phase 2 (63/63 tests passing).
- [ ] Anchor completeness / reduced-state UX: decide whether incomplete
      anchors (missing fabric composition, etc.) warrant a dedicated
      degraded card + "UPDATE ANCHOR" CTA, or whether existing unknown-state
      pillar logic (State 7, etc.) is sufficient. If the former, define what
      "incomplete" means (which fields, what threshold) before building.
      Currently no code path produces a degraded/reduced card — new feature
      work, not a bug fix.

---

## Session 4 continued — carry into next session
- [ ] Style / Model field on anchor form
- [ ] Confidence level LOW vs MEDIUM mismatch — single soft 
      warning should return MEDIUM not LOW
- [ ] Inseam note capitalization — uppercase
- [ ] Category trigger shows Denim not denim
- [ ] Brand/Category width parity on anchor form
- [ ] Size normalisation — store 27x30 not 27X30
- [ ] MD files update — CLAUDE.md, ENGINEERING_NOTES.md, 
      README.md reference bar format string

---

## Known Gaps — confirmed post-MVP
- [ ] Vault not wired to real Supabase data
- [ ] model_name null until Style/Model field lands
- [ ] Rayon/viscose parsed but not stored
- [ ] Brand inseam availability
- [ ] user_profiles table
- [ ] Post-purchase feedback loop UI
