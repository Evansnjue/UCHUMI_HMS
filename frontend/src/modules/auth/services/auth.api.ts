import axios from '../../app/api/axios';
import { AuthResponse } from '../types/auth.types';

export const login = async (payload: { email: string; password: string }) => {
  const res = await axios.post<AuthResponse>('/auth/login', payload, { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  await axios.post('/auth/logout', {}, { withCredentials: true });
};

export const resetPassword = async (payload: { email: string }) => {
  await axios.post('/auth/reset', payload);
};

export const refreshToken = async () => {
  const res = await axios.post<AuthResponse>('/auth/refresh', {}, { withCredentials: true });
  return res.data;
};
