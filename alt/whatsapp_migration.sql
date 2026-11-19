-- Migration: adiciona suporte ao botão WhatsApp flutuante na tabela site_config
-- Execute no Supabase Dashboard > SQL Editor

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '+5561969811976';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT true;

-- Popula os valores nas linhas existentes
UPDATE site_config
SET
  whatsapp_number = '+5561969811976',
  whatsapp_enabled = true
WHERE whatsapp_number IS NULL;
