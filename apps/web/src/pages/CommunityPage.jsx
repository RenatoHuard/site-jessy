
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CommunityPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const communityFeatures = [
    { title: 'Clube de Leitura', icon: BookOpen, description: 'Acesse os materiais e discussões do mês.' },
    { title: 'Aulas Gravadas', icon: Sparkles, description: 'Assista às práticas e conteúdos exclusivos.' },
    { title: 'Fórum', icon: MessageCircle, description: 'Conecte-se com outras mulheres da comunidade.' }
  ];

  return (
    <>
      <Helmet>
        <title>Minha Comunidade - Jéssica Rayane</title>
      </Helmet>
      <div className="min-h-[80vh] bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Site
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h1 className="text-4xl font-bold heading-font text-primary mb-4">
                Minha Comunidade
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl">
                Olá, {currentUser?.name || 'querida'}! Que bom ter você aqui. Este é o seu espaço exclusivo para explorar dança, leitura e desenvolvimento pessoal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
              <h3 className="text-2xl font-medium heading-font text-foreground mb-2">Novidades em breve</h3>
              <p className="text-muted-foreground">Estamos preparando conteúdos incríveis para você.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default CommunityPage;
