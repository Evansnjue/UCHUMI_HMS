import api from '../auth/api';

export async function createVisit(payload: any) {
  const res = await api.post('/visits', payload);
  return res.data;
}

export async function completeVisit(id: string) {
  const res = await api.post(`/visits/${id}/complete`);
  return res.data;
}

export async function getQueue(department: string) {
  const res = await api.get(`/visits/queue/${department}`);
  return res.data;
}

export async function nextInQueue(department: string) {
  const res = await api.post(`/visits/queue/${department}/next`);
  return res.data;
}

export async function visitHistoryForPatient(patientId: string) {
  const res = await api.get(`/visits/patient/${patientId}/history`);
  return res.data;
}
