-- Migration: bucket de Storage para imagens de eventos Respira, Preta
-- Execute no Supabase Dashboard > SQL Editor (projeto grhljhackmnbbglnbkks)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'respira-events',
  'respira-events',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública
DROP POLICY IF EXISTS "Public read respira-events" ON storage.objects;
CREATE POLICY "Public read respira-events"
ON storage.objects FOR SELECT
USING (bucket_id = 'respira-events');

-- Upload autenticado (qualquer usuário logado)
DROP POLICY IF EXISTS "Auth upload respira-events" ON storage.objects;
CREATE POLICY "Auth upload respira-events"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'respira-events' AND auth.role() = 'authenticated');

-- Deleção autenticada
DROP POLICY IF EXISTS "Auth delete respira-events" ON storage.objects;
CREATE POLICY "Auth delete respira-events"
ON storage.objects FOR DELETE
USING (bucket_id = 'respira-events' AND auth.role() = 'authenticated');
