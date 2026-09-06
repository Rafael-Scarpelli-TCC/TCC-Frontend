import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Layout from './components/layout/Layout.jsx';

import Login from './pages/Login.jsx';
import SuapCallback from './pages/SuapCallback.jsx';

import Solicitacoes from './pages/Solicitacoes.jsx';
import NovaSolicitacao from './pages/NovaSolicitacao.jsx';
import Aprovacoes from './pages/Aprovacoes.jsx';
import HistoricoAprovacoes from './pages/HistoricoAprovacoes.jsx';
import Admin from './pages/Admin.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Cronograma from './pages/Cronograma.jsx';
import Configuracoes from './pages/Configuracoes.jsx';


function Sistema({ usuario, onLogout }) {
  const { perfil, isAprovador } = usuario;

  const podeAprovar =
    isAprovador || perfil === 'ADMINISTRADOR';

  return (
    <Layout
      usuario={usuario}
      onLogout={onLogout}
    >
      <Routes>

        <Route
          path="/"
          element={<Solicitacoes />}
        />

        <Route
          path="/nova-solicitacao"
          element={<NovaSolicitacao />}
        />

        {podeAprovar && (
          <Route
            path="/aprovacoes"
            element={<Aprovacoes />}
          />
        )}

        {podeAprovar && (
          <Route
            path="/historico-aprovacoes"
            element={<HistoricoAprovacoes />}
          />
        )}

        {perfil === 'ADMINISTRADOR' && (
          <Route
            path="/admin"
            element={<Admin />}
          />
        )}

        {perfil === 'ADMINISTRADOR' && (
          <Route
            path="/usuarios"
            element={<Usuarios />}
          />
        )}

        {perfil === 'ADMINISTRADOR' && (
          <Route
            path="/cronograma"
            element={<Cronograma />}
          />
        )}

        {perfil === 'ADMINISTRADOR' && (
          <Route
            path="/configuracoes"
            element={<Configuracoes />}
          />
        )}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </Layout>
  );
}


function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');

    return salvo
      ? JSON.parse(salvo)
      : null;
  });


  const handleLogin = (u) => {
    setUsuario(u);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    setUsuario(null);
  };


  return (
    <BrowserRouter>

      <Routes>

        {/* 
          Callback do OAuth2 do SUAP.
          Essa rota precisa funcionar mesmo
          quando ainda não existe usuário logado.
        */}
        <Route
          path="/auth/suap/callback"
          element={<SuapCallback />}
        />


        {/* 
          Todas as outras rotas do sistema.
        */}
        <Route
          path="*"
          element={
            !usuario ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Sistema
                usuario={usuario}
                onLogout={handleLogout}
              />
            )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);