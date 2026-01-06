import api from '../auth/api';

export async function registerPatient(payload: any) {
  const res = await api.post('/patients', payload);
  return res.data;
}

export async function searchPatients(query?: string, department?: string) {
  const params: any = {};
  if (query) params.query = query;
  if (department) params.department = department;
  const res = await api.get('/patients', { params });
  return res.data;
}

export async function getPatient(id: string) {
  const res = await api.get(`/patients/${id}`);
  return res.data;
}
