import React from 'react';
import { Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminPreview } from '@/hooks/useAdminPreview';

const defaultData = {
  hero_title: 'Sobre o Respira, Preta',
  hero_subtitle: 'Nascido do desejo de criar um espaço genuinamente acolhedor para mulheres negras praticarem yoga e cuidarem de si.',
  section1_title: 'A origem',
  section1_text: 'O Respira, Preta nasce da intersecção entre a prática do yoga e o cuidado com a ancestralidade. Criado por Jéssica Rayane, o projeto oferece encontros onde o corpo negro é celebrado, acolhido e convidado a descansar — sem pressa, sem julgamentos.',
  section2_title: 'O espaço',
  section2_text: 'Cada encontro é pensado com cuidado: a música, o silêncio, as palavras e os movimentos são escolhidos para criar uma experiência completa de autocuidado. Um espaço onde você pode simplesmente ser.',
  section3_title: 'Para quem é',
  section3_text: 'Para mulheres negras que buscam um espaço genuinamente acolhedor para praticar yoga, descansar e se conectar com outras mulheres em um ambiente seguro, respeitoso e cheio de afeto.',
  quote: '"Respira, Preta" é mais que um evento. É um convite.',
};

function RpLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#DEB896' }}>
      {children}
    </label>
  );
}

function RpInput({ name, value, onChange, placeholder }) {
  return (
    <input
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
      style={{ background: '#2A1409', borderColor: '#5C2D1E', color: '#F5EDE4', '--tw-ring-color': '#C4634A' }}
    />
  );
}

function RpTextarea({ name, value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg border text-sm resize-y focus:outline-none focus:ring-2"
      style={{ background: '#2A1409', borderColor: '#5C2D1E', color: '#F5EDE4', '--tw-ring-color': '#C4634A' }}
    />
  );
}

function RpSection({ title, children }) {
  return (
    <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: '#5C2D1E', background: 'rgba(61,31,20,0.4)' }}>
      <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#E8B89A' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function AdminRespiraSobrePage() {
  const { formData, handleChange, loading, saving, save } = useAdminPreview('respira_sobre_content', defaultData);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#1E0E06' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-[#C4634A] border-[#5C2D1E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#1E0E06' }}>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto p-6 space-y-6">

          {/* Header Respira Preta */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#3D1F14' }}>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-11" />
                <div>
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#DEB896', opacity: 0.6 }}>Editar</p>
                  <p className="text-sm font-medium" style={{ color: '#F5EDE4' }}>Página Sobre</p>
                </div>
              </div>
              <Link
                to="/respira-preta/sobre"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors"
                style={{ borderColor: '#5C2D1E', color: '#DEB896' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver
              </Link>
            </div>
          </div>

          <RpSection title="Hero">
            <div>
              <RpLabel>Título</RpLabel>
              <RpInput name="hero_title" value={formData.hero_title} onChange={handleChange} placeholder="Sobre o Respira, Preta" />
            </div>
            <div>
              <RpLabel>Subtítulo</RpLabel>
              <RpTextarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} placeholder="Nascido do desejo de criar..." rows={2} />
            </div>
          </RpSection>

          {[1, 2, 3].map(n => (
            <RpSection key={n} title={`Seção ${n}: ${formData[`section${n}_title`] || `Seção ${n}`}`}>
              <div>
                <RpLabel>Título</RpLabel>
                <RpInput name={`section${n}_title`} value={formData[`section${n}_title`]} onChange={handleChange} placeholder="Título da seção" />
              </div>
              <div>
                <RpLabel>Texto</RpLabel>
                <RpTextarea name={`section${n}_text`} value={formData[`section${n}_text`]} onChange={handleChange} placeholder="Texto da seção..." rows={4} />
              </div>
            </RpSection>
          ))}

          <RpSection title="Citação final (selo)">
            <div>
              <RpLabel>Texto da citação</RpLabel>
              <RpInput name="quote" value={formData.quote} onChange={handleChange} placeholder='"Respira, Preta" é mais que um evento...' />
            </div>
          </RpSection>

        </div>
      </div>

      {/* Footer fixo fora do scroll */}
      <div className="flex justify-end p-4 flex-shrink-0" style={{ borderTop: '1px solid #3D1F14', background: '#0F0704' }}>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          style={{ background: '#C4634A', color: 'white' }}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  );
}
