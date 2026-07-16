
import React from 'react';
import { toast } from 'sonner';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import AdminSplitLayout from '@/components/admin/AdminSplitLayout.jsx';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import { FormImageUpload } from '@/components/admin/FormImageUpload.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import { useExtractServicesContent } from '@/hooks/useDatabaseSync.js';

const defaultData = {
  intro_title: '',
  intro_description: '',
  services: []
};

export default function AdminServicesPage() {
  const {
    formData,
    loading,
    saving,
    handleChange,
    handleCustomChange,
    resetForm,
    save,
    fetchData
  } = useAdminPreview('services_content', defaultData);
  const { sync: syncDefaults } = useExtractServicesContent();

  const handleSyncDefaults = async () => {
    await syncDefaults();
    await fetchData();
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...(formData.services || [])];
    newServices[index] = { ...newServices[index], [field]: value };
    handleCustomChange('services', newServices);
  };

  const addService = () => {
    const newServices = [...(formData.services || []), { 
      id: crypto.randomUUID(),
      title: '', 
      description: '', 
      button_text: '', 
      button_link: '', 
      icon: 'Sparkles',
      image: ''
    }];
    handleCustomChange('services', newServices);
  };

  const removeService = (index) => {
    const newServices = [...(formData.services || [])];
    newServices.splice(index, 1);
    handleCustomChange('services', newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cleanedServices = (formData.services || []).map(service => {
      const cleaned = { ...service };
      if (cleaned.image && typeof cleaned.image !== 'string') {
        cleaned.image = '';
      } else if (cleaned.image && cleaned.image.startsWith('data:image')) {
        cleaned.image = '';
      }
      return cleaned;
    });

    const jsonString = JSON.stringify(cleanedServices);
    if (jsonString.length > 900000) {
      toast.error('Dados muito grandes. Remova algumas imagens ou serviços.');
      return;
    }

    await save((data) => {
      return {
        intro_title: data.intro_title,
        intro_description: data.intro_description,
        services: cleanedServices
      };
    });
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dados de Serviços...</div>;

  const formContent = (
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">Introdução</h2>
        <div className="space-y-4">
          <FormField label="Título da Seção" id="intro_title" value={formData.intro_title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="intro_description" value={formData.intro_description} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-accent">Lista de Serviços</h2>
          <Button type="button" variant="outline" onClick={addService} className="hover:text-accent hover:border-accent">Adicionar Novo Serviço</Button>
        </div>
        
        <div className="space-y-8">
          {(formData.services || []).map((service, index) => (
            <div key={index} className="p-4 border border-border rounded-lg bg-muted/10 relative">
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                className="absolute top-4 right-4"
                onClick={() => removeService(index)}
              >
                Remover
              </Button>
              <h3 className="font-medium mb-4">Serviço {index + 1}</h3>
              <div className="space-y-4">
                <FormField 
                  label="Título" 
                  id={`service_title_${index}`} 
                  value={service.title || ''} 
                  onChange={(e) => handleServiceChange(index, 'title', e.target.value)} 
                />
                <FormTextarea 
                  label="Descrição" 
                  id={`service_desc_${index}`} 
                  value={service.description || ''} 
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)} 
                />
                
                <FormImageUpload 
                  label="Imagem do Serviço" 
                  id={`service_image_${index}`} 
                  currentImage={service.image} 
                  onChange={(e) => handleServiceChange(index, 'image', e.target.value)} 
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField 
                    label="Texto do Botão" 
                    id={`service_btn_text_${index}`} 
                    value={service.button_text || ''} 
                    onChange={(e) => handleServiceChange(index, 'button_text', e.target.value)} 
                  />
                  <FormField 
                    label="Link do Botão" 
                    id={`service_btn_link_${index}`} 
                    value={service.button_link || ''} 
                    onChange={(e) => handleServiceChange(index, 'button_link', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}
          {(!formData.services || formData.services.length === 0) && (
            <div className="text-center py-8 space-y-3">
              <p className="text-muted-foreground">Nenhum serviço cadastrado.</p>
              <Button type="button" variant="outline" onClick={handleSyncDefaults}>
                Carregar dados padrão
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-0 bg-card p-4 border-t border-border mt-8 -mx-6 -mb-6 rounded-b-xl z-10">
        <Button type="button" variant="outline" onClick={resetForm}>Descartar</Button>
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
      </div>
    </form>
  );

  return (
    <AdminSplitLayout 
      title="Editar Serviços"
      formContent={formContent}
      previewContent={<ServicesPage previewData={formData} />}
    />
  );
}
