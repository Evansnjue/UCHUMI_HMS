import api from '../auth/api';

export const createTemplate = (payload: any) => api.post('/reporting/templates', payload).then(r => r.data);
export const listTemplates = (department?: string) => api.get(`/reporting/templates${department ? '?department=' + department : ''}`).then(r => r.data);
export const generateReport = (payload: any) => api.post('/reporting/generate', payload).then(r => r.data);
export const getReport = (id: string) => api.get(`/reporting/${id}`).then(r => r.data);
export const listReports = (department?: string, start?: string, end?: string) => api.get(`/reporting?department=${department || ''}&start=${start || ''}&end=${end || ''}`).then(r => r.data);
