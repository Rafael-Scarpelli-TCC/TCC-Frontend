import { useEffect, useState } from 'react';

const SUAP_USER_URL =
  'https://suap.ifpr.edu.br/api/v2/minhas-informacoes/meus-dados/';

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
          setMensagem(
            'Token não encontrado na resposta do SUAP.'
          );
          return;
        }

        setMensagem(
          'Token recebido. Consultando seus dados no SUAP...'
        );

        /*
         * Consulta diretamente a API v2 do SUAP.
         */
        const response = await fetch(SUAP_USER_URL, {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });

        console.log(
          'Status da resposta do SUAP:',
          response.status
        );

        const texto = await response.text();

        console.log(
          'Resposta do SUAP:',
          texto
        );

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

        console.log(
          'Dados do usuário SUAP:',
          dados
        );

        setUsuarioSuap(dados);

        setMensagem(
          'Dados do SUAP recebidos com sucesso!'
        );

      } catch (error) {
        console.error(
          'Erro na autenticação SUAP:',
          error
        );

        setMensagem(
          error.message ||
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