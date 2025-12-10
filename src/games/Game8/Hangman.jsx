import React, { useState } from 'react';

const words = ['react', 'javascript', 'banana', 'apple', 'orange', 'grape', 'melon', 'kiwi'];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function Hangman() {
  const [word, setWord] = useState(getRandomWord());
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [input, setInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState('1P'); // '1P' or 'MP'
  const [players, setPlayers] = useState(2);
  const [turns, setTurns] = useState(6); // custom amount = how many wrong turns allowed
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [chooserIndex, setChooserIndex] = useState(null);
  const [isChoosingWord, setIsChoosingWord] = useState(false);
  const [chooserInput, setChooserInput] = useState('');

  const maxWrong = Number(turns) || 6;
  const display = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');

  function getNextPlayerFrom(p, chooser) {
    const total = Math.max(2, Number(players));
    let next = p;
    do {
      next = (next % total) + 1;
    } while (next === chooser);
    return next;
  }

  function guessLetter() {
    if (!input || guessed.includes(input) || wrong.includes(input) || gameOver || (mode === 'MP' && isChoosingWord) || !word) return;

    // record guess
    if (word.includes(input)) {
      const newGuessed = [...guessed, input];
      setGuessed(newGuessed);
      // check for win
      if (word.split('').every(l => newGuessed.includes(l))) {
        setGameOver(true);
        if (mode === 'MP') setWinner(currentPlayer);
        else setWinner('You');
      }
    } else {
      const newWrong = [...wrong, input];
      setWrong(newWrong);
      if (newWrong.length >= maxWrong) {
        setGameOver(true);
        setWinner(null);
      }
    }

    // advance turn in multiplayer, always skip the chooser
    if (mode === 'MP' && !gameOver) {
      setCurrentPlayer(p => getNextPlayerFrom(p, chooserIndex));
    }

    setInput('');
  }

  function restart() {
    // reset state; in multiplayer choose a new chooser and wait for word
    setGuessed([]);
    setWrong([]);
    setInput('');
    setGameOver(false);
    setWinner(null);
    setCurrentPlayer(1);
    if (mode === 'MP') {
      const pick = Math.floor(Math.random() * Math.max(2, players)) + 1;
      setChooserIndex(pick);
      setIsChoosingWord(true);
      setWord('');
      // start with first non-chooser player
      setCurrentPlayer(getNextPlayerFrom(pick, pick));
    } else {
      setIsChoosingWord(false);
      setChooserIndex(null);
      setWord(getRandomWord());
    }
  }

  function handleModeChange(e) {
    const newMode = e.target.value;
    setMode(newMode);
    if (newMode === 'MP') {
      const pick = Math.floor(Math.random() * Math.max(2, players)) + 1;
      setChooserIndex(pick);
      setIsChoosingWord(true);
      setWord('');
      setGuessed([]);
      setWrong([]);
      setGameOver(false);
      setWinner(null);
      setCurrentPlayer(getNextPlayerFrom(pick, pick));
    } else {
      setIsChoosingWord(false);
      setChooserIndex(null);
      setWord(getRandomWord());
      restart();
    }
  }

  function handlePlayersChange(e) {
    const val = Math.max(2, Number(e.target.value) || 2);
    setPlayers(val);
    setCurrentPlayer(1);
    if (mode === 'MP') {
      const pick = Math.floor(Math.random() * Math.max(2, val)) + 1;
      setChooserIndex(pick);
      setIsChoosingWord(true);
      setWord('');
      setGuessed([]);
      setWrong([]);
      setGameOver(false);
      setWinner(null);
      setCurrentPlayer(getNextPlayerFrom(pick, pick));
    }
  }

  function handleTurnsChange(e) {
    const val = Math.max(1, Number(e.target.value) || 1);
    setTurns(val);
  }

  function submitChooserWord() {
    const w = (chooserInput || '').trim().toLowerCase();
    if (!w || !/^[a-z]+$/.test(w)) return;
    setWord(w);
    setIsChoosingWord(false);
    setChooserInput('');
    setGuessed([]);
    setWrong([]);
    setGameOver(false);
    setWinner(null);
    setCurrentPlayer(1);
  }

  return (
    <div style={{ maxWidth: '20rem', margin: '2rem auto', background: '#1a2233', borderRadius: '1rem', padding: '1.5rem', color: 'white', boxShadow: '0 0.125rem 1rem #0002' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Hangman</h2>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.125rem', marginBottom: '0.75rem' }}>{display}</p>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Mode:</label>
        <select value={mode} onChange={handleModeChange} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.375rem', marginRight: '0.75rem' }}>
          <option value="1P">1 Player</option>
          <option value="MP">Multiplayer</option>
        </select>
        {mode === 'MP' && (
          <>
            <label style={{ marginRight: 8 }}>Players:</label>
            <input type="number" min={2} value={players} onChange={handlePlayersChange} style={{ width: '3.75rem', padding: '0.25rem 0.375rem', borderRadius: '0.375rem', marginRight: '0.75rem' }} />
            <label style={{ marginRight: 8 }}>Turns:</label>
            <input type="number" min={1} value={turns} onChange={handleTurnsChange} style={{ width: '3.75rem', padding: '0.25rem 0.375rem', borderRadius: '0.375rem' }} />
          </>
        )}
      </div>
        {mode === 'MP' && isChoosingWord && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ marginBottom: 8 }}>Player <strong>{chooserIndex}</strong>, please enter the secret word (letters only):</p>
            <input
              type="password"
              value={chooserInput}
              onChange={e => setChooserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitChooserWord()}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1.125rem', borderRadius: '0.5rem', border: '1px solid #333', marginBottom: '0.5rem', outline: 'none' }}
            />
            <button onClick={submitChooserWord} style={{ width: '100%', padding: '0.625rem 0', fontSize: '1rem', borderRadius: '0.5rem', background: '#08bad1', color: 'white', border: 'none' }}>Set Word</button>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#ccc' }}>Other players, please look away while the secret word is entered.</p>
          </div>
        )}
      <input
        type="text"
        maxLength={1}
        value={input}
        onChange={e => setInput(e.target.value.toLowerCase())}
        onKeyDown={e => e.key === 'Enter' && guessLetter()}
        disabled={gameOver || (mode === 'MP' && isChoosingWord) || !word}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1.125rem', borderRadius: '0.5rem', border: '1px solid #333', marginBottom: '0.75rem', outline: 'none' }}
      />
      <button onClick={guessLetter} disabled={gameOver || (mode === 'MP' && isChoosingWord) || !word} style={{ width: '100%', padding: '0.625rem 0', fontSize: '1.125rem', borderRadius: '0.5rem', background: '#08bad1', color: 'white', border: 'none', marginBottom: '0.75rem' }}>Guess</button>

      <p style={{ textAlign: 'center', marginBottom: 8 }}>Wrong guesses: <strong>{wrong.join(', ')}</strong></p>
      <p style={{ textAlign: 'center', marginBottom: 8 }}>Guesses left: <strong>{maxWrong - wrong.length}</strong></p>
      {mode === 'MP' && !gameOver && <p style={{ textAlign: 'center', marginBottom: 8 }}>Player <strong>{currentPlayer}</strong>'s turn</p>}
      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <strong>{winner ? (mode === 'MP' ? `Player ${winner} wins!` : 'You win!') : 'Game Over!'}</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={restart} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', background: '#08bad1', color: 'white', border: 'none' }}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hangman;
