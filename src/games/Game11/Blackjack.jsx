import React, { useState } from 'react';

const suits = ['♠', '♥', '♦', '♣'];
const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
function getDeck() {
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
}
function getValue(card) {
  if (typeof card.value === 'number') return card.value;
  if (card.value === 'A') return 11;
  return 10;
}
function calcScore(hand) {
  let score = hand.reduce((sum, card) => sum + getValue(card), 0);
  let aces = hand.filter(card => card.value === 'A').length;
  while (score > 21 && aces) {
    score -= 10;
    aces--;
  }
  return score;
}
function shuffle(deck) {
  let arr = deck.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Blackjack() {
  const [deck, setDeck] = useState(() => shuffle(getDeck()));
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');

  function deal() {
    if (player.length || dealer.length) return;
    setPlayer([deck[0], deck[2]]);
    setDealer([deck[1], deck[3]]);
    setDeck(deck.slice(4));
  }

  // Double: player takes exactly one card and then stands (dealer plays)
  function doubleBet() {
    // only allowed as first action (after initial deal)
    if (gameOver || player.length !== 2) return;
    // draw one card
    const localDeck = deck.slice();
    const newCard = localDeck.shift();
    const newPlayer = [...player, newCard];
    setPlayer(newPlayer);
    // now dealer plays like in stand
    let dealerHand = [...dealer];
    let dScore = calcScore(dealerHand);
    while (dScore < 17 && localDeck.length) {
      dealerHand.push(localDeck.shift());
      dScore = calcScore(dealerHand);
    }
    setDealer(dealerHand);
    setDeck(localDeck);
    const pScore = calcScore(newPlayer);
    if (dScore > 21 || pScore > dScore) {
      setResult('You win!');
    } else if (pScore < dScore) {
      setResult('Dealer wins.');
    } else {
      setResult('Draw!');
    }
    setGameOver(true);
  }

  function hit() {
    if (gameOver || !player.length) return;
    const localDeck = deck.slice();
    const newCard = localDeck.shift();
    const newHand = [...player, newCard];
    setPlayer(newHand);
    setDeck(localDeck);
    if (calcScore(newHand) > 21) {
      setResult('Bust! Dealer wins.');
      setGameOver(true);
    }
  }

  function stand() {
    if (gameOver || !player.length) return;
    const localDeck = deck.slice();
    let dealerHand = [...dealer];
    let dScore = calcScore(dealerHand);
    while (dScore < 17 && localDeck.length) {
      dealerHand.push(localDeck.shift());
      dScore = calcScore(dealerHand);
    }
    setDealer(dealerHand);
    setDeck(localDeck);
    const pScore = calcScore(player);
    if (dScore > 21 || pScore > dScore) {
      setResult('You win!');
    } else if (pScore < dScore) {
      setResult('Dealer wins.');
    } else {
      setResult('Draw!');
    }
    setGameOver(true);
  }

  function restart() {
    setDeck(shuffle(getDeck()));
    setPlayer([]);
    setDealer([]);
    setGameOver(false);
    setResult('');
  }

  return (
    <div style={{ maxWidth: 340, margin: '2rem auto', background: '#1a2233', borderRadius: 16, padding: 24, color: 'white', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Blackjack</h2>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 6, color: '#c7d4df' }}>Dealer</div>
          <div style={{ background: '#0b1014', padding: 12, borderRadius: 8, minHeight: 42 }}>
            {dealer.length ? (
              (!gameOver && player.length) ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span>{`${dealer[0].value}${dealer[0].suit}`}</span>
                  <span style={{
                    display: 'inline-flex',
                    width: 36,
                    height: 24,
                    background: '#071827',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#c7d4df',
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)'
                  }}>?</span>
                </span>
              ) : dealer.map(card => `${card.value}${card.suit}`).join(' ')
            ) : '—'}
          </div>
          <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Dealer Score: <strong>{calcScore(dealer)}</strong></div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 6, color: '#c7d4df' }}>Player</div>
          <div style={{ background: '#071226', padding: 12, borderRadius: 8, minHeight: 42 }}>{player.length ? player.map(card => `${card.value}${card.suit}`).join(' ') : '—'}</div>
          <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Player Score: <strong>{calcScore(player)}</strong></div>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>{result}</p>
      {!player.length ? (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={deal} style={{ flex: 1, padding: '12px 0', fontSize: 18, borderRadius: 10, background: '#06b6d4', color: 'white', border: 'none' }}>Deal</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <button onClick={hit} disabled={gameOver || !player.length} style={{ flex: 1.4, padding: '14px 0', fontSize: 20, borderRadius: 10, background: '#06b6d4', color: 'white', border: 'none' }}>Hit</button>
          <button onClick={stand} disabled={gameOver || !player.length} style={{ flex: 1, padding: '12px 0', fontSize: 18, borderRadius: 10, background: '#0891b2', color: 'white', border: 'none' }}>Stand</button>
          <button onClick={doubleBet} disabled={gameOver || player.length !== 2} style={{ flex: 1, padding: '12px 0', fontSize: 18, borderRadius: 10, background: '#0ea5e9', color: 'white', border: 'none' }}>Double</button>
        </div>
      )}
      <button onClick={restart} style={{ width: '100%', padding: '10px 0', fontSize: 18, borderRadius: 8, background: '#08bad1', color: 'white', border: 'none', marginTop: 8 }}>Restart</button>
    </div>
  );
}

export default Blackjack;
