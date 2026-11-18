import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useVersionCheck } from '@/hooks/useVersionCheck';

export function UpdateBanner() {
  const hasUpdate = useVersionCheck();

  if (!hasUpdate) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-3 flex items-center justify-between gap-4 text-sm font-semibold shadow-md">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 shrink-0 animate-spin" style={{ animationDuration: '2s' }} />
        <span>Uma nova versão está disponível. Atualize para continuar usando o site corretamente.</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="shrink-0 bg-white text-amber-600 hover:bg-amber-50 transition-colors font-bold px-4 py-1.5 rounded-md whitespace-nowrap text-sm"
      >
        Atualizar agora
      </button>
    </div>
  );
}
