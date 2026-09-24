// Session helpers. The token lives in a cookie (so middleware can read it on the
// server for route protection); the small user object lives in localStorage.
const TOKEN_KEY = 'token';
const USER_KEY = 'admin-user';
const ONE_DAY = 60 * 60 * 24;

export function getToken() {
  if (typeof document === 'undefined') return null;
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${TOKEN_KEY}=`));
  return entry ? decodeURIComponent(entry.slice(TOKEN_KEY.length + 1)) : null;
}

export function saveSession({ token, user }) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${ONE_DAY}; SameSite=Lax${secure}`;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function clearSession() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {}
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
