import api from './api.jsx';

export const criarCronograma = (data) => api.post('/cronograma', data);
export const listarCronogramas = () => api.get('/cronograma');
export const encerrarCronograma = (id) => api.patch(`/cronograma/${id}/encerrar`);
export const verificarCronogramaAberto = () => api.get('/cronograma/aberto');