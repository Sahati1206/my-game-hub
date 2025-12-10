import React, { useState, useEffect, useRef } from 'react';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation() {
  const a = getRandomInt(1, 20);
  const b = getRandomInt(1, 20);
  const op = ['+', '-', '*'][getRandomInt(0, 2)];
  let answer;
  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '*': answer = a * b; break;
    default: answer = 0;
  }
  return { question: `${a} ${op} ${b}`, answer };
}

function MathGame() {
  const [eq, setEq] = useState(generateEquation());
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('mathHighScore')) || 0);
  const [time, setTime] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const timer = useRef();

  useEffect(() => {
    if (gameOver) return;
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
  }, [gameOver]);

  const checkAnswer = () => {
    if (Number(input) === eq.answer) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('mathHighScore', newScore);
      }
      setEq(generateEquation());
      setInput('');
      setTime(10);
    } else {
      setGameOver(true);
      clearInterval(timer.current);
    }
  };

  const restart = () => {
    setEq(generateEquation());
    setInput('');
    setScore(0);
    setTime(10);
    setGameOver(false);
  };

  return (
    <div>
      <h2>Math Game</h2>
      <p>Solve: {eq.question}</p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        disabled={gameOver}
      />
      <button onClick={checkAnswer} disabled={gameOver}>Submit</button>
      <p>Score: {score} | High Score: {highScore}</p>
      <p>Time left: {time}s</p>
      {gameOver && <div><strong>Game Over!</strong> <button onClick={restart}>Restart</button></div>}
    </div>
  );
}

export default MathGame;
