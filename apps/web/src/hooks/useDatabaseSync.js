import { useState } from 'react';
import supabase from '@/lib/supabaseClient';

// Helper: upsert numa tabela de single-record (busca o primeiro, cria ou atualiza)
const upsertSingleRecord = async (table, data) => {
  const { data: existing, error: fetchError } = await supabase
    .from(table)
    .select('id')
    .limit(1)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase.from(table).update(data).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(table).insert(data);
    if (error) throw error;
  }
};

const exampleServices = [
  {
    title: 'Comunidade da Jéssica (venda anual)',
    description: 'Comunidade exclusiva para mulheres que querem explorar dança, leitura e desenvolvimento pessoal.',
    image: 'https://images.unsplash.com/photo-1644311529675-8da508c62285',
    button_text: 'Saiba mais',
    button_link: '/comunidade',
    icon: 'Users',
  },
  {
    title: 'Aulas temáticas individuais',
    description: 'Aulas de dança personalizadas com foco em história, técnica e expressão.',
    image: 'https://images.unsplash.com/photo-1689840970755-857851e83b6a',
    button_text: 'Saiba mais',
    button_link: '/aulas',
    icon: 'Sparkles',
  },
];

export const useInitializeDatabase = () => {
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      await upsertSingleRecord('homepage_content', {
        hero_title: 'Jéssica Rayane',
        hero_overlay_opacity: 70,
        presentation_title: 'Uma abordagem pedagógica e artística',
        presentation_description: 'Aulas que vão além do movimento, explorando a história, a técnica e a expressão autêntica de cada corpo.',
        cta_title: 'Pronta para começar?',
        cta_description: 'Junte-se a nós e descubra um novo mundo de possibilidades.',
        cta_button_text: 'Fale Comigo',
        cta_button_link: '/contato',
        cta_button2_text: 'Saiba Mais',
        cta_button2_link: '/sobre',
        community_title: 'Nossa Comunidade',
        community_description: 'Espaços acolhedores criados exclusivamente para mulheres se conectarem, compartilharem experiências e crescerem juntas.',
      });
      return { success: true };
    } catch (error) {
      console.error('Error syncing homepage:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { sync, loading };
};

export const useExtractSobreContent = () => {
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      await upsertSingleRecord('sobre_content', {
        hero_title: 'Uma jornada de paixão, arte e transformação',
        jornada_text: 'A dança nos proporciona dialogar com o mundo. Desde criança, a dança sempre foi minha forma de expressão...',
        conhecimento_title: 'Minha Trajetória',
        conhecimento_description: 'Professora há 10 anos, com licenciatura em Dança e pós-graduação em Metodologia.',
        frase_text: 'A dança nos proporciona dialogar com o mundo',
        frase_attribution: 'JÉSSICA RAYANE',
        jornada_topicos: [
          'Professora há 10 anos',
          'Licenciatura em Dança',
          'Coordenadora Pedagógica',
          'Pós-graduação em Metodologia',
          'Trabalha com a infância',
          'Ama ler e tem uma biblioteca em casa',
          'Em constante estudo',
          'Estudante de Yoga',
        ],
      });
      return { success: true };
    } catch (error) {
      console.error('Error syncing sobre:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { sync, loading };
};

export const useExtractServicesContent = () => {
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      await upsertSingleRecord('services_content', {
        intro_title: 'Serviços e Experiências',
        intro_description: 'Escolha o formato ideal para sua jornada. Cada espaço foi criado com cuidado para acolher, ensinar e transformar através da arte e do conhecimento.',
        services: exampleServices,
      });
      return { success: true };
    } catch (error) {
      console.error('Error syncing services:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { sync, loading };
};

export const useExtractContatoContent = () => {
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      await upsertSingleRecord('contato_content', {
        title: 'Vamos Conversar',
        description: 'Estou sempre aberta a novas conexões, parcerias e projetos. Sinta-se à vontade para me enviar uma mensagem.',
        form_text: 'Preencha o formulário abaixo e entrarei em contato o mais breve possível.',
        email: 'contato@exemplo.com',
        social_media: [
          { platform: 'Instagram', link: 'https://instagram.com' },
          { platform: 'LinkedIn', link: 'https://linkedin.com' },
        ],
      });
      return { success: true };
    } catch (error) {
      console.error('Error syncing contato:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { sync, loading };
};

export const useExtractSiteConfig = () => {
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      await upsertSingleRecord('site_config', {
        site_title: 'Jéssica Rayane',
        site_description: 'Bailarina, Educadora, Leitora',
        primary_color: '#472418',
        secondary_color: '#cc401a',
        accent_color: '#d99e4d',
      });
      return { success: true };
    } catch (error) {
      console.error('Error syncing config:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { sync, loading };
};
