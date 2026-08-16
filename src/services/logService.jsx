import api from './api.jsx';

export const listarLogs = (solicitacaoId) => api.get(`/logs/${solicitacaoId}`);