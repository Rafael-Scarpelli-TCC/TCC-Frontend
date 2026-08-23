export default function Topbar({ usuario, onLogout }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '20px', height: '20px',
          borderRadius: '5px',
          background: 'var(--blue)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          Plano de Compras IFPR
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontSize: '11px', color: 'var(--text2)',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '3px 11px',
        }}>
          {usuario?.nome} • {usuario?.perfil}
        </span>

        <button
          onClick={onLogout}
          style={{
            fontSize: '11px', padding: '4px 12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border2)',
            background: 'var(--bg3)', color: 'var(--text2)',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}