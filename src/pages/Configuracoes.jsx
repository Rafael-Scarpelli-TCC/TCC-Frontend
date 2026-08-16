import { useState, useEffect } from 'react';
import { criarSetor, listarSetores, deletarSetor, atualizarSetor } from '../services/setorService.jsx';
import { criarCategoria, listarCategorias, deletarCategoria } from '../services/categoriaService.jsx';
import { listarUsuarios } from '../services/usuarioService.jsx';
import Button from '../components/ui/Button.jsx';

function SecaoLista({ titulo, itens = [], onDeletar, deletando, onEditar }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{titulo}</span>
        <span style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '8px' }}>{itens.length} cadastrado(s)</span>
      </div>
      {itens.length === 0 ? (
        <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text3)' }}>
          Nenhum registro encontrado.
        </div>
      ) : (
        itens.map((item, index) => (
          <div key={item._id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 16px',
            borderBottom: index < itens.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{item.nome}</div>
              {item.descricao && (
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{item.descricao}</div>
              )}
              {item.aprovador && (
                <div style={{ fontSize: '10px', color: 'var(--blue-dk)', marginTop: '2px' }}>
                  Aprovador: {item.aprovador.nome}
                </div>
              )}
            </div>
            {onEditar && (
              <Button variant="default" onClick={() => onEditar(item)}>
                Editar
              </Button>
            )}
            <Button variant="danger" disabled={deletando === item._id} onClick={() => onDeletar(item._id)}>
              {deletando === item._id ? 'Removendo...' : 'Remover'}
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

export default function Configuracoes() {
  const [setores, setSetores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [salvandoSetor, setSalvandoSetor] = useState(false);
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [deletandoSetor, setDeletandoSetor] = useState(null);
  const [deletandoCategoria, setDeletandoCategoria] = useState(null);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [editandoSetor, setEditandoSetor] = useState(null);

  const [formSetor, setFormSetor] = useState({ nome: '', descricao: '', aprovadorId: '' });
  const [formCategoria, setFormCategoria] = useState({ nome: '', descricao: '' });

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const [resSetores, resCategorias, resUsuarios] = await Promise.all([
        listarSetores(),
        listarCategorias(),
        listarUsuarios(),
      ]);
      setSetores(resSetores.data.setores);
      setCategorias(resCategorias.data.categorias);
      setUsuarios(resUsuarios.data.usuarios.filter(u => u.perfil !== 'ADMINISTRADOR'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSalvarSetor = async () => {
    if (!formSetor.nome.trim()) return;
    try {
      setErro('');
      setSalvandoSetor(true);
      if (editandoSetor) {
        await atualizarSetor(editandoSetor._id, formSetor);
        setSucesso('Setor atualizado com sucesso!');
        setEditandoSetor(null);
      } else {
        await criarSetor(formSetor);
        setSucesso('Setor criado com sucesso!');
      }
      setTimeout(() => setSucesso(''), 3000);
      setFormSetor({ nome: '', descricao: '', aprovadorId: '' });
      await buscarDados();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar setor.');
    } finally {
      setSalvandoSetor(false);
    }
  };

  const handleEditarSetor = (setor) => {
    setEditandoSetor(setor);
    setFormSetor({
      nome: setor.nome,
      descricao: setor.descricao || '',
      aprovadorId: setor.aprovador?._id || '',
    });
  };

  const handleCancelarEdicao = () => {
    setEditandoSetor(null);
    setFormSetor({ nome: '', descricao: '', aprovadorId: '' });
  };

  const handleSalvarCategoria = async () => {
    if (!formCategoria.nome.trim()) return;
    try {
      setErro('');
      setSalvandoCategoria(true);
      await criarCategoria(formCategoria);
      setSucesso('Categoria criada com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
      setFormCategoria({ nome: '', descricao: '' });
      await buscarDados();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar categoria.');
    } finally {
      setSalvandoCategoria(false);
    }
  };

  const handleDeletarSetor = async (id) => {
    try {
      setDeletandoSetor(id);
      await deletarSetor(id);
      setSucesso('Setor removido!');
      setTimeout(() => setSucesso(''), 3000);
      await buscarDados();
    } catch (err) {
      setErro('Erro ao remover setor.');
    } finally {
      setDeletandoSetor(null);
    }
  };

  const handleDeletarCategoria = async (id) => {
    try {
      setDeletandoCategoria(id);
      await deletarCategoria(id);
      setSucesso('Categoria removida!');
      setTimeout(() => setSucesso(''), 3000);
      await buscarDados();
    } catch (err) {
      setErro('Erro ao remover categoria.');
    } finally {
      setDeletandoCategoria(null);
    }
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
          Configurações
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Gerencie setores e categorias do sistema
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Setores */}
        <div>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '10px',
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              {editandoSetor ? `Editando: ${editandoSetor.nome}` : 'Novo Setor'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                value={formSetor.nome}
                onChange={e => setFormSetor({ ...formSetor, nome: e.target.value })}
                placeholder="Nome *"
                style={inputStyle}
              />
              <input
                value={formSetor.descricao}
                onChange={e => setFormSetor({ ...formSetor, descricao: e.target.value })}
                placeholder="Descrição (opcional)"
                style={inputStyle}
              />
              <select
                value={formSetor.aprovadorId}
                onChange={e => setFormSetor({ ...formSetor, aprovadorId: e.target.value })}
                style={inputStyle}
              >
                <option value="">Sem aprovador</option>
                {usuarios.map(u => (
                  <option key={u._id} value={u._id}>{u.nome} — {u.email}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={handleSalvarSetor} disabled={salvandoSetor || !formSetor.nome.trim()}>
                  {salvandoSetor ? 'Salvando...' : editandoSetor ? 'Salvar' : 'Adicionar'}
                </Button>
                {editandoSetor && (
                  <Button variant="default" onClick={handleCancelarEdicao}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
          <SecaoLista
            titulo="Setores"
            itens={setores}
            onDeletar={handleDeletarSetor}
            deletando={deletandoSetor}
            onEditar={handleEditarSetor}
          />
        </div>

        {/* Categorias */}
        <div>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '10px',
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Nova Categoria
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                value={formCategoria.nome}
                onChange={e => setFormCategoria({ ...formCategoria, nome: e.target.value })}
                placeholder="Nome *"
                style={inputStyle}
              />
              <input
                value={formCategoria.descricao}
                onChange={e => setFormCategoria({ ...formCategoria, descricao: e.target.value })}
                placeholder="Descrição (opcional)"
                style={inputStyle}
              />
              <Button variant="primary" onClick={handleSalvarCategoria} disabled={salvandoCategoria || !formCategoria.nome.trim()}>
                {salvandoCategoria ? 'Salvando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
          <SecaoLista
            titulo="Categorias"
            itens={categorias}
            onDeletar={handleDeletarCategoria}
            deletando={deletandoCategoria}
          />
        </div>
      </div>
    </div>
  );
}