import api from './api.jsx';

export const importarPlanilha = (formData) =>
  api.post('/planilha/importar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const exportarPlanilha = (planilhaId) =>
  api.get(`/planilha/exportar/${planilhaId}`, { responseType: 'blob' });

export const listarPlanilhas = () => api.get('/planilha');