-- Adiciona colunas de fonte na tabela site_config
-- Execute no Supabase Dashboard > SQL Editor (projeto grhljhackmnbbglnbkks)

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS body_font TEXT DEFAULT 'Roboto';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS name_font TEXT DEFAULT 'Dancing Script';

-- Preenche os valores nas linhas existentes que ainda estão NULL
UPDATE site_config SET body_font = 'Roboto' WHERE body_font IS NULL;
UPDATE site_config SET name_font = 'Dancing Script' WHERE name_font IS NULL;
