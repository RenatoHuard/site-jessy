
import React from 'react';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import AdminSplitLayout from '@/components/admin/AdminSplitLayout.jsx';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import ContatoPage from '@/pages/ContatoPage.jsx';

const defaultData = {
  title: '',
  description: '',
  form_text: '',
  email: '',
  social_media: []
};

export default function AdminContatoPage() {
  const {
    formData,
    loading,
    saving,
    handleChange,
    handleCustomChange,
    resetForm,
    save
  } = useAdminPreview('contato_content', defaultData);

  const handleSocialChange = (index, field, value) => {
    const newSocialMedia = [...(formData.social_media || [])];
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
    handleCustomChange('social_media', newSocialMedia);
  };

  const addSocialLink = () => {
    const newSocialMedia = [...(formData.social_media || []), { platform: '', link: '' }];
    handleCustomChange('social_media', newSocialMedia);
  };

  const removeSocialLink = (index) => {
    const newSocialMedia = [...(formData.social_media || [])];
    newSocialMedia.splice(index, 1);
    handleCustomChange('social_media', newSocialMedia);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await save();
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dados de Contato...</div>;

  const formContent = (
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">Textos Principais</h2>
        <div className="space-y-4">
          <FormField label="Título" id="title" value={formData.title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="description" value={formData.description} onChange={handleChange} />
          <FormField label="Texto do Formulário" id="form_text" value={formData.form_text} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">Informações de Contato</h2>
        <div className="space-y-4">
          <FormField label="Email de Contato" id="email" type="email" value={formData.email} onChange={handleChange} />
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Redes Sociais</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="hover:text-accent hover:border-accent">Adicionar Rede</Button>
            </div>
            
            <div className="space-y-4">
              {(formData.social_media || []).map((social, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border border-border rounded-lg bg-muted/10">
                  <div className="flex-1 space-y-4">
                    <FormField 
                      label="Plataforma (ex: Instagram, LinkedIn)" 
                      id={`social_platform_${index}`} 
                      value={social.platform || ''} 
                      onChange={(e) => handleSocialChange(index, 'platform', e.target.value)} 
                    />
                    <FormField 
                      label="Link (URL)" 
                      id={`social_link_${index}`} 
                      value={social.link || ''} 
                      onChange={(e) => handleSocialChange(index, 'link', e.target.value)} 
                    />
                  </div>
                  <Button type="button" variant="destructive" onClick={() => removeSocialLink(index)}>Remover</Button>
                </div>
              ))}
              {(!formData.social_media || formData.social_media.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-2">Nenhuma rede social cadastrada.</p>
              )}
            </div>
          </div>
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
      title="Editar Página de Contato"
      formContent={formContent}
      previewContent={<ContatoPage previewData={formData} />}
    />
  );
}
