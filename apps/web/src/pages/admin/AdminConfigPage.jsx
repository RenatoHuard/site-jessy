
import React, { useEffect } from 'react';
import { useAdminPreview } from '@/hooks/useAdminPreview.js';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/FormField.jsx';
import { FormTextarea } from '@/components/admin/FormTextarea.jsx';
import { ensureFontLoaded, hexToHSL, getContrastForeground } from '@/hooks/useSiteConfig.js';
import { Check, ChevronRight } from 'lucide-react';

const BODY_FONTS = [
  { id: 'Roboto', label: 'Roboto', sample: 'Texto limpo e moderno' },
  { id: 'Inter', label: 'Inter', sample: 'Texto limpo e moderno' },
  { id: 'Poppins', label: 'Poppins', sample: 'Texto limpo e moderno' },
  { id: 'Lato', label: 'Lato', sample: 'Texto limpo e moderno' },
  { id: 'Nunito', label: 'Nunito', sample: 'Texto limpo e moderno' },
  { id: 'Open Sans', label: 'Open Sans', sample: 'Texto limpo e moderno' },
];

const NAME_FONTS = [
  { id: 'Dancing Script', label: 'Dancing Script', sample: 'Jéssica Rayane' },
  { id: 'Great Vibes', label: 'Great Vibes', sample: 'Jéssica Rayane' },
  { id: 'Pacifico', label: 'Pacifico', sample: 'Jéssica Rayane' },
  { id: 'Sacramento', label: 'Sacramento', sample: 'Jéssica Rayane' },
  { id: 'Satisfy', label: 'Satisfy', sample: 'Jéssica Rayane' },
  { id: 'Cormorant Garamond', label: 'Cormorant', sample: 'Jéssica Rayane' },
];

const PALETTES = [
  {
    id: 'ambar-ancestral',
    label: 'Âmbar Ancestral',
    desc: 'Tons quentes de marrom e terracota',
    primary: '#3D1F14',
    secondary: '#C4634A',
    accent: '#C4954A',
  },
  {
    id: 'moderna-neutra',
    label: 'Moderna Neutra',
    desc: 'Cinzas sofisticados com destaque índigo',
    primary: '#1E1E2E',
    secondary: '#313244',
    accent: '#6366f1',
  },
  {
    id: 'rosa-floral',
    label: 'Rosa Floral',
    desc: 'Suave e feminino com tons rosados',
    primary: '#6B1E45',
    secondary: '#C4607E',
    accent: '#E8A0BF',
  },
  {
    id: 'verde-natural',
    label: 'Verde Natural',
    desc: 'Tons de natureza e frescor',
    primary: '#1B4332',
    secondary: '#2D6A4F',
    accent: '#52B788',
  },
  {
    id: 'azul-oceano',
    label: 'Azul Oceano',
    desc: 'Profundidade e calma marítima',
    primary: '#03045E',
    secondary: '#0077B6',
    accent: '#00B4D8',
  },
  {
    id: 'coral-vibrante',
    label: 'Coral Vibrante',
    desc: 'Energia e alegria em tons quentes',
    primary: '#7B2D00',
    secondary: '#E85D04',
    accent: '#F9C74F',
  },
];

function FontCard({ font, selected, onSelect, size }) {
  useEffect(() => { ensureFontLoaded(font.id); }, [font.id]);

  return (
    <button
      type="button"
      onClick={() => onSelect(font.id)}
      className={`relative p-3 rounded-lg border-2 text-left transition-all cursor-pointer hover:border-accent/60 ${
        selected ? 'border-accent bg-accent/5' : 'border-border bg-background'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <Check className="w-3 h-3 text-accent-foreground" />
        </span>
      )}
      <p className="text-xs text-muted-foreground mb-1.5">{font.label}</p>
      <p
        style={{ fontFamily: `'${font.id}', ${size === 'name' ? 'cursive' : 'sans-serif'}` }}
        className={size === 'name' ? 'text-xl leading-tight' : 'text-sm leading-snug'}
      >
        {font.sample}
      </p>
    </button>
  );
}

function PaletteCard({ palette, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(palette)}
      className={`relative p-3 rounded-lg border-2 text-left transition-all cursor-pointer hover:border-accent/60 ${
        selected ? 'border-accent bg-accent/5' : 'border-border bg-background'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <Check className="w-3 h-3 text-accent-foreground" />
        </span>
      )}
      <div className="flex gap-1.5 mb-2.5">
        <span className="w-7 h-7 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: palette.primary }} />
        <span className="w-7 h-7 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: palette.secondary }} />
        <span className="w-7 h-7 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: palette.accent }} />
      </div>
      <p className="text-sm font-medium leading-tight">{palette.label}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{palette.desc}</p>
    </button>
  );
}

const defaultData = {
  site_title: '',
  site_description: '',
  primary_color: '#3D1F14',
  secondary_color: '#C4634A',
  accent_color: '#C4954A',
  body_font: 'Roboto',
  name_font: 'Dancing Script',
  whatsapp_number: '',
  whatsapp_enabled: true,
};

