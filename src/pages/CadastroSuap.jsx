import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../services/api';
import './CadastroSuap.css';

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
      <div className="cadastro-suap-page">
        <div className="cadastro-suap-card cadastro-suap-empty">
          <h1>Dados de cadastro não encontrados</h1>

          <p>
            Não foi possível recuperar os dados do SUAP.
            Inicie o cadastro novamente através da tela de login.
          </p>

          <button
            type="button"
            className="cadastro-suap-button cadastro-suap-button-primary"
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
      setMensagem(
        'A senha deve possuir pelo menos 6 caracteres.'
      );
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

      await api.post(
        '/usuarios/cadastro-suap',
        dadosCadastro
      );

      window.alert(
        'Cadastro realizado com sucesso! Agora faça login com seu email e senha.'
      );

      navigate('/');

    } catch (error) {
      console.error(
        'Erro ao finalizar cadastro:',
        error
      );

      const mensagemErro =
        error.response?.data?.message ||
        'Erro ao realizar cadastro.';

      setMensagem(mensagemErro);

    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-suap-page">
      <div className="cadastro-suap-card">

        <div className="cadastro-suap-header">
          <h1>Complete seu cadastro</h1>

          <p>
            Seus dados foram obtidos pelo SUAP.
            Defina uma senha para acessar o sistema.
          </p>
        </div>

        <div className="cadastro-suap-info">
          <span className="cadastro-suap-info-icon">
            ⓘ
          </span>

          <span>
            Os dados abaixo são provenientes do SUAP e não podem
            ser alterados nesta etapa. O setor será definido
            posteriormente pelo administrador.
          </span>
        </div>

        <form
          className="cadastro-suap-form"
          onSubmit={finalizarCadastro}
        >
          <div className="cadastro-suap-field">
            <label htmlFor="nome">
              Nome completo
            </label>

            <input
              id="nome"
              type="text"
              value={usuarioSuap.nome}
              readOnly
            />
          </div>

          <div className="cadastro-suap-field">
            <label htmlFor="email">
              Email acadêmico
            </label>

            <input
              id="email"
              type="email"
              value={usuarioSuap.email}
              readOnly
            />
          </div>

          <div className="cadastro-suap-field">
            <label htmlFor="identificacao">
              Identificação
            </label>

            <input
              id="identificacao"
              type="text"
              value={usuarioSuap.identificacao}
              readOnly
            />
          </div>

          <div className="cadastro-suap-field">
            <label htmlFor="tipoUsuario">
              Tipo de usuário
            </label>

            <input
              id="tipoUsuario"
              type="text"
              value={usuarioSuap.tipoUsuario}
              readOnly
            />
          </div>

          <div className="cadastro-suap-field">
            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              placeholder="Digite uma senha"
              minLength={6}
              required
            />
          </div>

          <div className="cadastro-suap-field">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
              placeholder="Digite a senha novamente"
              minLength={6}
              required
            />
          </div>

          {mensagem && (
            <div className="cadastro-suap-error">
              {mensagem}
            </div>
          )}

          <div className="cadastro-suap-actions">
            <button
              type="button"
              className="cadastro-suap-button cadastro-suap-button-secondary"
              onClick={() => navigate('/')}
              disabled={carregando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="cadastro-suap-button cadastro-suap-button-primary"
              disabled={carregando}
            >
              {carregando
                ? 'Finalizando cadastro...'
                : 'Finalizar cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}