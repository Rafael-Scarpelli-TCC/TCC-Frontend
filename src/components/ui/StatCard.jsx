export default function StatCard({ label, value, tone, active, onClick }) {
  const style = tone || { background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border2)' };
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        flex: 1,
        minWidth: '120px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow .15s, transform .15s, outline .15s',
        outline: active ? '2px solid var(--blue)' : '2px solid transparent',
        outlineOffset: '-1px',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ fontSize: '21px', fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '4px', fontWeight: 500 }}>{label}</div>
    </div>
  );
}