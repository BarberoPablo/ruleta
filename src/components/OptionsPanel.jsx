import { useState, useRef, useEffect } from 'react';
import { getColor } from '../data';

export default function OptionsPanel({ options, setOptions, disabled }) {
  const [name, setName] = useState('');
  const [pct, setPct] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPct, setEditPct] = useState('');
  const editNameRef = useRef(null);
  const editRowRef = useRef(null);

  const totalPct = options.reduce((s, o) => s + o.percentage, 0);
  const remaining = Math.max(0, 100 - totalPct);

  useEffect(() => {
    if (editingId && editNameRef.current) {
      editNameRef.current.focus();
    }
  }, [editingId]);

  const addOption = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const val = parseFloat(pct);
    if (!trimmed || isNaN(val) || val <= 0) return;
    if (val > remaining) return;

    setOptions(prev => [
      ...prev,
      { id: Date.now(), name: trimmed, percentage: val, color: getColor(prev.length), img: '' },
    ]);
    setName('');
    setPct('');
  };

  const removeOption = (id) => {
    if (editingId === id) setEditingId(null);
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const startEdit = (opt) => {
    if (disabled) return;
    setEditingId(opt.id);
    setEditName(opt.name);
    setEditPct(String(opt.percentage));
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editName.trim();
    const val = parseFloat(editPct);
    if (!trimmed || isNaN(val) || val <= 0) {
      setEditingId(null);
      return;
    }
    setOptions(prev => {
      const otherTotal = prev.reduce((s, o) => o.id !== editingId ? s + o.percentage : s, 0);
      if (otherTotal + val > 100) {
        setEditingId(null);
        return prev;
      }
      return prev.map(o => o.id === editingId ? { ...o, name: trimmed, percentage: val } : o);
    });
    setEditingId(null);
  };

  const handleEditBlur = (e) => {
    const container = editRowRef.current;
    if (container && container.contains(e.relatedTarget)) return;
    saveEdit();
  };

  const handleEditKeydown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1a0f2e 0%, #120a20 100%)',
      borderRadius: 16,
      padding: 24,
      width: 300,
      border: '1px solid #3d2b6e',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      overflow: 'hidden',
    }}>
      <h3 style={{
        fontFamily: 'Cinzel, serif',
        marginBottom: 16, fontSize: 16, fontWeight: 700, color: '#c084fc',
        letterSpacing: 2,
      }}>
        OPCIONES
      </h3>

      <form onSubmit={addOption} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Nombre de la opción"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={30}
          disabled={disabled}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            placeholder="%"
            value={pct}
            onChange={e => setPct(e.target.value)}
            min={0.1}
            max={remaining}
            step={0.1}
            disabled={disabled}
            style={{ ...inputStyle, width: 72 }}
          />
          <span style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Restante: {remaining.toFixed(1)}%
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled || !name.trim() || !pct || remaining <= 0}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: 8,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 14,
            background: disabled || !name.trim() || !pct || remaining <= 0
              ? '#2a1a4e'
              : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: disabled || !name.trim() || !pct || remaining <= 0 ? '#5a4a7a' : '#fff',
            cursor: disabled || !name.trim() || !pct || remaining <= 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Añadir
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflow: 'auto' }}>
        {options.length === 0 && (
          <p style={{ color: '#5a4a7a', fontSize: 14, fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '20px 0' }}>
            Sin opciones — añade una arriba
          </p>
        )}
        {options.map(opt => (
          <div key={opt.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: editingId === opt.id ? '#1a0f2e' : '#0f0a18',
            borderRadius: 10, padding: '8px 12px',
            border: `1px solid ${editingId === opt.id ? '#7c3aed' : '#2a1a4e'}`,
            transition: 'all 0.2s',
            cursor: disabled ? 'default' : 'pointer',
            overflow: 'hidden',
          }} onClick={() => !editingId && startEdit(opt)}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: opt.color, flexShrink: 0,
              boxShadow: `0 0 8px ${opt.color}66`,
            }} />
            {editingId === opt.id ? (
              <div ref={editRowRef} onBlur={handleEditBlur} style={{ display: 'flex', flex: 1, gap: 6, alignItems: 'center' }}>
                <input
                  ref={editNameRef}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={handleEditKeydown}
                  maxLength={30}
                  size={1}
                  onClick={e => e.stopPropagation()}
                  style={{ ...inlineInput, flex: '1 1 0', minWidth: 0, width: 0 }}
                />
                <input
                  value={editPct}
                  onChange={e => setEditPct(e.target.value)}
                  onKeyDown={handleEditKeydown}
                  type="text"
                  inputMode="decimal"
                  maxLength={5}
                  size={2}
                  onClick={e => e.stopPropagation()}
                  style={{ ...inlineInput, width: 34, textAlign: 'right' }}
                />
                <span style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, flexShrink: 0 }}>%</span>
              </div>
            ) : (
              <>
                <span style={{ flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#e8e0f0' }}>{opt.name}</span>
                <span style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, width: 40, textAlign: 'right' }}>
                  {opt.percentage}%
                </span>
              </>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); removeOption(opt.id); }}
              disabled={disabled}
              style={{
                background: 'none', border: 'none', color: '#ef4444',
                cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 18,
                padding: '0 4px', opacity: disabled ? 0.4 : 0.7,
                transition: 'opacity 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #3d2b6e',
  borderRadius: 8,
  background: '#120a20',
  color: '#e8e0f0',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  outline: 'none',
};

const inlineInput = {
  padding: '4px 6px',
  border: '1px solid #7c3aed',
  borderRadius: 4,
  background: '#120a20',
  color: '#e8e0f0',
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};
