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
    check: ({ isAprovador, perfil }) =>
      isAprovador || perfil === 'ADMIN',
    icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  },
  {
    label: 'Histórico',
    path: '/historico-aprovacoes',
    check: ({ isAprovador, perfil }) =>
      isAprovador || perfil === 'ADMIN',
    icon: 'M12 8v4l3 3 M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z',
  },
  {
    label: 'Administração',
    path: '/admin',
    check: ({ perfil }) =>
      perfil === 'ADMIN',
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  },
  {
    label: 'Cronograma',
    path: '/cronograma',
    check: ({ perfil }) =>
      perfil === 'ADMIN',
    icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  },
  {
    label: 'Usuários',
    path: '/usuarios',
    check: ({ perfil }) =>
      perfil === 'ADMIN',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 1 0 0 7.75',
  },
  {
    label: 'Configurações',
    path: '/configuracoes',
    check: ({ perfil }) =>
      perfil === 'ADMIN',
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.51 1H13a2 2 0 0 0-4 0h-.09A1.65 1.65 0 0 0 7 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 2.6 15a1.65 1.65 0 0 0-1.51-1H1a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 2.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 7 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 13 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 17.4 7a1.65 1.65 0 0 0 1.51 1H19a2 2 0 0 0 0 4h-.09A1.65 1.65 0 0 0 17.4 13a1.65 1.65 0 0 0-.33 1.82',
  },
];

export default function Sidebar({ usuario }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = todosMenus.filter((menu) =>
    menu.check(usuario || {})
  );

  return (
    <aside
      style={{
        width: '220px',
        minHeight: 'calc(100vh - 64px)',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        padding: '18px 12px',
      }}
    >
      <nav>
        {menus.map((menu) => {
          const ativo =
            location.pathname === menu.path;

          return (
            <button
              key={menu.path}
              type="button"
              onClick={() => navigate(menu.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                marginBottom: '4px',
                border: 'none',
                borderRadius: 'var(--radius)',
                background: ativo
                  ? 'var(--blue-bg)'
                  : 'transparent',
                color: ativo
                  ? 'var(--blue)'
                  : 'var(--text2)',
                fontSize: '13px',
                fontWeight: ativo ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={menu.icon} />
              </svg>

              <span>{menu.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}