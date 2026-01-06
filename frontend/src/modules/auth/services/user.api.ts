import axios from '../../app/api/axios';
import { User } from '../types/auth.types';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get('/users');
  return res.data;
};

export const updateUser = async (id: string, payload: Partial<User>) => {
  const res = await axios.put(`/users/${id}`, payload);
  return res.data;
};
