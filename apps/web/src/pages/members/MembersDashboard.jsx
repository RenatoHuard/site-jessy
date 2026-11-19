import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, BookOpen, Dumbbell, User, ArrowRight, Calendar, Sparkles, MessageCircle, BookMarked, Youtube, Briefcase, Wind, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';

const iconMap = { Users, Sparkles, Calendar, MessageCircle, BookOpen, BookMarked, Youtube, Briefcase };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function MembersDashboard() {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState({ members: 0, services: 0 });
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [membersRes, servicesRes] = await Promise.all([
          window.fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&role=eq.member`, {
            headers: { apikey: SUPABASE_KEY, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' },
          }),
          window.fetch(`${SUPABASE_URL}/rest/v1/services_content?select=services&limit=1`, {
            headers: { apikey: SUPABASE_KEY },
          }),
        ]);

        const membersCount = parseInt(membersRes.headers.get('Content-Range')?.split('/')[1] || '0');

        const servData = await servicesRes.json();
        const list = Array.isArray(servData?.[0]?.services) ? servData[0].services : [];
        const servicesCount = list.length;

        setCounts({ members: membersCount, services: servicesCount });
        setServicesList(list);
      } catch (e) {
        console.error('Dashboard counts error:', e);
      }
    };
    fetchCounts();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const joinDate = currentUser?.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : null;

  const stats = [
    {
      title: 'Membros da Comunidade',
      value: counts.members || '—',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      desc: 'mulheres na comunidade',
    },
    {
      title: 'Serviços Disponíveis',
      value: counts.services || '—',
      icon: BookOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
      desc: 'experiências para você',
    },
    {
      title: 'Seu Nível',
      value: currentUser?.role === 'admin' ? 'Admin' : 'Membro',
      icon: Dumbbell,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      desc: 'status na comunidade',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <Helmet>
        <title>Dashboard | Área de Membros</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header com perfil */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              {currentUser?.foto_perfil_url && (
                <AvatarImage src={currentUser.foto_perfil_url} className="object-cover" />
              )}
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {getInitials(currentUser?.nome || currentUser?.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Olá, {currentUser?.nome?.split(' ')[0] || 'Membro'}!
              </h1>
              <p className="text-muted-foreground text-sm">
                Bem-vinda à sua área exclusiva.
              </p>
              {joinDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" /> Membro desde {joinDate}
                </p>
              )}
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/members/profile">
              <User className="mr-2 h-4 w-4" />
              Editar Perfil
            </Link>
          </Button>
        </div>

        {/* Cards de contagem */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acesso rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base text-primary">Sobre a Jéssica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Conheça a trajetória, a missão e os valores que movem este espaço.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/sobre">
                  Conheça mais <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Serviços disponíveis */}
        {servicesList.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Serviços Disponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesList.map((srv, i) => {
                const IconComp = iconMap[srv.icon] || BookOpen;
                return (
                  <Card key={i} className="border-border/50 shadow-sm flex flex-col h-full">
                    {srv.image && (
                      <div className="w-full overflow-hidden rounded-t-lg aspect-video bg-muted/20">
                        <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      {!srv.image && (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 mb-2">
                          <IconComp className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <CardTitle className="text-base">{srv.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground flex-1 mb-3">{srv.description}</p>
                      {srv.link && (
                        <Button asChild variant="outline" size="sm" className="w-fit">
                          {srv.link.startsWith('/') ? (
                            <Link to={srv.link}>Saiba mais <ArrowRight className="ml-1 h-3 w-3" /></Link>
                          ) : (
                            <a href={srv.link} target="_blank" rel="noopener noreferrer">Saiba mais <ExternalLink className="ml-1 h-3 w-3" /></a>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Card fixo: Respira, Preta */}
              <Link to="/respira-preta" className="block h-full">
                <div className="h-full flex flex-col rounded-xl overflow-hidden border hover:-translate-y-1 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(145deg, #3D1F14 0%, #5C2D1E 100%)', borderColor: 'rgba(196,99,74,0.3)' }}>
                  <div className="p-5 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(196,149,74,0.2)' }}>
                      <Wind className="h-5 w-5" style={{ color: '#E8B89A' }} />
                    </div>
                    <p className="text-base font-bold mb-2" style={{ color: '#F5EDE4' }}>Respira, Preta</p>
                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#DEB896' }}>
                      Um evento de yoga, respiração e autocuidado pensado para o cuidado de mulheres negras.
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#E8B89A' }}>
                      Conhecer o projeto <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
