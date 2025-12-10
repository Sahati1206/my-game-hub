import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#06b6d4','#7c3aed','#f59e0b','#ef4444','#34d399','#60a5fa'];

function random(min, max) { return Math.random() * (max - min) + min; }

const Confetti = () => {
  const [bursts, setBursts] = useState([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onBeatPR(e) {
      // add a burst id
      const id = Date.now();
      setBursts(b => [...b, { id, created: Date.now() }]);
      // clean up after 2s
      setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 2000);
    }
    window.addEventListener('badge:beat-pr', onBeatPR);
    return () => window.removeEventListener('badge:beat-pr', onBeatPR);
  }, []);

  if (bursts.length === 0) return null;

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {bursts.map(b => (
        <div key={b.id} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const left = `${random(10, 90)}%`;
            const size = random(8, 14);
            const bg = COLORS[i % COLORS.length];
            const rotate = random(-360, 360);
            if (reduce) {
              return <div key={i} style={{ position: 'absolute', left, top: '20%', width: size, height: size, background: bg, borderRadius: 4, opacity: 0.9 }} />;
            }
            return (
              <motion.div key={i}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: random(180, 420), opacity: 1, rotate }}
                transition={{ duration: random(0.9, 1.6), ease: 'easeOut' }}
                style={{ position: 'absolute', left, top: '8%', width: size, height: size, background: bg, borderRadius: 4, boxShadow: '0 6px 18px rgba(0,0,0,0.28)' }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
