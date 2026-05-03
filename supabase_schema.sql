{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 -- ============================================================\
-- THE SPEC-TWIN FIT AUDITOR\
-- Supabase Schema \'97 Full Rebuild\
-- ============================================================\
-- Run this in Supabase SQL Editor.\
-- Drop existing tables first if rebuilding from scratch:\
-- DROP TABLE IF EXISTS product_audits, brand_offsets, user_anchors CASCADE;\
-- ============================================================\
\
\
-- ============================================================\
-- TABLE 1: user_anchors\
-- The technical DNA of garments the user already owns and trusts.\
-- ============================================================\
\
create table user_anchors (\
  id                uuid        default gen_random_uuid() primary key,\
  user_id           uuid        references auth.users(id) on delete cascade,\
\
  -- Identity\
  brand_name        text        not null,\
  model_name        text,\
  brand_model       text        not null,  -- combined display string, e.g. "Levi's 511 Slim"\
  category          text        not null,  -- e.g. 'denim', 'trouser', 'knitwear'\
\
  -- Size Contract\
  size              text        not null,  -- original labeled size entered by user\
  contract_type     text        check (contract_type in ('precision', 'range')),\
  size_range_low    numeric,\
  size_range_high   numeric,\
\
  -- Fabric Performance\
  fiber_content     text,                  -- raw label string, e.g. "98% Cotton / 2% Elastane"\
  elastane_pct      numeric     default 0, -- normalized stretch fiber %, includes spandex/lycra/etc.\
  poly_pct          numeric     default null, -- null = absent from product data \uc0\u8594  recovery_class = 'unknown'; 0 = confirmed 0%\
  fabric_class      text        check (fabric_class in ('rigid', 'comfort_stretch', 'high_stretch')),\
  recovery_class    text        check (recovery_class in ('low', 'moderate', 'high', 'unknown')),\
\
  -- Hardware\
  closure_type      text        check (closure_type in ('zipper', 'button_fly', 'elastic', 'drawstring', 'none')),\
\
  -- User Input\
  user_notes        text,\
  parser_confidence numeric,              -- confidence score from the Anthropic API parser (0\'961); stored for audit/traceability\
  created_at        timestamptz default now()\
);\
\
\
-- ============================================================\
-- TABLE 2: brand_offsets\
-- Expert baseline fit offsets by brand + category,\
-- adjusted over time by aggregate user feedback (drift).\
-- ============================================================\
\
create table brand_offsets (\
  id                    uuid        default gen_random_uuid() primary key,\
\
  -- Identity (unique triplet enforces one record per brand/category/gender)\
  brand_name            text        not null,\
  category              text        not null,\
  -- Note: gender added via ADDENDUM_V2; unique constraint updated there to (brand_name, category, gender)\
\
  -- Offset Intelligence\
  weighted_offset       numeric     default 0,  -- expert baseline on normalized size scale\
  drift_adjustment      numeric     default 0,  -- crowdsourced correction; capped at +/- 0.5\
  -- effective_offset is computed at query time: weighted_offset + drift_adjustment\
\
  -- Brand Defaults (used when anchor data is incomplete)\
  default_fabric_class  text        check (default_fabric_class in ('rigid', 'comfort_stretch', 'high_stretch')),\
  default_contract_type text        check (default_contract_type in ('precision', 'range')),\
\
  -- Drift Signal Strength\
  sample_size           integer     default 0,  -- feedback event count contributing to drift; min 10 to activate drift\
  last_validated        timestamptz,            -- timestamp of most recent feedback used in drift calc\
\
  created_at            timestamptz default now(),\
  updated_at            timestamptz default now()\
);\
\
\
-- ============================================================\
-- TABLE 3: product_audits\
-- Full snapshot of every recommendation event.\
-- Captures input, math chain, output, gates, and feedback.\
-- ============================================================\
\
create table product_audits (\
  id                      uuid        default gen_random_uuid() primary key,\
\
  -- Relationships\
  user_id                 uuid        references auth.users(id) on delete cascade,\
  reference_anchor_id     uuid        references user_anchors(id) on delete set null,  -- the specific anchor used for this recommendation\
  brand_offset_id         uuid        references brand_offsets(id) on delete set null,\
\
  -- Target Product Identity\
  target_brand            text        not null,\
  target_model            text,\
  target_category         text        not null,\
  target_url              text,\
\
  -- Target Product DNA (parser output snapshot)\
  target_size_original    text,\
  target_contract_type    text        check (target_contract_type in ('precision', 'range')),\
  target_size_range_low   numeric,\
  target_size_range_high  numeric,\
  target_fiber_content    text,        -- raw string preserved for auditability\
  target_elastane_pct     numeric     default 0,\
  target_poly_pct         numeric     default null, -- null = absent from product data \uc0\u8594  recovery_class = 'unknown'; 0 = confirmed 0%\
  target_fabric_class     text        check (target_fabric_class in ('rigid', 'comfort_stretch', 'high_stretch')),\
  target_recovery_class   text        check (target_recovery_class in ('low', 'moderate', 'high', 'unknown')),\
  target_closure_type     text        check (target_closure_type in ('zipper', 'button_fly', 'elastic', 'drawstring', 'none')),\
\
  -- Math Chain (audit trail of how the recommendation was calculated)\
  brand_offset_used       numeric     default 0,  -- weighted_offset snapshot at time of recommendation\
  drift_adjustment_used   numeric     default 0,  -- drift_adjustment snapshot at time of recommendation\
  effective_offset        numeric     default 0,  -- weighted_offset + drift_adjustment\
  fit_delta               numeric,                -- target_effective_offset - anchor_effective_offset\
  size_adjustment         integer,                -- -2, -1, 0, +1, +2\
\
  -- Recommendation Output\
  output_state            text        check (output_state in ('verified_fit', 'fit_advisory', 'smart_estimate')),\
  recommended_size        text,                   -- primary size shown to user\
  suggested_size          text,                   -- cautious fallback for NO_DIRECT_MATCH\
  adjacent_size_down      text,                   -- smaller adjacent size for fit-preference guidance\
  adjacent_size_up        text,                   -- larger adjacent size for fit-preference guidance\
\
  -- Confidence\
  confidence_score        numeric     check (confidence_score >= 0 and confidence_score <= 1),  -- internal math\
  confidence_level        text        check (confidence_level in ('HIGH', 'MEDIUM', 'LOW')),     -- UI output\
\
  -- User-Facing Messaging\
  message_type            text,                   -- template identifier for rendering verdict card\
  reason_summary          text,                   -- short plain-language fit/feel explanation\
  guidance                text,                   -- fit-preference guidance shown with recommendation\
  warning_summary         text,                   -- user-facing caution when a meaningful limitation applies\
  recommendation_summary  text,                   -- full verdict card summary text\
\
  -- Warning Flags\
  fabric_gate             boolean     default false,\
  fabric_gate_reason      text,                   -- reason_code from gate reason templates\
  contract_gate           boolean     default false,\
  contract_gate_reason    text,\
\
  -- Warning Flags\
  recovery_warning        boolean     default false,\
  recovery_note           text,\
  hardware_warning        boolean     default false,\
  hardware_note           text,\
  aging_warning           boolean     default false,\
  aging_note              text,\
  rise_mismatch_warning   boolean     default false,\
  rise_mismatch_note      text,\
\
  -- Post-Purchase Feedback Loop\
  user_purchased          boolean     default false,\
  user_fit_rating         integer     check (user_fit_rating >= 1 and user_fit_rating <= 5),\
  user_kept               boolean,\
  user_return_reason      text,\
  user_feedback_notes     text,\
  feedback_outcome        text        check (feedback_outcome in ('too_small', 'too_big', 'worked_as_expected')),\
  user_feedback_date      timestamptz,\
\
  -- Engine Versioning\
  engine_version          text,                   -- version of recommendation logic used at time of audit\
\
  created_at              timestamptz default now(),\
  updated_at              timestamptz default now()\
);}