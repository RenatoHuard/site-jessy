import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useVersionCheck } from '@/hooks/useVersionCheck';

export function UpdateBanner() {
  const [dismissed, setDismissed] = useState(false);
  const hasUpdate = useVersionCheck();

  if (!hasUpdate || dismissed) return null;

  return (
    <div className="bg-accent text-accent-foreground px-4 py-2.5 flex items-center justify-between gap-4 text-sm font-medium">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 shrink-0" />
        <span>Uma nova versão do site está disponível.</span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => window.location.reload()}
          className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold whitespace-nowrap"
        >
          Atualizar agora
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="hover:opacity-80 transition-opacity"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
