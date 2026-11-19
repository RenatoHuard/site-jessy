
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Home, Briefcase, User, Mail, Settings,
  LogOut, Menu, X, ArrowLeft, Wind, Info, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSiteConfig } from '@/hooks/useSiteConfig.js';
import { Button } from '@/components/ui/button';
import { UpdateBanner } from '@/components/UpdateBanner.jsx';

// ── JR Dancing nav ──────────────────────────────────────────────────────────
const JR_NAV = [
  { path: '/admin',          label: 'Dashboard',     icon: LayoutDashboard, exact: true },
  { path: '/admin/home',     label: 'Home Page',      icon: Home },
  { path: '/admin/services', label: 'Serviços',       icon: Briefcase },
  { path: '/admin/sobre',    label: 'Sobre',          icon: User },
  { path: '/admin/contato',  label: 'Contato',        icon: Mail },
  { path: '/admin/config',   label: 'Configurações',  icon: Settings },
];

// ── Respira Preta nav ───────────────────────────────────────────────────────
const RP_NAV = [
  { path: '/admin/respira-home',   label: 'Home Page',     icon: Home },
  { path: '/admin/respira-sobre',  label: 'Sobre',         icon: Info },
  { path: '/admin/respira',        label: 'Eventos',       icon: Wind, exact: true },
  { path: '/admin/respira-config', label: 'Configurações', icon: Settings },
];

// ── Sidebar JR Dancing ──────────────────────────────────────────────────────
function JrSidebar({ location, onClose, currentUser, onLogout, isMember, isAdmin, isOpen }) {
  return (
    <aside className={`fixed md:relative top-0 left-0 z-30 h-screen w-64 bg-card border-r border-border flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <span className="font-bold heading-font text-xl text-primary">Admin Panel</span>
        <button className="md:hidden text-muted-foreground" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Site switcher */}
      <div className="px-3 py-3 border-b border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-2 px-1">Site ativo</p>
        <div className="space-y-1.5">
          {/* JR Dancing — ativo */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary truncate">Jéssica Rayane</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          </div>
          {/* Respira Preta — inativo */}
          <Link
            to="/admin/respira-home"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-[#5C2D1E]/40 hover:bg-[#3D1F14]/10 transition-all group"
          >
            <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-7 w-auto opacity-75 group-hover:opacity-100 transition-opacity" />
            <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-[#C4634A] transition-colors flex-shrink-0" />
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-0.5">
        {JR_NAV.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path || location.pathname === item.path + '/'
            : location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <SidebarFooter currentUser={currentUser} onLogout={onLogout} isMember={isMember} isAdmin={isAdmin} />
    </aside>
  );
}

// ── Sidebar Respira Preta ───────────────────────────────────────────────────
function RpSidebar({ location, onClose, currentUser, onLogout, isOpen }) {
  return (
    <aside
      className={`fixed md:relative top-0 left-0 z-30 h-screen w-64 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      style={{ background: '#0F0704', borderRight: '1px solid #3D1F14' }}
    >
      {/* Header com logo */}
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #3D1F14' }}>
        <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-11 w-auto" />
        <button className="md:hidden" style={{ color: '#DEB896' }} onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Site switcher */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid #3D1F14' }}>
        <p className="text-[10px] uppercase tracking-widest mb-2 px-1" style={{ color: '#DEB896', opacity: 0.4 }}>Site ativo</p>
        <div className="space-y-1.5">
          {/* JR Dancing — inativo */}
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent transition-all group"
            style={{ '--hover-bg': 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span className="text-sm font-medium" style={{ color: '#DEB896', opacity: 0.5 }}>Jéssica Rayane</span>
            <ChevronRight className="ml-auto h-3.5 w-3.5 flex-shrink-0" style={{ color: '#DEB896', opacity: 0.3 }} />
          </Link>
          {/* Respira Preta — ativo */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: '#3D1F14', borderColor: '#C4634A33' }}>
            <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-7 w-auto" />
            <span className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C4634A' }} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-0.5">
        {RP_NAV.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path || location.pathname === item.path + '/'
            : location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm"
              style={{
                background: isActive ? '#5C2D1E' : 'transparent',
                color: isActive ? '#E8B89A' : '#DEB896',
                fontWeight: isActive ? 600 : 400,
                opacity: isActive ? 1 : 0.65,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(92,45,30,0.4)'; e.currentTarget.style.opacity = '1'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.65'; } }}
            >
              <item.icon className="mr-3 h-4 w-4 flex-shrink-0" style={{ color: isActive ? '#E8B89A' : '#DEB896' }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid #3D1F14' }}>
        <div className="mb-3 px-1">
          <p className="text-sm font-medium truncate" style={{ color: '#F5EDE4' }}>{currentUser?.nome || 'Admin'}</p>
          <p className="text-xs truncate" style={{ color: '#DEB896', opacity: 0.5 }}>{currentUser?.email}</p>
        </div>
        <Link
          to="/respira-preta"
          onClick={onClose}
          className="flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ border: '1px solid #3D1F14', color: '#DEB896', opacity: 0.7 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = '#5C2D1E'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = '#3D1F14'; }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ver site Respira
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ border: '1px solid #3D1F14', color: '#C4634A', opacity: 0.8 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(196,99,74,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

// ── Shared footer for JR sidebar ────────────────────────────────────────────
function SidebarFooter({ currentUser, onLogout, isMember, isAdmin }) {
  return (
    <div className="p-4 border-t border-border bg-card space-y-2">
      <div className="mb-3 px-1">
        <p className="text-sm font-medium text-foreground truncate">{currentUser?.nome || 'Admin'}</p>
        <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
      </div>
      <Button asChild variant="outline" size="sm" className="w-full justify-start">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Ver site</Link>
      </Button>
      {(isMember || isAdmin) && (
        <Button asChild variant="outline" size="sm" className="w-full justify-start">
          <Link to="/members/dashboard"><User className="mr-2 h-4 w-4" />Área de Membros</Link>
        </Button>
      )}
      <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />Sair
      </Button>
    </div>
  );
}

// ── Main layout ─────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isMember, isAdmin } = useAuth();
  useSiteConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const isRespira = location.pathname.startsWith('/admin/respira');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const close = () => setSidebarOpen(false);

  const sidebarProps = {
    location,
    onClose: close,
    currentUser,
    onLogout: handleLogout,
    isMember,
    isAdmin,
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden" style={{ background: isRespira ? '#1E0E06' : undefined }}>
      <UpdateBanner />

      {/* Mobile header */}
      <div
        className="md:hidden p-4 flex items-center justify-between z-20"
        style={isRespira
          ? { background: '#0F0704', borderBottom: '1px solid #3D1F14' }
          : { background: 'hsl(var(--card))', borderBottom: '1px solid hsl(var(--border))' }
        }
      >
        {isRespira
          ? <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-9" />
          : <span className="font-bold heading-font text-xl text-primary">Admin Panel</span>
        }
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={isRespira ? { color: '#DEB896' } : undefined}
          className={isRespira ? '' : 'text-muted-foreground'}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      {isRespira
        ? <RpSidebar {...sidebarProps} isOpen={sidebarOpen} />
        : <JrSidebar {...sidebarProps} isOpen={sidebarOpen} />
      }

      {/* Main content */}
      <main className="flex-1 h-[calc(100vh-4rem)] md:h-screen overflow-hidden relative">
        <Outlet />
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={close} />
      )}
    </div>
  );
}
