import { getValidSession } from '@/lib/authClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getToken = async () => {
  try {
    const session = await getValidSession();
    if (session?.access_token) return session.access_token;
    // Fallback: formato SDK legado
    const projectRef = SUPABASE_URL?.split('//')[1]?.split('.')[0];
    if (projectRef) {
      const raw = window.localStorage.getItem(`sb-${projectRef}-auth-token`);
      if (raw) return JSON.parse(raw)?.access_token;
    }
  } catch (_) {}
  return null;
};

const getHeaders = async (withAuth = false) => {
  const token = withAuth ? ((await getToken()) || SUPABASE_KEY) : SUPABASE_KEY;
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const dbGet = async (table, params = {}) => {
  const query = new URLSearchParams({ select: '*', limit: '1', ...params });
  const res = await window.fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: await getHeaders(),
  });
  if (!res.ok) throw new Error(`${table} GET: ${res.status}`);
  return res.json();
};

export const dbUpdate = async (table, id, data) => {
  const res = await window.fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...(await getHeaders(true)), 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${table} PATCH: ${res.status}`);
  return res.json();
};

export const dbInsert = async (table, data) => {
  const res = await window.fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...(await getHeaders(true)), 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${table} POST: ${res.status}`);
  return res.json();
};

// Helper para uploads autenticados (Storage)
export const getAuthToken = async () => (await getToken()) || SUPABASE_KEY;
