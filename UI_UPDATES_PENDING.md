# UI Updates — Pending
Last updated: 2026-05-10

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
- [ ] Add Rise toggle (High / Mid / Low) — required, saves to 
      user_anchors.rise. Pre-populate from localStorage rise_primary.
      User can override for this specific garment.
- [ ] Add Silhouette dropdown — required, saves to user_anchors.silhouette.
      Pre-populate from localStorage silhouette_primary.
      User can override for this specific garment.
- [ ] Remove Fit Allowance toggle entirely — not wired to engine logic,
      creates false expectations
- [ ] Expand Material Composition maxLength from 68 to 90

---

## Session 4 — UI cleanup pass
- [ ] Audit form: leg shape dropdown width — should match brand/style 
      field width, not full width
- [ ] Audit form: leg shape dropdown display labels — show 'Bootcut / Flare'
      not 'bootcut_flare', 'Relaxed / Loose' not 'relaxed_loose', etc.
      Apply same label mapping to all engine value dropdowns
- [ ] Audit form: Product URL helper text — replace 
      'Stored for reference only — no scraping' with 
      'Save the link to revisit this item later.'
- [ ] Audit form: Product URL field — add onPaste handler to strip query 
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
- [ ] Smart estimate banner: 'Incomplete data — verify before buying' 
      should only show for cold start, not fabric hard stop
      Fabric hard stop should show fabric-specific banner copy

---

## Session 6 — Performance
- [ ] Anchor save lag: 6–7 second delay on Gemini parse call —
      investigate whether parse can be made non-blocking
- [ ] Verdict loader lag: confirm parallel Promise.all fix held from 
      earlier session — re-test loading state timing
- [ ] Loading state: confirm three Geist Mono lines cycle at ~250ms each
      and verdict card fades in at 200ms after third step

---

## Known Gaps — Post-MVP
- [ ] Brand inseam availability: engine has no visibility into what inseam 
      lengths a brand offers. Documented in ENGINEERING_NOTES Section 13.
- [ ] Petite, tall, plus size ranges: grade differently from standard 
      women's 0–16, not supported at MVP
- [ ] Rayon/viscose columns: rayon_pct parsed by Gemini but not stored.
      Add rayon_pct to user_anchors and product_audits when schema extended.
      TODO comment already in audit.ts at the storage point.
- [ ] Fit Allowance toggle: collected on anchor form but not wired to 
      engine. Remove from form at Session 3, revisit in full vision.
- [ ] user_profiles table: see ADDENDUM_V4.sql. Implement when auth added.
