import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SUITS = ['♠','♥','♦','♣'];
const RANKS = [2,3,4,5,6,7,8,9,10,11,12,13,14]; // 11=J 12=Q 13=K 14=A

function makeDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ rank: r, suit: s });
    }
  }
  return deck;
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length -1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const rankLabel = (r) => {
  if (r === 14) return 'A';
  if (r === 13) return 'K';
  if (r === 12) return 'Q';
  if (r === 11) return 'J';
  return String(r);
};

const CardView = ({ card, hidden = false, style }) => (
  <div style={{
    width: '7.5rem', height: '10rem', borderRadius: '0.75rem', background: hidden ? '#0b1220' : '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: hidden ? '#08bad1' : (card && (card.suit === '♥' || card.suit === '♦') ? '#ef4444' : '#071226'), border: '2px solid rgba(255,255,255,0.06)', ...style
  }}>
    {hidden ? (
      <div style={{ fontSize: '2.5rem', opacity: 0.25 }}>?</div>
    ) : (
      <>
        <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>{card && rankLabel(card.rank)}</div>
        <div style={{ fontSize: '2.5rem' }}>{card && card.suit}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{card ? `${card.rank}` : ''}</div>
      </>
    )}
  </div>
);

function HigherLower() {
  const [deck, setDeck] = useState(() => shuffle(makeDeck()));
  const [current, setCurrent] = useState(() => deck.length ? deck[0] : null);
  const initialRef = useRef(null);
  const [index, setIndex] = useState(1); // next draw index
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Make your guess');
  const [revealed, setRevealed] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  // removed blur/resolving state
  const [showPlus, setShowPlus] = useState(false);
  const prefersReduced = useReducedMotion();
  const [animMove, setAnimMove] = useState(false);
  const [animFlipOut, setAnimFlipOut] = useState(false);
  const [animFlipIn, setAnimFlipIn] = useState(false);
  const [revealFlip, setRevealFlip] = useState(false);
  const [finalFlip, setFinalFlip] = useState(false);

  const restart = () => {
    const d = shuffle(makeDeck());
    setDeck(d);
    setCurrent(d[0]);
    setIndex(1);
    setScore(0);
    setMessage('Make your guess');
    setRevealed(null);
    setDisabled(false);
  };

  // remember the initial card (only-random-once behavior)
  useEffect(() => {
    if (!initialRef.current && current) initialRef.current = current;
  }, [current]);

  const drawNext = () => {
    if (index >= deck.length) return null;
    // draw from deck in order (normal behavior)
    return deck[index];
  };

  const randomCard = () => {
    const d = makeDeck();
    return d[Math.floor(Math.random() * d.length)];
  };

  const handleGuess = (guessHigher) => {
    if (disabled || resolving) return;
    const next = drawNext();
    if (!next) {
      setMessage('No more cards — reshuffle to play again');
      return;
    }

    // sequence: reveal flip -> show result and +1 -> blur wait (~2.8s) -> final smooth flip swap
    setDisabled(true);
    setRevealed(next);
    setRevealFlip(true); // animate initial reveal flip
    setShowSuccess(false);

    const revealDur = prefersReduced ? 120 : 700; // reveal animation duration
    const preBlurDelay = prefersReduced ? 120 : 6000; // wait BEFORE starting blur
    const blurDuration = prefersReduced ? 120 : 4000; // blur lasts this long

    // After reveal animation, evaluate correctness and show +1 if correct
    setTimeout(() => {
      setRevealFlip(false);
      const correct = guessHigher ? (next.rank > current.rank) : (next.rank < current.rank);
      // start the resolving overlay immediately so the message is readable
      setResolving(true);
      if (next.rank === current.rank) {
        // Tie: player keeps their card; AI/next becomes random
        setMessage('Tie — you keep your card');
        setShowFailure(false);
        setShowSuccess(false);
        // replace upcoming card with a random card
        setDeck(prev => {
          const copy = prev.slice();
          if (copy[index]) copy[index] = randomCard();
          return copy;
        });
        // advance the index so we don't repeat the same slot
        setIndex(i => i + 1);
      } else if (correct) {
        setMessage('Great Job!');
        setScore(s => s + 1);
        setShowPlus(true);
        setShowSuccess(true);
        setShowFailure(false);
        // hide +1 after a short moment (keeps visible during final flip)
        setTimeout(() => setShowPlus(false), 1700);
      } else {
        setMessage('Wrong — both cards replaced');
        setScore(0);
        setShowFailure(true);
        setShowSuccess(false);
      }

      // short pause so player can see result, then run final flip sequence
      const postRevealPause = prefersReduced ? 120 : 900;
      // how long the resolving overlay/blur stays so the message can be read
      const resolvingHold = prefersReduced ? 120 : 4500; // increased to 4.5s for readability
      setTimeout(() => {
        // perform final flip/move animation: shrink revealed, swap, then flip-in current
        setFinalFlip(true);
        setAnimMove(true);

        setTimeout(() => {
          if (correct) {
            // player wins: they take the revealed card; opponent/new next becomes random
            setCurrent(next);
            setIndex(i => i + 1);
            // replace upcoming card at current index with a random card
            setDeck(prev => {
              const copy = prev.slice();
              if (copy[index]) copy[index] = randomCard();
              return copy;
            });
          } else {
            // player lost: both cards become random
            const newCurrent = randomCard();
            const newNext = randomCard();
            setCurrent(newCurrent);
            // ensure deck's upcoming card matches the new random next
            setDeck(prev => {
              const copy = prev.slice();
              if (copy[index]) copy[index] = newNext;
              return copy;
            });
            setIndex(i => i + 1);
          }
          setFinalFlip(false);
          setAnimMove(false);
          setAnimFlipIn(true);

          setTimeout(() => {
            setAnimFlipIn(false);
                setRevealed(null);
                setDisabled(false);
                setShowPlus(false);
                setShowSuccess(false);
                setShowFailure(false);
                setResolving(false);
          }, prefersReduced ? 120 : 420);
        }, resolvingHold);
      }, postRevealPause);
    }, revealDur);
  };

  return (
    <div style={{ maxWidth: '42.5rem', margin: '2rem auto', background: '#1a2233', borderRadius: '1rem', padding: '1.5rem', color: 'white', boxShadow: '0 0.125rem 1rem #0002', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Higher or Lower</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 0 }}>Guess whether the next card is higher or lower. If you're right, the revealed card becomes your card for the following round.</p>

      {/* blur overlay while resolving */}
      {resolving && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: showFailure ? 'rgba(120,10,12,0.45)' : 'rgba(2,6,23,0.45)', backdropFilter: 'blur(6px)', transition: 'opacity 220ms' }} />
      )}

      <div style={{ display: 'flex', gap: '1.125rem', alignItems: 'center', justifyContent: 'center', marginTop: '1.125rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Your Card</div>
            <motion.div layout style={{ display: 'inline-block', transformStyle: 'preserve-3d' }} animate={animFlipIn ? { scaleX: [0.02,1], rotateY: [90,0] } : { scaleX: 1 }} transition={{ duration: prefersReduced ? 0 : 0.42 }}>
            <CardView card={current} hidden={!current} style={{ transformOrigin: 'center' }} />
          </motion.div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Next Card</div>
          <motion.div
            layout
            style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
            animate={
              revealFlip
                ? { rotateY: [90, 0], scaleX: [0.96, 1], opacity: [0, 1] }
                : finalFlip
                ? { scaleX: [1, 0.02], opacity: [1, 0.9] }
                : animMove
                ? { x: '-10rem', rotate: -6, scale: 0.98 }
                : { x: 0, rotate: 0, scale: 1, scaleX: 1 }
            }
            transition={{ duration: prefersReduced ? 0 : 0.52 }}
          >
            <CardView card={revealed} hidden={!revealed} style={{ transformOrigin: 'left center' }} />
          </motion.div>
        </div>
      </div>

      {/* +1 floating */}
      {showPlus && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: '-3rem' }} exit={{ opacity: 0 }} transition={{ duration: 1.0 }} style={{ position: 'absolute', left: '50%', top: '22%', transform: 'translateX(-50%)', zIndex: 40, pointerEvents: 'none', color: '#b6f3c7', fontWeight: 800 }}>
          <div style={{ fontSize: '2rem', textShadow: '0 0.625rem 1.625rem rgba(0,0,0,0.6)' }}>+1</div>
        </motion.div>
      )}

      {/* Success centered panel */}
      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 45, pointerEvents: 'none', background: 'rgba(255,255,255,0.03)', padding: '1.125rem 1.625rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#b6f3c7' }}>Great Job!</div>
          <div style={{ marginTop: '0.375rem', color: 'var(--text-muted)' }}>Current score: <strong style={{ color: 'white' }}>{score}</strong></div>
        </motion.div>
      )}

      {showFailure && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 45, pointerEvents: 'none', background: 'rgba(20,6,6,0.6)', padding: '1.125rem 1.625rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid rgba(255,40,40,0.12)' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffb6b6' }}>Wrong</div>
          <div style={{ marginTop: '0.375rem', color: 'var(--text-muted)' }}>Both cards were replaced.</div>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.125rem' }}>
        <button onClick={() => handleGuess(true)} disabled={disabled} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: '#2b7df0', border: 'none', color: 'white', cursor: 'pointer' }}>Higher</button>
        <button onClick={() => handleGuess(false)} disabled={disabled} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer' }}>Lower</button>
        <button onClick={restart} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', cursor: 'pointer' }}>Restart</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, alignItems: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{message}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score</div>
          <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{score}</div>
        </div>
      </div>
    </div>
  );
}

export default HigherLower;
