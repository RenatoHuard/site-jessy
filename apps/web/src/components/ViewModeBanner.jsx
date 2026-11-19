import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ShieldCheck, User } from 'lucide-react';

function ViewModeBanner() {
  const { isRealAdmin, viewMode, setViewMode } = useAuth();

  if (!isRealAdmin) return null;

  const isAdminMode = viewMode === 'admin';

  return (
    <div className={`w-full flex items-center justify-center gap-3 py-1.5 px-4 text-xs font-medium ${
      isAdminMode
        ? 'bg-primary text-primary-foreground'
        : 'bg-accent text-accent-foreground'
    }`}>
      <span className="flex items-center gap-1.5">
        {isAdminMode
          ? <><ShieldCheck className="h-3.5 w-3.5" /> Visualizando como <strong>Admin</strong></>
          : <><User className="h-3.5 w-3.5" /> Visualizando como <strong>Cliente</strong></>
        }
      </span>
      <span className="text-current/40">|</span>
      <button
        onClick={() => setViewMode(isAdminMode ? 'client' : 'admin')}
        className="underline underline-offset-2 hover:no-underline transition-all"
      >
        Trocar para {isAdminMode ? 'Cliente' : 'Admin'}
      </button>
    </div>
  );
}

export default ViewModeBanner;
