import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Save, ExternalLink, Upload, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { fetchAllEvents, createEvent, updateEvent, deleteEvent } from '@/lib/respiraClient.js';
import { uploadToStorage } from '@/lib/dbClient.js';
import { toast } from 'sonner';

const getToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sb-session') || 'null');
    return session?.access_token || null;
  } catch { return null; }
};

const emptyEvent = {
  title: 'Respira, Preta',
  subtitle: 'Encontro de Yoga, Afeto e Descanso',
  edition: '',
  date: '',
  start_time: '',
  end_time: '',
  location_name: '',
  location_instagram: '',
  location_address: '',
  description: '',
  image_url: '',
  spotify_link: '',
  registration_link: '',
  max_spots: '',
  is_published: false,
  includes: [],
  schedule: [],
  collaborators: [],
};

// ── Sub-components ─────────────────────────────────────────

function FieldLabel({ children }) {
  return <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{children}</label>;
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

// Dynamic list (for simple string arrays like includes)
function StringList({ label, items, onChange }) {
  const add = () => onChange([...items, '']);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, v) => onChange(items.map((item, idx) => idx === i ? v : item));

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={v => update(i, v)} placeholder="Item..." />
            <button onClick={() => remove(i)} className="text-destructive hover:text-destructive/70 flex-shrink-0 p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
          <Plus className="w-3 h-3" /> Adicionar item
        </button>
      </div>
    </div>
  );
}

// Dynamic schedule (time + title + description)
function ScheduleList({ items, onChange }) {
  const add = () => onChange([...items, { time: '', title: '', description: '' }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, v) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: v } : item));

  return (
    <div>
      <FieldLabel>Programação</FieldLabel>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
            <div className="flex gap-2">
              <div className="w-24">
                <Input value={item.time} onChange={v => update(i, 'time', v)} placeholder="09:00" />
              </div>
              <Input value={item.title} onChange={v => update(i, 'title', v)} placeholder="Título do momento" />
              <button onClick={() => remove(i)} className="text-destructive flex-shrink-0 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Input value={item.description} onChange={v => update(i, 'description', v)} placeholder="Descrição..." />
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-3 h-3" /> Adicionar momento
        </button>
      </div>
    </div>
  );
}

// Dynamic collaborators (name + instagram + role)
function CollaboratorsList({ items, onChange }) {
  const add = () => onChange([...items, { name: '', instagram: '', role: '' }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, v) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: v } : item));

  return (
    <div>
      <FieldLabel>Colaboradores / Perfis</FieldLabel>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
            <div className="flex gap-2">
              <Input value={item.instagram} onChange={v => update(i, 'instagram', v)} placeholder="instagram (sem @)" />
              <Input value={item.role} onChange={v => update(i, 'role', v)} placeholder="Papel / Função" />
              <button onClick={() => remove(i)} className="text-destructive flex-shrink-0 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-3 h-3" /> Adicionar colaborador
        </button>
      </div>
    </div>
  );
}

