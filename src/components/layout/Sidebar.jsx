import { useNavigate, useLocation } from 'react-router-dom';

const todosMenus = [
  {
    label: 'Minhas Solicitações',
    path: '/',
    check: () => true,
    icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  },
  {
    label: 'Aprovações',
    path: '/aprovacoes',
    check: ({ isAprovador, perfil }) => isAprovador || perfil === 'ADMINISTRADOR',
    icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  },
  {
    label: 'Histórico',
    path: '/historico-aprovacoes',
    check: ({ isAprovador, perfil }) => isAprovador || perfil === 'ADMINISTRADOR',
    icon: 'M12 8v4l3 3 M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z',
  },
  {
    label: 'Administração',
    path: '/admin',
    check: ({ perfil }) => perfil === 'ADMINISTRADOR',
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  },
  {
    label: 'Cronograma',
    path: '/cronograma',
    check: ({ perfil }) => perfil === 'ADMINISTRADOR',
    icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  },
  {
    label: 'Usuários',
    path: '/usuarios',
    check: ({ perfil }) => perfil === 'ADMINISTRADOR',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
  {
    label: 'Configurações',
    path: '/configuracoes',
    check: ({ perfil }) => perfil === 'ADMINISTRADOR',
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  },
];

export default function Sidebar({ usuario }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = todosMenus.filter(m => m.check(usuario || {}));

  return (
    <div style={{
      width: '188px',
      background: 'var(--bg3)',
      borderRight: '1px solid var(--border)',
      padding: '14px 0',
      flexShrink: 0,
      minHeight: 'calc(100vh - 50px)',
    }}>
      {menus.map((item) => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '8px 15px',
              fontSize: '12px',
              color: active ? 'var(--blue)' : 'var(--text2)',
              background: active ? 'var(--blue-bg)' : 'transparent',
              borderRight: active ? '2px solid var(--blue)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: active ? 600 : 400,
              transition: 'all .12s',
            }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d={item.icon} />
            </svg>
            {item.label}
          </div>
        );
      })}
    </div>
  );
}