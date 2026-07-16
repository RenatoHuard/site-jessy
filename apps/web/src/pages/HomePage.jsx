
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionDivider from '@/components/SectionDivider.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import { dbGet } from '@/lib/dbClient';

function HomePage({ previewData }) {
  const [data, setData] = useState(previewData || null);
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (previewData) {
          setData(previewData);
          const servRec = await dbGet('services_content');
          if (servRec.length > 0) setServicesData(servRec[0]);
        } else {
          const homeRec = await dbGet('homepage_content');
          const servRec = await dbGet('services_content');
          if (homeRec.length > 0) setData(homeRec[0]);
          if (servRec.length > 0) setServicesData(servRec[0]);
        }
      } catch (e) {
        console.error('HomePage fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [previewData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="text-muted-foreground font-medium">Carregando...</div>
        </div>
      </div>
    );
  }

  // Helper to resolve image URLs (handles Files from preview, PB URLs, or Base64)
  const getImgUrl = (field) => {
    if (!data) return '';
    if (data[`${field}_url`]) return data[`${field}_url`];
    const val = data[field];
    if (!val) return '';
    if (val instanceof File) return URL.createObjectURL(val);
    if (typeof val === 'string') return val;
    return '';
  };

  // Fallback data
  const heroTitle = data?.hero_title || 'Jéssica Rayane';
  const heroImg = getImgUrl('hero_image');
  const heroOverlayOpacity = data?.hero_overlay_opacity ?? 70;

  const presTitle = data?.presentation_title || 'Uma abordagem pedagógica e artística';
  const presDesc = data?.presentation_description || 'Aulas que vão além do movimento, explorando a história, a técnica e a expressão autêntica de cada corpo.';
  const presImg = getImgUrl('presentation_image');

  const services = servicesData?.services || [];

  const ctaTitle = data?.cta_title || 'Pronta para começar?';
  const ctaDesc = data?.cta_description || 'Junte-se a nós e descubra um novo mundo de possibilidades.';
  const ctaBtnText = data?.cta_button_text || 'Fale Comigo';
  const ctaBtnLink = data?.cta_button_link || '/contato';
  const ctaBtn2Text = data?.cta_button2_text || '';
  const ctaBtn2Link = data?.cta_button2_link || '';
  const ctaImg = getImgUrl('cta_image');

  const commTitle = data?.community_title || 'Nossa Comunidade';
  const commDesc = data?.community_description || 'Espaços acolhedores criados exclusivamente para mulheres se conectarem, compartilharem experiências e crescerem juntas.';
  const commImg = getImgUrl('community_image');

  return (
    <>
      {!previewData && (
        <Helmet>
          <title>{heroTitle} - Dança, Leitura e Comunidade</title>
          <meta name="description" content={presDesc} />
        </Helmet>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Hero Background" 
            className={`w-full h-full object-cover object-top ${data?.hero_parallax ? 'fixed' : ''}`}
            style={{ opacity: (100 - heroOverlayOpacity) / 100 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" style={{ opacity: heroOverlayOpacity / 100 }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent-foreground font-medium text-sm tracking-wider uppercase mb-6 border border-accent/30 backdrop-blur-sm">
              Bem-vinda ao meu universo
            </span>
            <h1 className="heading-font text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              {heroTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. PRESENTATION SECTION (Zig-Zag Left) */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
                <img 
                  src={presImg} 
                  alt={presTitle} 
                  className={`w-full h-full object-cover object-top ${data?.presentation_parallax ? 'fixed' : ''}`}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="heading-font text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
                {presTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {presDesc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION (Bento/Grid) */}
      {services.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl font-bold text-foreground mb-4">Meus Serviços</h2>
              <SectionDivider />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((srv, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <ServiceCard {...srv} service={srv} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. COMMUNITY SECTION (Zig-Zag Right) */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
              <h2 className="heading-font text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
                {commTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
                {commDesc}
              </p>
              <ul className="space-y-4">
                {['Conexão autêntica', 'Troca de experiências', 'Crescimento mútuo'].map((item, i) => (
                  <li key={i} className="flex items-center text-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-secondary mr-3" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
                <img 
                  src={commImg} 
                  alt={commTitle} 
                  className={`w-full h-full object-cover object-top ${data?.community_parallax ? 'fixed' : ''}`}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaImg} 
            alt="Call to action background" 
            className={`w-full h-full object-cover object-top ${data?.cta_parallax ? 'fixed' : ''}`}
          />
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-background">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Sparkles className="h-12 w-12 mx-auto mb-8 text-accent opacity-90" />
            <h2 className="heading-font text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ textWrap: 'balance' }}>
              {ctaTitle}
            </h2>
            <p className="text-xl text-background/80 mb-10 max-w-2xl mx-auto">
              {ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaBtnText && (
                <Button asChild size="lg" className="h-14 px-10 text-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 active:scale-[0.98]">
                  <Link to={ctaBtnLink}>{ctaBtnText}</Link>
                </Button>
              )}
              {ctaBtn2Text && (
                <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg border-2 border-background/30 text-background hover:bg-background/10 transition-all duration-200 active:scale-[0.98]">
                  <Link to={ctaBtn2Link}>{ctaBtn2Text}</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
