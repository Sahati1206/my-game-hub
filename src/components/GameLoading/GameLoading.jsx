import React from 'react';
import { useReducedMotion } from 'framer-motion';

const palFor = (key) => {
  switch ((key || '').toLowerCase()) {
    case 'snake': return { primary: '#16a34a', secondary: '#059669' };
    case 'tetris': return { primary: '#06b6d4', secondary: '#0ea5e9' };
    case 'clickergame': case 'clicker-hero': return { primary: '#0ea5e9', secondary: '#60a5fa' };
    case 'memorycard': case 'memory-card': return { primary: '#08b7c1', secondary: '#f97316' };
    case 'tictactoe': case 'tic-tac-toe': return { primary: '#fbbf24', secondary: '#c7d4df' };
    case 'rockpaperscissors': case 'rock-paper-scissors': return { primary: '#94a3b8', secondary: '#7c3aed' };
    case 'hangman': return { primary: '#c7d4df', secondary: '#94a3b8' };
    case 'minesweeper': return { primary: '#ef4444', secondary: '#94a3b8' };
    case 'warcardgame': case 'war-card-game': return { primary: '#ffffff', secondary: '#eab308' };
    case 'blackjack': return { primary: '#fef3c7', secondary: '#f59e0b' };
    case 'higherlower': case 'higher-lower': return { primary: '#8b5cf6', secondary: '#06b6d4' };
    case 'mathgame': case 'math-quiz': return { primary: '#f59e0b', secondary: '#fde68a' };
    default: return { primary: '#8b5cf6', secondary: '#06b6d4' };
  }
};

const Spinner = ({ color, reduced }) => (
  <svg width="56" height="56" viewBox="0 0 50 50" aria-hidden>
    <circle cx="25" cy="25" r="20" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="31.4 31.4">
      {!reduced && (
        <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="0.9s" repeatCount="indefinite" />
      )}
    </circle>
  </svg>
);

const SnakeLoader = ({ pal, reduced }) => (
  <svg width="160" height="56" viewBox="0 0 160 56" aria-hidden>
    <defs>
      <linearGradient id="g-snake" x1="0" x2="1">
        <stop offset="0%" stopColor={pal.primary} />
        <stop offset="100%" stopColor={pal.secondary} />
      </linearGradient>
    </defs>
    <rect x="6" y="10" width="148" height="36" rx="8" fill="none" stroke="url(#g-snake)" strokeWidth="3" />
    <circle cx="20" cy="28" r="6" fill="url(#g-snake)">
      {!reduced && (
        <animate attributeName="cx" values="20;80;140" dur="1.6s" repeatCount="indefinite" />
      )}
    </circle>
  </svg>
);

const TetrisLoader = ({ pal, reduced }) => (
  <svg width="160" height="56" viewBox="0 0 160 56" aria-hidden>
    <rect x="6" y="6" width="148" height="44" rx="6" fill="#071226" opacity="0.06" />
    <rect x="14" y="12" width="12" height="12" rx="2" fill={pal.primary}>
      {!reduced && (
        <animate attributeName="y" values="12;28;12" dur="0.9s" repeatCount="indefinite" />
      )}
    </rect>
    <rect x="34" y="12" width="12" height="12" rx="2" fill={pal.secondary}>
      {!reduced && (
        <animate attributeName="y" values="28;12;28" dur="1.0s" repeatCount="indefinite" />
      )}
    </rect>
    <rect x="54" y="12" width="12" height="12" rx="2" fill={pal.primary}>
      {!reduced && (
        <animate attributeName="y" values="12;24;12" dur="1.1s" repeatCount="indefinite" />
      )}
    </rect>
  </svg>
);

const CardShuffle = ({ pal, reduced }) => (
  <svg width="160" height="56" viewBox="0 0 160 56" aria-hidden>
    <rect x="6" y="6" width="148" height="44" rx="6" fill="#071226" opacity="0.04" />
    <g>
      <rect x="18" y="12" width="44" height="60" rx="6" fill={pal.primary} opacity="0.12" transform="translate(0 -8)">
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;6 -6;0 0" dur="1.6s" repeatCount="indefinite" />
        )}
      </rect>
      <rect x="38" y="6" width="44" height="60" rx="6" fill={pal.secondary} opacity="0.10" transform="translate(0 -8)">
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;-6 6;0 0" dur="1.8s" repeatCount="indefinite" />
        )}
      </rect>
    </g>
  </svg>
);

const MemoryLoader = ({ pal, reduced }) => (
  <svg width="160" height="56" viewBox="0 0 160 56" aria-hidden>
    <rect x="6" y="6" width="148" height="44" rx="6" fill="#071226" opacity="0.04" />
    <g transform="translate(12,10)">
      <rect x="0" y="0" width="36" height="44" rx="6" fill={pal.primary}>
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -6;0 0" dur="1.6s" repeatCount="indefinite" />
        )}
      </rect>
      <rect x="44" y="4" width="36" height="44" rx="6" fill={pal.secondary}>
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -4;0 0" dur="1.3s" repeatCount="indefinite" />
        )}
      </rect>
      <rect x="88" y="8" width="36" height="44" rx="6" fill="#60a5fa">
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -2;0 0" dur="1.1s" repeatCount="indefinite" />
        )}
      </rect>
    </g>
  </svg>
);

const DefaultLoader = ({ pal, reduced }) => <Spinner color={pal.primary} reduced={reduced} />;

const GameLoading = ({ game }) => {
  const prefersReduced = useReducedMotion();
  const key = (game?.componentKey || game?.id || '').toLowerCase();
  const pal = palFor(key || game?.id);

  switch (key) {
    case 'snake':
    case 'snakegame':
      return <div style={{display:'flex',alignItems:'center',gap:12}}><SnakeLoader pal={pal} reduced={prefersReduced} /><div style={{color:'#fff'}}>Loading {game?.title || 'Snake'}…</div></div>;
    case 'tetris':
    case 'tetrisgame':
    case 'box-dodger':
      return <div style={{display:'flex',alignItems:'center',gap:12}}><TetrisLoader pal={pal} reduced={prefersReduced} /><div style={{color:'#fff'}}>Loading {game?.title || 'Tetris'}…</div></div>;
    case 'memorycard':
    case 'memory-card':
      return <div style={{display:'flex',alignItems:'center',gap:12}}><MemoryLoader pal={pal} reduced={prefersReduced} /><div style={{color:'#fff'}}>Loading {game?.title || 'Memory'}…</div></div>;
    case 'clickergame':
    case 'clicker-hero':
      return <div style={{display:'flex',alignItems:'center',gap:12}}><Spinner color={pal.primary} reduced={prefersReduced} /><div style={{color:'#fff'}}>Loading {game?.title || 'Clicker'}…</div></div>;
    case 'higherlower':
    case 'higher-lower':
      return <div style={{display:'flex',alignItems:'center',gap:12}}><CardShuffle pal={pal} reduced={prefersReduced} /><div style={{color:'#fff'}}>Shuffling {game?.title || 'Game'}…</div></div>;
    default:
      return <div style={{display:'flex',alignItems:'center',gap:12}}><DefaultLoader pal={pal} reduced={prefersReduced} /><div style={{color:'#fff'}}>Loading {game?.title || 'Game'}…</div></div>;
  }
};

export default GameLoading;
