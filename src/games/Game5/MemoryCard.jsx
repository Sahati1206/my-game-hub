import React, { useState } from 'react';

const cardsList = [
  '🍎','🍌','🍇','🍉','🍒','🍓','🍍','🥝'
];

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function MemoryCard() {
  const [cards, setCards] = useState(() => shuffle([...cardsList, ...cardsList]));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [mode, setMode] = useState('1P'); // '1P' or '2P'
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [busy, setBusy] = useState(false);

  function handleFlip(idx) {
    if (busy || flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped(prev => [...prev, idx]);
    if (flipped.length === 1) {
      // second card chosen
      setMoves(m => m + 1);
      const firstIdx = flipped[0];
      const secondIdx = idx;
      if (cards[firstIdx] === cards[secondIdx]) {
        // match!
        setMatched(prev => [...prev, firstIdx, secondIdx]);
        if (mode === '2P') {
          setScores(prev => {
            const next = [...prev];
            next[currentPlayer] = (next[currentPlayer] || 0) + 1;
            return next;
          });
          // keep turn for matching player
          setBusy(true);
          setTimeout(() => {
            setFlipped([]);
            setBusy(false);
          }, 700);
        } else {
          setBusy(true);
          setTimeout(() => {
            setFlipped([]);
            setBusy(false);
          }, 700);
        }
      } else {
        // not a match -> switch player in 2P
        setBusy(true);
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
          if (mode === '2P') setCurrentPlayer(p => 1 - p);
        }, 700);
      }
    }
  }

  function restart() {
    setCards(shuffle([...cardsList, ...cardsList]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScores([0, 0]);
    setCurrentPlayer(0);
    setBusy(false);
  }

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto', background: '#1a2233', borderRadius: 16, padding: 20, color: 'white', boxShadow: '0 2px 16px #0002' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Memory</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('1P')} style={{ padding: '8px 12px', borderRadius: 8, border: mode === '1P' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.06)', background: mode === '1P' ? '#0f172a' : 'transparent', color: 'white', cursor: 'pointer' }}>1 Player</button>
          <button onClick={() => setMode('2P')} style={{ padding: '8px 12px', borderRadius: 8, border: mode === '2P' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.06)', background: mode === '2P' ? '#0f172a' : 'transparent', color: 'white', cursor: 'pointer' }}>2 Player</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Moves: <strong style={{ color: 'white' }}>{moves}</strong></div>
        {mode === '2P' && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 14 }}>Player 1: <strong>{scores[0]}</strong></div>
            <div style={{ fontSize: 14 }}>Player 2: <strong>{scores[1]}</strong></div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Turn: <strong>Player {currentPlayer + 1}</strong></div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
              style={{
              height: '4.375rem',
              fontSize: 34,
              background: matched.includes(idx) || flipped.includes(idx) ? '#08bad1' : '#19213a',
              color: matched.includes(idx) || flipped.includes(idx) ? 'white' : '#08bad1',
              border: '2px solid #08bad1',
              borderRadius: 8,
              cursor: matched.includes(idx) ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            disabled={matched.includes(idx) || busy}
          >
            {matched.includes(idx) || flipped.includes(idx) ? card : '?'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={restart} style={{ flex: 1, padding: '10px 0', fontSize: 16, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none' }}>Restart</button>
        <button onClick={() => { setCards(shuffle([...cardsList, ...cardsList])); setFlipped([]); setMatched([]); }} style={{ padding: '10px 12px', fontSize: 14, borderRadius: 8, background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>Shuffle</button>
      </div>
    </div>
  );
}

export default MemoryCard;
