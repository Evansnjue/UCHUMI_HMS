import axios from '../utils/axios';

export const listInventoryItems = (limit = 100, offset = 0) => axios.get(`/inventory/items?limit=${limit}&offset=${offset}`).then((r) => r.data);
export const getInventoryItem = (id: string) => axios.get(`/inventory/items/${id}`).then((r) => r.data);
export const addStock = (itemId: string, quantity: number, reason = '') => axios.post(`/inventory/items/add`, { itemId, quantity, reason }).then((r) => r.data);
export const removeStock = (itemId: string, quantity: number, reason = '') => axios.post(`/inventory/items/remove`, { itemId, quantity, reason }).then((r) => r.data);
export const transferStock = (itemId: string, toDepartmentId: string, quantity: number, reason = '') => axios.post(`/inventory/items/transfer`, { itemId, toDepartmentId, quantity, reason }).then((r) => r.data);
export const listLowStock = (threshold = 5) => axios.get(`/inventory/items/low?threshold=${threshold}`).then((r) => r.data);
