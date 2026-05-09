export default function HistoryModal({ history, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(180deg, #1a0f2e 0%, #120a20 100%)',
        borderRadius: 20, padding: 28,
        width: 440, maxHeight: '80vh', overflow: 'auto',
        border: '1px solid #3d2b6e',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 17, fontWeight: 700, color: '#c084fc',
            letterSpacing: 2,
          }}>
            HISTORIAL
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#7a6a9a',
            fontSize: 24, cursor: 'pointer', padding: '0 4px',
            fontFamily: 'Inter, sans-serif',
          }}>×</button>
        </div>
        {history.length === 0 ? (
          <p style={{ color: '#5a4a7a', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '20px 0' }}>
            Sin resultados aún
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...history].reverse().map((entry, i) => (
              <div key={entry.timestamp} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#0f0a18',
                borderRadius: 10, padding: '10px 14px',
                border: '1px solid #2a1a4e',
              }}>
                <span style={{
                  color: '#5a4a7a', fontSize: 12, width: 28,
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                }}>
                  #{history.length - i}
                </span>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: entry.color, flexShrink: 0,
                  boxShadow: `0 0 8px ${entry.color}66`,
                }} />
                <span style={{ flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{entry.name}</span>
                <span style={{ color: '#7a6a9a', fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
