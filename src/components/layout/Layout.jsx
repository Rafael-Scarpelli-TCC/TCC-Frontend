import Topbar from './Topbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children, usuario, onLogout, onLogin }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar usuario={usuario} onLogout={onLogout} onLogin={onLogin} />
      <div style={{ display: 'flex' }}>
        <Sidebar usuario={usuario} />
        <main style={{ flex: 1, padding: '22px 26px', background: 'var(--bg3)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}