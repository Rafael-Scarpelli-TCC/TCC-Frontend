import api from './api.jsx';

export const criarSetor = (data) => api.post('/setores', data);
export const listarSetores = () => api.get('/setores');
export const atualizarSetor = (id, data) => api.patch(`/setores/${id}`, data);
export const deletarSetor = (id) => api.delete(`/setores/${id}`);