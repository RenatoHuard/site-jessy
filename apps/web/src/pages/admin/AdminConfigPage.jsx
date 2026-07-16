
import React from 'react';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import { FormColorPicker } from '@/components/admin/FormColorPicker.jsx';
import { toast } from 'sonner';

const defaultData = {
  site_title: '',
  site_description: '',
  primary_color: '#a855f7',
  secondary_color: '#f1f5f9',
  accent_color: '#a855f7'
};

export default function AdminConfigPage() {
  const { formData, loading, saving, handleChange, save } = useAdminPreview('site_config', defaultData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await save((data) => data);
    toast.success('Configurações salvas com sucesso! Recarregue a página para ver as novas cores.');
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando configurações...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 h-full overflow-y-auto custom-scrollbar">
      <h1 className="text-3xl font-bold mb-8 text-accent">Configurações do Site</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
          <div className="space-y-4">
            <FormField label="Título do Site" id="site_title" value={formData.site_title} onChange={handleChange} />
            <FormTextarea label="Descrição do Site" id="site_description" value={formData.site_description} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-4">Identidade Visual (Cores)</h2>
          <p className="text-sm text-muted-foreground mb-6">Escolha as cores principais da sua marca. Elas serão aplicadas automaticamente em todo o site.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormColorPicker label="Cor Primária" id="primary_color" value={formData.primary_color} onChange={handleChange} />
            <FormColorPicker label="Cor Secundária" id="secondary_color" value={formData.secondary_color} onChange={handleChange} />
            <FormColorPicker label="Cor de Destaque (Accent)" id="accent_color" value={formData.accent_color} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end gap-4 sticky bottom-0 bg-card p-4 border-t border-border mt-8 -mx-6 -mb-6 rounded-b-xl z-10">
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
