import { useState } from 'react';
import { login } from '../services/usuarioService.jsx';

const SUAP_LOGIN_URL = 'https://tcc-backend-lct1.onrender.com/auth/suap';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Mantém o fluxo original de autenticação por e-mail e senha.
  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setErro('');
      setCarregando(true);

      const res = await login({ email, senha });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      onLogin(res.data.usuario);
    } catch (err) {
      setErro(err.response?.data?.message || 'Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastroSuap = () => {
    window.location.href = SUAP_LOGIN_URL;
  };

  return (
    <div className="login-page">
      <section className="login-card" aria-label="Acesso ao Plano de Compras IFPR">
        <div className="login-intro">
          <div className="login-brand">
            <div className="login-brand-mark" aria-hidden="true">IF</div>
            <div className="login-brand-copy">
              <strong>Plano de Compras</strong>
              <span>Instituto Federal do Paraná</span>
            </div>
          </div>
          <div className="login-intro-main">
            <span className="login-eyebrow">Organização e transparência</span>
            <h1>Planejar melhor. Comprar com propósito.</h1>
            <p>Um espaço centralizado para organizar solicitações, acompanhar aprovações e dar mais clareza ao planejamento de compras do campus.</p>
          </div>
          <div className="login-intro-footer">
            <span>IF</span>
            <span>Campus Paranavaí · Paraná</span>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-heading">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para acessar o sistema.</p>
          </div>

          {erro && <div className="login-error" role="alert">{erro}</div>}

          <div className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
                autoComplete="username"
              />
            </div>
            <div className="login-field">
              <label htmlFor="login-senha">Senha</label>
              <input
                id="login-senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleLogin();
                }}
              />
            </div>
            <button className="login-submit" type="button" onClick={handleLogin} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar no sistema'}
              {!carregando && <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
            </button>
          </div>

          <div className="login-separator">ou continue com</div>
          <button className="login-suap-button" type="button" onClick={handleCadastroSuap}>
            <span className="login-suap-mark" aria-hidden="true">SU</span>
            Cadastrar com SUAP
          </button>
          <p className="login-privacy-note">Acesso destinado à comunidade do IFPR. Utilize suas credenciais institucionais.</p>
        </div>
      </section>
    </div>
  );
}
