import axios from 'axios';
import { getAccessToken, setAccessToken, clearAuth } from '../modules/auth/utils/storage';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000' });

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t && config.headers) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const resp = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
          const { accessToken } = resp.data;
          setAccessToken(accessToken);
          isRefreshing = false;
          queue.forEach((cb) => cb(accessToken));
          queue = [];
          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original);
        } catch (e) {
          isRefreshing = false;
          queue = [];
          clearAuth();
          window.location.href = '/login';
          return Promise.reject(e);
        }
      }
      return new Promise((resolve) => queue.push((token: string) => {
        original.headers.Authorization = `Bearer ${token}`;
        resolve(api(original));
      }));
    }
    return Promise.reject(err);
  }
);

export default api;
