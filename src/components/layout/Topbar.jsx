export default function Topbar({ usuario, onLogout }) {
  const nome = usuario?.nome || 'Usuário';
  const iniciais = nome.split(' ').filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();

  return (
    <header className="app-topbar">
      <div className="topbar-brand">
        <div className="brand-mark" aria-hidden="true"><span>IF</span></div>
        <div className="brand-copy">
          <span className="brand-title">Plano de Compras</span>
          <span className="brand-subtitle">Instituto Federal do Paraná</span>
        </div>
      </div>
      <div className="topbar-account">
        <div className="account-avatar" aria-hidden="true">{iniciais}</div>
        <div className="account-copy">
          <span className="account-name">{nome}</span>
          <span className="account-role">{usuario?.perfil || 'Usuário'}</span>
        </div>
        <span className="topbar-divider" aria-hidden="true" />
        <button className="logout-button" type="button" onClick={onLogout}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
