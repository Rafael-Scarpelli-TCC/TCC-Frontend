import { useState, useEffect, useMemo } from 'react';
import { listarSolicitacoes, cancelarSolicitacao, editarSolicitacao } from '../services/solicitacaoService.jsx';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import StatCard from '../components/ui/StatCard.jsx';

const prioridadeCor = {
  ALTA:  { background: 'var(--red-bg)',   color: 'var(--red-dk)',   border: '1px solid var(--red-bd)' },
  MEDIA: { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
  BAIXA: { background: 'var(--green-bg)', color: 'var(--green-dk)', border: '1px solid var(--green-bd)' },
};

const statusTone = {
  PENDENTE:  { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
  APROVADA:  { background: 'var(--green-bg)', color: 'var(--green-dk)', border: '1px solid var(--green-bd)' },
  REJEITADA: { background: 'var(--red-bg)',   color: 'var(--red-dk)',   border: '1px solid var(--red-bd)' },
  CANCELADA: { background: 'var(--bg3)',      color: 'var(--text2)',   border: '1px solid var(--border2)' },
};

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [selecionada, setSelecionada] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formEdicao, setFormEdicao] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const res = await listarSolicitacoes({});
      setSolicitacoes(res.data.solicitacoes);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const contagem = useMemo(() => ({
    total: solicitacoes.length,
    PENDENTE: solicitacoes.filter(s => s.status === 'PENDENTE').length,
    APROVADA: solicitacoes.filter(s => s.status === 'APROVADA').length,
    REJEITADA: solicitacoes.filter(s => s.status === 'REJEITADA').length,
    CANCELADA: solicitacoes.filter(s => s.status === 'CANCELADA').length,
  }), [solicitacoes]);

  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoes.filter(s => {
      if (filtroStatus && s.status !== filtroStatus) return false;
      if (filtroPrioridade && s.grauPrioridade !== filtroPrioridade) return false;
      if (buscaTexto && !s.descricao?.toLowerCase().includes(buscaTexto.toLowerCase())) return false;
      return true;
    });
  }, [solicitacoes, filtroStatus, filtroPrioridade, buscaTexto]);

  const handleSelecionar = (sol) => {
    setSelecionada(sol);
    setEditando(false);
  };

  const handleEditar = () => {
    setFormEdicao({
      quantidade: selecionada.quantidade,
      grauPrioridade: selecionada.grauPrioridade,
      dataDesejadaAquisicao: selecionada.dataDesejadaAquisicao ? new Date(selecionada.dataDesejadaAquisicao).toISOString().split('T')[0] : '',
      justificativa: selecionada.justificativa || '',
    });
    setEditando(true);
  };

  const handleSalvarEdicao = async () => {
    try {
      setSalvando(true);
      const res = await editarSolicitacao(selecionada._id, formEdicao);
      setSelecionada(res.data.solicitacao);
      setEditando(false);
      await buscarSolicitacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) return;
    try {
      setCancelando(true);
      await cancelarSolicitacao(selecionada._id);
      setSelecionada(null);
      await buscarSolicitacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelando(false);
    }
  };

  const statusOpcoes = ['', 'PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'];
  const statusLabels = { '': 'Todos', PENDENTE: 'Pendente', APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CANCELADA: 'Cancelada' };

  const inputStyle = {
    width: '100%', padding: '7px 10px', fontSize: '12px',
    border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
    background: 'var(--bg)', color: 'var(--text)',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
            Minhas Solicitações
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
            Acompanhe o status das suas solicitações
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/nova-solicitacao')}>
          + Fazer Solicitação
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <StatCard label="Total" value={contagem.total}
          active={filtroStatus === ''} onClick={() => setFiltroStatus('')} />
        <StatCard label="Pendentes" value={contagem.PENDENTE} tone={statusTone.PENDENTE}
          active={filtroStatus === 'PENDENTE'} onClick={() => setFiltroStatus('PENDENTE')} />
        <StatCard label="Aprovadas" value={contagem.APROVADA} tone={statusTone.APROVADA}
          active={filtroStatus === 'APROVADA'} onClick={() => setFiltroStatus('APROVADA')} />
        <StatCard label="Rejeitadas" value={contagem.REJEITADA} tone={statusTone.REJEITADA}
          active={filtroStatus === 'REJEITADA'} onClick={() => setFiltroStatus('REJEITADA')} />
        <StatCard label="Canceladas" value={contagem.CANCELADA} tone={statusTone.CANCELADA}
          active={filtroStatus === 'CANCELADA'} onClick={() => setFiltroStatus('CANCELADA')} />
      </div>

      <div style={{ display: 'flex', gap: '12px', height: 'calc(100vh - 260px)' }}>

        {/* Lista */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={buscaTexto}
              onChange={e => setBuscaTexto(e.target.value)}
              placeholder="Buscar por descrição..."
              style={{ ...inputStyle, maxWidth: '220px' }}
            />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {statusOpcoes.map(s => (
                <button
                  key={s}
                  onClick={() => setFiltroStatus(s)}
                  style={{
                    fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: filtroStatus === s ? 'var(--blue)' : 'var(--bg3)',
                    color: filtroStatus === s ? '#fff' : 'var(--text2)',
                    cursor: 'pointer', transition: 'all .12s',
                  }}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
            <select
              value={filtroPrioridade}
              onChange={e => setFiltroPrioridade(e.target.value)}
              style={{ ...inputStyle, width: 'auto', marginLeft: 'auto' }}
            >
              <option value="">Todas prioridades</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {carregando ? (
              <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando...</p>
            ) : solicitacoesFiltradas.length === 0 ? (
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
                  {solicitacoes.length === 0 ? 'Você ainda não fez nenhuma solicitação.' : 'Nenhuma solicitação encontrada com esses filtros.'}
                </p>
                {solicitacoes.length === 0 && (
                  <Button variant="primary" onClick={() => navigate('/nova-solicitacao')}>
                    Fazer minha primeira solicitação
                  </Button>
                )}
              </div>
            ) : (
              solicitacoesFiltradas.map(sol => (
                <div
                  key={sol._id}
                  onClick={() => handleSelecionar(sol)}
                  style={{
                    background: selecionada?._id === sol._id ? 'var(--blue-bg)' : 'var(--bg2)',
                    border: `1px solid ${selecionada?._id === sol._id ? 'var(--blue-bd)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '12px 14px',
                    cursor: 'pointer', transition: 'all .12s',
                  }}
                  onMouseEnter={e => { if (selecionada?._id !== sol._id) e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: 'var(--text)',
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {sol.descricao}
                    </span>
                    <Badge status={sol.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', color: 'var(--text3)' }}>
                    <span>Qtd: {sol.quantidade}</span>
                    {sol.grauPrioridade && (
                      <span style={{
                        ...prioridadeCor[sol.grauPrioridade],
                        fontSize: '10px', fontWeight: 600,
                        borderRadius: '4px', padding: '1px 6px',
                      }}>
                        {sol.grauPrioridade}
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto' }}>
                      {new Date(sol.dataCriacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalhe */}
        <div style={{
          width: '320px', flexShrink: 0,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '18px',
          overflowY: 'auto',
        }}>
          {!selecionada ? (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <svg width="32" height="32" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center' }}>
                Selecione uma solicitação para ver os detalhes
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.4 }}>
                  {selecionada.descricao}
                </div>
                <Badge status={selecionada.status} />
              </div>

              {!editando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>INFORMAÇÕES</div>
                    {[
                      ['Quantidade', `${selecionada.quantidade} ${selecionada.unidadeFornecimento || ''}`],
                      ['Prioridade', selecionada.grauPrioridade],
                      ['Setor', selecionada.setor?.nome],
                      ['Data desejada', selecionada.dataDesejadaAquisicao ? new Date(selecionada.dataDesejadaAquisicao).toLocaleDateString('pt-BR') : null],
                      ['Valor unitário', selecionada.valorUnitarioEstimado ? `R$ ${selecionada.valorUnitarioEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null],
                      ['Valor total', selecionada.valorTotal ? `R$ ${selecionada.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null],
                      ['Tipo', selecionada.itemNovo ? 'Item novo' : 'Item da planilha'],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '11px', padding: '4px 0',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <span style={{ color: 'var(--text2)' }}>{label}</span>
                        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {selecionada.justificativa && (
                    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text2)', marginBottom: '4px' }}>JUSTIFICATIVA</div>
                      <p style={{ fontSize: '11px', color: 'var(--text)', lineHeight: 1.5 }}>{selecionada.justificativa}</p>
                    </div>
                  )}

                  {selecionada.comentario && (
                    <div style={{
                      background: selecionada.decisao ? 'var(--green-bg)' : 'var(--red-bg)',
                      border: `1px solid ${selecionada.decisao ? 'var(--green-bd)' : 'var(--red-bd)'}`,
                      borderRadius: 'var(--radius)', padding: '10px 12px',
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, marginBottom: '4px', color: selecionada.decisao ? 'var(--green-dk)' : 'var(--red-dk)' }}>
                        COMENTÁRIO DO APROVADOR
                      </div>
                      <p style={{ fontSize: '11px', lineHeight: 1.5, color: selecionada.decisao ? 'var(--green-dk)' : 'var(--red-dk)' }}>
                        {selecionada.comentario}
                      </p>
                    </div>
                  )}

                  {selecionada.status === 'PENDENTE' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <Button variant="default" onClick={handleEditar} style={{ flex: 1 }}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={handleCancelar} disabled={cancelando} style={{ flex: 1 }}>
                        {cancelando ? 'Cancelando...' : 'Cancelar'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Quantidade</label>
                    <input type="number" min="1" value={formEdicao.quantidade}
                      onChange={e => setFormEdicao({ ...formEdicao, quantidade: parseInt(e.target.value) || 1 })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Prioridade</label>
                    <select value={formEdicao.grauPrioridade}
                      onChange={e => setFormEdicao({ ...formEdicao, grauPrioridade: e.target.value })}
                      style={inputStyle}>
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Data Desejada</label>
                    <input type="date" value={formEdicao.dataDesejadaAquisicao}
                      onChange={e => setFormEdicao({ ...formEdicao, dataDesejadaAquisicao: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Justificativa</label>
                    <textarea value={formEdicao.justificativa}
                      onChange={e => setFormEdicao({ ...formEdicao, justificativa: e.target.value })}
                      rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary" onClick={handleSalvarEdicao} disabled={salvando} style={{ flex: 1 }}>
                      {salvando ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button variant="default" onClick={() => setEditando(false)} style={{ flex: 1 }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}