// Image upload + URL field
function ImageField({ value, onChange }) {
  const [uploading, setUploading] = React.useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `events/${Date.now()}.${ext}`;
      const url = await uploadToStorage('respira-events', path, file);
      onChange(url);
      toast.success('Imagem enviada!');
    } catch (err) {
      toast.error('Erro ao enviar: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-border bg-muted/20" style={{ maxHeight: 220 }}>
          <img src={value} alt="Capa" className="w-full h-full object-cover" style={{ maxHeight: 220 }} />
        </div>
      )}
      {!value && (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/10 h-28">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Nenhuma imagem</p>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <Input value={value} onChange={onChange} placeholder="https://..." />
        <label className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors whitespace-nowrap flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-4 h-4" />
          {uploading ? 'Enviando...' : 'Subir'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function AdminRespiraPage() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null); // null = list, 'new' = new form, id = edit form
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const data = await fetchAllEvents(token);
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm(emptyEvent);
    setSelected('new');
  };

  const openEdit = (event) => {
    setForm({ ...emptyEvent, ...event });
    setSelected(event.id);
  };

  const field = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        ...form,
        max_spots: form.max_spots ? parseInt(form.max_spots) : null,
        includes: form.includes,
        schedule: form.schedule,
        collaborators: form.collaborators,
      };
      if (selected === 'new') {
        await createEvent(payload, token);
        toast.success('Evento criado!');
      } else {
        await updateEvent(selected, payload, token);
        toast.success('Evento salvo!');
      }
      await load();
      setSelected(null);
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Remover este evento?')) return;
    try {
      await deleteEvent(id, getToken());
      toast.success('Evento removido');
      await load();
    } catch {
      toast.error('Erro ao remover');
    }
  };

  // ── Form view ──
  if (selected !== null) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground mb-1">
                ← Voltar
              </button>
              <h1 className="admin-title !mb-0">
                {selected === 'new' ? 'Novo Evento' : 'Editar Evento'}
              </h1>
            </div>
            <div className="flex gap-2">
              {selected !== 'new' && (
                <Link
                  to={`/respira-preta/eventos/${selected}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ver
                </Link>
              )}
              <button
                onClick={() => save()}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>

          {/* Publicado */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
            <div>
              <p className="text-sm font-medium">Status de publicação</p>
              <p className="text-xs text-muted-foreground">Eventos publicados aparecem no site.</p>
            </div>
            <button
              onClick={() => field('is_published')(!form.is_published)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                form.is_published
                  ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {form.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {form.is_published ? 'Publicado' : 'Rascunho'}
            </button>
          </div>

          {/* Identificação */}
          <div className="admin-section space-y-4">
            <h2 className="font-semibold text-sm text-foreground">Identificação</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel>Título</FieldLabel><Input value={form.title} onChange={field('title')} placeholder="Respira, Preta" /></div>
              <div><FieldLabel>Edição</FieldLabel><Input value={form.edition} onChange={field('edition')} placeholder="1ª Edição" /></div>
            </div>
            <div><FieldLabel>Subtítulo</FieldLabel><Input value={form.subtitle} onChange={field('subtitle')} placeholder="Encontro de Yoga, Afeto e Descanso" /></div>
          </div>

          {/* Data e Hora */}
          <div className="admin-section space-y-4">
            <h2 className="font-semibold text-sm text-foreground">Data e Horário</h2>
            <div className="grid grid-cols-3 gap-4">
              <div><FieldLabel>Data</FieldLabel><Input type="date" value={form.date} onChange={field('date')} /></div>
              <div><FieldLabel>Início</FieldLabel><Input type="time" value={form.start_time} onChange={field('start_time')} /></div>
              <div><FieldLabel>Término</FieldLabel><Input type="time" value={form.end_time} onChange={field('end_time')} /></div>
            </div>
          </div>

          {/* Local */}
          <div className="admin-section space-y-4">
            <h2 className="font-semibold text-sm text-foreground">Local</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel>Nome do local</FieldLabel><Input value={form.location_name} onChange={field('location_name')} placeholder="Ambâr" /></div>
              <div><FieldLabel>Instagram do local</FieldLabel><Input value={form.location_instagram} onChange={field('location_instagram')} placeholder="ambar.bsb" /></div>
            </div>
            <div><FieldLabel>Endereço</FieldLabel><Input value={form.location_address} onChange={field('location_address')} placeholder="Endereço completo..." /></div>
          </div>

          {/* Descrição */}
          <div className="admin-section">
            <h2 className="font-semibold text-sm text-foreground mb-4">Descrição</h2>
            <Textarea value={form.description} onChange={field('description')} placeholder="Descreva o evento..." rows={6} />
          </div>

          {/* Programação */}
          <div className="admin-section">
            <ScheduleList items={form.schedule} onChange={field('schedule')} />
          </div>

          {/* O que está incluso */}
          <div className="admin-section">
            <StringList label="O que está incluso" items={form.includes} onChange={field('includes')} />
          </div>

          {/* Colaboradores */}
          <div className="admin-section">
            <CollaboratorsList items={form.collaborators} onChange={field('collaborators')} />
          </div>

          {/* Imagem e Links */}
          <div className="admin-section space-y-4">
            <h2 className="font-semibold text-sm text-foreground">Imagem e Links</h2>
            <div>
              <FieldLabel>Imagem de capa</FieldLabel>
              <ImageField value={form.image_url} onChange={field('image_url')} />
            </div>
            <div><FieldLabel>Link de inscrição</FieldLabel><Input value={form.registration_link} onChange={field('registration_link')} placeholder="https://..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel>Link da playlist (Spotify)</FieldLabel><Input value={form.spotify_link} onChange={field('spotify_link')} placeholder="https://open.spotify.com/..." /></div>
              <div><FieldLabel>Vagas disponíveis</FieldLabel><Input type="number" value={form.max_spots} onChange={field('max_spots')} placeholder="Ex: 30" /></div>
            </div>
          </div>

          <div className="flex justify-end pb-8">
            <button
              onClick={() => save()}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar evento'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header com identidade Respira Preta */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#3D1F14' }}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/respira-preta/logos/RP_logo3_horizontal_bicolor_claro.png" alt="Respira, Preta" className="h-11" />
              <div>
                <p className="text-[#DEB896]/60 text-xs tracking-widest uppercase">Gestão</p>
                <p className="text-[#F5EDE4] font-medium text-sm">Eventos e Encontros</p>
              </div>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C4634A] hover:bg-[#B05438] text-white rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Novo Evento
            </button>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-2xl">
            <p className="text-muted-foreground text-sm mb-4">Nenhum evento cadastrado.</p>
            <p className="text-xs text-muted-foreground mb-6">
              Certifique-se de rodar a migração SQL no Supabase antes de criar eventos.
            </p>
            <button onClick={openNew} className="text-primary text-sm hover:underline">Criar primeiro evento →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${event.is_published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  <div>
                    <p className="font-medium text-sm">{event.title} {event.edition && `— ${event.edition}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date ? new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem data'}
                      {event.location_name && ` · ${event.location_name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/respira-preta/eventos/${event.id}`}
                    target="_blank"
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button onClick={() => openEdit(event)} className="px-4 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                    Editar
                  </button>
                  <button onClick={() => remove(event.id)} className="p-2 text-destructive hover:text-destructive/70">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
