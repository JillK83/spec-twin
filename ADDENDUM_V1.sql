{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww28860\viewh15360\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 -- ============================================================\
-- SPEC-TWIN FIT AUDITOR \'97 ADDENDUM V1\
-- Hot-fix migration: adds structure_class and layering_intent\
-- Run in Supabase SQL Editor after initial schema is live.\
-- ============================================================\
\
-- user_anchors: add garment architecture fields\
ALTER TABLE user_anchors\
  ADD COLUMN structure_class  text CHECK (structure_class IN ('structured', 'semi-structured', 'unstructured')),\
  ADD COLUMN layering_intent  text CHECK (layering_intent IN ('light', 'medium', 'heavy'));\
\
-- brand_offsets: add brand-level default structure class\
ALTER TABLE brand_offsets\
  ADD COLUMN structure_class  text CHECK (structure_class IN ('structured', 'semi-structured', 'unstructured'));\
\
-- product_audits: add target structure class and layering intent (parser output snapshot)\
ALTER TABLE product_audits\
  ADD COLUMN target_structure_class  text CHECK (target_structure_class IN ('structured', 'semi-structured', 'unstructured')),\
  ADD COLUMN target_layering_intent  text CHECK (target_layering_intent IN ('light', 'medium', 'heavy')),\
  ADD COLUMN sizing_system_mismatch  boolean DEFAULT false;  -- true when anchor and target use different sizing systems\
  -- e.g. waist_precision anchor vs womens_numeric target triggers -0.2 confidence penalty}