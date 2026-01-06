import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000' });

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { accessToken }
}

export async function getProfile(token: string) {
  const res = await api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function setUserRoles(id: string, roles: string[], token: string) {
  const res = await api.post(`/auth/admin/users/${id}/roles`, { roles }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export default api;
