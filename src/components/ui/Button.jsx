export default function Button({ children, variant = 'default', onClick, disabled, type = 'button', style }) {
  const styles = {
    default: {
      background: 'var(--bg3)',
      color: 'var(--text2)',
      border: '1px solid var(--border2)',
    },
    primary: {
      background: 'var(--blue)',
      color: '#fff',
      border: '1px solid var(--blue)',
    },
    success: {
      background: 'var(--green-bg)',
      color: 'var(--green-dk)',
      border: '1px solid var(--green-bd)',
    },
    danger: {
      background: 'var(--red-bg)',
      color: 'var(--red-dk)',
      border: '1px solid var(--red-bd)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        fontSize: '12px',
        padding: '6px 14px',
        borderRadius: 'var(--radius)',
        fontWeight: 500,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform .12s, box-shadow .12s, opacity .12s',
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {children}
    </button>
  );
}