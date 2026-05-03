{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 -- ============================================================\
-- SPEC-TWIN FIT AUDITOR \'97 ADDENDUM V2\
-- Adds: gender column, fit_tag column, updated unique constraint\
-- Run AFTER supabase_schema.sql and ADDENDUM_V1.sql\
-- ============================================================\
\
-- Step 1: Drop the existing unique constraint on brand_offsets\
-- (constraint name may vary \'97 check Supabase dashboard if this errors)\
ALTER TABLE brand_offsets\
  DROP CONSTRAINT IF EXISTS brand_offsets_brand_name_category_key;\
\
-- Step 2: Add gender column\
ALTER TABLE brand_offsets\
  ADD COLUMN gender text CHECK (gender IN ('mens', 'womens', 'unisex'));\
\
-- Step 3: Add fit_tag column\
-- Describes the WHY behind the offset for use in verdict card messaging\
ALTER TABLE brand_offsets\
  ADD COLUMN fit_tag text CHECK (fit_tag IN (\
    'euro_slim',        -- Measures smaller/narrower than label (Zara, Mango, H&M)\
    'vanity_high',      -- Measures much larger than label (Gap, Old Navy, Madewell)\
    'true_spec',        -- Measures close to industry standard (Theory, Bonobos)\
    'rigid_bias',       -- No stretch \'97 feels smaller due to fabric (Levi's, APC)\
    'oversize_design'   -- Intentionally baggy by design (Fear of God)\
  ));\
\
-- Step 4: Add tier column for reference\
ALTER TABLE brand_offsets\
  ADD COLUMN tier text CHECK (tier IN ('A', 'B', 'C'));\
\
-- Step 5: Add new composite unique constraint\
-- Prevents duplicate rows for same brand + category + gender combination\
ALTER TABLE brand_offsets\
  ADD CONSTRAINT brand_offsets_brand_category_gender_key\
  UNIQUE (brand_name, category, gender);\
\
-- Step 6: Add gender to user_anchors\
ALTER TABLE user_anchors\
  ADD COLUMN gender text CHECK (gender IN ('mens', 'womens', 'unisex'));\
\
-- Step 7: Add gender to product_audits (target product snapshot)\
ALTER TABLE product_audits\
  ADD COLUMN target_gender text CHECK (target_gender IN ('mens', 'womens', 'unisex'));\
\
-- ============================================================\
-- LOOKUP QUERY PATTERN (for reference \'97 implement in TS engine)\
-- Use LOWER() for case-insensitive brand name matching.\
-- Always try specific category first, fall back to 'All'.\
--\
-- Step 1 \'97 specific category:\
-- SELECT * FROM brand_offsets\
--   WHERE LOWER(brand_name) = LOWER(:brand)\
--   AND LOWER(category) = LOWER(:category)\
--   AND gender = :gender\
--   LIMIT 1;\
--\
-- Step 2 \'97 fallback to 'All' if Step 1 returns null:\
-- SELECT * FROM brand_offsets\
--   WHERE LOWER(brand_name) = LOWER(:brand)\
--   AND LOWER(category) = 'all'\
--   AND gender = :gender\
--   LIMIT 1;\
-- ============================================================}