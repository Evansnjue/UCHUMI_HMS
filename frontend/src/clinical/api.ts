import api from '../auth/api';

export async function listDrugCategories() { const res = await api.get('/clinical/admin/drug-categories'); return res.data; }
export async function createDrugCategory(payload: any) { const res = await api.post('/clinical/admin/drug-categories', payload); return res.data; }
export async function setDoctorLimit(payload: any) { const res = await api.post('/clinical/admin/doctor-limits', payload); return res.data; }
export async function getDoctorLimits(doctorId: string) { const res = await api.get(`/clinical/admin/doctor-limits/${doctorId}`); return res.data; }
