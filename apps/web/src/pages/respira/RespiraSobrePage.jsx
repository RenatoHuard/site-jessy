import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbGet } from '@/lib/dbClient';

const SECTION_SVGS = [
  '/respira-preta/svg/RP_sankofa_pulmao_claro.svg',
  '/respira-preta/svg/RP_simbolo_lotus3_claro.svg',
  '/respira-preta/svg/RP_simbolo_lotus4_claro.svg',
];

const DEFAULT_DATA = {
  hero_title: 'Sobre o Respira, Preta',
  hero_subtitle: 'Nascido do desejo de criar um espaço genuinamente acolhedor para mulheres negras praticarem yoga e cuidarem de si.',
  section1_title: 'A origem',
  section1_text: 'O Respira, Preta nasce da intersecção entre a prática do yoga e o cuidado com a ancestralidade. Criado por Jéssica Rayane, o projeto oferece encontros onde o corpo negro é celebrado, acolhido e convidado a descansar — sem pressa, sem julgamentos.',
  section2_title: 'O espaço',
  section2_text: 'Cada encontro é pensado com cuidado: a música, o silêncio, as palavras e os movimentos são escolhidos para criar uma experiência completa de autocuidado. Um espaço onde você pode simplesmente ser.',
  section3_title: 'Para quem é',
  section3_text: 'Para mulheres negras que buscam um espaço genuinamente acolhedor para praticar yoga, descansar e se conectar com outras mulheres em um ambiente seguro, respeitoso e cheio de afeto.',
  quote: '"Respira, Preta" é mais que um evento. É um convite.',
};

export default function RespiraSobrePage({ previewData }) {
  const [data, setData] = useState(previewData || DEFAULT_DATA);

  useEffect(() => {
    if (previewData) {
      setData({ ...DEFAULT_DATA, ...previewData });
      return;
    }
    dbGet('respira_sobre_content')
      .then(rows => {
        if (rows?.[0]) setData({ ...DEFAULT_DATA, ...rows[0] });
      })
      .catch(() => {});
  }, [previewData]);

  const d = data;
  const sections = [
    { svg: SECTION_SVGS[0], title: d.section1_title, text: d.section1_text, reverse: false },
    { svg: SECTION_SVGS[1], title: d.section2_title, text: d.section2_text, reverse: true },
    { svg: SECTION_SVGS[2], title: d.section3_title, text: d.section3_text, reverse: false },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-20 px-6 text-center overflow-hidden"
        style={{ backgroundColor: '#3D1F14' }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/respira-preta/grafismos/RP_grafismo1_padrao_simbolo.png)',
            backgroundSize: '250px',
            backgroundRepeat: 'repeat',
          }}
        />
        <motion.div
          className="relative z-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#C4634A] text-xs tracking-widest uppercase font-medium">
            O projeto
          </span>
          <h1 className="display-font text-5xl md:text-6xl italic text-[#E8B89A] mt-3 mb-6">
            {d.hero_title}
          </h1>
          <p className="text-[#DEB896]/70 text-lg leading-relaxed whitespace-pre-line">
            {d.hero_subtitle}
          </p>
        </motion.div>
      </section>

      {/* ── Sections ── */}
      <section className="py-20 px-6 bg-[#4A2318]">
        <div className="max-w-3xl mx-auto space-y-20">
          {sections.map(({ svg, title, text, reverse }, i) => (
            <motion.div
              key={i}
              className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}
              initial={{ opacity: 0, x: reverse ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#5C2D1E] border border-[#C4634A]/25 flex items-center justify-center">
                  <img src={svg} alt="" className="w-12 h-12 opacity-70" />
                </div>
              </div>
              <div>
                <h2 className="display-font text-3xl italic text-[#E8B89A] mb-4">{title}</h2>
                <p className="text-[#DEB896]/70 leading-relaxed whitespace-pre-line">{text}</p>
              </div>
            </motion.div>
          ))}

          {/* Selo final */}
          <motion.div
            className="text-center pt-10 border-t border-[#5C2D1E]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/respira-preta/logos/RP_logo4_selo_claro.png"
              alt="Respira, Preta"
              className="h-24 w-auto mx-auto opacity-50 mb-6"
            />
            <p className="text-[#DEB896]/40 text-sm italic">{d.quote}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
