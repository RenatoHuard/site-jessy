
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Sparkles, Calendar, MessageCircle, BookOpen, BookMarked, Youtube, Briefcase, Wind, ArrowUpRight } from 'lucide-react';
import SectionDivider from '@/components/SectionDivider.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import { dbGet } from '@/lib/dbClient';

const iconMap = {
  Users, Sparkles, Calendar, MessageCircle, BookOpen, BookMarked, Youtube, Briefcase
};

function ServicesPage({ previewData }) {
  const [data, setData] = useState(previewData || null);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
    } else {
      const fetchData = async () => {
        try {
          const records = await dbGet('services_content');
          if (records.length > 0) setData(records[0]);
        } catch (e) {
          console.error('ServicesPage fetch error:', e);
        }
      };
      fetchData();
    }
  }, [previewData]);

  const introTitle = data?.intro_title || 'Serviços e Experiências';
  const introDesc = data?.intro_description || 'Escolha o formato ideal para sua jornada. Cada espaço foi criado com cuidado para acolher, ensinar e transformar através da arte e do conhecimento.';

  const defaultServices = [
    {
      title: 'Comunidade da Jéssica (venda anual)',
      description: 'Comunidade exclusiva para mulheres que querem explorar dança, leitura e desenvolvimento pessoal.',
      icon: 'Users',
      featured: true,
      link: ''
    },
    {
      title: 'Aulas temáticas individuais',
      description: 'Aulas de dança personalizadas com foco em história, técnica e expressão.',
      icon: 'Sparkles',
      link: ''
    }
  ];

  const servicesList = data?.services?.length > 0 ? data.services : defaultServices;

  return (
    <>
      {!previewData && (
        <Helmet>
          <title>Serviços - Jéssica Rayane</title>
          <meta name="description" content={introDesc} />
        </Helmet>
      )}

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1
              className="heading-font text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              {introTitle}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {introDesc}
            </p>
          </div>

          <SectionDivider className="mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {servicesList.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <div key={index} className="h-full">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={IconComponent}
                    image={service.image}
                    featured={service.featured}
                    link={service.link}
                    delay={index * 0.1}
                  />
                </div>
              );
            })}

            {/* Card fixo: Respira, Preta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: servicesList.length * 0.1 }}
              className="h-full"
            >
              <Link to="/respira-preta" className="block h-full">
                <div className="h-full flex flex-col rounded-xl overflow-hidden border hover:-translate-y-1 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(145deg, #3D1F14 0%, #5C2D1E 100%)', borderColor: 'rgba(196,99,74,0.3)' }}>
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(196, 149, 74, 0.2)' }}>
                      <Wind className="h-6 w-6" style={{ color: '#E8B89A' }} />
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--body-font)', color: '#F5EDE4' }}>Respira, Preta</h3>
                    <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: '#DEB896' }}>
                      Um evento de yoga, respiração e autocuidado pensado para o cuidado de mulheres negras. Um espaço de acolhimento, afeto e descanso.
                    </p>
                    <div className="mt-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200" style={{ border: '1px solid rgba(245, 237, 228, 0.45)', color: '#F5EDE4', background: 'rgba(255,255,255,0.07)' }}>
                      Conhecer o projeto
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-font text-3xl md:text-4xl font-bold mb-6" style={{ textWrap: 'balance' }}>
            Não sabe por onde começar?
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed mb-10">
            Entre em contato e vamos conversar sobre seus objetivos. Juntas, encontraremos o caminho perfeito para sua transformação.
          </p>
          <a
            href="/contato"
            className="inline-flex items-center justify-center rounded-lg bg-background text-foreground px-8 py-4 text-lg font-medium transition-all duration-200 hover:bg-background/90 active:scale-[0.98]"
          >
            Fale comigo
          </a>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
