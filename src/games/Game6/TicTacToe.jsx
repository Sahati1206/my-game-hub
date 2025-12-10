import React, { useState } from 'react';

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('1P'); // '1P' or '2P'
  const [waiting, setWaiting] = useState(false); // for computer move
  const winner = checkWinner(board);

  function handleClick(idx) {
    if (board[idx] || winner || (mode === '1P' && !xIsNext)) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    if (mode === '1P' && !winner) {
      setWaiting(true);
      setTimeout(() => {
        const empty = newBoard.map((v, i) => v ? null : i).filter(i => i !== null);
        if (empty.length && !checkWinner(newBoard)) {
          const move = empty[Math.floor(Math.random() * empty.length)];
          newBoard[move] = 'O';
          setBoard([...newBoard]);
          setXIsNext(true);
        }
        setWaiting(false);
      }, 600);
    }
  }

  function restart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWaiting(false);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
    restart();
  }

  return (
    <div style={{ maxWidth: 320, margin: '2rem auto', background: '#1a2233', borderRadius: 16, padding: 24, color: 'white', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Tic-Tac-Toe</h2>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Mode:</label>
        <select value={mode} onChange={handleModeChange} style={{ padding: '4px 8px', borderRadius: 6 }}>
          <option value="1P">1 Player</option>
          <option value="2P">2 Player</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
              style={{
              height: '3.75rem',
              width: '3.75rem',
              fontSize: 32,
              background: cell ? '#08bad1' : '#19213a',
              color: cell ? 'white' : '#08bad1',
              border: '2px solid #08bad1',
              borderRadius: 8,
              cursor: cell ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              outline: 'none',
              margin: 0,
            }}
            disabled={!!cell || !!winner || (mode === '1P' && !xIsNext) || waiting}
          >
            {cell || ''}
          </button>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>
        {winner ? `Winner: ${winner}` : board.every(Boolean) ? 'Draw!' : `Next: ${xIsNext ? 'X' : 'O'}`}
      </p>
      <button onClick={restart} style={{ width: '100%', padding: '10px 0', fontSize: 18, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none', marginTop: 8 }}>Restart</button>
    </div>
  );
}

export default TicTacToe;
