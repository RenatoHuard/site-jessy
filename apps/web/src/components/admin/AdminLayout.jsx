
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Home, Briefcase, User, Mail, Settings, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSiteConfig } from '@/hooks/useSiteConfig.js';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isMember, isAdmin } = useAuth();
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/home', label: 'Home Page', icon: Home },
    { path: '/admin/services', label: 'Serviços', icon: Briefcase },
    { path: '/admin/sobre', label: 'Sobre', icon: User },
    { path: '/admin/contato', label: 'Contato', icon: Mail },
    { path: '/admin/config', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between z-20">
        <span className="font-bold heading-font text-xl text-primary">Admin Panel</span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 z-30 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border hidden md:block">
          <span className="font-bold heading-font text-2xl text-primary">Admin Panel</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-card space-y-2">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-foreground truncate">{currentUser?.nome || 'Admin'}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
          </div>
          
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Site
            </Link>
          </Button>
          
          {(isMember || isAdmin) && (
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/members/dashboard">
                <User className="mr-2 h-4 w-4" />
                Área de Membros
              </Link>
            </Button>
          )}

          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content - Takes remaining width */}
      <main className="flex-1 h-[calc(100vh-4rem)] md:h-screen overflow-hidden relative">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
