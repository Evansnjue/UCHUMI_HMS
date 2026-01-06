import axios from '../utils/axios';

export const listPendingPrescriptions = (limit = 50, offset = 0) => axios.get(`/pharmacy/prescriptions?limit=${limit}&offset=${offset}`).then((r) => r.data);
export const getPrescription = (id: string) => axios.get(`/pharmacy/prescriptions/${id}`).then((r) => r.data);
export const fulfillPrescription = (id: string, items: { prescriptionItemId: string; quantity: number }[]) => axios.post(`/pharmacy/prescriptions/${id}/fulfill`, { items }).then((r) => r.data);
