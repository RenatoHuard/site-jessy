
import React from 'react';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import AdminSplitLayout from '@/components/admin/AdminSplitLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import { FormImageUpload } from '@/components/admin/FormImageUpload.jsx';
import { FormToggle } from '@/components/admin/FormToggle.jsx';
import { Plus, X } from 'lucide-react';
import SobrePage from '@/pages/SobrePage.jsx';

const defaultData = {
  hero_title: '', hero_parallax: false, hero_image: null,
  frase_text: '', frase_attribution: '', frase_image: null, frase_parallax: false,
  jornada_text: '', jornada_image: null, jornada_parallax: false,
  jornada_topicos: [],
  conhecimento_title: '', conhecimento_description: '', 
  conhecimento_image1: null, conhecimento_parallax1: false,
  conhecimento_image2: null, conhecimento_parallax2: false,
  conhecimento_image3: null, conhecimento_parallax3: false
};

export default function AdminSobrePage() {
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
  } = useAdminPreview('sobre_content', defaultData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await save((data) => data);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...(formData.jornada_topicos || [])];
    newTopics[index] = value;
    handleCustomChange('jornada_topicos', newTopics);
  };

  const addTopic = () => {
    const newTopics = [...(formData.jornada_topicos || []), ''];
    handleCustomChange('jornada_topicos', newTopics);
  };

  const removeTopic = (index) => {
    const newTopics = [...(formData.jornada_topicos || [])];
    newTopics.splice(index, 1);
    handleCustomChange('jornada_topicos', newTopics);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dados da página Sobre...</div>;

  const formContent = (
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">1. Hero Section</h2>
        <div className="space-y-4">
          <FormField label="Título" id="hero_title" value={formData.hero_title} onChange={handleChange} />
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
        <h2 className="text-xl font-semibold mb-4 text-accent">2. Frase em Destaque</h2>
        <div className="space-y-4">
          <FormTextarea label="Frase" id="frase_text" value={formData.frase_text} onChange={handleChange} />
          <FormField label="Atribuição (Autor)" id="frase_attribution" value={formData.frase_attribution} onChange={handleChange} />
          <FormImageUpload label="Imagem de Fundo" id="frase_image" currentImage={formData.frase_image} onChange={handleChange} />
          <FormToggle label="Efeito Parallax" id="frase_parallax" checked={formData.frase_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">3. Minha Trajetória / Jornada</h2>
        <div className="space-y-4">
          <FormTextarea label="Texto da Jornada" id="jornada_text" value={formData.jornada_text} onChange={handleChange} />
          <FormImageUpload label="Imagem da Jornada" id="jornada_image" currentImage={formData.jornada_image} onChange={handleChange} />
          <FormToggle label="Efeito Parallax" id="jornada_parallax" checked={formData.jornada_parallax} onChange={handleChange} />
        </div>
      </div>

      <div className="admin-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-accent">4. Tópicos da Trajetória</h2>
          <Button type="button" variant="outline" size="sm" onClick={addTopic} className="hover:text-accent hover:border-accent">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Tópico
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.jornada_topicos || []).map((topic, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input 
                value={topic} 
                onChange={(e) => handleTopicChange(index, e.target.value)} 
                placeholder="Ex: Professora há 10 anos"
                className="focus-visible:ring-accent"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeTopic(index)} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!formData.jornada_topicos || formData.jornada_topicos.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum tópico adicionado.</p>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-xl font-semibold mb-4 text-accent">5. Leitura & Conhecimento</h2>
        <div className="space-y-4">
          <FormField label="Título" id="conhecimento_title" value={formData.conhecimento_title} onChange={handleChange} />
          <FormTextarea label="Descrição" id="conhecimento_description" value={formData.conhecimento_description} onChange={handleChange} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-4">
              <FormImageUpload label="Imagem 1" id="conhecimento_image1" currentImage={formData.conhecimento_image1} onChange={handleChange} />
              <FormToggle label="Efeito Parallax (Img 1)" id="conhecimento_parallax1" checked={formData.conhecimento_parallax1} onChange={handleChange} />
            </div>
            <div className="space-y-4">
              <FormImageUpload label="Imagem 2" id="conhecimento_image2" currentImage={formData.conhecimento_image2} onChange={handleChange} />
              <FormToggle label="Efeito Parallax (Img 2)" id="conhecimento_parallax2" checked={formData.conhecimento_parallax2} onChange={handleChange} />
            </div>
            <div className="space-y-4 md:col-span-2">
              <FormImageUpload label="Imagem 3" id="conhecimento_image3" currentImage={formData.conhecimento_image3} onChange={handleChange} />
              <FormToggle label="Efeito Parallax (Img 3)" id="conhecimento_parallax3" checked={formData.conhecimento_parallax3} onChange={handleChange} />
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

  const previewData = { ...formData };

  return (
    <AdminSplitLayout 
      title="Editar Página Sobre"
      formContent={formContent}
      previewContent={<SobrePage previewData={previewData} />}
    />
  );
}
