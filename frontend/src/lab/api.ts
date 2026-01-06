import api from '../auth/api';

export async function listPending() { const res = await api.get('/lab/pending'); return res.data; }
export async function createResult(payload: any) { const res = await api.post('/lab/results', payload); return res.data; }
export async function resultsForRequest(id: string) { const res = await api.get(`/lab/request/${id}/results`); return res.data; }
