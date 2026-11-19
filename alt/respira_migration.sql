-- =============================================================
-- RESPIRA, PRETA — Migração do banco de dados
-- Execute no SQL Editor do Supabase (projeto grhljhackmnbbglnbkks)
-- =============================================================

-- Tabela principal de eventos
CREATE TABLE IF NOT EXISTS public.respira_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL DEFAULT 'Respira, Preta',
  subtitle        text,
  edition         text,
  date            date,
  start_time      time,
  end_time        time,
  location_name   text,
  location_instagram text,
  location_address   text,
  description     text,
  includes        jsonb       NOT NULL DEFAULT '[]'::jsonb,
  schedule        jsonb       NOT NULL DEFAULT '[]'::jsonb,
  collaborators   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  spotify_link    text,
  image_url       text,
  gallery_urls    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  is_published    boolean     NOT NULL DEFAULT false,
  max_spots       integer,
  registration_link text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.respira_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published respira events"
  ON public.respira_events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin full access respira events"
  ON public.respira_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER respira_events_updated_at
  BEFORE UPDATE ON public.respira_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================
-- Primeiro evento — 1ª Edição (29/11/2025)
-- =============================================================
INSERT INTO public.respira_events (
  title, subtitle, edition, date, start_time, end_time,
  location_name, location_instagram,
  description, includes, schedule, collaborators,
  spotify_link, is_published
) VALUES (
  'Respira, Preta',
  'Encontro de Yoga, Afeto e Descanso',
  '1ª Edição',
  '2025-11-29',
  '08:30', '12:30',
  'Ambâr', 'ambar.bsb',
  E'Um encontro de autocuidado, afeto e reconexão.\n\nO Respira, Preta nasce com o foco e a centralidade no cuidado, na escuta e no fortalecimento de mulheres negras, com curadoria, práticas e brindes pensados especificamente para a nossa vivência. Mulheres brancas aliadas são bem-vindas para somar com respeito, escuta ativa e apoio às expositoras, honrando o protagonismo negro deste espaço.',
  '["Prática de yoga guiada","Kit surpresa exclusivo","Café da manhã coletivo","Escrita terapêutica e meditação","Tapetinho de yoga incluso","Pacote de fotos e filmagens do evento"]'::jsonb,
  '[{"time":"08:30","title":"Recepção e Chegada","description":"Momento de acolhimento inicial, check-in e acomodação no espaço — tapetinhos de yoga disponíveis para todas."},{"time":"09:00","title":"Prática de Yoga","description":"Vivência guiada e acessível para desacelerar, soltar as tensões, habitar o corpo com gentileza e ativar a respiração como ferramenta de presença e descanso."},{"time":"09:50","title":"Entrega dos Kits Surpresa","description":"Momento de mimo e celebração — cada participante recebe seu presente exclusivo, preparado com carinho e produtos pensados para o autocuidado da mulher negra."},{"time":"10:10","title":"Escrita Terapêutica e Meditação","description":"Mergulho interno guiado para organizar sentimentos, registrar intenções e reconectar com a própria história em um ambiente seguro de escuta e afeto."},{"time":"10:50","title":"Café da Manhã Coletivo","description":"Pausa para nutrir o corpo, conversar e fortalecer vínculos com trocas genuínas."},{"time":"11:30","title":"Feira de Empreendedoras Negras","description":"Espaço dedicado a conhecer, prestigiar e fortalecer marcas, talentos e o empreendedorismo de mulheres negras locais."}]'::jsonb,
  '[{"name":"yoga.corpomemoria","instagram":"yoga.corpomemoria","role":"Instrutora de Yoga"},{"name":"baeafroclub","instagram":"baeafroclub","role":"Colaboração"}]'::jsonb,
  'https://open.spotify.com/playlist/6ve5foIvvBICtUtL1vkXGQ?si=hUl2YVxTT9ez66ZXKd5Vcw',
  true
);
