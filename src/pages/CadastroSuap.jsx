import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CadastroSuap() {
  const location = useLocation();
  const navigate = useNavigate();

  const usuarioSuap = location.state?.usuarioSuap;

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!usuarioSuap) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--text)',
          padding: '20px'
        }}
      >
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow)',
            textAlign: 'center'
          }}
        >
          <h2>Dados de cadastro não encontrados</h2>

          <p
            style={{
              color: 'var(--text2)',
              marginTop: '12px',
              marginBottom: '20px'
            }}
          >
            Inicie o cadastro novamente através do SUAP.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  const finalizarCadastro = async (event) => {
    event.preventDefault();

    setMensagem('');

    if (senha.length < 6) {
      setMensagem('A senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);

      const dadosCadastro = {
        nome: usuarioSuap.nome,
        email: usuarioSuap.email,
        identificacao: usuarioSuap.identificacao,
        tipoUsuario: usuarioSuap.tipoUsuario,
        senha
      };

      await api.post('/usuarios/cadastro-suap', dadosCadastro);

      alert('Cadastro realizado com sucesso! Agora faça login com seu email e senha.');

      navigate('/');
    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);

      const mensagemErro =
        error.response?.data?.message ||
        'Erro ao realizar cadastro.';

      setMensagem(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <h2
          style={{
            marginBottom: '10px',
            fontSize: '20px',
            textAlign: 'center'
          }}
        >
          Complete seu cadastro
        </h2>

        <p
          style={{
            color: 'var(--text2)',
            textAlign: 'center',
            marginBottom: '25px'
          }}
        >
          Confira seus dados e defina uma senha para acessar o sistema.
        </p>

        <form onSubmit={finalizarCadastro}>
          <div style={{ marginBottom: '15px' }}>
            <label>Nome</label>

            <input
              type="text"
              value={usuarioSuap.nome}
              readOnly
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Email acadêmico</label>

            <input
              type="email"
              value={usuarioSuap.email}
              readOnly
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Identificação</label>

            <input
              type="text"
              value={usuarioSuap.identificacao}
              readOnly
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Tipo de usuário</label>

            <input
              type="text"
              value={usuarioSuap.tipoUsuario}
              readOnly
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Senha</label>

            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Confirmar senha</label>

            <input
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Digite a senha novamente"
              required
            />
          </div>

          {mensagem && (
            <p
              style={{
                color: '#dc2626',
                marginBottom: '15px'
              }}
            >
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: '100%'
            }}
          >
            {carregando
              ? 'Finalizando cadastro...'
              : 'Finalizar cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}