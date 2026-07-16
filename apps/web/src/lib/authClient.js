const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const STORAGE_KEY = 'sb-session';

let _session = null;

const saveSession = (session) => {
  _session = session;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
};

const loadSession = () => {
  if (_session) return _session;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) _session = JSON.parse(raw);
  } catch (_) {}
  return _session;
};

const isTokenExpired = (session) => {
  if (!session?.expires_at) return false;
  return Date.now() / 1000 > session.expires_at - 60; // 60s de margem
};

const refreshSession = async () => {
  const session = loadSession();
  if (!session?.refresh_token) return null;
  try {
    const res = await window.fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!res.ok) { saveSession(null); return null; }
    const data = await res.json();
    saveSession(data);
    return data;
  } catch (_) { return null; }
};

const getValidSession = async () => {
  const session = loadSession();
  if (!session) return null;
  if (isTokenExpired(session)) return await refreshSession();
  return session;
};

export const authSignIn = async (email, password) => {
  const res = await window.fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login falhou');
  saveSession(data);
  return data;
};

export const authSignUp = async (email, password, metadata = {}) => {
  const res = await window.fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ email, password, data: metadata }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Cadastro falhou');
  if (data.access_token) saveSession(data);
  return data;
};

export const authSignOut = async () => {
  const session = loadSession();
  if (session?.access_token) {
    await window.fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${session.access_token}` },
    }).catch(() => {});
  }
  saveSession(null);
};

export const authGetSession = loadSession;
export const authGetUser = () => loadSession()?.user || null;

export const fetchProfile = async (userId) => {
  try {
    const session = await getValidSession();
    const token = session?.access_token || SUPABASE_KEY;
    const res = await window.fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.error('fetchProfile error:', e);
    return null;
  }
};

// Exporta getValidSession para uso no dbClient
export { getValidSession };
