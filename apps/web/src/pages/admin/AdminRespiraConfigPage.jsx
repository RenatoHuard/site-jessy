import React from 'react';
import { Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminPreview } from '@/hooks/useAdminPreview';

const defaultData = {
  whatsapp_number: '+5561969811976',
  whatsapp_enabled: true,
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

function RpSection({ title, desc, children }) {
  return (
    <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: '#5C2D1E', background: 'rgba(61,31,20,0.4)' }}>
      <div>
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#E8B89A' }}>{title}</h3>
        {desc && <p className="text-xs mt-0.5" style={{ color: '#DEB896', opacity: 0.6 }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminRespiraConfigPage() {
  const { formData, handleChange, loading, saving, save } = useAdminPreview('respira_config', defaultData);

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
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#DEB896', opacity: 0.6 }}>Respira, Preta</p>
                  <p className="text-sm font-medium" style={{ color: '#F5EDE4' }}>Configurações</p>
                </div>
              </div>
              <Link
                to="/respira-preta"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors"
                style={{ borderColor: '#5C2D1E', color: '#DEB896' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver site
              </Link>
            </div>
          </div>

          {/* WhatsApp */}
          <RpSection
            title="Botão WhatsApp"
            desc="Número específico para o site Respira, Preta. Aparece como botão flutuante em todas as páginas do projeto."
          >
            <div>
              <RpLabel>Número (com código de país)</RpLabel>
              <RpInput
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="+5561969811976"
              />
              <p className="text-xs mt-1" style={{ color: '#DEB896', opacity: 0.45 }}>
                Formato: +55 DDD número — ex: +5561969811976
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="whatsapp_enabled"
                checked={!!formData.whatsapp_enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: '#C4634A' }}
              />
              <span className="text-sm font-medium" style={{ color: '#F5EDE4' }}>Exibir botão WhatsApp no Respira, Preta</span>
            </label>
          </RpSection>

        </div>
      </div>

      {/* Footer fixo fora do scroll */}
      <div className="flex justify-end p-4 flex-shrink-0" style={{ borderTop: '1px solid #3D1F14', background: '#0F0704' }}>
        <button
          onClick={() => save()}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          style={{ background: '#C4634A', color: 'white' }}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
