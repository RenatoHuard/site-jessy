import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, ChevronLeft, Instagram } from 'lucide-react';
import { fetchEventById } from '@/lib/respiraClient.js';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function RespiraEventoDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3D1F14] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C4634A]/30 border-t-[#C4634A] animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#3D1F14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#DEB896]/60">Evento não encontrado.</p>
        <Link to="/respira-preta/eventos" className="text-[#E8B89A] hover:underline text-sm">
          ← Ver todos os eventos
        </Link>
      </div>
    );
  }

  const schedule = Array.isArray(event.schedule) ? event.schedule : [];
  const includes = Array.isArray(event.includes) ? event.includes : [];
  const collaborators = Array.isArray(event.collaborators) ? event.collaborators : [];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative pt-10 pb-16 px-6 overflow-hidden" style={{ backgroundColor: '#3D1F14' }}>
        {event.image_url ? (
          <div className="absolute inset-0">
            <img src={event.image_url} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#3D1F14]/60 via-[#3D1F14]/80 to-[#3D1F14]" />
          </div>
        ) : (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url(/respira-preta/grafismos/RP_grafismo2_ondas_respiracao.png)',
              backgroundSize: '400px',
            }}
          />
        )}

        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            to="/respira-preta/eventos"
            className="inline-flex items-center gap-1 text-[#DEB896]/50 hover:text-[#DEB896] text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Todos os eventos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {event.edition && (
              <span className="text-[#C4634A] text-xs tracking-widest uppercase font-medium">{event.edition}</span>
            )}
            <h1 className="display-font text-5xl md:text-6xl italic text-[#E8B89A] mt-2 mb-2">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-[#DEB896]/60 text-sm tracking-widest uppercase">{event.subtitle}</p>
            )}

            <div className="flex flex-wrap gap-5 mt-8 text-sm text-[#DEB896]/75">
              {event.date && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C4634A]" />
                  {formatDate(event.date)}
                </span>
              )}
              {event.start_time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C4634A]" />
                  {event.start_time.slice(0, 5)}{event.end_time ? ` às ${event.end_time.slice(0, 5)}` : ''}
                </span>
              )}
              {event.location_name && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C4634A]" />
                  {event.location_name}
                  {event.location_instagram && (
                    <a
                      href={`https://instagram.com/${event.location_instagram}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[#C4634A] hover:underline"
                    >
                      @{event.location_instagram}
                    </a>
                  )}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-[#4A2318]">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

          {/* Descrição */}
          {event.description && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="display-font text-3xl italic text-[#E8B89A] mb-5">Sobre o encontro</h2>
              <div className="text-[#DEB896]/75 leading-relaxed space-y-4">
                {event.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.section>
          )}

          {/* Programação */}
          {schedule.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="display-font text-3xl italic text-[#E8B89A] mb-8">Nossa manhã</h2>
              <div className="relative pl-6 border-l border-[#5C2D1E] space-y-8">
                {schedule.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[#C4634A] border-2 border-[#4A2318]" />
                    <span className="text-[#C4634A] text-xs font-mono font-medium tracking-widest">{item.time}</span>
                    <h3 className="text-[#F5EDE4] font-medium mt-1 mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-[#DEB896]/60 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* O que está incluso */}
          {includes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="display-font text-3xl italic text-[#E8B89A] mb-6">O que está incluso</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#DEB896]/75 text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-[#C4634A]/20 flex-shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4634A]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Colaboradores */}
          {collaborators.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="display-font text-3xl italic text-[#E8B89A] mb-6">Em colaboração</h2>
              <div className="flex flex-wrap gap-4">
                {collaborators.map((c, i) => (
                  <a
                    key={i}
                    href={`https://instagram.com/${c.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#5C2D1E] bg-[#3D1F14] hover:border-[#C4634A]/50 transition-colors group"
                  >
                    <Instagram className="w-4 h-4 text-[#C4634A] group-hover:text-[#E8B89A] transition-colors" />
                    <div>
                      <p className="text-[#F5EDE4] text-sm font-medium">@{c.instagram}</p>
                      {c.role && <p className="text-[#DEB896]/50 text-xs">{c.role}</p>}
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {/* Spotify */}
          {event.spotify_link && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="display-font text-3xl italic text-[#E8B89A] mb-5">Playlist do encontro</h2>
              <a
                href={event.spotify_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[#5C2D1E] bg-[#3D1F14] hover:border-[#C4634A]/50 transition-colors group"
              >
                <Music className="w-5 h-5 text-[#C4634A]" />
                <span className="text-[#DEB896]/75 group-hover:text-[#E8B89A] text-sm transition-colors">
                  Ouvir no Spotify
                </span>
              </a>
            </motion.section>
          )}

          {/* CTA */}
          {event.registration_link && (
            <div className="text-center py-8 border-t border-[#5C2D1E]">
              <img src="/respira-preta/svg/RP_simbolo_lotus3_claro.svg" alt="" className="h-12 mx-auto mb-4 opacity-40" />
              <h3 className="display-font text-3xl italic text-[#E8B89A] mb-3">Pronta para participar?</h3>
              <p className="text-[#DEB896]/50 text-sm mb-6">Reserve o seu espaço.</p>
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-[#C4634A] hover:bg-[#B05438] text-white rounded-full font-medium text-sm tracking-wide transition-colors"
              >
                Inscrever-se
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
