import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Heart, Feather } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { dbGet } from '@/lib/dbClient';

const PILLAR_ICONS = [Wind, Heart, Feather];

const DEFAULT_DATA = {
  hero_tagline: 'Um espaço sagrado para respirar, sentir e cuidar de si.',
  project_title: 'O que é o Respira, Preta?',
  project_text: 'Um encontro de yoga, afeto e descanso criado especialmente para mulheres negras. Um espaço onde cada respiração é um ato de cuidado, resistência e reconexão com a própria essência.',
  pillar1_title: 'Respiração',
  pillar1_text: 'Técnicas de pranayama adaptadas para reconectar com o próprio corpo e acalmar a mente.',
  pillar2_title: 'Afeto',
  pillar2_text: 'Um espaço seguro construído com cuidado, escuta ativa e acolhimento mútuo.',
  pillar3_title: 'Descanso',
  pillar3_text: 'Encontros criados para que você simplesmente seja — sem pressa, sem cobranças.',
  cta_title: 'Pronta para respirar?',
  cta_text: 'Confira os próximos encontros e reserve o seu espaço.',
  cta_button_text: 'Ver Eventos',
};

export default function RespiraHomePage({ previewData }) {
  const [data, setData] = useState(previewData || DEFAULT_DATA);

  useEffect(() => {
    if (previewData) {
      setData({ ...DEFAULT_DATA, ...previewData });
      return;
    }
    dbGet('respira_home_content')
      .then(rows => {
        if (rows?.[0]) setData({ ...DEFAULT_DATA, ...rows[0] });
      })
      .catch(() => {});
  }, [previewData]);

  const d = data;
  const pillars = [
    { icon: PILLAR_ICONS[0], title: d.pillar1_title, text: d.pillar1_text },
    { icon: PILLAR_ICONS[1], title: d.pillar2_title, text: d.pillar2_text },
    { icon: PILLAR_ICONS[2], title: d.pillar3_title, text: d.pillar3_text },
  ];

  return (
    <div>
      <Helmet>
        <title>Respira, Preta — Yoga, afeto e descanso para mulheres negras</title>
        <meta name="description" content="Um espaço sagrado de yoga, respiração e autocuidado pensado para o cuidado de mulheres negras. Acolhimento, afeto e descanso." />
        <meta property="og:title" content="Respira, Preta" />
        <meta property="og:description" content="Um espaço sagrado de yoga, respiração e autocuidado pensado para o cuidado de mulheres negras." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jrdancing.com.br/respira-preta" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://jrdancing.com.br/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Respira, Preta" />
        <meta name="twitter:description" content="Um espaço sagrado de yoga, respiração e autocuidado pensado para o cuidado de mulheres negras." />
        <meta name="twitter:image" content="https://jrdancing.com.br/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" />
      </Helmet>

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ backgroundColor: '#3D1F14' }}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'url(/respira-preta/grafismos/RP_grafismo2_ondas_respiracao.png)',
            backgroundSize: '500px',
            backgroundRepeat: 'repeat',
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <img
            src="/respira-preta/logos/RP_logo1_vertical_claro.png"
            alt="Respira, Preta"
            className="h-52 md:h-64 w-auto"
            fetchpriority="high"
          />
          <p className="text-[#DEB896] text-lg md:text-xl font-light tracking-wide leading-relaxed whitespace-pre-line">
            {d.hero_tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/respira-preta/eventos"
              className="px-8 py-3 bg-[#C4634A] hover:bg-[#B05438] text-white rounded-full text-sm font-medium tracking-wide transition-colors"
            >
              Ver Próximos Eventos
            </Link>
            <Link
              to="/respira-preta/sobre"
              className="px-8 py-3 border border-[#DEB896]/40 hover:border-[#DEB896] text-[#DEB896] rounded-full text-sm font-medium tracking-wide transition-colors"
            >
              Sobre o Projeto
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-2 text-[#DEB896]/30 text-xs tracking-widest uppercase"
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <span>scroll</span>
          <div className="w-px h-8 bg-[#DEB896]/20" />
        </motion.div>
      </section>

      {/* ── O que é ── */}
      <section className="py-24 px-6 bg-[#4A2318]">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#C4634A] text-xs tracking-widest uppercase font-medium">
            O projeto
          </span>
          <h2 className="display-font text-4xl md:text-5xl italic text-[#E8B89A] mt-3 mb-6">
            {d.project_title}
          </h2>
          <p className="text-[#DEB896]/75 text-lg leading-relaxed whitespace-pre-line">
            {d.project_text}
          </p>
          <Link
            to="/respira-preta/sobre"
            className="inline-block mt-8 text-[#E8B89A] hover:text-[#F5EDE4] text-sm tracking-widest uppercase transition-colors"
          >
            Conhecer mais →
          </Link>
        </motion.div>
      </section>

      {/* ── Pilares ── */}
      <section className="py-20 px-6 bg-[#3D1F14]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-[#5C2D1E] bg-[#4A2318]/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="w-12 h-12 rounded-full bg-[#C4634A]/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#C4634A]" />
              </div>
              <h3 className="display-font text-2xl italic text-[#E8B89A]">{title}</h3>
              <p className="text-[#DEB896]/65 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative py-28 px-6 text-center overflow-hidden"
        style={{ backgroundColor: '#5C2D1E' }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/respira-preta/grafismos/RP_grafismo4_sankofa_sutil.png)',
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
          }}
        />
        <motion.div
          className="relative z-10 max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/respira-preta/svg/RP_simbolo_lotus3_claro.svg"
            alt=""
            className="h-16 w-auto mx-auto mb-6 opacity-50"
          />
          <h2 className="display-font text-4xl md:text-5xl italic text-[#F5EDE4] mb-4">
            {d.cta_title}
          </h2>
          <p className="text-[#DEB896]/65 mb-8 leading-relaxed">
            {d.cta_text}
          </p>
          <Link
            to="/respira-preta/eventos"
            className="inline-block px-10 py-4 bg-[#E8B89A] hover:bg-[#F5EDE4] text-[#3D1F14] rounded-full font-medium text-sm tracking-wide transition-colors"
          >
            {d.cta_button_text}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
