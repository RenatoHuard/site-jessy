const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const baseHeaders = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
};

const authHeaders = (token) => ({
  ...baseHeaders,
  Authorization: `Bearer ${token || SUPABASE_KEY}`,
});

// ── Public ──────────────────────────────────────────────────

export async function fetchPublishedEvents() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/respira_events?is_published=eq.true&order=date.asc`,
    { headers: authHeaders() }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchEventById(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/respira_events?id=eq.${id}&is_published=eq.true`,
    { headers: authHeaders() }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

// ── Admin ────────────────────────────────────────────────────

export async function fetchAllEvents(token) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/respira_events?order=date.desc`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error('Erro ao buscar eventos');
  return res.json();
}

export async function createEvent(data, token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/respira_events`, {
    method: 'POST',
    headers: { ...authHeaders(token), Prefer: 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erro ao criar evento');
  }
  const result = await res.json();
  return result[0];
}

export async function updateEvent(id, data, token) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/respira_events?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: { ...authHeaders(token), Prefer: 'return=representation' },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erro ao atualizar evento');
  }
  const result = await res.json();
  return result[0];
}

export async function deleteEvent(id, token) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/respira_events?id=eq.${id}`,
    { method: 'DELETE', headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error('Erro ao deletar evento');
}
