import { useState, useEffect } from 'react';
import { criarCronograma, listarCronogramas, encerrarCronograma } from '../services/cronogramaService.jsx';
import Button from '../components/ui/Button.jsx';

export default function Cronograma() {
  const [cronogramas, setCronogramas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [criando, setCriando] = useState(false);
  const [encerrando, setEncerrando] = useState(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [form, setForm] = useState({
    anoReferencia: new Date().getFullYear().toString(),
    dataAbertura: '',
    dataFechamento: '',
  });

  useEffect(() => {
    buscarCronogramas();
  }, []);

  const buscarCronogramas = async () => {
    try {
      setCarregando(true);
      const res = await listarCronogramas();
      setCronogramas(res.data.cronogramas);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleCriar = async () => {
    if (!form.anoReferencia || !form.dataAbertura || !form.dataFechamento) {
      return setErro('Preencha todos os campos.');
    }
    try {
      setErro('');
      setCriando(true);
      await criarCronograma(form);
      setSucesso('Cronograma criado com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
      setForm({ anoReferencia: new Date().getFullYear().toString(), dataAbertura: '', dataFechamento: '' });
      await buscarCronogramas();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar cronograma.');
    } finally {
      setCriando(false);
    }
  };

  const handleEncerrar = async (id) => {
    try {
      setEncerrando(id);
      await encerrarCronograma(id);
      setSucesso('Cronograma encerrado com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
      await buscarCronogramas();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao encerrar cronograma.');
    } finally {
      setEncerrando(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          Cronograma
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Gerencie os cronogramas do Plano de Compras Anual
        </p>
      </div>

      {erro && (
        <div style={{
          background: 'var(--red-bg)', border: '1px solid var(--red-bd)',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          fontSize: '12px', color: 'var(--red-dk)', marginBottom: '14px',
        }}>
          {erro}
        </div>
      )}

      {sucesso && (
        <div style={{
          background: 'var(--green-bg)', border: '1px solid var(--green-bd)',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          fontSize: '12px', color: 'var(--green-dk)', marginBottom: '14px',
        }}>
          ✓ {sucesso}
        </div>
      )}

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '12px',
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
          Novo Cronograma
        </h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Ano de Referência
            </label>
            <input
              value={form.anoReferencia}
              onChange={e => setForm({ ...form, anoReferencia: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Data de Abertura
            </label>
            <input
              type="date"
              value={form.dataAbertura}
              onChange={e => setForm({ ...form, dataAbertura: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Data de Fechamento
            </label>
            <input
              type="date"
              value={form.dataFechamento}
              onChange={e => setForm({ ...form, dataFechamento: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            />
          </div>
        </div>

        <Button variant="primary" onClick={handleCriar} disabled={criando}>
          {criando ? 'Criando...' : 'Criar Cronograma'}
        </Button>
      </div>

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px',
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
          Cronogramas
        </h2>

        {carregando ? (
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando...</p>
        ) : cronogramas.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Nenhum cronograma criado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cronogramas.map(c => (
              <div key={c._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                    Plano de Compras {c.anoReferencia}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
                    {new Date(c.dataAbertura).toLocaleDateString('pt-BR')} até {new Date(c.dataFechamento).toLocaleDateString('pt-BR')}
                    {c.planilhas?.length > 0 && ` • ${c.planilhas.length} planilha(s)`}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 600, borderRadius: '4px', padding: '2px 8px',
                  background: c.status === 'ABERTO' ? 'var(--green-bg)' : 'var(--bg3)',
                  color: c.status === 'ABERTO' ? 'var(--green-dk)' : 'var(--text3)',
                  border: `1px solid ${c.status === 'ABERTO' ? 'var(--green-bd)' : 'var(--border2)'}`,
                }}>
                  {c.status === 'ABERTO' ? 'Aberto' : 'Encerrado'}
                </span>
                {c.status === 'ABERTO' && (
                  <Button
                    variant="danger"
                    onClick={() => handleEncerrar(c._id)}
                    disabled={encerrando === c._id}
                  >
                    {encerrando === c._id ? 'Encerrando...' : 'Encerrar'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}