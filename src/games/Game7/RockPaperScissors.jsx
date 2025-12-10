import React, { useState } from 'react';

const choices = ['Rock', 'Paper', 'Scissors'];

function getResult(player, computer) {
  if (player === computer) return 'Draw';
  if (
    (player === 'Rock' && computer === 'Scissors') ||
    (player === 'Paper' && computer === 'Rock') ||
    (player === 'Scissors' && computer === 'Paper')
  ) return 'Win';
  return 'Lose';
}

function RockPaperScissors() {
  const [player, setPlayer] = useState(null);
  const [computer, setComputer] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState('1P'); // '1P' or '2P'
  const [player2, setPlayer2] = useState(null);
  const [turn, setTurn] = useState(1); // 1 or 2

  function play(choice) {
    if (mode === '1P') {
      const comp = choices[Math.floor(Math.random() * 3)];
      setPlayer(choice);
      setComputer(comp);
      const res = getResult(choice, comp);
      setResult(res);
      if (res === 'Win') setScore(score + 1);
    } else {
      if (turn === 1) {
        setPlayer(choice);
        setTurn(2);
      } else {
        setPlayer2(choice);
        const res = getResult(player, choice);
        setResult(res === 'Draw' ? 'Draw' : res === 'Win' ? 'Player 1 Wins' : 'Player 2 Wins');
        setTurn(1);
      }
    }
  }

  function restart() {
    setPlayer(null);
    setComputer(null);
    setResult('');
    setScore(0);
    setPlayer2(null);
    setTurn(1);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
    restart();
  }

  return (
    <div style={{ maxWidth: '20rem', margin: '2rem auto', background: '#1a2233', borderRadius: '1rem', padding: '1.5rem', color: 'white', boxShadow: '0 0.125rem 1rem #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Rock Paper Scissors</h2>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Mode:</label>
        <select value={mode} onChange={handleModeChange} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
          <option value="1P">1 Player</option>
          <option value="2P">2 Player</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => play(choice)}
              style={{
              padding: '0.75rem 0',
              width: '6.25rem',
              minWidth: '6.25rem',
              fontSize: '1.1rem',
              borderRadius: '0.5rem',
              background: '#08bad1',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 0.125rem 0.5rem #08bad122',
              transition: 'background 0.2s',
              outline: 'none',
              margin: 0,
            }}
            disabled={mode === '2P' && turn === 2 && player === null}
          >{choice}</button>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>
        {mode === '1P'
          ? (player && computer ? `You: ${player} | Computer: ${computer}` : 'Choose your move!')
          : (player && !player2 ? `Player 2: Choose your move!` : player && player2 ? `Player 1: ${player} | Player 2: ${player2}` : 'Player 1: Choose your move!')}
      </p>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>
        {result && `Result: ${result}`}
      </p>
      {mode === '1P' && <p style={{ textAlign: 'center', marginBottom: 8 }}>Score: <strong>{score}</strong></p>}
      <button onClick={restart} style={{ width: '100%', padding: '0.625rem 0', fontSize: '1.125rem', borderRadius: '0.5rem', background: '#08bad1', color: 'white', border: 'none', marginTop: '0.5rem' }}>Restart</button>
    </div>
  );
}

export default RockPaperScissors;