export default function AdminConfigPage() {
  const { formData, loading, saving, handleChange, save } = useAdminPreview('site_config', defaultData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await save((data) => data);
    if (success) {
      const root = document.documentElement;
      if (formData.primary_color) {
        root.style.setProperty('--primary', hexToHSL(formData.primary_color));
        root.style.setProperty('--primary-foreground', getContrastForeground(formData.primary_color));
      }
      if (formData.secondary_color) {
        root.style.setProperty('--secondary', hexToHSL(formData.secondary_color));
        root.style.setProperty('--secondary-foreground', getContrastForeground(formData.secondary_color));
      }
      if (formData.accent_color) {
        root.style.setProperty('--accent', hexToHSL(formData.accent_color));
        root.style.setProperty('--accent-foreground', getContrastForeground(formData.accent_color));
        root.style.setProperty('--ring', hexToHSL(formData.accent_color));
      }
      if (formData.body_font) {
        ensureFontLoaded(formData.body_font);
        root.style.setProperty('--body-font', `'${formData.body_font}', sans-serif`);
      }
      if (formData.name_font) {
        ensureFontLoaded(formData.name_font);
        root.style.setProperty('--name-font-family', `'${formData.name_font}', cursive`);
      }
    }
  };

  const selectedPalette = PALETTES.find(p =>
    p.primary === formData.primary_color &&
    p.secondary === formData.secondary_color &&
    p.accent === formData.accent_color
  );

  const handlePaletteSelect = (palette) => {
    handleChange({ target: { id: 'primary_color', value: palette.primary } });
    handleChange({ target: { id: 'secondary_color', value: palette.secondary } });
    handleChange({ target: { id: 'accent_color', value: palette.accent } });
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando configurações...</div>;

  return (
    <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto custom-scrollbar">
    <div className="p-6 max-w-4xl mx-auto pb-6">
      <h1 className="text-3xl font-bold mb-8 text-accent">Configurações do Site</h1>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Informações gerais */}
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
          <div className="space-y-4">
            <FormField label="Título do Site" id="site_title" value={formData.site_title} onChange={handleChange} />
            <FormTextarea label="Descrição do Site" id="site_description" value={formData.site_description} onChange={handleChange} />
          </div>
        </div>

        {/* Paleta de Cores */}
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-1">Paleta de Cores</h2>
          <p className="text-sm text-muted-foreground mb-4">Escolha uma paleta pré-definida para o site inteiro.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {PALETTES.map(p => (
              <PaletteCard
                key={p.id}
                palette={p}
                selected={selectedPalette?.id === p.id}
                onSelect={handlePaletteSelect}
              />
            ))}
          </div>

          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-1 select-none">
              <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
              Ajuste fino de cores
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              {[
                { id: 'primary_color', label: 'Cor Primária' },
                { id: 'secondary_color', label: 'Cor Secundária' },
                { id: 'accent_color', label: 'Cor de Destaque' },
              ].map(({ id, label }) => (
                <label key={id} className="space-y-1.5">
                  <span className="text-sm font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id={id}
                      value={formData[id] || '#000000'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer border border-border p-0.5 bg-background"
                    />
                    <span className="text-sm text-muted-foreground font-mono">{formData[id]}</span>
                  </div>
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Fonte do Corpo */}
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-1">Fonte do Site</h2>
          <p className="text-sm text-muted-foreground mb-4">Usada em textos, parágrafos e navegação.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BODY_FONTS.map(font => (
              <FontCard
                key={font.id}
                font={font}
                size="body"
                selected={formData.body_font === font.id}
                onSelect={(id) => {
                  handleChange({ target: { id: 'body_font', value: id } });
                  ensureFontLoaded(id);
                  document.documentElement.style.setProperty('--body-font', `'${id}', sans-serif`);
                }}
              />
            ))}
          </div>
        </div>

        {/* Fonte do Nome */}
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-1">Fonte do Nome</h2>
          <p className="text-sm text-muted-foreground mb-4">Aparece no cabeçalho onde está escrito o nome do site.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {NAME_FONTS.map(font => (
              <FontCard
                key={font.id}
                font={font}
                size="name"
                selected={formData.name_font === font.id}
                onSelect={(id) => {
                  handleChange({ target: { id: 'name_font', value: id } });
                  ensureFontLoaded(id);
                  document.documentElement.style.setProperty('--name-font-family', `'${id}', cursive`);
                }}
              />
            ))}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="admin-section">
          <h2 className="text-xl font-semibold mb-1">Botão WhatsApp</h2>
          <p className="text-sm text-muted-foreground mb-4">Botão flutuante que aparece em todas as páginas do site.</p>
          <div className="space-y-4">
            <FormField
              label="Número do WhatsApp (com código de país)"
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="+5561969811976"
            />
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="whatsapp_enabled"
                checked={!!formData.whatsapp_enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
              />
              <span className="text-sm font-medium">Exibir botão WhatsApp no site</span>
            </label>
          </div>
        </div>

      </form>
    </div>
    </div>
    {/* Footer fixo fora da área de scroll */}
    <div className="flex justify-end gap-4 p-4 border-t border-border bg-card flex-shrink-0">
      <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </div>
    </div>
  );
}
