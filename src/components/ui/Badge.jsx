export default function Badge({ status }) {
  const styles = {
    PENDENTE:  { background: 'var(--amber-bg)', color: 'var(--amber-dk)', border: '1px solid var(--amber-bd)' },
    APROVADA:  { background: 'var(--green-bg)', color: 'var(--green-dk)', border: '1px solid var(--green-bd)' },
    REJEITADA: { background: 'var(--red-bg)',   color: 'var(--red-dk)',   border: '1px solid var(--red-bd)'   },
    CANCELADA: { background: 'var(--bg3)',      color: 'var(--text2)',    border: '1px solid var(--border2)'  },
  };

  const labels = {
    PENDENTE:  'Pendente',
    APROVADA:  'Aprovada',
    REJEITADA: 'Rejeitada',
    CANCELADA: 'Cancelada',
  };

  return (
    <span style={{
      ...styles[status],
      fontSize: '10px',
      fontWeight: 600,
      borderRadius: '4px',
      padding: '2px 8px',
      display: 'inline-block',
    }}>
      {labels[status] || status}
    </span>
  );
}