import { useRef, useEffect, useState } from 'react';

const COLORS = [
  '#7c3aed', '#a855f7', '#c084fc', '#6d28d9', '#8b5cf6',
  '#a78bfa', '#5b21b6', '#9333ea', '#c4b5fd', '#3b1d8e',
  '#7e22ce', '#d8b4fe', '#4c1d95', '#e9d5ff', '#581c87',
];

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function RouletteWheel({ options, onResult, disabled }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const rotation = useRef(0);
  const animId = useRef(null);

  const totalPct = options.reduce((s, o) => s + o.percentage, 0);

  function draw(angle) {
    const canvas = canvasRef.current;
    if (!canvas || options.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;

    ctx.clearRect(0, 0, size, size);

    ctx.shadowColor = 'rgba(124, 58, 237, 0.3)';
    ctx.shadowBlur = 15;

    let a = angle;
    for (const opt of options) {
      const slice = (opt.percentage / totalPct) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a, a + slice);
      ctx.closePath();
      ctx.fillStyle = opt.color;
      ctx.fill();
      ctx.strokeStyle = '#0f0a1a';
      ctx.lineWidth = 3;
      ctx.stroke();

      const mid = a + slice / 2;
      const lr = r * 0.62;
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.translate(cx + Math.cos(mid) * lr, cy + Math.sin(mid) * lr);
      ctx.rotate(mid + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${Math.max(11, Math.min(13, r * 0.08))}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.name, 0, 0);
      ctx.restore();

      a += slice;
    }

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 16);
    grad.addColorStop(0, '#c084fc');
    grad.addColorStop(0.5, '#7c3aed');
    grad.addColorStop(1, '#1a0f2e');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
  }

  useEffect(() => {
    draw(rotation.current);
  }, [options, totalPct]);

  function spin() {
    if (spinning || options.length === 0 || totalPct <= 0) return;
    setSpinning(true);

    const rand = Math.random() * totalPct;
    let cumulative = 0;
    let winner = options[0];
    for (const opt of options) {
      cumulative += opt.percentage;
      if (rand <= cumulative) {
        winner = opt;
        break;
      }
    }

    const slice = (winner.percentage / totalPct) * Math.PI * 2;
    let segStart = 0;
    for (const opt of options) {
      if (opt.id === winner.id) break;
      segStart += (opt.percentage / totalPct) * Math.PI * 2;
    }

    const target = -Math.PI / 2 - segStart - slice / 2;
    const extra = 6 + Math.floor(Math.random() * 4);
    const dest = extra * Math.PI * 2 + target;
    const startRot = rotation.current;
    const delta = dest - (startRot % (Math.PI * 2));
    const finalRot = startRot + delta;
    const duration = 3500 + Math.random() * 1500;
    const startTime = performance.now();

    function animate(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const cur = startRot + delta * easeOut(t);
      draw(cur);
      if (t < 1) {
        animId.current = requestAnimationFrame(animate);
      } else {
        rotation.current = finalRot;
        draw(finalRot);
        setSpinning(false);
        onResult(winner);
      }
    }

    animId.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    return () => { if (animId.current) cancelAnimationFrame(animId.current); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 320, height: 320 }}>
        <canvas ref={canvasRef} style={{ width: 320, height: 320, borderRadius: '50%' }} />
        <div style={{
          position: 'absolute', top: -8, left: '50%',
          width: 0, height: 0, marginLeft: -10,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '22px solid #000',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 32, height: 32,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: !spinning ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }} />
      </div>
      <button
        onClick={spin}
        disabled={disabled || spinning || options.length === 0 || totalPct <= 0}
        style={{
          padding: '14px 56px',
          fontFamily: 'Cinzel, serif',
          fontSize: 18, fontWeight: 700,
          letterSpacing: 4,
          border: 'none', borderRadius: 10,
          cursor: disabled || spinning || options.length === 0 || totalPct <= 0 ? 'not-allowed' : 'pointer',
          background: spinning ? '#3d2b6e' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: '#fff',
          boxShadow: spinning ? 'none' : '0 4px 20px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          transition: 'all 0.2s',
        }}
      >
        {spinning ? 'GIRANDO' : 'GIRAR'}
      </button>
    </div>
  );
}
