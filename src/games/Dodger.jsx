
import React, { useRef, useEffect, useState } from 'react';

// Tetris shapes
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const COLORS = ['cyan', 'yellow', 'purple', 'orange', 'blue', 'green', 'red'];

const ROWS = 20;
const COLS = 10;
const BLOCK = 24;

function randomShape() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[idx], color: COLORS[idx], idx };
}

function Tetris() {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [current, setCurrent] = useState(randomShape());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('tetrisHighScore')) || 0);
  const [gameOver, setGameOver] = useState(false);

  // Draw board and current piece
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, COLS * BLOCK, ROWS * BLOCK);
    // Draw board
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          ctx.fillStyle = board[r][c];
          ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
          ctx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
        }
      }
    }
    // Draw current piece
    current.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          ctx.fillStyle = current.color;
          ctx.fillRect((pos.x + dx) * BLOCK, (pos.y + dy) * BLOCK, BLOCK, BLOCK);
          ctx.strokeRect((pos.x + dx) * BLOCK, (pos.y + dy) * BLOCK, BLOCK, BLOCK);
        }
      });
    });
  }, [board, current, pos]);

  // Move piece down
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      move(0, 1);
    }, 400);
    return () => clearInterval(interval);
  });

  // Keyboard controls
  useEffect(() => {
    const handle = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  });

  function collide(nx, ny, shape = current.shape) {
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        if (shape[dy][dx]) {
          const x = nx + dx;
          const y = ny + dy;
          if (x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x])) return true;
        }
      }
    }
    return false;
  }

  function merge() {
    const newBoard = board.map((row) => [...row]);
    current.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = pos.x + dx;
          const y = pos.y + dy;
          if (y >= 0) newBoard[y][x] = current.color;
        }
      });
    });
    return newBoard;
  }

  function move(dx, dy) {
    if (!collide(pos.x + dx, pos.y + dy)) {
      setPos({ x: pos.x + dx, y: pos.y + dy });
    } else if (dy === 1) {
      // Piece landed
      const newBoard = merge();
      // Check for lines
      let lines = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newBoard[r].every((cell) => cell)) {
          newBoard.splice(r, 1);
          newBoard.unshift(Array(COLS).fill(null));
          lines++;
        }
      }
      if (lines) {
        const newScore = score + lines * 100;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('tetrisHighScore', newScore);
        }
      }
      // New piece
      setBoard(newBoard);
      const next = randomShape();
      setCurrent(next);
      setPos({ x: 3, y: 0 });
      // Game over check
      if (collide(3, 0, next.shape)) {
        setGameOver(true);
      }
    }
  }

  function rotate() {
    const shape = current.shape;
    const rotated = shape[0].map((_, i) => shape.map((row) => row[i])).reverse();
    if (!collide(pos.x, pos.y, rotated)) {
      setCurrent({ ...current, shape: rotated });
    }
  }

  function restart() {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setCurrent(randomShape());
    setPos({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
  }

  return (
    <div>
      <h2>Tetris</h2>
      <canvas ref={canvasRef} width={COLS * BLOCK} height={ROWS * BLOCK} tabIndex={0} />
      <p>Score: {score} | High Score: {highScore}</p>
      {gameOver && <div><strong>Game Over!</strong> <button onClick={restart}>Restart</button></div>}
      <p>Arrow keys to move, Up to rotate.</p>
    </div>
  );
}

export default Tetris;
