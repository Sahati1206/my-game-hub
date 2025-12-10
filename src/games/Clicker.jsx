import React, { useState } from 'react';
import { resetClickerPR, getClickerPR } from '../utils/localStorageHelpers';

function Clicker() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getClickerPR());

  const handleClick = () => {
    const newScore = score + 1;
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      try { localStorage.setItem('highScore:clicker-hero', String(newScore)); } catch (e) {}
    }
  };

  const reset = () => {
    setScore(0);
    // reset PR as well via helper
    resetClickerPR();
    setHighScore(0);
  };

  return (
    <div>
      <h2>Clicker Game</h2>
      <p>Score: {score} | PR: {highScore}</p>
      <button onClick={handleClick}>Click Me!</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Clicker;
