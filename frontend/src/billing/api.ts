import axios from '../utils/axios';

export const createInvoice = (payload: any) => axios.post('/billing/invoices', payload).then((r) => r.data);
export const getInvoice = (id: string) => axios.get(`/billing/invoices/${id}`).then((r) => r.data);
export const listInvoices = (limit = 50, offset = 0) => axios.get(`/billing/invoices?limit=${limit}&offset=${offset}`).then((r) => r.data);
export const payInvoice = (id: string, payload: any) => axios.post(`/billing/invoices/${id}/payments`, payload).then((r) => r.data);
export const revenueReport = (period: 'day'|'week'|'month' = 'day') => axios.get(`/billing/reports/revenue?period=${period}`).then((r) => r.data);
