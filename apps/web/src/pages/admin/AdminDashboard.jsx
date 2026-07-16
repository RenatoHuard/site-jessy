import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Settings, Home, FileText, Image } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const fetchCount = async (table, filter = '') => {
  const res = await window.fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=id${filter}`,
    { headers: { apikey: SUPABASE_KEY, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' } }
  );
  return parseInt(res.headers.get('Content-Range')?.split('/')[1] || '0');
};

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ members: 0, admins: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [members, admins, servRes] = await Promise.all([
          fetchCount('profiles', '&role=eq.member'),
          fetchCount('profiles', '&role=eq.admin'),
          window.fetch(`${SUPABASE_URL}/rest/v1/services_content?select=services&limit=1`, {
            headers: { apikey: SUPABASE_KEY },
          }),
        ]);
        const servData = await servRes.json();
        const services = Array.isArray(servData?.[0]?.services) ? servData[0].services.length : 0;
        setStats({ members, admins, services });
      } catch (e) {
        console.error('Dashboard error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { title: 'Membros', value: stats.members, icon: Users, color: 'text-primary', bg: 'bg-primary/10', desc: 'usuários cadastrados' },
    { title: 'Administradores', value: stats.admins, icon: Settings, color: 'text-amber-600', bg: 'bg-amber-500/10', desc: 'com acesso admin' },
    { title: 'Serviços', value: stats.services, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10', desc: 'serviços publicados' },
  ];

  const shortcuts = [
    { label: 'Editar Home Page', to: '/admin/home', icon: Home },
    { label: 'Editar Serviços', to: '/admin/services', icon: BookOpen },
    { label: 'Editar Página Sobre', to: '/admin/sobre', icon: FileText },
    { label: 'Configurações do Site', to: '/admin/config', icon: Settings },
  ];

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Olá, {currentUser?.nome?.split(' ')[0] || 'Admin'}. Visão geral do site.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? '—' : c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atalhos de edição */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Editar Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((s, i) => (
            <Link
              key={i}
              to={s.to}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
            >
              <s.icon className="h-4 w-4 text-muted-foreground" />
              {s.label}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
