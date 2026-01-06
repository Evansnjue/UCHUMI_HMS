import api from '../auth/api';

export const createEmployee = (payload: any) => api.post('/hr/employees', payload).then((r) => r.data);
export const getEmployee = (id: string) => api.get(`/hr/employees/${id}`).then((r) => r.data);
export const checkIn = (payload: any) => api.post('/hr/attendance/checkin', payload).then((r) => r.data);
export const checkOut = (payload: any) => api.post('/hr/attendance/checkout', payload).then((r) => r.data);
export const generatePayroll = (payload: any) => api.post('/hr/payroll/generate', payload).then((r) => r.data);
export const attendanceReport = (start: string, end: string) => api.get(`/hr/attendance/report?start=${start}&end=${end}`).then((r) => r.data);
