
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';
import {
  useInitializeDatabase,
  useExtractSobreContent,
  useExtractServicesContent,
  useExtractContatoContent,
  useExtractSiteConfig
} from '@/hooks/useDatabaseSync.js';

export default function SyncDatabaseButton({ onSyncComplete }) {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { sync: syncHome } = useInitializeDatabase();
  const { sync: syncSobre } = useExtractSobreContent();
  const { sync: syncServices } = useExtractServicesContent();
  const { sync: syncContato } = useExtractContatoContent();
  const { sync: syncConfig } = useExtractSiteConfig();

  const handleSync = async () => {
    setIsSyncing(true);
    toast.loading('Extraindo conteúdo e sincronizando banco de dados...', { id: 'sync-db' });
    
    try {
      const results = await Promise.all([
        syncHome(),
        syncSobre(),
        syncServices(),
        syncContato(),
        syncConfig()
      ]);
      
      const hasErrors = results.some(r => !r.success);
      
      if (hasErrors) {
        toast.error('Sincronização concluída com alguns erros. Verifique o console.', { id: 'sync-db' });
      } else {
        toast.success('Banco de dados sincronizado com sucesso! Todo o conteúdo padrão foi extraído.', { id: 'sync-db' });
        if (onSyncComplete) onSyncComplete();
      }
    } catch (error) {
      toast.error('Falha crítica ao sincronizar o banco de dados.', { id: 'sync-db' });
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1 sm:mt-0">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Sincronização Inicial de Conteúdo</h3>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Esta ação extrai todo o conteúdo padrão atual do site (textos, serviços, depoimentos) e o salva no banco de dados. 
            Utilize isto para popular o banco de dados pela primeira vez e habilitar a edição.
          </p>
        </div>
      </div>
      <Button 
        onClick={handleSync} 
        disabled={isSyncing} 
        className="whitespace-nowrap w-full sm:w-auto shadow-sm"
        size="lg"
      >
        <RefreshCw className={`mr-2 h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Sincronizar com Preview'}
      </Button>
    </div>
  );
}
