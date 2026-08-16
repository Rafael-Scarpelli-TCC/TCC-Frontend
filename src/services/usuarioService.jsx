import api from './api.jsx';

export const login = (data) => api.post('/usuarios/login', data);
export const listarUsuarios = () => api.get('/usuarios');
export const atualizarUsuario = (id, data) => api.patch(`/usuarios/${id}`, data);
export const criarUsuario = (data) => api.post('/usuarios', data);
