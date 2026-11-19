import React from 'react';
import { Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminPreview } from '@/hooks/useAdminPreview';

const defaultData = {
  hero_tagline: 'Um espaço sagrado para respirar, sentir e cuidar de si.',
  project_title: 'O que é o Respira, Preta?',
  project_text: 'Um encontro de yoga, afeto e descanso criado especialmente para mulheres negras. Um espaço onde cada respiração é um ato de cuidado, resistência e reconexão com a própria essência.',
  pillar1_title: 'Respiração',
  pillar1_text: 'Técnicas de pranayama adaptadas para reconectar com o próprio corpo e acalmar a mente.',
  pillar2_title: 'Afeto',
  pillar2_text: 'Um espaço seguro construído com cuidado, escuta ativa e acolhimento mútuo.',
  pillar3_title: 'Descanso',
  pillar3_text: 'Encontros criados para que você simplesmente seja — sem pressa, sem cobranças.',
  cta_title: 'Pronta para respirar?',
  cta_text: 'Confira os próximos encontros e reserve o seu espaço.',
  cta_button_text: 'Ver Eventos',
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

export default function AdminRespiraHomePage() {
  const { formData, handleChange, loading, saving, save } = useAdminPreview('respira_home_content', defaultData);

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
                  <p className="text-sm font-medium" style={{ color: '#F5EDE4' }}>Página Inicial</p>
                </div>
              </div>
              <Link
                to="/respira-preta"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors"
                style={{ borderColor: '#5C2D1E', color: '#DEB896' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver
              </Link>
            </div>
          </div>

          <RpSection title="Hero — Tagline">
            <div>
              <RpLabel>Tagline (texto abaixo do logo)</RpLabel>
              <RpTextarea name="hero_tagline" value={formData.hero_tagline} onChange={handleChange} placeholder="Um espaço sagrado para respirar..." rows={2} />
            </div>
          </RpSection>

          <RpSection title="Seção: O que é o Respira, Preta?">
            <div>
              <RpLabel>Título</RpLabel>
              <RpInput name="project_title" value={formData.project_title} onChange={handleChange} placeholder="O que é o Respira, Preta?" />
            </div>
            <div>
              <RpLabel>Texto</RpLabel>
              <RpTextarea name="project_text" value={formData.project_text} onChange={handleChange} placeholder="Descrição do projeto..." rows={4} />
            </div>
          </RpSection>

          <RpSection title="Pilares (3 cards)">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-3">
                {n > 1 && <div className="border-t" style={{ borderColor: '#5C2D1E' }} />}
                <p className="text-xs" style={{ color: '#C4634A' }}>Pilar {n}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <RpLabel>Título</RpLabel>
                    <RpInput name={`pillar${n}_title`} value={formData[`pillar${n}_title`]} onChange={handleChange} placeholder="Título" />
                  </div>
                  <div>
                    <RpLabel>Texto</RpLabel>
                    <RpInput name={`pillar${n}_text`} value={formData[`pillar${n}_text`]} onChange={handleChange} placeholder="Descrição..." />
                  </div>
                </div>
              </div>
            ))}
          </RpSection>

          <RpSection title="Seção: CTA Final">
            <div>
              <RpLabel>Título</RpLabel>
              <RpInput name="cta_title" value={formData.cta_title} onChange={handleChange} placeholder="Pronta para respirar?" />
            </div>
            <div>
              <RpLabel>Subtítulo</RpLabel>
              <RpInput name="cta_text" value={formData.cta_text} onChange={handleChange} placeholder="Confira os próximos encontros..." />
            </div>
            <div>
              <RpLabel>Texto do botão</RpLabel>
              <RpInput name="cta_button_text" value={formData.cta_button_text} onChange={handleChange} placeholder="Ver Eventos" />
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
