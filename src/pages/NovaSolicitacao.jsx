import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarItens } from '../services/itemCompraService.jsx';
import { criarSolicitacao } from '../services/solicitacaoService.jsx';
import { listarCategorias } from '../services/categoriaService.jsx';
import Button from '../components/ui/Button.jsx';

const inputStyle = {
  width: '100%', padding: '7px 10px', fontSize: '12px',
  border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
  background: 'var(--bg)', color: 'var(--text)',
};

const inputReadonlyStyle = {
  ...inputStyle,
  background: 'var(--bg3)', color: 'var(--text2)',
};

const labelStyle = { fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' };

function Field({ label, required, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--red-dk)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function NovaSolicitacao() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [busca, setBusca] = useState('');
  const [itens, setItens] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [itemNovo, setItemNovo] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    quantidade: 1,
    valorTotal: '',
    grauPrioridade: 'MEDIA',
    dataDesejadaAquisicao: '',
    temVinculacao: false,
    justificativa: '',
    nomeInteressado: usuario.nome || '',
    email: usuario.email || '',
    categoriaId: '',
    descricao: '',
    descricaoSucinta: '',
    unidadeFornecimento: '',
    valorUnitarioEstimado: '',
    codigoSIPAC: '',
    subitem: '',
    codigoCATService: '',
    grupoVinculado: '',
  });

  useEffect(() => {
    listarCategorias().then(res => setCategorias(res.data.categorias)).catch(console.error);
  }, []);

  useEffect(() => {
    if (form.quantidade && form.valorUnitarioEstimado) {
      const total = parseFloat(form.quantidade) * parseFloat(form.valorUnitarioEstimado);
      setForm(prev => ({ ...prev, valorTotal: total.toFixed(2) }));
    }
  }, [form.quantidade, form.valorUnitarioEstimado]);

  const handleBusca = async (valor) => {
    setBusca(valor);
    if (valor.length < 2) { setItens([]); return; }
    try {
      setBuscando(true);
      const res = await listarItens({ busca: valor });
      setItens(res.data.itens.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const handleSelecionarItem = (item) => {
    setItemSelecionado(item);
    setItemNovo(false);
    setItens([]);
    setBusca(item.descricao);
    setForm(prev => ({
      ...prev,
      descricao: item.descricao || '',
      descricaoSucinta: item.descricaoSucinta || '',
      unidadeFornecimento: item.unidadeFornecimento || '',
      valorUnitarioEstimado: item.valorUnitarioEstimado || '',
      codigoSIPAC: item.codigoSIPAC || '',
      subitem: item.subitem || '',
      codigoCATService: item.codigoCATService || '',
      grupoVinculado: item.grupoVinculado || '',
    }));
  };

  const handleItemNovo = () => {
    setItemSelecionado(null);
    setItemNovo(true);
    setItens([]);
    setForm(prev => ({
      ...prev,
      descricao: busca,
      descricaoSucinta: '',
      unidadeFornecimento: '',
      valorUnitarioEstimado: '',
      codigoSIPAC: '',
      subitem: '',
      codigoCATService: '',
      grupoVinculado: '',
    }));
  };

  const handleEnviar = async () => {
    if (!form.descricao || !form.quantidade || !form.justificativa || !form.nomeInteressado) {
      return setErro('Preencha os campos obrigatórios: descrição, quantidade, justificativa e nome do interessado.');
    }
    try {
      setErro('');
      setEnviando(true);
      await criarSolicitacao({
        itemCompraId: itemSelecionado?._id || null,
        ...form,
        itemNovo,
      });
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar solicitação.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text2)', fontSize: '12px',
        }}>
          ← Voltar
        </button>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
            Nova Solicitação
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text2)' }}>Pesquise um item ou solicite um novo</p>
        </div>
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

      {/* Busca */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '12px',
      }}>
        <label style={labelStyle}>Pesquisar item na planilha</label>
        <div style={{ position: 'relative' }}>
          <input
            value={busca}
            onChange={e => handleBusca(e.target.value)}
            placeholder="Digite o nome do item..."
            style={inputStyle}
          />
          {buscando && (
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: 'var(--text3)' }}>
              Buscando...
            </span>
          )}
        </div>

        {itens.length > 0 && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '6px', background: 'var(--bg2)', overflow: 'hidden' }}>
            {itens.map(item => (
              <div key={item._id} onClick={() => handleSelecionarItem(item)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{item.descricao}</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>
                  {item.unidadeFornecimento} • R$ {item.valorUnitarioEstimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {item.subitem && ` • ${item.subitem}`}
                </div>
              </div>
            ))}
            <div onClick={handleItemNovo} style={{
              padding: '10px 14px', cursor: 'pointer',
              background: 'var(--blue-bg)', color: 'var(--blue-dk)', fontSize: '12px', fontWeight: 500,
            }}>
              + Solicitar "{busca}" como item novo
            </div>
          </div>
        )}

        {busca.length >= 2 && itens.length === 0 && !buscando && !itemSelecionado && !itemNovo && (
          <div style={{ marginTop: '8px' }}>
            <button onClick={handleItemNovo} style={{
              fontSize: '12px', color: 'var(--blue)', background: 'var(--blue-bg)',
              border: '1px solid var(--blue-bd)', borderRadius: 'var(--radius)',
              padding: '7px 14px', cursor: 'pointer', fontWeight: 500,
            }}>
              + Item não encontrado — solicitar como novo
            </button>
          </div>
        )}

        {itemSelecionado && (
          <div style={{
            marginTop: '8px', background: 'var(--green-bg)', border: '1px solid var(--green-bd)',
            borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: '11px', color: 'var(--green-dk)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>✓ Item selecionado da planilha</span>
            <button onClick={() => { setItemSelecionado(null); setBusca(''); setItens([]); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-dk)', fontSize: '12px' }}>✕</button>
          </div>
        )}

        {itemNovo && (
          <div style={{
            marginTop: '8px', background: 'var(--amber-bg)', border: '1px solid var(--amber-bd)',
            borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: '11px', color: 'var(--amber-dk)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>⚠ Item novo — preencha todos os campos necessários</span>
            <button onClick={() => { setItemNovo(false); setBusca(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--amber-dk)', fontSize: '12px' }}>✕</button>
          </div>
        )}
      </div>

      {(itemSelecionado || itemNovo) && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

          {/* Esquerda — campos pré-preenchidos */}
          <div style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text2)', marginBottom: '12px' }}>
              DADOS DO ITEM
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Field label="Descrição" required>
                <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}
                  style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
              </Field>
              <Field label="Descrição Sucinta">
                <textarea value={form.descricaoSucinta} onChange={e => setForm({ ...form, descricaoSucinta: e.target.value })}
                  rows={4} style={{ ...(itemSelecionado ? inputReadonlyStyle : inputStyle), resize: 'vertical' }}
                  readOnly={!!itemSelecionado} />
              </Field>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Field label="Cód. SIPAC">
                  <input value={form.codigoSIPAC} onChange={e => setForm({ ...form, codigoSIPAC: e.target.value })}
                    style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
                </Field>
                <Field label="Subitem">
                  <input value={form.subitem} onChange={e => setForm({ ...form, subitem: e.target.value })}
                    style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
                </Field>
              </div>
              <Field label="Cód. CAT Service">
                <input value={form.codigoCATService} onChange={e => setForm({ ...form, codigoCATService: e.target.value })}
                  style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
              </Field>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Field label="Unidade de Fornecimento">
                  <input value={form.unidadeFornecimento} onChange={e => setForm({ ...form, unidadeFornecimento: e.target.value })}
                    style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
                </Field>
                <Field label="Valor Unitário (R$)">
                  <input type="number" value={form.valorUnitarioEstimado}
                    onChange={e => setForm({ ...form, valorUnitarioEstimado: e.target.value })}
                    style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
                </Field>
              </div>
              <Field label="Grupo Vinculado">
                <input value={form.grupoVinculado} onChange={e => setForm({ ...form, grupoVinculado: e.target.value })}
                  style={itemSelecionado ? inputReadonlyStyle : inputStyle} readOnly={!!itemSelecionado} />
              </Field>
              {itemNovo && (
                <Field label="Categoria">
                  <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })} style={inputStyle}>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                  </select>
                </Field>
              )}
            </div>
          </div>

          {/* Direita — campos da solicitação */}
          <div style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text2)', marginBottom: '12px' }}>
              DADOS DA SOLICITAÇÃO
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Field label="Quantidade" required>
                  <input
                    type="number"
                    min="1"
                    value={form.quantidade}
                    onChange={e => setForm({ ...form, quantidade: e.target.value === '' ? '' : parseInt(e.target.value) || 1 })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Valor Total (R$)">
                  <input value={form.valorTotal} style={inputReadonlyStyle} readOnly />
                </Field>
              </div>
              <Field label="Grau de Prioridade">
                <select value={form.grauPrioridade} onChange={e => setForm({ ...form, grauPrioridade: e.target.value })} style={inputStyle}>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </Field>
              <Field label="Data Desejada">
                <input type="date" value={form.dataDesejadaAquisicao}
                  onChange={e => setForm({ ...form, dataDesejadaAquisicao: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Vinculação com outro item">
                <select value={form.temVinculacao} onChange={e => setForm({ ...form, temVinculacao: e.target.value === 'true' })} style={inputStyle}>
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
              </Field>
              <Field label="Justificativa" required>
                <textarea value={form.justificativa} onChange={e => setForm({ ...form, justificativa: e.target.value })}
                  rows={4} placeholder="Descreva a necessidade do item..."
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </Field>
              <Field label="Nome do Interessado" required>
                <input value={form.nomeInteressado} onChange={e => setForm({ ...form, nomeInteressado: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </Field>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="default" onClick={() => navigate('/')}>Cancelar</Button>
                <Button variant="primary" onClick={handleEnviar} disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Confirmar Solicitação'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}