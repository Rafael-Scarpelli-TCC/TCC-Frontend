import { useState, useEffect } from 'react';
import { listarUsuarios, atualizarUsuario } from '../services/usuarioService.jsx';
import { listarSetores } from '../services/setorService.jsx';

const perfisLabels = { SERVIDOR: 'Servidor', APROVADOR: 'Aprovador', ADMINISTRADOR: 'Administrador' };
const perfisCores = {
  SERVIDOR:      { background: 'var(--bg3)',     color: 'var(--text2)',    border: '1px solid var(--border2)' },
  APROVADOR:     { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
  ADMINISTRADOR: { background: 'var(--blue-bg)',  color: 'var(--blue-dk)', border: '1px solid var(--blue-bd)' },
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(null);
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setCarregando(true);
      const [resUsuarios, resSetores] = await Promise.all([
        listarUsuarios(),
        listarSetores(),
      ]);
      setUsuarios(resUsuarios.data.usuarios);
      setSetores(resSetores.data.setores);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleAtualizar = async (id, dados) => {
    try {
      setAtualizando(id);
      await atualizarUsuario(id, dados);
      setSucesso('Usuário atualizado com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
      await buscarDados();
    } catch (err) {
      console.error(err);
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          Gerenciar Usuários
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Gerencie o setor dos usuários
        </p>
      </div>

      {sucesso && (
        <div style={{
          background: 'var(--green-bg)', border: '1px solid var(--green-bd)',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          fontSize: '12px', color: 'var(--green-dk)', marginBottom: '14px',
        }}>
          ✓ {sucesso}
        </div>
      )}

      {carregando ? (
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando...</p>
      ) : (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {usuarios.map((u, index) => (
            <div key={u._id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px',
              borderBottom: index < usuarios.length - 1 ? '1px solid var(--border)' : 'none',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--blue-bg)', border: '1px solid var(--blue-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600, color: 'var(--blue-dk)',
                flexShrink: 0,
              }}>
                {u.nome.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: '150px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                  {u.nome}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>
                  {u.email}
                </div>
              </div>

              <span style={{
                ...perfisCores[u.perfil],
                fontSize: '10px', fontWeight: 600,
                borderRadius: '4px', padding: '2px 8px',
                whiteSpace: 'nowrap',
              }}>
                {perfisLabels[u.perfil]}
              </span>

              <select
                value={u.setor?._id?.toString() || ''}
                disabled={atualizando === u._id}
                onChange={e => handleAtualizar(u._id, { setorId: e.target.value || null })}
                style={{
                  fontSize: '11px', padding: '5px 8px',
                  border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                  background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                <option value="">Sem setor</option>
                {setores.map(s => (
                  <option key={s._id} value={s._id}>{s.nome}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}