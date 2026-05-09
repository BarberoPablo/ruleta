import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import RouletteWheel from './components/RouletteWheel';
import OptionsPanel from './components/OptionsPanel';
import HistoryModal from './components/HistoryModal';
import ResultModal from './components/ResultModal';

const RESULT_IMAGES = [
  'https://i.postimg.cc/VkWJtDMx/yoli.webp',
  'https://i.postimg.cc/MK5KGhq4/trolos.webp',
  'https://iili.io/BtyzGyP.md.webp',
  'https://i.postimg.cc/PxjCB1tH/besito.webp',
  'https://i.postimg.cc/nzGXZMLy/bicep.webp',
  'https://i.postimg.cc/ZRxWZ0Rk/trola.webp',
];

export default function App() {
  const [options, setOptions] = useLocalStorage('ruleta-options', [
    { id: 1, name: 'A', percentage: 25, color: '#7c3aed', img: '' },
    { id: 2, name: 'B', percentage: 25, color: '#a855f7', img: '' },
    { id: 3, name: 'C', percentage: 25, color: '#c084fc', img: '' },
    { id: 4, name: 'D', percentage: 25, color: '#6d28d9', img: '' },
  ]);
  const [history, setHistory] = useLocalStorage('ruleta-history', []);
  const [imageIndex, setImageIndex] = useLocalStorage('ruleta-image-idx', 0);
  const [showHistory, setShowHistory] = useState(false);
  const [result, setResult] = useState(null);

  const handleResult = (winner) => {
    setResult(winner);
    setHistory(prev => [...prev, { ...winner, timestamp: Date.now() }]);
  };

  const handleCloseResult = () => {
    setResult(null);
    setImageIndex(prev => (prev + 1) % RESULT_IMAGES.length);
  };

  const currentImage = result ? RESULT_IMAGES[imageIndex] : null;

  return (
    <div style={{
      display: 'flex', gap: 48, alignItems: 'flex-start',
      justifyContent: 'center', padding: '40px 24px',
      width: '100%', maxWidth: 960,
    }}>
      <OptionsPanel options={options} setOptions={setOptions} disabled={showHistory || !!result} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        paddingTop: 40,
      }}>
        <RouletteWheel options={options} onResult={handleResult} disabled={showHistory} />

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #3d2b6e, #2a1a4e)',
              border: '1px solid #5b3b8e',
              borderRadius: 8,
              color: '#c084fc',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.2s',
            }}
          >
            HISTORIAL ({history.length})
          </button>

        </div>
      </div>

      {showHistory && (
        <HistoryModal history={history} onClose={() => setShowHistory(false)} />
      )}

      {result && (
        <ResultModal result={result} image={currentImage} onClose={handleCloseResult} />
      )}
    </div>
  );
}
