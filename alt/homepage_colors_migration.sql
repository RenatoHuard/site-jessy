-- Migration: adiciona campos de cor de fundo para cada seção da homepage
-- Execute no Supabase Dashboard > SQL Editor (projeto grhljhackmnbbglnbkks)

ALTER TABLE homepage_content ADD COLUMN IF NOT EXISTS hero_bg_color TEXT;
ALTER TABLE homepage_content ADD COLUMN IF NOT EXISTS presentation_bg_color TEXT;
ALTER TABLE homepage_content ADD COLUMN IF NOT EXISTS services_bg_color TEXT;
ALTER TABLE homepage_content ADD COLUMN IF NOT EXISTS cta_bg_color TEXT;
ALTER TABLE homepage_content ADD COLUMN IF NOT EXISTS community_bg_color TEXT;
