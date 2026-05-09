import { useState, useEffect } from 'react';

export default function ResultModal({ result, image, onClose }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!result) return;
    const t1 = setTimeout(() => { setShowOverlay(true); setCanClose(true); }, 1000);
    const t2 = setTimeout(() => setBtnVisible(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result]);

  if (!result) return null;

  const handleBackdropClick = () => {
    if (canClose) onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backdropFilter: 'blur(6px)',
      cursor: canClose ? 'pointer' : 'default',
    }} onClick={handleBackdropClick}>
      <div style={{
        background: '#120a20',
        borderRadius: 20, width: 460,
        border: '1px solid #5b3b8e',
        boxShadow: '0 8px 48px rgba(124, 58, 237, 0.2)',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          position: 'relative', width: '100%', height: 400,
          background: '#0a0514',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {image ? (
            <img
              src={image}
              alt={result.name}
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                animation: 'img-enter 0.6s ease-out forwards',
              }}
            />
          ) : (
            <span style={{ color: '#5a4a7a', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              Espacio para imagen
            </span>
          )}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: showOverlay ? 'rgba(0,0,0,0.6)' : 'transparent',
            opacity: showOverlay ? 1 : 0,
            animation: showOverlay ? 'overlay-enter 0.5s ease-out forwards' : 'none',
            transition: 'background 0.5s',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 14, color: '#c084fc', fontWeight: 700,
              letterSpacing: 3, marginBottom: 8,
            }}>
              RESULTADO
            </div>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 34, fontWeight: 800, color: result.color,
              textShadow: `0 0 30px ${result.color}66, 0 2px 8px rgba(0,0,0,0.8)`,
              letterSpacing: 1, textAlign: 'center', padding: '0 20px',
            }}>
              {result.name}
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px 24px 24px',
          display: 'flex', justifyContent: 'center',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 40px',
              border: 'none', borderRadius: 10,
              fontFamily: 'Cinzel, serif',
              fontWeight: 700, fontSize: 14,
              letterSpacing: 3,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              cursor: btnVisible ? 'pointer' : 'default',
              opacity: btnVisible ? 1 : 0,
              transform: btnVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s, transform 0.4s',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
}
