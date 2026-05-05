-- ============================================================
-- SPEC-TWIN FIT AUDITOR — ADDENDUM V3
-- Adds: anchor_inseam, rise, silhouette to user_anchors
-- Adds: target_rise, target_silhouette, target_inseam_suggested to product_audits
-- Run AFTER supabase_schema.sql, ADDENDUM_V1.sql, ADDENDUM_V2.sql
-- ============================================================

-- ============================================================
-- user_anchors: add inseam, rise, and silhouette fields
-- ============================================================

-- anchor_inseam: numeric inseam extracted from the "27x30" size entry
-- Stored separately from the raw size string for engine use
ALTER TABLE user_anchors
  ADD COLUMN anchor_inseam numeric;

-- rise: the rise of the anchor garment, captured on the anchor form
-- Used as the baseline for rise mismatch gate comparison
ALTER TABLE user_anchors
  ADD COLUMN rise text CHECK (rise IN ('high', 'mid', 'low'));

-- silhouette: the leg shape of the anchor garment
-- Used to derive target inseam via Section 11 subtraction constants
-- when target silhouette differs from anchor silhouette
ALTER TABLE user_anchors
  ADD COLUMN silhouette text CHECK (silhouette IN (
    'skinny',
    'straight',
    'relaxed_loose',
    'bootcut_flare',
    'wide_leg'
  ));

-- ============================================================
-- product_audits: add target rise, silhouette, and suggested inseam
-- ============================================================

-- target_rise: rise of the target item, captured on the audit form Rise toggle
-- Compared against user's onboarding primary rise preference to fire rise gate
ALTER TABLE product_audits
  ADD COLUMN target_rise text CHECK (target_rise IN ('high', 'mid', 'low'));

-- target_silhouette: leg shape of the target item
-- Derived by parser from fabric/care paste text or set from audit form
-- Used with anchor silhouette to determine whether inseam adjustment applies
ALTER TABLE product_audits
  ADD COLUMN target_silhouette text CHECK (target_silhouette IN (
    'skinny',
    'straight',
    'relaxed_loose',
    'bootcut_flare',
    'wide_leg'
  ));

-- target_inseam_suggested: the inseam value shown on the verdict card
-- Derived at audit time from:
--   1. preferred_inseam_overrides JSONB map (wins if present for this silhouette)
--   2. anchor_inseam if silhouettes match (carry forward unchanged)
--   3. height-derived subtraction constant from ENGINEERING_NOTES Section 11 (if silhouettes differ)
ALTER TABLE product_audits
  ADD COLUMN target_inseam_suggested numeric;

-- ============================================================
-- user_anchors: add fabric preference from onboarding Screen 5
-- ============================================================

-- fabric_preference: user's stated denim feel preference
-- Optional — null if user skipped Screen 5
-- Primary selection (first tap) stored here
-- Maps directly to fabric_class values for advisory copy enrichment
-- Does NOT affect gate logic — fabric gate fires on anchor vs target fabric_class only
ALTER TABLE user_anchors
  ADD COLUMN fabric_preference text CHECK (fabric_preference IN (
    'rigid',
    'comfort_stretch',
    'high_stretch'
  ));

-- fabric_preference_secondary: additional fabric preferences beyond primary
-- Stored as JSONB array for future use — e.g. ["comfort_stretch", "high_stretch"]
-- Not used in MVP gate logic or copy — collected for future personalization
ALTER TABLE user_anchors
  ADD COLUMN fabric_preference_secondary jsonb;

-- ============================================================
-- user_anchors: add body shape from onboarding Screen 4
-- ============================================================

-- body_shape: user's selected body shape
-- Optional — null if user skipped Screen 4
-- Skipping drops confidence to MEDIUM per SPEC_TWIN_LOGIC Section 12
-- At MVP affects confidence scoring only — full vision feeds waist/hip fit copy
ALTER TABLE user_anchors
  ADD COLUMN body_shape text CHECK (body_shape IN (
    'athletic_straight',
    'pear',
    'apple',
    'hourglass'
  ));

-- ============================================================
-- Notes for implementation
-- ============================================================
-- Full onboarding screen → schema mapping:
--   Screen 1: Rise preference → stored on user profile (primary + optional secondary)
--   Screen 2: Leg shape / silhouette → silhouette column (required, at least 1)
--   Screen 3: Height → stored on user profile (required, feeds inseam derivation)
--   Screen 4: Body shape → body_shape column (optional, skip allowed, ideally 1)
--   Screen 5: Denim feel → fabric_preference column (optional, skip allowed, at least 1 if selected)
--
-- Fabric preference UI label → engine value mapping:
--   "Rigid and Authentic"    → 'rigid'
--   "Classic Comfort"        → 'comfort_stretch'
--   "Stretchy and Forgiving" → 'high_stretch'
--
-- Body shape UI label → engine value mapping:
--   "Athletic / Straight" → 'athletic_straight'
--   "Pear"                → 'pear'
--   "Apple"               → 'apple'
--   "Hourglass"           → 'hourglass'
--
-- Silhouette values map to onboarding Screen 2 selections:
--   'skinny'        → Skinny
--   'straight'      → Straight
--   'relaxed_loose' → Relaxed / Loose
--   'bootcut_flare' → Bootcut / Flare
--   'wide_leg'      → Wide Leg
--
-- Size display format on verdict card: "27 x 30" (waist x inseam)
-- Size display format on anchor form: "27x30" or "27 x 30" (parser splits on save)
-- Size display format on Fit Vault dashboard card: "Size 27x30"
-- Size display format on audit form anchor reference bar: "Size 27x29"
-- Inseam adjustment note shown below verdict card size value when silhouettes differ:
--   "Inseam adjusted for silhouette" (Geist Mono small)
-- When preferred_inseam_overrides applied:
--   "Based on your inseam preference" (Geist Mono small)
-- See ENGINEERING_NOTES.md Section 11 for subtraction constants by silhouette
-- See ENGINEERING_NOTES.md Section 13 for full inseam derivation rules
-- See CLAUDE.md Size Display Contract for full display rules
