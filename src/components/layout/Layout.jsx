import Topbar from './Topbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children, usuario, onLogout }) {
  return (
    <div className="app-shell">
      <Topbar usuario={usuario} onLogout={onLogout} />
      <div className="app-frame">
        <Sidebar usuario={usuario} />
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
