import axios from '../utils/axios';

export const listStock = (limit = 100, offset = 0) => axios.get(`/pharmacy/stock?limit=${limit}&offset=${offset}`).then((r) => r.data);
export const adjustStock = (id: string, delta: number, reason: string) => axios.post(`/pharmacy/stock/${id}/adjust`, { delta, reason }).then((r) => r.data);
