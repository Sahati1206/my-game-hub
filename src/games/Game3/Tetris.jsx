import React, { useRef, useEffect, useState } from 'react';

// Tetris shapes
const SHAPES = [
  [[1, 1, 1, 1]], // I (cyan)
  [[1, 1], [1, 1]], // O (yellow)
  [[0, 1, 0], [1, 1, 1]], // T (purple)
  [[1, 0, 0], [1, 1, 1]], // L (orange)
  [[0, 0, 1], [1, 1, 1]], // J (blue)
  [[1, 1, 0], [0, 1, 1]], // S (green)
  [[0, 1, 1], [1, 1, 0]], // Z (red)
];

const COLORS = ['cyan', 'yellow', 'purple', 'orange', 'blue', 'green', 'red'];

const ROWS = 20;
const COLS = 10;
const BLOCK = 24;
const DROP_INTERVAL = 400; // Original drop speed in ms

function randomShape() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[idx], color: COLORS[idx], idx };
}

// 7-bag generator for fair Tetris distribution
function createBag() {
  const indices = Array.from({ length: SHAPES.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.map((idx) => ({ shape: SHAPES[idx], color: COLORS[idx], idx }));
}

function getInitialState(shape) {
    const shapeWidth = shape.shape[0].length;
    return {
        x: Math.floor((COLS - shapeWidth) / 2), // Spawn piece near the center top
        y: 0 
    };
}

function Tetris() {
  const canvasRef = useRef(null);
  const canvasPreviewRef = useRef(null);

  // bag stored in ref so it persists without re-rendering on each draw
  const bagRef = useRef(createBag());
  function drawFromBag() {
    if (!bagRef.current || bagRef.current.length === 0) bagRef.current = createBag();
    return bagRef.current.shift();
  }

  const [current, setCurrent] = useState(() => drawFromBag());
  // queue of upcoming pieces (show next 1)
  const [nextQueue, setNextQueue] = useState(() => [drawFromBag()]);
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [pos, setPos] = useState(getInitialState(current));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('tetrisHighScore')) || 0);
  const [gameOver, setGameOver] = useState(false);

  // Try to restore persisted game state for Tetris
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tetrisState');
      if (raw) {
        const s = JSON.parse(raw);
        if (s) {
          if (Array.isArray(s.board)) setBoard(s.board);
          if (s.current) setCurrent(s.current);
          if (s.pos) setPos(s.pos);
          if (Array.isArray(s.nextQueue)) setNextQueue(s.nextQueue);
          if (s.bag) bagRef.current = s.bag;
          if (typeof s.score === 'number') setScore(s.score);
          if (typeof s.highScore === 'number') setHighScore(s.highScore);
          if (s.gameOver) setGameOver(true);
        }
      }
    } catch (e) {
      // ignore invalid state
    }
  }, []);

  // Persist Tetris state whenever important pieces change
  useEffect(() => {
    const payload = {
      board,
      current,
      pos,
      nextQueue,
      bag: bagRef.current,
      score,
      highScore,
      gameOver,
      ts: Date.now()
    };
    try { localStorage.setItem('tetrisState', JSON.stringify(payload)); } catch (e) {}
  }, [board, current, pos, nextQueue, score, highScore, gameOver]);

  // --- Core Game Logic Functions ---

  function collide(nx, ny, shape = current.shape) {
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        if (shape[dy][dx]) {
          const x = nx + dx;
          const y = ny + dy;
          
          // Check horizontal walls and floor (y >= ROWS)
          if (x < 0 || x >= COLS || y >= ROWS) return true;
          
          // Check collision with placed blocks (only if y is on the board)
          if (y >= 0 && board[y][x]) return true;
        }
      }
    }
    return false;
  }

  function merge() {
    // We must deeply copy the board before modifying it
    const newBoard = board.map((row) => [...row]); 
    current.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = pos.x + dx;
          const y = pos.y + dy;
          // Only merge if block is within the board (y >= 0)
          if (y >= 0) newBoard[y][x] = current.color; 
        }
      });
    });
    return newBoard;
  }

  function move(dx, dy) {
    if (gameOver) return;

    if (dy === 0) { // Horizontal movement (ArrowLeft/ArrowRight)
      // Check if the piece can move horizontally without collision
      if (!collide(pos.x + dx, pos.y)) {
        setPos(prev => ({ x: prev.x + dx, y: prev.y }));
      }
      return; 
    }

    // Vertical movement (ArrowDown or auto-drop)
    setPos(prev => {
      // 1. Check if safe to move down
      if (!collide(prev.x, prev.y + dy)) {
        return { x: prev.x, y: prev.y + dy };
      } 
      
      // 2. Collision detected AND it was a downward move (dy=1) -> Piece landed
      if (dy === 1) {
        const mergedBoard = merge();
        
        // Line clearing and scoring
        let lines = 0;
        let finalBoard = mergedBoard.map(row => [...row]);
        
        // Iterate from bottom up
        for (let r = ROWS - 1; r >= 0; r--) { 
          if (finalBoard[r].every((cell) => cell)) {
            finalBoard.splice(r, 1);
            finalBoard.unshift(Array(COLS).fill(null));
            lines++;
            r++; // IMPORTANT: Check the new row that shifted down into this position
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
        
        // Set up the next piece using the queue (take first from nextQueue)
        setBoard(finalBoard);
        const next = nextQueue[0] || drawFromBag();
        setCurrent(next);
        // advance queue: replace with a single next piece from the bag
        setNextQueue([drawFromBag()]);
        const nextPos = getInitialState(next); // Use the helper for clean initial position
        
        // Game over check: if the new piece collides immediately upon spawn
        if (collide(nextPos.x, nextPos.y, next.shape)) {
          setGameOver(true);
        }
        
        // Return new position (top of the board)
        return nextPos;
      }
      return prev; // No change if collision was non-vertical or not a land
    });
  }

  function rotate() {
    if (gameOver) return;
    
    const shape = current.shape;
    // Standard matrix rotation (transpose and reverse rows)
    const rotated = shape[0].map((_, i) => shape.map((row) => row[i])).reverse();
    
    // Check collision for the rotated shape
    if (!collide(pos.x, pos.y, rotated)) {
      setCurrent({ ...current, shape: rotated });
    }
    // Simple wall kick is not implemented here, only simple rotation check
  }

  function restart() {
    // refill bag and draw fresh pieces
    bagRef.current = createBag();
    const first = drawFromBag();
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setCurrent(first);
    setNextQueue([drawFromBag(), drawFromBag(), drawFromBag()]);
    setPos(getInitialState(first));
    setScore(0);
    setGameOver(false);
  }

  // --- Hooks and Effects ---

  // 1. Drawing Effect (Runs when board, current piece, or position changes)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, COLS * BLOCK, ROWS * BLOCK);

    // Draw left and right edge lines
    ctx.save();
    ctx.strokeStyle = '#08bad1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ROWS * BLOCK);
    ctx.moveTo(COLS * BLOCK, 0);
    ctx.lineTo(COLS * BLOCK, ROWS * BLOCK);
    ctx.stroke();
    ctx.restore();

    // Set up border styling for blocks
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

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

  // --- Draw previews for nextQueue ---
  const previewRefs = useRef([]);
  useEffect(() => {
    // draw the single queued shape (nextQueue[0]) into the first canvas
    const item = nextQueue[0];
    const canvas = previewRefs.current[0];
    if (!item || !canvas) return;
    const ctx = canvas.getContext('2d');
    const PREV_BLOCK = 12;
    const shape = item.shape;
    const h = shape.length;
    const w = shape[0].length;
    const width = w * PREV_BLOCK;
    const height = h * PREV_BLOCK;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetX = Math.floor((canvas.width - width) / 2);
    const offsetY = Math.floor((canvas.height - height) / 2);
    ctx.fillStyle = item.color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    shape.forEach((row, ry) => {
      row.forEach((cell, rx) => {
        if (cell) {
          const x = offsetX + rx * PREV_BLOCK;
          const y = offsetY + ry * PREV_BLOCK;
          ctx.fillRect(x, y, PREV_BLOCK, PREV_BLOCK);
          ctx.strokeRect(x, y, PREV_BLOCK, PREV_BLOCK);
        }
      });
    });
  }, [nextQueue]);

  // 2. Auto-Drop Effect (Runs on a fixed interval)
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      move(0, 1);
    }, DROP_INTERVAL);
    
    return () => clearInterval(interval);
  }, [gameOver, score, current, pos]); // Include dependencies that 'move' uses

  // 3. Keyboard Controls
  useEffect(() => {
    const handle = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1, 0);
      else if (e.key === 'ArrowRight') move(1, 0);
      else if (e.key === 'ArrowDown') move(0, 1);
      else if (e.key === 'ArrowUp' || e.key === ' ') rotate(); // Spacebar also rotates
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [gameOver, pos, current]); // Dependencies for 'move' and 'rotate'

  // --- Component Render ---

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Tetris</h2>
      <canvas 
        ref={canvasRef} 
        width={COLS * BLOCK} 
        height={ROWS * BLOCK} 
        tabIndex={0} 
        style={{ border: '2px solid black', display: 'block', margin: '0 auto' }}
      />
      {/* Next pieces preview */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
        {nextQueue.slice(0,1).map((n, idx) => (
          <canvas
            key={idx}
            ref={(el) => (previewRefs.current[idx] = el)}
            width={80}
            height={64}
            style={{ background: '#071226', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}
          />
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <p>Score: <strong>{score}</strong> | High Score: <strong>{highScore}</strong></p>
        <p>Arrow keys to move, Up/Space to rotate, Down to drop.</p>
      </div>
      
      {gameOver && (
        <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'rgba(30, 41, 59, 0.98)', 
            padding: '32px 24px', 
            borderRadius: '16px', 
            border: '4px solid #08bad1',
            boxShadow: '0 4px 32px #0008',
            color: 'white',
            minWidth: '260px',
            zIndex: 10
        }}>
          <strong style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '8px', display: 'block' }}>Game Over!</strong>
          <p style={{ fontSize: '1.1rem', marginBottom: '18px' }}>Final Score: <span style={{ color: '#08bad1', fontWeight: 700 }}>{score}</span></p>
          <button 
            onClick={restart} 
            style={{ 
              padding: '12px 32px', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              background: 'linear-gradient(90deg, #08bad1 0%, #60a5fa 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 2px 12px #08bad188', 
              cursor: 'pointer', 
              transition: 'background 0.2s',
              marginTop: '8px'
            }}
            onMouseOver={e => e.target.style.background = 'linear-gradient(90deg, #60a5fa 0%, #08bad1 100%)'}
            onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #08bad1 0%, #60a5fa 100%)'}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default Tetris;