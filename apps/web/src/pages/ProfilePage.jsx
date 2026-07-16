
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Meu Perfil - Jéssica Rayane</title>
      </Helmet>
      <div className="min-h-[80vh] bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/50 shadow-md overflow-hidden">
              <div className="h-32 bg-primary/10 w-full"></div>
              <CardHeader className="relative pb-0">
                <Avatar className="h-24 w-24 absolute -top-12 border-4 border-background bg-muted">
                  <AvatarFallback className="text-2xl font-bold text-primary">
                    {getInitials(currentUser?.name || currentUser?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="pt-12 flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold heading-font text-foreground">
                      {currentUser?.name || 'Usuário'}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">Membro da comunidade</p>
                  </div>
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                    Editar Perfil
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <User className="mr-2 h-4 w-4" /> Nome
                    </div>
                    <p className="text-foreground font-medium">{currentUser?.name || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </div>
                    <p className="text-foreground font-medium">{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <Shield className="mr-2 h-4 w-4" /> Tipo de Conta
                    </div>
                    <p className="text-foreground font-medium capitalize">
                      {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
