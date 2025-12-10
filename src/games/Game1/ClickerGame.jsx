import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resetClickerPR, getClickerPR } from '../../utils/localStorageHelpers';

const ClickerGame = ({ resetPR = false }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => getClickerPR());
  const [isNewPR, setIsNewPR] = useState(false);

  useEffect(() => {
    if (resetPR) {
      resetClickerPR();
      setHighScore(0);
    }
  }, [resetPR]);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      // check PR
      if (score > highScore) {
        setHighScore(score);
        try { localStorage.setItem('highScore:clicker-hero', String(score)); } catch (e) {}
        setIsNewPR(true);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleClick = () => {
    if (!isPlaying && !gameOver) setIsPlaying(true);
    if (isPlaying) setScore(s => s + 1);
  };

  const reset = () => {
    setScore(0);
    setTimeLeft(10);
    setGameOver(false);
    setIsPlaying(false);
    setIsNewPR(false);
  };

  return (
    <div style={{ 
      width: '100%', height: '100%', 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'monospace'
    }}>
      <h2 style={{ fontSize: '2rem' }}>SCORE: {score}</h2>
      <h3 style={{ fontSize: '1.5rem', color: timeLeft < 4 ? '#ff4b4b' : 'white' }}>
        TIME: {timeLeft}s
      </h3>

      {gameOver ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1>GAME OVER</h1>
          <div style={{ marginTop: 6, marginBottom: 8 }}>{isNewPR ? <strong style={{ color: '#b6f3c7' }}>New PR!</strong> : `PR: ${highScore}`}</div>
          <button 
            onClick={reset}
            style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', marginTop: '10px' }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          style={{
            marginTop: '30px',
            width: '150px', height: '150px',
            borderRadius: '50%',
            border: 'none',
            background: '#ff4b4b',
            color: 'white',
            fontSize: '1.5rem', fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 0 #bd0000'
          }}
        >
          {isPlaying ? "CLICK!" : "START"}
        </motion.button>
      )}
      <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 12, color: '#c7d4df', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div>PR: {highScore}</div>
        <button
          onClick={() => {
            // Use helper to aggressively clear any legacy keys and ensure canonical key set to 0
            resetClickerPR();
            setHighScore(0);
          }}
          title="Reset PR"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
        >Reset PR</button>
      </div>
    </div>
  );
};

export default ClickerGame;