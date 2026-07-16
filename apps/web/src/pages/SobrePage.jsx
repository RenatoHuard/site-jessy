
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Quote, CheckCircle2 } from 'lucide-react';
import { dbGet } from '@/lib/dbClient';

function SobrePage({ previewData }) {
  const [data, setData] = useState(previewData || null);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
    } else {
      const fetchData = async () => {
        try {
          const records = await dbGet('sobre_content');
          if (records.length > 0) setData(records[0]);
        } catch (e) {
          console.error('SobrePage fetch error:', e);
        }
      };
      fetchData();
    }
  }, [previewData]);

  const qualifications = data?.jornada_topicos || [
    "Professora há 10 anos",
    "Licenciatura em Dança",
    "Coordenadora Pedagógica",
    "Pós-graduação em Metodologia",
    "Trabalha com a infância",
    "Ama ler e tem uma biblioteca em casa",
    "Em constante estudo",
    "Estudante de Yoga"
  ];

  const heroTitle = data?.hero_title || 'Uma jornada de paixão, arte e transformação';
  const fraseText = data?.frase_text || 'A dança nos proporciona dialogar com o mundo';
  const fraseAttribution = data?.frase_attribution || 'JÉSSICA RAYANE';
  const jornadaText = data?.jornada_text || 'Desde criança, a dança sempre foi minha forma de expressão...';
  const conhecimentoTitle = data?.conhecimento_title || 'Minha Trajetória';
  const conhecimentoDesc = data?.conhecimento_description || 'Professora há 10 anos, com licenciatura em Dança e pós-graduação em Metodologia.';

  const getImgUrl = (field, defaultUrl) => {
    if (!data || !data[field]) return defaultUrl;
    if (data[`${field}_url`]) return data[`${field}_url`]; // From preview
    if (data[field] instanceof File) return URL.createObjectURL(data[field]);
    if (typeof data[field] === 'string') return data[field];
    return defaultUrl;
  };

  const heroImg = getImgUrl('hero_image', null);
  const heroOverlayOpacity = data?.hero_overlay_opacity ?? 70;
  const fraseImg = getImgUrl('frase_image', null);
  const jornadaImg = getImgUrl('jornada_image', null);
  const conhImg1 = getImgUrl('conhecimento_image1', null);
  const conhImg2 = getImgUrl('conhecimento_image2', null);
  const conhImg3 = getImgUrl('conhecimento_image3', null);

  const heroParallax = data?.hero_parallax ? 'fixed' : '';
  const fraseParallax = data?.frase_parallax ? 'fixed' : '';
  const jornadaParallax = data?.jornada_parallax ? 'fixed' : '';
  const conhParallax1 = data?.conhecimento_parallax1 ? 'fixed' : '';
  const conhParallax2 = data?.conhecimento_parallax2 ? 'fixed' : '';
  const conhParallax3 = data?.conhecimento_parallax3 ? 'fixed' : '';

  return (
    <>
      {!previewData && (
        <Helmet>
          <title>Sobre - Jéssica Rayane</title>
          <meta name="description" content="Conheça a história de Jéssica Rayane, bailarina, educadora e criadora de comunidade." />
        </Helmet>
      )}

      {/* SECTION 1 - HERO/INTRO */}
      <section className="relative min-h-[70dvh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Hero Background" 
            className={`w-full h-full object-cover object-top ${heroParallax}`}
            style={{ opacity: (100 - heroOverlayOpacity) / 100 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" style={{ opacity: heroOverlayOpacity / 100 }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="display-font text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground leading-tight mb-6"
              style={{ textWrap: 'balance' }}
              dangerouslySetInnerHTML={{ __html: heroTitle.replace('\n', '<br/>') }}
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 - QUOTE (Frase em Destaque) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={fraseImg} 
            alt="Quote Background" 
            className={`w-full h-full object-cover object-top ${fraseParallax}`}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Quote className="h-12 w-12 mx-auto mb-8 text-accent opacity-90" />
            <h2 className="display-font text-3xl md:text-5xl lg:text-6xl font-medium italic leading-tight mb-8" style={{ textWrap: 'balance' }}>
              "{fraseText}"
            </h2>
            {fraseAttribution && (
              <p className="text-xl text-white/80 font-medium tracking-wide uppercase">
                — {fraseAttribution}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - JORNADA */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
                <img 
                  src={jornadaImg} 
                  alt="Jornada" 
                  className={`w-full h-full object-cover object-top ${jornadaParallax}`}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="heading-font text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
                Minha Jornada
              </h2>
              <div className="prose prose-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {jornadaText}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - CONHECIMENTO */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-8"
            >
              <h2 className="heading-font text-3xl md:text-4xl font-bold text-foreground" style={{ textWrap: 'balance' }}>
                {conhecimentoTitle}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {conhecimentoDesc}
              </p>

              <div className="pt-6 border-t border-border/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {qualifications.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-base text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="col-span-2 md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden shadow-lg aspect-[3/4] md:aspect-auto relative">
                  <img 
                    src={conhImg1} 
                    alt="Conhecimento 1" 
                    className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ${conhParallax1}`}
                  />
                </div>
                <div className="col-span-1 rounded-2xl overflow-hidden shadow-lg aspect-square relative">
                  <img 
                    src={conhImg2} 
                    alt="Conhecimento 2" 
                    className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ${conhParallax2}`}
                  />
                </div>
                <div className="col-span-1 rounded-2xl overflow-hidden shadow-lg aspect-square relative">
                  <img 
                    src={conhImg3} 
                    alt="Conhecimento 3" 
                    className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ${conhParallax3}`}
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}

export default SobrePage;
