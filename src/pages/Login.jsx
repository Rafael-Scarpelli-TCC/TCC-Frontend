import { useState } from 'react';
import { login } from '../services/usuarioService.jsx';
import Button from '../components/ui/Button.jsx';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) return setErro('Preencha todos os campos.');
    try {
      setErro('');
      setCarregando(true);
      const res = await login({ email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      onLogin(res.data.usuario);
    } catch (err) {
      setErro('Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '32px',
        width: '100%', maxWidth: '380px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'var(--blue)', flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Plano de Compras IFPR
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text2)' }}>
              Campus Paranavaí
            </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%', padding: '8px 12px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '8px 12px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)', outline: 'none',
              }}
            />
          </div>

          <Button variant="primary" onClick={handleLogin} disabled={carregando} style={{ width: '100%', padding: '9px' }}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}