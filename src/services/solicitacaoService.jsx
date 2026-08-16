import api from './api.jsx';

export const criarSolicitacao = (data) => api.post('/solicitacoes', data);
export const listarSolicitacoes = (params) => api.get('/solicitacoes', { params });
export const listarSolicitacoesAprovador = (params) => api.get('/solicitacoes/aprovador', { params });
export const aprovarRejeitarSolicitacao = (id, data) => api.patch(`/solicitacoes/${id}/decisao`, data);
export const cancelarSolicitacao = (id) => api.patch(`/solicitacoes/${id}/cancelar`);
export const editarSolicitacao = (id, data) => api.patch(`/solicitacoes/${id}/editar`, data);