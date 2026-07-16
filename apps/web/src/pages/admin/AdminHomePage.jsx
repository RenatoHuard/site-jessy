
import React from 'react';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import AdminSplitLayout from '@/components/admin/AdminSplitLayout.jsx';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import { FormImageUpload } from '@/components/admin/FormImageUpload.jsx';
import { FormToggle } from '@/components/admin/FormToggle.jsx';
import HomePage from '@/pages/HomePage.jsx';

const defaultData = {
  hero_title: '', hero_parallax: false, hero_image: null, hero_overlay_opacity: 70,
  presentation_title: '', presentation_description: '', presentation_parallax: false, presentation_image: null,
  cta_title: '', cta_description: '', cta_button_text: '', cta_button_link: '', cta_button2_text: '', cta_button2_link: '', cta_parallax: false, cta_image: null,
  community_title: '', community_description: '', community_parallax: false, community_image: null
};

export default function AdminHomePage() {
  const {
    formData,
    loading,
    saving,
    handleChange,
    handleCustomChange,
    resetForm,
    getImageUrl,
    save,
    recordId
  } = useAdminPreview('homepage_content', defaultData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await save((data) => data);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dados da Home...</div>;

  const formContent = (
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">1. Hero Section</h2>
        <div className="space-y-4">
          <FormField label="Título Principal" id="hero_title" value={formData.hero_title} onChange={handleChange} />
          <FormImageUpload label="Imagem de Fundo" id="hero_image" currentImage={formData.hero_image} onChange={handleChange} />
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-foreground">
              Opacidade do Overlay: <span className="text-primary font-bold">{formData.hero_overlay_opacity ?? 70}%</span>
            </label>
            <p className="text-xs text-muted-foreground">0% = imagem visível | 100% = fundo sólido</p>
            <input
              type="range"
              min="0"
              max="100"
              name="hero_overlay_opacity"
              value={formData.hero_overlay_opacity ?? 70}
              onChange={(e) => handleCustomChange('hero_overlay_opacity', Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <FormToggle label="Efeito Parallax" id="hero_parallax" checked={formData.hero_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">2. Apresentação</h2>
        <div className="space-y-4">
          <FormField label="Título" id="presentation_title" value={formData.presentation_title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="presentation_description" value={formData.presentation_description} onChange={handleChange} />
          <FormImageUpload label="Imagem" id="presentation_image" currentImage={formData.presentation_image} onChange={handleChange} />
          <FormToggle label="Efeito Parallax" id="presentation_parallax" checked={formData.presentation_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">3. Call to Action (CTA)</h2>
        <div className="space-y-4">
          <FormField label="Título" id="cta_title" value={formData.cta_title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="cta_description" value={formData.cta_description} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Texto Botão 1" id="cta_button_text" value={formData.cta_button_text} onChange={handleChange} />
            <FormField label="Link Botão 1" id="cta_button_link" value={formData.cta_button_link} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Texto Botão 2" id="cta_button2_text" value={formData.cta_button2_text} onChange={handleChange} />
            <FormField label="Link Botão 2" id="cta_button2_link" value={formData.cta_button2_link} onChange={handleChange} />
          </div>
          <FormImageUpload label="Imagem de Fundo" id="cta_image" currentImage={formData.cta_image} onChange={handleChange} />
          <FormToggle label="Efeito Parallax" id="cta_parallax" checked={formData.cta_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">4. Comunidade</h2>
        <div className="space-y-4">
          <FormField label="Título" id="community_title" value={formData.community_title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="community_description" value={formData.community_description} onChange={handleChange} />
          <FormImageUpload label="Imagem de Fundo" id="community_image" currentImage={formData.community_image} onChange={handleChange} />
          <FormToggle label="Efeito Parallax" id="community_parallax" checked={formData.community_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-0 bg-card p-4 border-t border-border mt-8 -mx-6 -mb-6 rounded-b-xl z-10">
        <Button type="button" variant="outline" onClick={resetForm}>Descartar</Button>
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
      </div>
    </form>
  );

  const previewData = { ...formData };

  return (
    <AdminSplitLayout 
      title="Editar Home Page"
      formContent={formContent}
      previewContent={<HomePage previewData={previewData} />}
    />
  );
}
