import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { prefetchGame } from '../../games/GameRegistry';
import { getBadgesForGame } from '../../utils/badges';

const GameCard = ({ game }) => {
  // Map category to specific soft colors
  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Action': return '#ef4444'; // red
      case 'Puzzle': return '#08bad1'; // cyan
      case 'Arcade': return '#22c55e'; // green
      case 'Strategy': return '#f59e42'; // orange
      case 'Card': return '#6366f1'; // indigo
      case 'Board': return '#fbbf24'; // yellow
      case 'Word': return '#eab308'; // gold
      default: return '#08bad1';
    }
  };

  const accentColor = getCategoryColor(game.category);

  // Helpers: derive a primary color from the thumbnail URL (placehold.co style)
  const extractHexFromThumbnail = (url) => {
    if (!url || typeof url !== 'string') return null;
    // Common patterns: /300x200/FFAA33/ or .../FFAA33.png or ?bg=FFAA33
    const m = url.match(/\/(?:\d+x\d+\/)?([0-9A-Fa-f]{6})\//);
    if (m && m[1]) return `#${m[1]}`;
    const m2 = url.match(/([0-9A-Fa-f]{6})(?:\.|$)/);
    if (m2 && m2[1]) return `#${m2[1]}`;
    const q = url.match(/[?&](?:bg|color)=([0-9A-Fa-f]{6})/);
    if (q && q[1]) return `#${q[1]}`;
    return null;
  };

  const hexToRgb = (hex) => {
    if (!hex) return null;
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };

  const luminance = (r,g,b) => {
    const a = [r,g,b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const thumbHex = extractHexFromThumbnail(game.thumbnail || '');
  const thumbRgb = hexToRgb(thumbHex);
  const isThumbLight = thumbRgb ? (luminance(thumbRgb.r, thumbRgb.g, thumbRgb.b) > 0.6) : false;
  const imageOverlay = isThumbLight ? 'linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.28))' : 'linear-gradient(180deg, rgba(0,0,0,0.48), rgba(0,0,0,0.48))';
  const titleColor = isThumbLight ? '#071226' : '#ffffff';
  const accentRgb = hexToRgb(accentColor.replace('#','')) || null;
  const accentGlow = accentRgb ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.30)` : 'rgba(6, 182, 212, 0.20)';
  // Detect system reduced-motion preference (production-ready)
  const systemPrefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // TEMP: Force animations ON for visual testing. Remove after testing.
  const prefersReduced = false;  // TEMP: Force animations ON (remove after testing)
  // For production, switch to the system preference by uncommenting below:
  // const prefersReduced = systemPrefersReduced;
  const decoSpring = { type: 'spring', stiffness: 150, damping: 19, mass: 0.9 };

  const renderDecoration = (id, isHovered) => {
    const colors = (key) => {
      switch(key) {
        case 'snake': return { primary: '#16a34a', secondary: '#059669' };
        case 'blackjack': return { primary: '#fef3c7', secondary: '#f59e0b' };
        case 'rock-paper-scissors': return { primary: '#94a3b8', secondary: '#7c3aed' };
        case 'math-quiz': return { primary: '#f59e0b', secondary: '#fde68a' };
        case 'box-dodger': return { primary: '#60a5fa', secondary: '#34d399' };
        case 'clicker-hero': return { primary: '#0ea5e9', secondary: '#60a5fa' };
        case 'memory-card': return { primary: '#08b7c1', secondary: '#f97316' };
        case 'tic-tac-toe': return { primary: '#fbbf24', secondary: '#c7d4df' };
        case 'hangman': return { primary: '#c7d4df', secondary: '#94a3b8' };
        case 'minesweeper': return { primary: '#ef4444', secondary: '#94a3b8' };
        case 'war-card-game': return { primary: '#ffffff', secondary: '#eab308' };
        default: return { primary: accentColor, secondary: '#ffffff' };
      }
    };

    const pal = colors(id);

    switch(id) {
      case 'snake':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={`gc-sgrad-${game.id}`} x1="0%" x2="100%">
                <stop offset="0%" stopColor={pal.primary} />
                <stop offset="50%" stopColor={pal.secondary} />
                <stop offset="100%" stopColor={pal.primary} />
              </linearGradient>
            </defs>
            <motion.path
              d="M18 120 C60 60, 120 60, 162 120 C204 180, 246 180, 282 120"
              fill="none"
              stroke={`url(#gc-sgrad-${game.id})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="16 10"
              initial={{ strokeDashoffset: 0 }}
              animate={ !prefersReduced && isHovered ? { strokeDashoffset: -140 } : { strokeDashoffset: 0 } }
              transition={ !prefersReduced && isHovered ? { duration: 1.2, ease: 'linear', repeat: Infinity, repeatType: 'loop' } : { duration: 0.6, ease: 'easeOut' } }
            />
            <ellipse cx="30" cy="18" rx="8" ry="6" fill={pal.primary} transform="rotate(-12 30 18)" />
            <circle cx="34" cy="16" r="1.2" fill="#071226" />
            <motion.g transform="translate(220,110)">
              <motion.circle
                cx={28}
                cy={-40}
                r={8}
                fill="#ef4444"
                animate={ !prefersReduced && isHovered ? { cx: [28, 20, 14, 20, 28] } : { cx: 28 } }
                transition={ !prefersReduced && isHovered ? { duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }
              />
            </motion.g>
          </motion.svg>
        );
      case 'blackjack':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.rect x="20" y="60" width="60" height="90" rx="6" fill={pal.primary} opacity="0.95"
              animate={ !prefersReduced && isHovered ? { rotate: [0, 5, 0] } : { rotate: 0 } }
              transition={ !prefersReduced && isHovered ? { duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
              <text x="30" y="45" fontSize="12" fill="#000" textAnchor="middle">K♠</text>
            </motion.rect>
            <motion.rect x="100" y="60" width="60" height="90" rx="6" fill={pal.secondary} opacity="0.95"
              initial={{ opacity: 0 }}
              animate={ !prefersReduced && isHovered ? { opacity: [0, 1, 1] } : { opacity: 0 } }
              transition={ !prefersReduced && isHovered ? { delay: 1, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
              <text x="30" y="45" fontSize="12" fill="#000" textAnchor="middle">K♥</text>
            </motion.rect>
            <text x="90" y="160" fontSize="16" fill="#fff" textAnchor="middle">20</text>
          </motion.svg>
        );
      case 'rock-paper-scissors':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <motion.path d="M60 90 Q70 70 80 90 M80 90 Q70 110 60 90" stroke={pal.primary} strokeWidth="4" fill="none"
              animate={ !prefersReduced && isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 } }
              transition={ !prefersReduced && isHovered ? { duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
            <motion.path d="M200 90 L220 70 L240 90 L220 110 Z" stroke={pal.secondary} strokeWidth="4" fill="none"
              animate={ !prefersReduced && isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 } }
              transition={ !prefersReduced && isHovered ? { duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
          </motion.svg>
        );
      case 'box-dodger':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.rect x="50" y="0" width="20" height="20" rx="3" fill={pal.primary}
              animate={ !prefersReduced && isHovered ? { y: [0, 160] } : { y: 0 } }
              transition={ !prefersReduced && isHovered ? { duration: 3, repeat: Infinity, ease: 'linear', repeatType: 'loop' } : decoSpring } />
            <motion.rect x="100" y="0" width="20" height="20" rx="3" fill={pal.secondary}
              animate={ !prefersReduced && isHovered ? { y: [0, 160] } : { y: 0 } }
              transition={ !prefersReduced && isHovered ? { delay: 0.5, duration: 2.5, repeat: Infinity, ease: 'linear', repeatType: 'loop' } : decoSpring } />
            <motion.rect x="150" y="0" width="20" height="20" rx="3" fill="#f59e0b"
              animate={ !prefersReduced && isHovered ? { y: [0, 160] } : { y: 0 } }
              transition={ !prefersReduced && isHovered ? { delay: 1, duration: 2, repeat: Infinity, ease: 'linear', repeatType: 'loop' } : decoSpring } />
          </motion.svg>
        );
      case 'clicker-hero':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.g transform="translate(16,12)">
              <motion.circle cx="40" cy="40" r={26} fill={pal.primary} opacity={0.95}
                animate={ !prefersReduced && isHovered ? { r: [26, 28, 26] } : { r: 26 } }
                transition={ !prefersReduced && isHovered ? { duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: 0.6 } }
              />
              <motion.text x="40" y={ !prefersReduced && isHovered ? [36, 46, 36] : 46 } fontSize="20" fontWeight="800" fill="#fff" textAnchor="middle"
                transition={ !prefersReduced && isHovered ? { duration: 1.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }
              >
                <tspan>+1</tspan>
              </motion.text>
              <g transform="translate(100,20)" opacity="0.85">
                <rect x="0" y="0" width="18" height="18" rx="4" fill={pal.secondary} />
                <rect x="10" y="10" width="18" height="18" rx="4" fill="#34d399" />
              </g>
            </motion.g>
            <motion.path d="M100 100 L110 90 L120 100" stroke="#fff" strokeWidth="4" fill="none"
              animate={ !prefersReduced && isHovered ? { y: [0, 10, 0], scale: [1, 1.2, 1] } : { y: 0, scale: 1 } }
              transition={ !prefersReduced && isHovered ? { duration: 0.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
          </motion.svg>
        );
      case 'memory-card':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.g transform="translate(16,12)">
              <motion.rect x="0" y={ !prefersReduced && isHovered ? [-6, 0, -6] : 0 } width="44" height="62" rx="6" fill={pal.primary} 
                transition={ !prefersReduced && isHovered ? { duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.rect x="34" y={ !prefersReduced && isHovered ? [2, 6, 2] : 6 } width="44" height="62" rx="6" fill={pal.secondary} 
                transition={ !prefersReduced && isHovered ? { duration: 1.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.rect x="68" y={ !prefersReduced && isHovered ? [10, 12, 10] : 12 } width="44" height="62" rx="6" fill="#60a5fa" 
                transition={ !prefersReduced && isHovered ? { duration: 1.3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
            </motion.g>
          </motion.svg>
        );
      case 'tic-tac-toe':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.g opacity={0.12} fill={pal.primary} animate={ !prefersReduced && isHovered ? { opacity: [0.12, 0.9, 0.12] } : { opacity: 0.12 } } 
              transition={ !prefersReduced && isHovered ? { duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
              <text x="18" y="24" fontSize="24" fontWeight="800">X</text>
              <text x="282" y="24" fontSize="24" fontWeight="800" textAnchor="end">O</text>
              <text x="18" y="156" fontSize="24" fontWeight="800">O</text>
              <text x="282" y="156" fontSize="24" fontWeight="800" textAnchor="end">X</text>
            </motion.g>
          </motion.svg>
        );
      case 'hangman':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(40,24)">
              <line x1="0" y1="110" x2="80" y2="110" stroke={pal.primary} strokeWidth="3" />
              <line x1="40" y1="110" x2="40" y2="10" stroke={pal.primary} strokeWidth="3" />
              <line x1="40" y1="10" x2="70" y2="10" stroke={pal.primary} strokeWidth="3" />
              <motion.circle cx="70" cy="22" r="6" fill={pal.primary} opacity={ !prefersReduced && isHovered ? { opacity: [0, 1] } : 1 } 
                transition={ !prefersReduced && isHovered ? { delay: 0.5, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.line x1="70" y1="28" x2="70" y2="60" stroke={pal.primary} strokeWidth="3" opacity={ !prefersReduced && isHovered ? [0, 1] : 1 } 
                transition={ !prefersReduced && isHovered ? { delay: 1, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.line x1="50" y1="40" x2="90" y2="40" stroke={pal.primary} strokeWidth="3" opacity={ !prefersReduced && isHovered ? [0, 1] : 1 } 
                transition={ !prefersReduced && isHovered ? { delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.line x1="60" y1="80" x2="70" y2="60" stroke={pal.primary} strokeWidth="3" opacity={ !prefersReduced && isHovered ? [0, 1] : 1 } 
                transition={ !prefersReduced && isHovered ? { delay: 2, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
              <motion.line x1="80" y1="80" x2="70" y2="60" stroke={pal.primary} strokeWidth="3" opacity={ !prefersReduced && isHovered ? [0, 1] : 1 } 
                transition={ !prefersReduced && isHovered ? { delay: 2.5, duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
            </g>
          </motion.svg>
        );
      case 'minesweeper':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(18,18)">
              <rect x="0" y="0" width="28" height="28" rx="4" fill="#94a3b8" />
              <rect x="34" y="0" width="28" height="28" rx="4" fill={pal.primary} />
              <rect x="68" y="0" width="28" height="28" rx="4" fill="#60a5fa" />
              <motion.circle cx="82" cy="36" r={ !prefersReduced && isHovered ? [6, 8, 6] : 6 } fill={pal.primary} opacity={ !prefersReduced && isHovered ? [0.9, 1, 0.9] : 0.9 } 
                transition={ !prefersReduced && isHovered ? { duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring } />
            </g>
          </motion.svg>
        );
      case 'war-card-game':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.g transform="translate(160,24)" animate={ !prefersReduced && isHovered ? { x: [0, 4, 0] } : { x: 0 } } 
              transition={ !prefersReduced && isHovered ? { duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
              <rect x="0" y="10" width="56" height="80" rx="6" fill={pal.primary} opacity="0.08" transform="rotate(-6 28 50)" />
              <rect x="8" y="0" width="56" height="80" rx="6" fill={pal.primary} opacity="0.12" transform="rotate(6 36 40)" />
            </motion.g>
          </motion.svg>
        );
      case 'math-quiz':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <motion.g initial={{ opacity: 1 }} animate={ !prefersReduced && isHovered ? { opacity: 1 } : { opacity: 1 }}>
              <motion.g initial={{ x: 0, opacity: 1 }} animate={ !prefersReduced && isHovered ? { x: [0, -6, 0], opacity: [1, 0, 1] } : { x: 0, opacity: 1 } } 
                transition={ !prefersReduced && isHovered ? { duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
                <text x="18" y="36" fontSize="20" fontWeight="800" fill={pal.secondary}>7 × 6 =</text>
                <rect x="110" y="16" width="48" height="34" rx="6" fill={pal.primary} opacity="0.95" />
                <text x="134" y="40" fontSize="18" fontWeight="800" fill="#071226" textAnchor="middle">42</text>
              </motion.g>
              <motion.g initial={{ x: 6, opacity: 0 }} animate={ !prefersReduced && isHovered ? { x: [6, 0, 6], opacity: [0, 1, 0] } : { x: 6, opacity: 0 } } 
                transition={ !prefersReduced && isHovered ? { duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
                <text x="18" y="36" fontSize="20" fontWeight="800" fill={pal.secondary}>8 × 7 =</text>
                <rect x="110" y="16" width="48" height="34" rx="6" fill={pal.primary} opacity="0.95" />
                <text x="134" y="40" fontSize="18" fontWeight="800" fill="#071226" textAnchor="middle">56</text>
              </motion.g>
            </motion.g>
          </motion.svg>
        );
      case 'higher-lower':
        return (
          <motion.svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <motion.g transform="translate(80,30)" animate={ !prefersReduced && isHovered ? { x: [0, 4, 0] } : { x: 0 } } 
              transition={ !prefersReduced && isHovered ? { duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
              <rect x="0" y="0" width="64" height="96" rx="8" fill={pal.primary} opacity="0.12" transform="rotate(-8 32 48)" />
              <rect x="18" y="6" width="64" height="96" rx="8" fill={pal.secondary} opacity="0.14" transform="rotate(6 50 54)" />
              <motion.g transform="translate(34,20)" animate={ !prefersReduced && isHovered ? { y: [0, -4, 0] } : { y: 0 } } 
                transition={ !prefersReduced && isHovered ? { duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : decoSpring }>
                <text x="18" y="34" fontSize="18" fontWeight="800" fill="#071226">?</text>
              </motion.g>
            </motion.g>
          </motion.svg>
        );
      default:
        return null;
    }
  };

  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const isFavorite = Array.isArray(favorites) && favorites.includes(game.id);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });

  // prefer a per-game persisted PR in localStorage (keyed by game id), fallback to static metadata
  const _ls = (() => {
    try { return localStorage.getItem(`highScore:${game.id}`); } catch (e) { return null; }
  })();
  const storedHighScore = _ls !== null && _ls !== undefined ? Number(_ls) : (typeof game.highScore === 'number' ? game.highScore : null);
  // detect whether there is a saved/resumable state for this game
  const navigate = useNavigate();

  const resumeExists = (() => {
    try {
      // common keys used by games in the repo
      const candidates = [
        `${game.id}State`,
        `${game.id}state`,
        `gameState:${game.id}`,
        `${game.id}-state`,
        // some games use a specific key
        'tetrisState',
        'snakeState',
        // high-level pattern: 'state:<id>'
        `state:${game.id}`
      ];
      return candidates.some(k => !!localStorage.getItem(k));
    } catch (e) { return false; }
  })();

  // Badges for this game (simple local display). Returned as array of badge keys.
  const badges = getBadgesForGame(game.id) || [];

  const badgeInfo = (key) => {
    switch (key) {
      case 'played-10': return { label: 'Played 10 sessions', symbol: '🎖', bg: 'bg-amber-500' };
      case 'beat-pr': return { label: 'Beat personal record', symbol: '🔥', bg: 'bg-rose-500' };
      default: return { label: key, symbol: '🏅', bg: 'bg-gray-500' };
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorite) {
        setFavorites(favorites.filter(f => f !== game.id));
      } else {
        setFavorites([...(Array.isArray(favorites) ? favorites : []), game.id]);
      }
    } catch (err) {
      console.warn('favorite toggle error', err);
    }
  };

  return (
    <Link to={`/game/${game.id}`} aria-label={`Open ${game.title} game`}>
      <motion.div
        onHoverStart={() => {
          setHovered(true);
          try { if (game.componentKey) prefetchGame(game.componentKey); } catch (e) {}
        }}
        onHoverEnd={() => { setHovered(false); setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 }); }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const rx = Math.max(Math.min((-dy / rect.height) * 6, 6), -6);
          const ry = Math.max(Math.min((dx / rect.width) * 6, 6), -6);
          const tx = Math.max(Math.min((dx / rect.width) * 4, 4), -4);
          const ty = Math.max(Math.min((dy / rect.height) * 4, 4), -4);
          setTilt({ rx, ry, tx, ty });
        }}
        className="game-card accent-glow"
        layout
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        whileHover={ !prefersReduced ? { y: -12, scale: 1.06, rotateZ: -1.5 } : { y: -6 } }
        transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
        style={{
          background: '#19213a',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-soft)',
          cursor: 'pointer',
          width: '100%',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          filter: hovered ? 'brightness(1.06) saturate(1.05)' : undefined,
          transition: 'filter 220ms ease, box-shadow 220ms ease',
          boxShadow: hovered ? `0 14px 34px ${accentGlow}` : 'var(--shadow-soft)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Neon overlay that softly lights the whole card on hover */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 260ms ease',
          background: `radial-gradient(circle at 30% 30%, ${accentGlow} 0%, rgba(0,0,0,0) 35%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 22%)`,
          mixBlendMode: 'screen',
          filter: 'blur(12px)'
        }} />

        {/* Thumbnail / Left Section */}
        <div className="game-card-thumb" style={{ 
          overflow: 'hidden', 
          position: 'relative',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Ultra-smooth animated top accent bar */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '5px',
            background: accentColor,
            zIndex: 10,
            borderRadius: '2px 2px 0 0',
            overflow: 'hidden',
            opacity: hovered ? 1 : 0.6,
          }}>
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg,
                  transparent 0%,
                  ${accentGlow.replace('0.30)', '0.8)')} 30%,
                  white 50%,
                  ${accentGlow.replace('0.30)', '0.8)')} 70%,
                  transparent 100%
                )`,
                filter: 'blur(2px)',
                opacity: 0.8,
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          
          <div style={{ position: 'absolute', inset: 0, zIndex: 6, overflow: 'hidden' }}>
            <motion.img
              src={game.thumbnail}
              alt={game.title}
              loading="lazy"
              animate={hovered && !prefersReduced ? {
                scale: 1.15,
                y: -6,
                x: tilt.tx * 0.5,
              } : { scale: 1, y: 0, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, mass: 1 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.95,
                display: 'block',
                willChange: 'transform'
              }}
              className="card-image"
            />
            <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none', background: imageOverlay }} />
            {/* removed diagonal shine in favor of full-card neon overlay */}
          </div>

            {/* Favorite button (clickable) */}
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
              aria-pressed={isFavorite}
              title={isFavorite ? 'Remove favorite' : 'Add favorite'}
              style={{
                position: 'absolute', top: 10, right: 10, zIndex: 22,
                width: 36, height: 36, borderRadius: 10, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.36)', cursor: 'pointer', color: isFavorite ? '#ff6b6b' : '#ffffff'
              }}
              className={isFavorite ? 'fav-wiggle' : ''}
            >
              {/* Heart icon */}
              {isFavorite ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff6b6b" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </button>

            {/* Per-card decoration (non-interactive) */}
            {/* Decoration layer: animate together with the thumbnail image so decorations float above the image without moving text/background */}
            <motion.div
              aria-hidden
              initial={{ x: 0, y: 0 }}
              animate={ !prefersReduced ? (hovered ? { x: tilt.tx / 5, y: tilt.ty / 5 } : { x: 0, y: 0 }) : { x: 0, y: 0 } }
              transition={{ type: 'spring', stiffness: 140, damping: 18, mass: 0.9 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}
            >
              <div style={{ width: '100%', height: '100%', opacity: 0.95 }}>
                {renderDecoration(game.id, hovered)}
              </div>
            </motion.div>
          
          {/* Animated gradient overlay (neon) - respects reduced motion */}
          {!prefersReduced && (
            <motion.div
              initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
              animate={hovered ? { opacity: 1, backgroundPosition: '100% 50%' } : { opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none', background: `linear-gradient(90deg, rgba(255,255,255,0.02), ${accentGlow}, rgba(255,255,255,0.02))`, backgroundSize: '200% 100%' }}
            />
          )}

          {/* Hover Overlay (over thumbnail) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.36))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(2px)'
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Play fill="white" size={18} />
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="game-card-content" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '8px' 
          }}>
            <motion.h3
              animate={ !prefersReduced && hovered ? { textShadow: `0 10px 30px ${accentGlow}`, color: titleColor } : { textShadow: 'none', color: titleColor } }
              transition={{ duration: 0.36, ease: 'easeOut' }}
              style={{ 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                color: titleColor,
                lineHeight: 1.2
              }}
            >
              {game.title}
            </motion.h3>
          </div>

          <p style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 'auto' // Pushes category to bottom
          }}>
            {game.description}
          </p>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 15%, transparent)`, 
              padding: '4px 10px', 
              borderRadius: '20px',
              fontWeight: 600,
              border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`
            }}>
              {game.category}
            </span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Badges */}
              {badges && badges.length > 0 && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {badges.map(b => {
                    const info = badgeInfo(b);
                    return (
                      <motion.span key={b}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        title={info.label}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 28,
                          height: 20,
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.02)',
                          color: '#f8fafc',
                          fontSize: 12,
                          padding: '0 6px',
                          border: '1px solid rgba(255,255,255,0.04)'
                        }}
                      >
                        <span style={{ marginRight: 6 }}>{info.symbol}</span>
                      </motion.span>
                    );
                  })}
                </div>
              )}
              {storedHighScore !== null && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                    PR: {Number(storedHighScore).toLocaleString()}
                  </div>
                )}
              {resumeExists && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // navigate directly to play with resume flag
                    navigate(`/play/${game.id}?resume=1`);
                  }}
                  title="Resume saved session"
                  style={{ marginLeft: 8, fontSize: 12, color: '#071226', background: '#fbbf24', padding: '4px 8px', borderRadius: 10, fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.12)', border: 'none', cursor: 'pointer' }}
                >Resume</button>
              )}
              <div style={{ marginLeft: 12, fontSize: 12, color: 'var(--text-muted)' }}>{game.players || '1-2 Players'}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default GameCard;