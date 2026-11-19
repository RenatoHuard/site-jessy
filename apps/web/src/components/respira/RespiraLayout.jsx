import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Menu, X } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';

const navLinks = [
  { to: '/respira-preta', label: 'Início', end: true },
  { to: '/respira-preta/sobre', label: 'Sobre' },
  { to: '/respira-preta/eventos', label: 'Eventos' },
];

const activeClass = 'text-[#E8B89A]';
const inactiveClass = 'text-[#F5EDE4]/75 hover:text-[#E8B89A] transition-colors';
const linkClass = ({ isActive }) => (isActive ? activeClass : inactiveClass);

function RespiraHeader() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#2A1409] border-b border-[#5C2D1E]/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/respira-preta" className="flex-shrink-0">
          <img
            src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png"
            alt="Respira, Preta"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? '/members/dashboard' : '/login'}
            className={inactiveClass}
          >
            Minha Área
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden md:inline text-xs text-[#DEB896]/50 hover:text-[#DEB896] transition-colors"
          >
            ← JR Dancing
          </Link>
          <button
            className="md:hidden text-[#F5EDE4]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#1E0E06] border-t border-[#5C2D1E]/60 px-6 py-5 flex flex-col gap-5 text-sm">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? '/members/dashboard' : '/login'}
            className={inactiveClass}
            onClick={() => setOpen(false)}
          >
            Minha Área
          </NavLink>
          <Link to="/" className="text-[#DEB896]/40 text-xs mt-1" onClick={() => setOpen(false)}>
            ← JR Dancing
          </Link>
        </div>
      )}
    </header>
  );
}

function RespiraFooter() {
  return (
    <footer className="bg-[#1E0E06] text-[#DEB896]/60 py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        <div className="flex flex-col items-center md:items-start gap-3">
          <img
            src="/respira-preta/logos/RP_logo1_vertical_claro.png"
            alt="Respira, Preta"
            className="h-20 w-auto opacity-70"
          />
          <p className="text-xs tracking-widest uppercase opacity-50">
            Encontro de Yoga, Afeto e Descanso
          </p>
        </div>

        <nav className="flex flex-col items-center md:items-start gap-3 text-sm">
          <p className="text-[#E8B89A]/50 text-xs uppercase tracking-widest mb-1">Navegação</p>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-[#E8B89A] transition-colors">
              {label}
            </Link>
          ))}
          <Link to="/" className="text-xs opacity-40 hover:opacity-70 transition-opacity mt-2">
            ← JR Dancing
          </Link>
        </nav>

        <p className="text-xs opacity-25 text-center md:text-right self-end">
          © {new Date().getFullYear()} Respira, Preta
          <br />Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

function RespiraLayout() {
  return (
    <div className="respira min-h-screen flex flex-col bg-[#4A2318] text-[#F5EDE4]">
      <RespiraHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <RespiraFooter />
      <WhatsAppButton color="#C4634A" variant="respira" />
    </div>
  );
}

export default RespiraLayout;
