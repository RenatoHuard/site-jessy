
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Sparkles, Calendar, MessageCircle, BookOpen, BookMarked, Youtube, Briefcase } from 'lucide-react';
import SectionDivider from '@/components/SectionDivider.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import { dbGet } from '@/lib/dbClient';

// Map string icon names to actual Lucide components for dynamic rendering
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
      image: '',
      featured: true
    },
    {
      title: 'Aulas temáticas individuais',
      description: 'Aulas de dança personalizadas com foco em história, técnica e expressão.',
      icon: 'Sparkles',
      image: ''
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

          <div className="flex flex-wrap gap-8 justify-center items-start">
            {servicesList.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              const hasImage = !!service.image;
              return (
                <div key={index} className={hasImage ? 'shrink-0' : 'flex-1 min-w-[280px] max-w-sm'}>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={IconComponent}
                    image={service.image}
                    featured={service.featured}
                    delay={index * 0.1}
                    naturalWidth={hasImage}
                  />
                </div>
              );
            })}
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
