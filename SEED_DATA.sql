{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 -- ============================================================\
-- SPEC-TWIN FIT AUDITOR \'97 BRAND OFFSET SEED DATA\
-- Source: Calibrating_Brand_Sizing_Offsets_Quickly.xlsx\
-- Master Seed Table + Gender Brand Data Blocks\
-- Run AFTER supabase_schema.sql, ADDENDUM_V1.sql, ADDENDUM_V2.sql\
-- ============================================================\
-- weighted_offset scale:\
--   positive = brand runs small \uc0\u8594  user sizes up\
--   negative = brand runs large (vanity) \uc0\u8594  user sizes down\
--   0 = true to spec (Tier C baseline)\
-- ============================================================\
\
INSERT INTO brand_offsets (brand_name, category, gender, tier, weighted_offset, fit_tag, sample_size, drift_adjustment, notes) VALUES\
\
-- ============================================================\
-- WOMENS BASELINE\
-- ============================================================\
('J Brand',       'Denim',       'womens', 'C',  0.0,  'true_spec',       0, 0, 'Womens baseline anchor \'97 true to boutique spec'),\
('Theory',        'All',         'womens', 'C',  0.0,  'true_spec',       0, 0, 'Contemporary womens spec'),\
('Theory',        'Trouser',     'womens', 'C',  0.0,  'true_spec',       0, 0, 'True to boutique spec'),\
('Everlane',      'Denim',       'womens', 'C',  0.0,  'true_spec',       0, 0, 'Demo scenario 1 target \'97 true to spec baseline'),\
\
-- ============================================================\
-- MENS BASELINE\
-- ============================================================\
('Bonobos',       'Trouser',     'mens',   'C',  0.0,  'true_spec',       0, 0, 'Mens baseline anchor'),\
('Theory',        'All',         'mens',   'C',  0.0,  'true_spec',       0, 0, 'Modern slim \'97 true to contemporary spec'),\
\
-- ============================================================\
-- TIER A \'97 EURO SLIM / RUNS SMALL (size up)\
-- ============================================================\
\
-- Zara\
('Zara',          'All',         'womens', 'A',  1.5,  'euro_slim',       0, 0, 'European narrow block \'97 default womens'),\
('Zara',          'Denim',       'womens', 'A',  1.5,  'euro_slim',       0, 0, 'Very narrow hips and thighs'),\
('Zara',          'Outerwear',   'womens', 'A',  2.0,  'euro_slim',       0, 0, 'Narrow shoulders \'97 usually requires 1.5\'962 sizes up'),\
('Zara',          'All',         'mens',   'A',  1.0,  'euro_slim',       0, 0, 'Slim European cut \'97 default mens'),\
('Zara',          'Outerwear',   'mens',   'A',  1.5,  'euro_slim',       0, 0, 'Narrow shoulders for structured outerwear'),\
\
-- Mango\
('Mango',         'All',         'womens', 'A',  1.2,  'euro_slim',       0, 0, 'Slim European cut'),\
\
-- H&M\
('H&M',           'All',         'womens', 'A',  1.0,  'euro_slim',       0, 0, 'Junior-leaning / slim grading'),\
('H&M',           'All',         'mens',   'A',  1.0,  'euro_slim',       0, 0, 'Fast fashion slim'),\
\
-- APC\
('APC',           'Denim',       'mens',   'A',  1.5,  'rigid_bias',      0, 0, 'Rigid/raw denim \'97 size up 1 to 2'),\
\
-- Scotch & Soda\
('Scotch & Soda', 'All',         'mens',   'A',  0.7,  'euro_slim',       0, 0, 'Slim Amsterdam tailoring'),\
\
-- Aritzia\
('Aritzia',       'All',         'womens', 'A',  1.0,  'euro_slim',       0, 0, 'Slim Canadian block \'97 Wilfred/Babaton'),\
('Aritzia',       'Outerwear',   'womens', 'B', -0.5,  'oversize_design', 0, 0, 'Super Puff is intentionally oversized'),\
\
-- Reformation\
('Reformation',   'All',         'womens', 'A',  1.2,  'euro_slim',       0, 0, 'High waist / narrow ribcage bias'),\
\
-- Club Monaco\
('Club Monaco',   'All',         'womens', 'C',  0.5,  'euro_slim',       0, 0, 'Slimmer than J.Crew \'97 boutique fit'),\
('Club Monaco',   'All',         'mens',   'C',  0.5,  'euro_slim',       0, 0, 'Slim boutique fit'),\
\
-- Arc'teryx\
('Arc''teryx',    'Outerwear',   'unisex', 'C',  0.5,  'true_spec',       0, 0, 'Technical trim fit for layering'),\
('Arc''teryx',    'Tops',        'mens',   'B', -0.5,  'vanity_high',     0, 0, 'Lifestyle tees run American relaxed'),\
\
-- ============================================================\
-- TIER B \'97 VANITY SIZING / RUNS LARGE (size down)\
-- ============================================================\
\
-- Gap\
('Gap',           'All',         'womens', 'B', -1.5,  'vanity_high',     0, 0, 'High vanity sizing \'97 default womens'),\
('Gap',           'All',         'mens',   'B', -1.0,  'vanity_high',     0, 0, 'Boxy American cut \'97 default mens'),\
('Gap',           'Denim',       'mens',   'B', -1.5,  'vanity_high',     0, 0, 'High vanity sizing in the waist'),\
\
-- Old Navy\
('Old Navy',      'All',         'womens', 'B', -2.0,  'vanity_high',     0, 0, 'Maximum vanity ease'),\
\
-- Madewell\
('Madewell',      'Denim',       'womens', 'B', -1.5,  'vanity_high',     0, 0, 'Aggressive vanity waist sizing'),\
('Madewell',      'Denim',       'mens',   'B', -0.5,  'vanity_high',     0, 0, 'Closer to true spec than womens line'),\
('Madewell',      'All',         'mens',   'B', -0.5,  'vanity_high',     0, 0, 'Less vanity than womens \'97 default mens'),\
\
-- Ralph Lauren\
('Ralph Lauren',  'Tops',        'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Traditional ease'),\
('Ralph Lauren',  'Tops',        'mens',   'B', -1.0,  'vanity_high',     0, 0, 'Classic Fit is very roomy'),\
\
-- Brooks Brothers\
('Brooks Brothers','Tops',       'mens',   'B', -1.5,  'vanity_high',     0, 0, 'Traditional full cut'),\
\
-- J.Crew\
('J.Crew',        'All',         'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Moderate vanity sizing'),\
\
-- Anthropologie\
('Anthropologie', 'All',         'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Boho / ease-heavy grading'),\
\
-- Uniqlo\
('Uniqlo',        'All',         'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Japanese/US hybrid \'97 modern relaxed'),\
\
-- Faherty\
('Faherty',       'All',         'mens',   'B', -0.5,  'vanity_high',     0, 0, 'Relaxed beach fit'),\
\
-- Michael Kors\
('Michael Kors',  'All',         'womens', 'B', -0.8,  'vanity_high',     0, 0, 'Designer vanity ease'),\
\
-- Blank NYC\
('Blank NYC',     'Denim',       'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Edgy/slim but has stretch \'97 moderate vanity'),\
\
-- Athleta\
('Athleta',       'Performance', 'womens', 'B', -1.0,  'vanity_high',     0, 0, 'Generous Power fit'),\
\
-- Vuori\
('Vuori',         'Performance', 'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Relaxed active fit'),\
('Vuori',         'Performance', 'mens',   'B', -0.5,  'vanity_high',     0, 0, 'Relaxed active fit'),\
\
-- Fear of God\
('Fear of God',   'All',         'unisex', 'B', -2.0,  'oversize_design', 0, 0, 'Intentional extreme oversize by design'),\
\
-- ============================================================\
-- TIER C \'97 TRUE TO SPEC (baseline or minor adjustment)\
-- ============================================================\
\
-- Levi's\
('Levi''s',       'Denim',       'womens', 'C',  0.5,  'rigid_bias',      0, 0, 'Rigid denim runs small'),\
('Levi''s',       'Denim',       'mens',   'C',  0.2,  'rigid_bias',      0, 0, 'Generally true to spec \'97 slight rigid bias'),\
\
-- Lululemon\
('Lululemon',     'Bottoms',     'womens', 'B', -0.5,  'vanity_high',     0, 0, 'Compression-focused \'97 measures larger'),\
('Lululemon',     'Bottoms',     'mens',   'C',  0.0,  'true_spec',       0, 0, 'Performance spec \'97 true to size'),\
('Lululemon',     'Tops',        'mens',   'C',  0.0,  'true_spec',       0, 0, 'Fits closer to standard athletic spec'),\
\
-- Rag & Bone\
('Rag & Bone',    'Denim',       'mens',   'C',  0.3,  'true_spec',       0, 0, 'Slim contemporary \'97 slight small bias'),\
\
-- Nike\
('Nike',          'Active',      'unisex', 'C',  0.0,  'true_spec',       0, 0, 'Global athletic spec \'97 true baseline');}