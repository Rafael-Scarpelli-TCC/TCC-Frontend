import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';

export default function SuapCallback() {
  const [mensagem, setMensagem] = useState(
    'Processando autenticação...'
  );

  const [usuarioSuap, setUsuarioSuap] = useState(null);

  useEffect(() => {
    const processarAutenticacao = async () => {
      try {
        console.log('URL atual:', window.location.href);
        console.log('Hash recebido:', window.location.hash);

        const hash = window.location.hash;

        if (!hash) {
          setMensagem('Token não recebido.');
          return;
        }

        const params = new URLSearchParams(
          hash.substring(1)
        );

        const accessToken = params.get('access_token');

        console.log(
          'Access token encontrado:',
          !!accessToken
        );

        if (!accessToken) {
          setMensagem('Token não encontrado na resposta do SUAP.');
          return;
        }

        setMensagem(
          'Token recebido. Consultando seus dados no SUAP...'
        );

        const response = await axios.post(
          `${API_URL.replace('/api', '')}/auth/suap/usuario`,
          {
            accessToken: accessToken,
          }
        );

        console.log(
          'Dados recebidos do SUAP:',
          response.data.usuario
        );

        setUsuarioSuap(response.data.usuario);

        setMensagem(
          'Dados do SUAP recebidos com sucesso!'
        );

      } catch (error) {
        console.error(
          'Erro na autenticação SUAP:',
          error
        );

        setMensagem(
          error.response?.data?.message ||
          'Erro ao consultar os dados do SUAP.'
        );
      }
    };

    processarAutenticacao();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '20px',
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
        }}
      >
        <h2
          style={{
            marginBottom: '10px',
            fontSize: '18px',
            textAlign: 'center',
          }}
        >
          Login SUAP
        </h2>

        <p
          style={{
            color: 'var(--text2)',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          {mensagem}
        </p>

        {usuarioSuap && (
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '15px',
              fontSize: '12px',
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                marginBottom: '10px',
              }}
            >
              Dados recebidos do SUAP
            </h3>

            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'var(--text2)',
              }}
            >
              {JSON.stringify(
                usuarioSuap,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}