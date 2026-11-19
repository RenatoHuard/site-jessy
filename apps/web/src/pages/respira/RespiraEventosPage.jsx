import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { fetchPublishedEvents } from '@/lib/respiraClient.js';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function EventCard({ event, index }) {
  const isPast = event.date && new Date(event.date + 'T23:59:59') < new Date();

  return (
    <motion.div
      className="rounded-2xl border border-[#5C2D1E] bg-[#3D1F14] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Image placeholder / actual image */}
      <div className="relative h-48 bg-[#5C2D1E] overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage: 'url(/respira-preta/grafismos/RP_grafismo3_petalas.png)',
              backgroundSize: '200px',
              backgroundRepeat: 'repeat',
              opacity: 0.3,
            }}
          />
        )}
        {event.edition && (
          <span className="absolute top-3 left-3 bg-[#C4634A] text-white text-xs px-3 py-1 rounded-full font-medium">
            {event.edition}
          </span>
        )}
        {isPast && (
          <span className="absolute top-3 right-3 bg-black/50 text-[#DEB896] text-xs px-3 py-1 rounded-full">
            Encerrado
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="display-font text-2xl italic text-[#E8B89A]">{event.title}</h3>
          {event.subtitle && <p className="text-[#DEB896]/60 text-xs tracking-widest uppercase mt-1">{event.subtitle}</p>}
        </div>

        <div className="flex flex-col gap-2 text-sm text-[#DEB896]/70">
          {event.date && (
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C4634A]" />
              {formatDate(event.date)}
            </span>
          )}
          {(event.start_time || event.end_time) && (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C4634A]" />
              {event.start_time?.slice(0, 5)}{event.end_time ? ` às ${event.end_time.slice(0, 5)}` : ''}
            </span>
          )}
          {event.location_name && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4634A]" />
              {event.location_name}
              {event.location_instagram && (
                <a
                  href={`https://instagram.com/${event.location_instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C4634A] hover:underline"
                >
                  @{event.location_instagram}
                </a>
              )}
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-[#DEB896]/60 text-sm leading-relaxed line-clamp-3">
            {event.description.split('\n')[0]}
          </p>
        )}

        <div className="flex gap-3 mt-auto pt-2">
          <Link
            to={`/respira-preta/eventos/${event.id}`}
            className="flex-1 text-center py-2.5 rounded-full border border-[#DEB896]/30 hover:border-[#E8B89A] text-[#DEB896] hover:text-[#E8B89A] text-sm transition-colors"
          >
            Ver detalhes
          </Link>
          {event.registration_link && !isPast && (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-full bg-[#C4634A] hover:bg-[#B05438] text-white text-sm transition-colors font-medium"
            >
              Inscrever-se
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function RespiraEventosPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="pt-24 pb-16 px-6 text-center" style={{ backgroundColor: '#3D1F14' }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#C4634A] text-xs tracking-widest uppercase font-medium">Encontros</span>
          <h1 className="display-font text-5xl md:text-6xl italic text-[#E8B89A] mt-3 mb-4">
            Próximos Eventos
          </h1>
          <p className="text-[#DEB896]/65">
            Encontros de yoga, afeto e descanso para mulheres negras.
          </p>
        </motion.div>
      </section>

      {/* Lista */}
      <section className="py-20 px-6 bg-[#4A2318] min-h-[40vh]">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-[#C4634A]/30 border-t-[#C4634A] animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              className="text-center py-16 rounded-2xl border border-[#5C2D1E]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img src="/respira-preta/svg/RP_simbolo_lotus4_claro.svg" alt="" className="h-20 mx-auto mb-6 opacity-30" />
              <h3 className="display-font text-3xl italic text-[#E8B89A] mb-3">Em breve</h3>
              <p className="text-[#DEB896]/45 text-sm max-w-sm mx-auto leading-relaxed">
                Os próximos encontros serão divulgados em breve.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
