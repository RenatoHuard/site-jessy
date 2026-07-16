
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Send, Instagram, Linkedin, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dbGet } from '@/lib/dbClient';
import { toast } from 'sonner';

function ContatoPage({ previewData }) {
  const [data, setData] = useState(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const records = await dbGet('contato_content');
          if (records.length > 0) setData(records[0]);
        } catch (e) {
          console.error('ContatoPage fetch error:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [previewData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    setTimeout(() => {
      setSending(false);
      toast.success('Mensagem enviada com sucesso! Retornarei em breve.');
      e.target.reset();
    }, 1500);
  };

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

  const title = data?.title || 'Vamos Conversar';
  const description = data?.description || 'Estou sempre aberta a novas conexões, parcerias e projetos. Sinta-se à vontade para me enviar uma mensagem.';
  const formText = data?.form_text || 'Preencha o formulário abaixo e entrarei em contato o mais breve possível.';
  const email = data?.email || 'contato@exemplo.com';
  const socialMedia = data?.social_media || [];

  const getIconForPlatform = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="h-5 w-5" />;
    if (p.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
    if (p.includes('whatsapp')) return <MessageCircle className="h-5 w-5" />;
    return <LinkIcon className="h-5 w-5" />;
  };

  return (
    <>
      {!previewData && (
        <Helmet>
          <title>{title} - Contato</title>
          <meta name="description" content={description} />
        </Helmet>
      )}

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              {description}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6">Informações de Contato</h3>
                <div className="flex items-center gap-4 text-lg text-muted-foreground mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
                </div>
              </div>

              {socialMedia.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Redes Sociais</h3>
                  <div className="flex flex-col gap-4">
                    {socialMedia.map((social, idx) => (
                      <a 
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {getIconForPlatform(social.platform)}
                        </div>
                        <span className="text-lg font-medium">{social.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border"
            >
              <h3 className="text-2xl font-semibold mb-2">Envie uma mensagem</h3>
              <p className="text-muted-foreground mb-8">{formText}</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                    placeholder="Como posso ajudar?"
                  ></textarea>
                </div>
                
                <Button type="submit" size="lg" className="w-full h-12 text-lg" disabled={sending}>
                  {sending ? 'Enviando...' : (
                    <>Enviar Mensagem <Send className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContatoPage;
