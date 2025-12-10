import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const Snake = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
  const [gameOver, setGameOver] = useState(false);
  const tileSize = 20;
  const gridSize = 20; // 20x20 grid
  const canvasSize = tileSize * gridSize;

  // Initial snake: 3 segments, moving right
  const [snake, setSnake] = useState([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // Right
  const [food, setFood] = useState({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
  // Try to restore persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem('snakeState');
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.snake && Array.isArray(s.snake)) {
          setSnake(s.snake);
          setDirection(s.direction || { x: 1, y: 0 });
          setFood(s.food || { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
          setScore(s.score || 0);
          setGameOver(!!s.gameOver);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist state to localStorage whenever relevant pieces change
  useEffect(() => {
    const payload = { snake, direction, food, score, gameOver };
    try { localStorage.setItem('snakeState', JSON.stringify(payload)); } catch (e) {}
  }, [snake, direction, food, score, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 100); // Speed: 100ms per tick

    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wall collision (wraparound optional; here it's game over)
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      endGame();
      return;
    }

    // Self collision
    if (newSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      endGame();
      return;
    }

    newSnake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
    } else {
      newSnake.pop(); // Don't grow
    }

    setSnake(newSnake);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score);
    }
  };

  const restart = () => {
    setSnake([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
    setScore(0);
    setGameOver(false);
  };

  // Draw on canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1e293b'; // Match your dark theme
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    ctx.fillStyle = '#22c55e'; // Green
    snake.forEach((seg) => {
      ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
    });

    // Draw food
    ctx.fillStyle = '#ef4444'; // Red apple
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  }, [snake, food]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', width: '100%', background: '#0f172a', padding: '1rem', position: 'relative',
      boxSizing: 'border-box',
    }}>
      <div style={{ marginBottom: '1rem', color: 'white', fontSize: '1.1rem', textAlign: 'center' }}>
        Score: {score} | High Score: {highScore}
      </div>
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} style={{ border: '2px solid #08bad1', borderRadius: '12px', maxWidth: '100%', height: 'auto', background: '#1e293b' }} />
      {gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', borderRadius: '12px',
          zIndex: 10,
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ef4444', marginBottom: '1rem' }}>Game Over!</h2>
          <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Score: {score}</p>
          <button
            onClick={restart}
            style={{
              padding: '14px 40px', fontSize: '1.1rem', fontWeight: 600,
              background: 'linear-gradient(90deg, #08bad1 0%, #60a5fa 100%)', color: 'white',
              border: 'none', borderRadius: '8px', boxShadow: '0 2px 12px #08bad188',
              cursor: 'pointer', transition: 'background 0.2s', marginTop: '8px',
            }}
            onMouseOver={e => e.target.style.background = 'linear-gradient(90deg, #60a5fa 0%, #08bad1 100%)'}
            onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #08bad1 0%, #60a5fa 100%)'}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Snake;