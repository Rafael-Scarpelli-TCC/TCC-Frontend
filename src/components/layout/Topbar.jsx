import { useState, useEffect } from 'react';
import { listarUsuarios } from '../../services/usuarioService.jsx';
import { login } from '../../services/usuarioService.jsx';

const senhasPadrao = {
  'admin@ifpr.edu.br': 'admin123',
  'rafael@ifpr.edu.br': 'rafael123',
  'marcelo@ifpr.edu.br': 'marcelo123',
  'alexandre@ifpr.edu.br': 'alexandre',
  'teste@ifpr.edu.br': 'teste123',
};

export default function Topbar({ usuario, onLogout, onLogin }) {
  const [usuarios, setUsuarios] = useState([]);
  const [trocando, setTrocando] = useState(false);

  useEffect(() => {
    listarUsuarios().then(res => setUsuarios(res.data.usuarios)).catch(console.error);
  }, []);

  const handleTrocar = async (e) => {
    const email = e.target.value;
    console.log('Email selecionado:', email);
    console.log('Senha encontrada:', senhasPadrao[email]);
    if (!email) return;
    const senha = senhasPadrao[email];
    if (!senha) return;
    try {
      setTrocando(true);
      const res = await login({ email, senha });
      console.log('Login ok:', res.data.usuario);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao trocar:', err);
    } finally {
      setTrocando(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '20px', height: '20px',
          borderRadius: '5px',
          background: 'var(--blue)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          Plano de Compras IFPR
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          fontSize: '10px', color: 'var(--text3)',
          background: 'var(--amber-bg)', border: '1px solid var(--amber-bd)',
          borderRadius: '4px', padding: '2px 8px',
        }}>
          DEV
        </div>

        <select
          onChange={handleTrocar}
          disabled={trocando}
          value=""
          style={{
            fontSize: '11px', padding: '4px 8px',
            border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
          }}
        >
          <option value="">Trocar usuário...</option>
          {usuarios.map(u => (
            <option key={u._id} value={u.email}>
              {u.nome} ({u.perfil})
            </option>
          ))}
        </select>

        <span style={{
          fontSize: '11px', color: 'var(--text2)',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '3px 11px',
        }}>
          {usuario?.nome} • {usuario?.perfil}
        </span>

        <button
          onClick={onLogout}
          style={{
            fontSize: '11px', padding: '4px 12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border2)',
            background: 'var(--bg3)', color: 'var(--text2)',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}