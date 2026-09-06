import { useEffect, useState } from 'react';

export default function SuapCallback() {
  const [mensagem, setMensagem] = useState(
    'Processando autenticação...'
  );

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      setMensagem('Token não recebido.');
      return;
    }

    const params = new URLSearchParams(
      hash.substring(1)
    );

    const accessToken = params.get('access_token');

    if (!accessToken) {
      setMensagem('Token não encontrado.');
      return;
    }

    console.log(
      'Token SUAP recebido:',
      accessToken
    );

    setMensagem(
      'Token SUAP recebido com sucesso!'
    );
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
      }}
    >

      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
        }}
      >

        <h2
          style={{
            marginBottom: '10px',
            fontSize: '18px',
          }}
        >
          Login SUAP
        </h2>

        <p
          style={{
            color: 'var(--text2)',
          }}
        >
          {mensagem}
        </p>

      </div>

    </div>
  );
}