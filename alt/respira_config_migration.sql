-- Migration: configurações independentes do Respira, Preta
-- Execute no Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS respira_config (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number  TEXT DEFAULT '+5561969811976',
  whatsapp_enabled BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE respira_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read respira_config"
  ON respira_config FOR SELECT USING (true);

CREATE POLICY "Admin write respira_config"
  ON respira_config FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Dados iniciais
INSERT INTO respira_config (whatsapp_number, whatsapp_enabled)
VALUES ('+5561969811976', true);
