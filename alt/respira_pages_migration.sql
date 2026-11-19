-- Migration: tabelas de conteúdo editável para Respira, Preta (Home e Sobre)
-- Execute no Supabase Dashboard > SQL Editor

-- ── respira_home_content ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS respira_home_content (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_tagline    TEXT DEFAULT 'Um espaço sagrado para respirar, sentir e cuidar de si.',
  project_title   TEXT DEFAULT 'O que é o Respira, Preta?',
  project_text    TEXT DEFAULT 'Um encontro de yoga, afeto e descanso criado especialmente para mulheres negras. Um espaço onde cada respiração é um ato de cuidado, resistência e reconexão com a própria essência.',
  pillar1_title   TEXT DEFAULT 'Respiração',
  pillar1_text    TEXT DEFAULT 'Técnicas de pranayama adaptadas para reconectar com o próprio corpo e acalmar a mente.',
  pillar2_title   TEXT DEFAULT 'Afeto',
  pillar2_text    TEXT DEFAULT 'Um espaço seguro construído com cuidado, escuta ativa e acolhimento mútuo.',
  pillar3_title   TEXT DEFAULT 'Descanso',
  pillar3_text    TEXT DEFAULT 'Encontros criados para que você simplesmente seja — sem pressa, sem cobranças.',
  cta_title       TEXT DEFAULT 'Pronta para respirar?',
  cta_text        TEXT DEFAULT 'Confira os próximos encontros e reserve o seu espaço.',
  cta_button_text TEXT DEFAULT 'Ver Eventos',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── respira_sobre_content ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS respira_sobre_content (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title      TEXT DEFAULT 'Sobre o Respira, Preta',
  hero_subtitle   TEXT DEFAULT 'Nascido do desejo de criar um espaço genuinamente acolhedor para mulheres negras praticarem yoga e cuidarem de si.',
  section1_title  TEXT DEFAULT 'A origem',
  section1_text   TEXT DEFAULT 'O Respira, Preta nasce da intersecção entre a prática do yoga e o cuidado com a ancestralidade. Criado por Jéssica Rayane, o projeto oferece encontros onde o corpo negro é celebrado, acolhido e convidado a descansar — sem pressa, sem julgamentos.',
  section2_title  TEXT DEFAULT 'O espaço',
  section2_text   TEXT DEFAULT 'Cada encontro é pensado com cuidado: a música, o silêncio, as palavras e os movimentos são escolhidos para criar uma experiência completa de autocuidado. Um espaço onde você pode simplesmente ser.',
  section3_title  TEXT DEFAULT 'Para quem é',
  section3_text   TEXT DEFAULT 'Para mulheres negras que buscam um espaço genuinamente acolhedor para praticar yoga, descansar e se conectar com outras mulheres em um ambiente seguro, respeitoso e cheio de afeto.',
  quote           TEXT DEFAULT '"Respira, Preta" é mais que um evento. É um convite.',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE respira_home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE respira_sobre_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read respira_home_content"
  ON respira_home_content FOR SELECT USING (true);

CREATE POLICY "Admin write respira_home_content"
  ON respira_home_content FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Public read respira_sobre_content"
  ON respira_sobre_content FOR SELECT USING (true);

CREATE POLICY "Admin write respira_sobre_content"
  ON respira_sobre_content FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- ── Dados iniciais ─────────────────────────────────────────────────────────────
INSERT INTO respira_home_content (
  hero_tagline, project_title, project_text,
  pillar1_title, pillar1_text,
  pillar2_title, pillar2_text,
  pillar3_title, pillar3_text,
  cta_title, cta_text, cta_button_text
) VALUES (
  'Um espaço sagrado para respirar, sentir e cuidar de si.',
  'O que é o Respira, Preta?',
  'Um encontro de yoga, afeto e descanso criado especialmente para mulheres negras. Um espaço onde cada respiração é um ato de cuidado, resistência e reconexão com a própria essência.',
  'Respiração', 'Técnicas de pranayama adaptadas para reconectar com o próprio corpo e acalmar a mente.',
  'Afeto', 'Um espaço seguro construído com cuidado, escuta ativa e acolhimento mútuo.',
  'Descanso', 'Encontros criados para que você simplesmente seja — sem pressa, sem cobranças.',
  'Pronta para respirar?',
  'Confira os próximos encontros e reserve o seu espaço.',
  'Ver Eventos'
);

INSERT INTO respira_sobre_content (
  hero_title, hero_subtitle,
  section1_title, section1_text,
  section2_title, section2_text,
  section3_title, section3_text,
  quote
) VALUES (
  'Sobre o Respira, Preta',
  'Nascido do desejo de criar um espaço genuinamente acolhedor para mulheres negras praticarem yoga e cuidarem de si.',
  'A origem',
  'O Respira, Preta nasce da intersecção entre a prática do yoga e o cuidado com a ancestralidade. Criado por Jéssica Rayane, o projeto oferece encontros onde o corpo negro é celebrado, acolhido e convidado a descansar — sem pressa, sem julgamentos.',
  'O espaço',
  'Cada encontro é pensado com cuidado: a música, o silêncio, as palavras e os movimentos são escolhidos para criar uma experiência completa de autocuidado. Um espaço onde você pode simplesmente ser.',
  'Para quem é',
  'Para mulheres negras que buscam um espaço genuinamente acolhedor para praticar yoga, descansar e se conectar com outras mulheres em um ambiente seguro, respeitoso e cheio de afeto.',
  '"Respira, Preta" é mais que um evento. É um convite.'
);
