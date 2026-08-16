import api from './api';

export const listarItens = (params) => api.get('/itens', { params });