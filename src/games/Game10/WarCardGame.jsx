import React, { useState } from 'react';

const suits = ['♠', '♥', '♦', '♣'];
const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
function getDeck() {
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
}
function getValue(val) {
  if (typeof val === 'number') return val;
  if (val === 'A') return 14;
  if (val === 'K') return 13;
  if (val === 'Q') return 12;
  if (val === 'J') return 11;
  return 0;
}
function shuffle(deck) {
  let arr = deck.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function WarCardGame() {
  const [deck, setDeck] = useState(() => shuffle(getDeck()));
  const [playerCard, setPlayerCard] = useState(null);
  const [computerCard, setComputerCard] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [compScore, setCompScore] = useState(0);

  function playRound() {
    if (deck.length < 2) return;
    const [p, c, ...rest] = deck;
    setPlayerCard(p);
    setComputerCard(c);
    const pVal = getValue(p.value);
    const cVal = getValue(c.value);
    if (pVal > cVal) {
      setResult('You win the round!');
      setScore(score + 1);
    } else if (cVal > pVal) {
      setResult('Computer wins the round!');
      setCompScore(compScore + 1);
    } else {
      setResult('Draw!');
    }
    setDeck(rest);
  }

  function restart() {
    setDeck(shuffle(getDeck()));
    setPlayerCard(null);
    setComputerCard(null);
    setResult('');
    setScore(0);
    setCompScore(0);
  }

  return (
    <div style={{ maxWidth: 340, margin: '2rem auto', background: '#1a2233', borderRadius: 16, padding: 24, color: 'white', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>War Card Game</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div>Player</div>
          <div style={{ fontSize: 32 }}>{playerCard ? `${playerCard.value}${playerCard.suit}` : '?'}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>Computer</div>
          <div style={{ fontSize: 32 }}>{computerCard ? `${computerCard.value}${computerCard.suit}` : '?'}</div>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>{result}</p>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>Score: <strong>{score}</strong> | Computer: <strong>{compScore}</strong></p>
      <button onClick={playRound} disabled={deck.length < 2} style={{ width: '100%', padding: '10px 0', fontSize: 18, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none', marginTop: 8 }}>Play Round</button>
      <button onClick={restart} style={{ width: '100%', padding: '10px 0', fontSize: 18, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none', marginTop: 8 }}>Restart</button>
      {deck.length < 2 && <p style={{ textAlign: 'center', marginTop: 12 }}>Game Over!</p>}
    </div>
  );
}

export default WarCardGame;
