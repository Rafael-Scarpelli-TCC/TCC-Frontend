import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SUAP_USER_URL =
  'https://suap.ifpr.edu.br/api/rh/eu/';

export default function SuapCallback() {
  const navigate = useNavigate();

  const [mensagem, setMensagem] = useState(
    'Processando autenticação...'
  );

  useEffect(() => {
    const processarAutenticacao = async () => {
      try {
        const hash = window.location.hash;

        if (!hash) {
          setMensagem('Token não recebido do SUAP.');
          return;
        }

        const params = new URLSearchParams(
          hash.substring(1)
        );

        const accessToken = params.get('access_token');

        if (!accessToken) {
          setMensagem(
            'Token não encontrado na resposta do SUAP.'
          );
          return;
        }

        setMensagem(
          'Token recebido. Consultando seus dados no SUAP...'
        );

        const response = await fetch(SUAP_USER_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        });

        const texto = await response.text();

        if (!response.ok) {
          throw new Error(
            `SUAP respondeu ${response.status}: ${texto}`
          );
        }

        let dados;

        try {
          dados = JSON.parse(texto);
        } catch {
          throw new Error(
            'O SUAP respondeu com conteúdo que não é JSON.'
          );
        }

        const nome =
          dados.nome_registro ||
          dados.nome_usual ||
          dados.nome;

        const email =
          dados.email_academico ||
          dados.email_preferencial ||
          dados.email;

        const identificacao = dados.identificacao;

        const tipoUsuario = dados.tipo_usuario;

        if (
          !nome ||
          !email ||
          !identificacao ||
          !tipoUsuario
        ) {
          throw new Error(
            'O SUAP não retornou todos os dados necessários para o cadastro.'
          );
        }

        setMensagem(
          'Verificando se você já possui cadastro...'
        );

        const verificacao = await api.get(
          `/usuarios/verificar-identificacao/${encodeURIComponent(identificacao)}`
        );

        if (verificacao.data.cadastrado) {
          setMensagem(
            'Este usuário já possui cadastro no sistema. Redirecionando para o login...'
          );

          setTimeout(() => {
            navigate('/');
          }, 2500);

          return;
        }

        const usuarioSuap = {
          nome,
          email,
          identificacao,
          tipoUsuario
        };

        navigate('/cadastro-suap', {
          state: {
            usuarioSuap
          }
        });

      } catch (error) {
        console.error(
          'Erro na autenticação SUAP:',
          error
        );

        setMensagem(
          error.response?.data?.message ||
          error.message ||
          'Erro ao processar autenticação do SUAP.'
        );
      }
    };

    processarAutenticacao();
  }, [navigate]);

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
        <h2
          style={{
            marginBottom: '15px',
            fontSize: '20px'
          }}
        >
          Cadastro com SUAP
        </h2>

        <p
          style={{
            color: 'var(--text2)'
          }}
        >
          {mensagem}
        </p>
      </div>
    </div>
  );
}