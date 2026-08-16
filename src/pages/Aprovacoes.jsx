import { useState, useEffect } from 'react';
import { listarSolicitacoesAprovador, aprovarRejeitarSolicitacao, editarSolicitacao } from '../services/solicitacaoService.jsx';
import Button from '../components/ui/Button.jsx';

export default function Aprovacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [editando, setEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const res = await listarSolicitacoesAprovador({ status: 'PENDENTE' });
      setSolicitacoes(res.data.solicitacoes);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleDecisao = async (solicitacaoId, decisao) => {
    try {
      setProcessando(solicitacaoId);
      await aprovarRejeitarSolicitacao(solicitacaoId, {
        decisao,
        comentario: comentarios[solicitacaoId] || '',
      });
      await buscarSolicitacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessando(null);
    }
  };

  const handleIniciarEdicao = (sol) => {
    setEditando(sol._id);
    setFormEdicao({
      quantidade: sol.quantidade,
      grauPrioridade: sol.grauPrioridade,
      dataDesejadaAquisicao: sol.dataDesejadaAquisicao ? new Date(sol.dataDesejadaAquisicao).toISOString().split('T')[0] : '',
      justificativa: sol.justificativa || '',
    });
  };

  const handleSalvarEdicao = async (solicitacaoId) => {
    try {
      setSalvando(true);
      await editarSolicitacao(solicitacaoId, formEdicao);
      setEditando(null);
      await buscarSolicitacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const prioridadeCor = {
    ALTA:  { background: 'var(--red-bg)',   color: 'var(--red-dk)',   border: '1px solid var(--red-bd)' },
    MEDIA: { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
    BAIXA: { background: 'var(--green-bg)', color: 'var(--green-dk)', border: '1px solid var(--green-bd)' },
  };

  const inputStyle = {
    width: '100%', padding: '7px 10px', fontSize: '12px',
    border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
    background: 'var(--bg)', color: 'var(--text)',
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          Aprovações
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Analise e decida sobre as solicitações pendentes
        </p>
      </div>

      {carregando ? (
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando...</p>
      ) : solicitacoes.length === 0 ? (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '32px',
          textAlign: 'center', color: 'var(--text3)', fontSize: '12px',
        }}>
          Nenhuma solicitação pendente.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {solicitacoes.map(sol => (
            <div key={sol._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      {sol.descricao}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span>Qtd: {sol.quantidade}</span>
                      <span>Unidade: {sol.unidadeFornecimento || '—'}</span>
                      {sol.setor?.nome && <span>Setor: {sol.setor.nome}</span>}
                      {sol.solicitante?.nome && <span>Solicitante: {sol.solicitante.nome}</span>}
                      <span>{new Date(sol.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  {sol.grauPrioridade && (
                    <span style={{
                      ...prioridadeCor[sol.grauPrioridade],
                      fontSize: '10px', fontWeight: 600,
                      borderRadius: '4px', padding: '2px 8px', whiteSpace: 'nowrap',
                    }}>
                      {sol.grauPrioridade}
                    </span>
                  )}
                </div>

                {sol.justificativa && editando !== sol._id && (
                  <div style={{
                    fontSize: '11px', color: 'var(--text2)',
                    background: 'var(--bg3)', borderRadius: 'var(--radius)',
                    padding: '8px 10px', marginBottom: '10px',
                  }}>
                    <strong>Justificativa:</strong> {sol.justificativa}
                  </div>
                )}

                {editando === sol._id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px', background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Quantidade</label>
                        <input type="number" min="1" value={formEdicao.quantidade}
                          onChange={e => setFormEdicao({ ...formEdicao, quantidade: parseInt(e.target.value) || 1 })}
                          style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Prioridade</label>
                        <select value={formEdicao.grauPrioridade}
                          onChange={e => setFormEdicao({ ...formEdicao, grauPrioridade: e.target.value })}
                          style={inputStyle}>
                          <option value="BAIXA">Baixa</option>
                          <option value="MEDIA">Média</option>
                          <option value="ALTA">Alta</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Data Desejada</label>
                        <input type="date" value={formEdicao.dataDesejadaAquisicao}
                          onChange={e => setFormEdicao({ ...formEdicao, dataDesejadaAquisicao: e.target.value })}
                          style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="default" onClick={() => setEditando(null)}>Cancelar</Button>
                      <Button variant="primary" onClick={() => handleSalvarEdicao(sol._id)} disabled={salvando}>
                        {salvando ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
                        Comentário (opcional)
                      </label>
                      <input
                        value={comentarios[sol._id] || ''}
                        onChange={e => setComentarios(prev => ({ ...prev, [sol._id]: e.target.value }))}
                        placeholder="Adicione um comentário..."
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="default" onClick={() => handleIniciarEdicao(sol)}>
                        Editar
                      </Button>
                      <Button variant="danger" disabled={processando === sol._id} onClick={() => handleDecisao(sol._id, false)}>
                        Reprovar
                      </Button>
                      <Button variant="success" disabled={processando === sol._id} onClick={() => handleDecisao(sol._id, true)}>
                        Aprovar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}