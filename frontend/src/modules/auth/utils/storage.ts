// Small storage abstraction. In production prefer memory + httpOnly refresh cookie.
const ACCESS_TOKEN_KEY = 'hms_access_token';

export const setAccessToken = (token: string) => {
  try { sessionStorage.setItem(ACCESS_TOKEN_KEY, token); } catch {} // fallback
};

export const getAccessToken = () => {
  try { return sessionStorage.getItem(ACCESS_TOKEN_KEY); } catch { return null; }
};

export const clearAuth = () => {
  try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
};
