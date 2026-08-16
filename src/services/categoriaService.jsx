import api from './api.jsx';

export const criarCategoria = (data) => api.post('/categorias', data);
export const listarCategorias = () => api.get('/categorias');
export const deletarCategoria = (id) => api.delete(`/categorias/${id}`);