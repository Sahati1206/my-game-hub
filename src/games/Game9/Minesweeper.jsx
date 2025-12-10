import React, { useState } from 'react';

const SIZE = 6;
const MINES = 6;

function createBoard() {
  let board = Array(SIZE * SIZE).fill({ mine: false, revealed: false, flagged: false, count: 0 });
  board = board.map((_, i) => ({ ...board[i] }));
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const idx = Math.floor(Math.random() * board.length);
    if (!board[idx].mine) {
      board[idx].mine = true;
      minesPlaced++;
    }
  }
  for (let i = 0; i < board.length; i++) {
    const neighbors = getNeighbors(i);
    board[i].count = neighbors.filter(j => board[j].mine).length;
  }
  return board;
}

function getNeighbors(idx) {
  const x = idx % SIZE, y = Math.floor(idx / SIZE);
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) neighbors.push(ny * SIZE + nx);
    }
  }
  return neighbors;
}

function Minesweeper() {
  const [board, setBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function reveal(idx) {
    if (board[idx].revealed || board[idx].flagged || gameOver) return;
    const newBoard = board.map(cell => ({ ...cell }));
    if (newBoard[idx].mine) {
      newBoard[idx].revealed = true;
      setGameOver(true);
      setBoard(newBoard);
      return;
    }
    function flood(i) {
      if (newBoard[i].revealed || newBoard[i].mine) return;
      newBoard[i].revealed = true;
      if (newBoard[i].count === 0) getNeighbors(i).forEach(flood);
    }
    flood(idx);
    setBoard(newBoard);
    if (newBoard.filter(c => !c.mine && c.revealed).length === SIZE * SIZE - MINES) setWon(true);
  }

  function flag(idx) {
    if (board[idx].revealed || gameOver) return;
    const newBoard = board.map(cell => ({ ...cell }));
    newBoard[idx].flagged = !newBoard[idx].flagged;
    setBoard(newBoard);
  }

  function restart() {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
  }

  return (
    <div style={{ maxWidth: '21.25rem', margin: '2rem auto', background: '#1a2233', borderRadius: '1rem', padding: '1.5rem', color: 'white', boxShadow: '0 0.125rem 1rem #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Minesweeper</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: '0.25rem', marginBottom: '1rem' }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => reveal(idx)}
            onContextMenu={e => { e.preventDefault(); flag(idx); }}
              style={{
              height: '2.25rem',
              fontSize: '1.125rem',
              background: cell.revealed ? (cell.mine ? '#ef4444' : '#08bad1') : '#19213a',
              color: cell.revealed ? 'white' : '#08bad1',
              border: '2px solid #08bad1',
              borderRadius: '0.375rem',
              cursor: cell.revealed ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              position: 'relative',
            }}
            disabled={cell.revealed || gameOver || won}
          >
            {cell.revealed ? (cell.mine ? '💣' : (cell.count || '')) : (cell.flagged ? '🚩' : '')}
          </button>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>
        {gameOver ? 'Game Over!' : won ? 'You Win!' : 'Left click: reveal, Right click: flag'}
      </p>
      <button onClick={restart} style={{ width: '100%', padding: '0.625rem 0', fontSize: '1.125rem', borderRadius: '0.5rem', background: '#08bad1', color: 'white', border: 'none', marginTop: '0.5rem' }}>Restart</button>
    </div>
  );
}

export default Minesweeper;
