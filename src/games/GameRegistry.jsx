import React from 'react';

// Lazy-load heavy game modules to improve initial load
const ClickerGame = React.lazy(() => import('./Game1/ClickerGame'));
const Tetris = React.lazy(() => import('./Game3/Tetris'));
const MathGame = React.lazy(() => import('./Game4/Math'));
const SnakeGame = React.lazy(() => import('./Game2/Snake'));
const MemoryCard = React.lazy(() => import('./Game5/MemoryCard'));
const TicTacToe = React.lazy(() => import('./Game6/TicTacToe'));
const RockPaperScissors = React.lazy(() => import('./Game7/RockPaperScissors'));
const Hangman = React.lazy(() => import('./Game8/Hangman'));
const Minesweeper = React.lazy(() => import('./Game9/Minesweeper'));
const WarCardGame = React.lazy(() => import('./Game10/WarCardGame'));
const Blackjack = React.lazy(() => import('./Game11/Blackjack'));
const HigherLower = React.lazy(() => import('./Game12/HigherLower'));

// Export importers so callers can prefetch bundles on hover
export const GAME_IMPORTERS = {
  ClickerGame: () => import('./Game1/ClickerGame'),
  Tetris: () => import('./Game3/Tetris'),
  MathGame: () => import('./Game4/Math'),
  SnakeGame: () => import('./Game2/Snake'),
  MemoryCard: () => import('./Game5/MemoryCard'),
  TicTacToe: () => import('./Game6/TicTacToe'),
  RockPaperScissors: () => import('./Game7/RockPaperScissors'),
  Hangman: () => import('./Game8/Hangman'),
  Minesweeper: () => import('./Game9/Minesweeper'),
  WarCardGame: () => import('./Game10/WarCardGame'),
  Blackjack: () => import('./Game11/Blackjack'),
  HigherLower: () => import('./Game12/HigherLower'),
};

export const prefetchGame = (key) => {
  try {
    const fn = GAME_IMPORTERS[key];
    if (fn) fn();
  } catch (e) {
    // ignore
  }
};

const PlaceholderGame = () => (
  <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
    <h2>🚧 Game Under Construction 🚧</h2>
  </div>
);

export const GAME_COMPONENTS = {
  "ClickerGame": ClickerGame,
  "Tetris": Tetris,
  "MathGame": MathGame,
  "SnakeGame": SnakeGame,
  "MemoryCard": MemoryCard,
  "TicTacToe": TicTacToe,
  "RockPaperScissors": RockPaperScissors,
  "Hangman": Hangman,
  "Minesweeper": Minesweeper,
  "WarCardGame": WarCardGame,
  "Blackjack": Blackjack,
  "HigherLower": HigherLower,
  "PlaceholderGame": PlaceholderGame
};