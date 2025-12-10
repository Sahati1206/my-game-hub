import React, { useState, useEffect, useRef } from 'react';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation() {
  // Accept difficulty as argument
  return function(difficulty = 'Normal') {
    let a, b, op, answer;
    if (difficulty === 'Easy') {
      a = getRandomInt(1, 10);
      b = getRandomInt(1, 10);
      op = ['+', '-'][getRandomInt(0, 1)];
    } else if (difficulty === 'Normal') {
      a = getRandomInt(1, 20);
      b = getRandomInt(1, 20);
      op = ['+', '-', '*'][getRandomInt(0, 2)];
    } else {
      // Hard: larger numbers, more operators, possible division
      a = getRandomInt(10, 99);
      b = getRandomInt(2, 99);
      op = ['+', '-', '*', '/'][getRandomInt(0, 3)];
    }
    switch (op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
      case '/': answer = Math.floor(a / b); break;
      default: answer = 0;
    }
    return { question: `${a} ${op} ${b}`, answer };
  }
}

function MathGame() {
  const [difficulty, setDifficulty] = useState('Normal');
  const [eq, setEq] = useState(() => generateEquation()(difficulty));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('mathHighScore')) || 0);
  const [time, setTime] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const timer = useRef();

  useEffect(() => {
    if (gameOver) return;
    let baseTime = difficulty === 'Easy' ? 15 : difficulty === 'Normal' ? 10 : 7.5;
    setTime(baseTime);
    timer.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(timer.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [gameOver, difficulty]);

  const checkAnswer = () => {
    if (Number(input) === eq.answer) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('mathHighScore', newScore);
      }
      setEq(generateEquation()(difficulty));
      setInput('');
      setTime(difficulty === 'Easy' ? 15 : difficulty === 'Normal' ? 10 : 7.5);
    } else {
      setGameOver(true);
      clearInterval(timer.current);
    }
  };

  const restart = () => {
    setEq(generateEquation()(difficulty));
    setInput('');
    setScore(0);
    setTime(difficulty === 'Easy' ? 15 : difficulty === 'Normal' ? 10 : 7.5);
    setGameOver(false);
  };

  return (
    <div style={{ maxWidth: 320, margin: '2rem auto', background: '#1a2233', borderRadius: 16, padding: 24, color: 'white', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Math Game</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, marginRight: 8 }}>Difficulty:</label>
        <select 
          value={difficulty} 
          onChange={e => setDifficulty(e.target.value)}
          style={{
            padding: '8px 18px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '2px solid #08bad1',
            background: '#19213a',
            color: '#08bad1',
            fontWeight: 600,
            outline: 'none',
            boxShadow: '0 2px 8px #08bad122',
            cursor: 'pointer',
            transition: 'border 0.2s, color 0.2s',
          }}
          onFocus={e => e.target.style.border = '2px solid #60a5fa'}
          onBlur={e => e.target.style.border = '2px solid #08bad1'}
        >
          <option value="Easy">Easy</option>
          <option value="Normal">Normal</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 12 }}>Solve: <strong>{eq.question}</strong></p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        disabled={gameOver}
        style={{ width: '100%', padding: 8, fontSize: 18, borderRadius: 8, border: '1px solid #333', marginBottom: 12 }}
      />
      <button onClick={checkAnswer} disabled={gameOver} style={{ width: '100%', padding: 10, fontSize: 18, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none', marginBottom: 12 }}>Submit</button>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>Score: <strong>{score}</strong> | High Score: <strong>{highScore}</strong></p>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>Time left: <strong>{time}s</strong></p>
      {gameOver && <div style={{ textAlign: 'center', marginTop: 16 }}><strong>Game Over!</strong> <button onClick={restart} style={{ marginLeft: 8, padding: '6px 16px', borderRadius: 8, background: '#08bad1', color: 'white', border: 'none' }}>Restart</button></div>}
    </div>
  );
}

export default MathGame;
