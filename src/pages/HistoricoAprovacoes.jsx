import { useState, useEffect } from 'react';
import { listarSolicitacoesAprovador } from '../services/solicitacaoService.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function HistoricoAprovacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('APROVADA');
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    buscarSolicitacoes();
  }, [filtroStatus]);

  const buscarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const res = await listarSolicitacoesAprovador({ status: filtroStatus });
      setSolicitacoes(res.data.solicitacoes);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const prioridadeCor = {
    ALTA:  { background: 'var(--red-bg)',   color: 'var(--red-dk)',   border: '1px solid var(--red-bd)' },
    MEDIA: { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
    BAIXA: { background: 'var(--green-bg)', color: 'var(--green-dk)', border: '1px solid var(--green-bd)' },
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
          Histórico de Aprovações
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Solicitações aprovadas e reprovadas do seu setor
        </p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {['APROVADA', 'REJEITADA', 'CANCELADA'].map(s => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            style={{
              fontSize: '11px', padding: '4px 14px', borderRadius: '20px',
              border: '1px solid var(--border)',
              background: filtroStatus === s ? 'var(--blue)' : 'var(--bg3)',
              color: filtroStatus === s ? '#fff' : 'var(--text2)',
              cursor: 'pointer',
            }}
          >
            {s === 'APROVADA' ? 'Aprovadas' : s === 'REJEITADA' ? 'Reprovadas' : 'Canceladas'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', height: 'calc(100vh - 180px)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {carregando ? (
              <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando...</p>
            ) : solicitacoes.length === 0 ? (
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '32px',
                textAlign: 'center', color: 'var(--text3)', fontSize: '12px',
              }}>
                Nenhuma solicitação {filtroStatus === 'APROVADA' ? 'aprovada' : 'reprovada'}.
              </div>
            ) : (
              solicitacoes.map(sol => (
                <div
                  key={sol._id}
                  onClick={() => setSelecionada(sol)}
                  style={{
                    background: selecionada?._id === sol._id ? 'var(--blue-bg)' : 'var(--bg2)',
                    border: `1px solid ${selecionada?._id === sol._id ? 'var(--blue-bd)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '12px 14px',
                    cursor: 'pointer', transition: 'all .12s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: 'var(--text)',
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {sol.descricao}
                    </span>
                    <Badge status={sol.status} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: 'var(--text3)' }}>
                    <span>Qtd: {sol.quantidade}</span>
                    {sol.solicitante?.nome && <span>Por: {sol.solicitante.nome}</span>}
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
                      {new Date(sol.dataAprovacao || sol.dataCriacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>
                    INFORMAÇÕES
                  </div>
                  {[
                    ['Solicitante', selecionada.solicitante?.nome],
                    ['Quantidade', `${selecionada.quantidade} ${selecionada.unidadeFornecimento || ''}`],
                    ['Prioridade', selecionada.grauPrioridade],
                    ['Setor', selecionada.setor?.nome],
                    ['Data desejada', selecionada.dataDesejadaAquisicao ? new Date(selecionada.dataDesejadaAquisicao).toLocaleDateString('pt-BR') : null],
                    ['Valor unitário', selecionada.valorUnitarioEstimado ? `R$ ${selecionada.valorUnitarioEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null],
                    ['Data aprovação', selecionada.dataAprovacao ? new Date(selecionada.dataAprovacao).toLocaleDateString('pt-BR') : null],
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
                    <div style={{
                      fontSize: '10px', fontWeight: 600, marginBottom: '4px',
                      color: selecionada.decisao ? 'var(--green-dk)' : 'var(--red-dk)',
                    }}>
                      COMENTÁRIO
                    </div>
                    <p style={{
                      fontSize: '11px', lineHeight: 1.5,
                      color: selecionada.decisao ? 'var(--green-dk)' : 'var(--red-dk)',
                    }}>
                      {selecionada.comentario}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}