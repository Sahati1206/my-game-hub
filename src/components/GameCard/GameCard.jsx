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
  const prefersReduced = useReducedMotion();
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
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={`gc-sgrad-${game.id}`} x1="0%" x2="100%">
                <stop offset="0%" stopColor={pal.primary}>
                  {!prefersReduced && <animate attributeName="offset" values="0;1;0" dur="2.8s" repeatCount="indefinite" />}
                </stop>
                <stop offset="50%" stopColor={pal.secondary}>
                  {!prefersReduced && <animate attributeName="offset" values="0.25;0.75;0.25" dur="2.8s" repeatCount="indefinite" />}
                </stop>
                <stop offset="100%" stopColor={pal.primary}>
                  {!prefersReduced && <animate attributeName="offset" values="1;0;1" dur="2.8s" repeatCount="indefinite" />}
                </stop>
              </linearGradient>
            </defs>
            {/* border wrap with animated gradient */}
            <rect x="6" y="6" width="288" height="168" rx="12" fill="none" stroke={`url(#gc-sgrad-${game.id})`} strokeWidth="6" opacity="0.95" />
            {/* decorative slithering body (animated dash offset + gradient) */}
            <path d="M18 120 C60 60, 120 60, 162 120 C204 180, 246 180, 282 120" fill="none" stroke={`url(#gc-sgrad-${game.id})`} strokeWidth="10" strokeLinecap="round" strokeDasharray="16 10">
              {!prefersReduced && <animate attributeName="stroke-dashoffset" values="0;-140" dur="1.8s" repeatCount="indefinite" />}
            </path>
            {/* head at top-left */}
            <ellipse cx="30" cy="18" rx="8" ry="6" fill={pal.primary} transform="rotate(-12 30 18)" />
            <circle cx="34" cy="16" r="1.2" fill="#071226" />
            {/* apple that moves toward snake when hovered */}
            <g transform="translate(220,110)">
              <circle cx={isHovered ? 14 : 28} cy="-40" r="8" fill="#ef4444">
                {!prefersReduced && (
                  <animate attributeName="cx" dur={isHovered ? '0.9s' : '2.2s'} values={isHovered ? '28;14' : '28;26;28'} repeatCount="indefinite" />
                )}
              </circle>
            </g>
          </svg>
        );
      case 'blackjack':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(170,8)">
              <g transform="rotate(-8 32 54)">
                <rect x="0" y="6" width="64" height="96" rx="6" fill={pal.primary} opacity="0.08">
                  {!prefersReduced && <animate attributeName="opacity" values="0.04;0.12;0.04" dur="2.4s" repeatCount="indefinite" />}
                </rect>
              </g>
              <g transform="rotate(6 42 48)">
                <rect x="10" y="0" width="64" height="96" rx="6" fill={pal.primary} opacity="0.12">
                  {!prefersReduced && <animate attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -4;0 0" dur="1.8s" repeatCount="indefinite" />}
                </rect>
              </g>
              <text x="42" y="46" fontSize="14" fill={pal.secondary} fontWeight="700" textAnchor="middle">A♠</text>
            </g>
          </svg>
        );
      case 'rock-paper-scissors':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            {/* Left rock */}
            <circle cx="60" cy="56" r="22" fill={pal.primary} opacity="0.95">
              {!prefersReduced && <animate attributeName="r" values="20;24;20" dur="1.6s" repeatCount="indefinite" />}
            </circle>
            {/* Right simple scissors */}
            <g transform="translate(180,36) rotate(6)">
              <rect x="0" y="18" width="56" height="8" rx="4" fill={pal.secondary} transform="rotate(18 28 22)">
                {!prefersReduced && <animate attributeName="transform" attributeType="XML" type="rotate" values="18 28 22;22 28 22;18 28 22" dur="1.6s" repeatCount="indefinite" />}
              </rect>
              <rect x="0" y="18" width="56" height="8" rx="4" fill={pal.secondary} transform="rotate(-18 28 22)">
                {!prefersReduced && <animate attributeName="transform" attributeType="XML" type="rotate" values="-18 28 22;-22 28 22;-18 28 22" dur="1.6s" repeatCount="indefinite" />}
              </rect>
              <circle cx="28" cy="22" r="4" fill="#6d28d9" />
            </g>
          </svg>
        );
      case 'box-dodger':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g>
              <rect x="12" y="18" width="20" height="20" rx="3" fill={pal.primary} transform="rotate(-14 22 28)">
                {!prefersReduced && <animate attributeName="y" values="18;8;18" dur="1.6s" repeatCount="indefinite" />}
              </rect>
              <rect x="44" y="6" width="22" height="22" rx="3" fill={pal.secondary} transform="rotate(6 55 17)">
                {!prefersReduced && <animate attributeName="y" values="6;16;6" dur="1.2s" repeatCount="indefinite" />}
              </rect>
              <rect x="76" y="36" width="24" height="24" rx="3" fill="#f59e0b" transform="rotate(-6 88 48)">
                {!prefersReduced && <animate attributeName="y" values="36;26;36" dur="1.8s" repeatCount="indefinite" />}
              </rect>
            </g>
          </svg>
        );
      case 'clicker-hero':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(16,12)">
              <circle cx="40" cy="40" r="26" fill={pal.primary} opacity="0.95">
                {!prefersReduced && <animate attributeName="r" values="22;28;22" dur="1s" repeatCount="indefinite" />}
              </circle>
              <text x="40" y="46" fontSize="20" fontWeight="800" fill="#fff" textAnchor="middle">
                <tspan>+1</tspan>
                {!prefersReduced && <animate attributeName="y" values="46;36;46" dur="1s" repeatCount="indefinite" />}
              </text>
              <g transform="translate(100,20)" opacity="0.85">
                <rect x="0" y="0" width="18" height="18" rx="4" fill={pal.secondary} />
                <rect x="10" y="10" width="18" height="18" rx="4" fill="#34d399" />
              </g>
            </g>
          </svg>
        );
      case 'memory-card':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(16,12)">
              <g>
                <rect x="0" y="0" width="44" height="62" rx="6" fill={pal.primary} />
                {!prefersReduced && <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -6;0 0" dur="1.8s" repeatCount="indefinite" />}
              </g>
              <g>
                <rect x="34" y="6" width="44" height="62" rx="6" fill={pal.secondary} />
                {!prefersReduced && <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -4;0 0" dur="1.6s" repeatCount="indefinite" />}
              </g>
              <g>
                <rect x="68" y="12" width="44" height="62" rx="6" fill="#60a5fa" />
                {!prefersReduced && <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -2;0 0" dur="1.4s" repeatCount="indefinite" />}
              </g>
            </g>
          </svg>
        );
      case 'tic-tac-toe':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g opacity="0.12" fill={pal.primary}>
              <text x="18" y="24" fontSize="24" fontWeight="800">X
                {!prefersReduced && <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />}
              </text>
              <text x="282" y="24" fontSize="24" fontWeight="800" textAnchor="end">O
                {!prefersReduced && <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.6s" repeatCount="indefinite" />}
              </text>
              <text x="18" y="156" fontSize="24" fontWeight="800">O
                {!prefersReduced && <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite" />}
              </text>
              <text x="282" y="156" fontSize="24" fontWeight="800" textAnchor="end">X
                {!prefersReduced && <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.2s" repeatCount="indefinite" />}
              </text>
            </g>
          </svg>
        );
      case 'hangman':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(40,24)">
              <line x1="0" y1="110" x2="80" y2="110" stroke={pal.primary} strokeWidth="3" />
              <line x1="40" y1="110" x2="40" y2="10" stroke={pal.primary} strokeWidth="3" />
              <line x1="40" y1="10" x2="70" y2="10" stroke={pal.primary} strokeWidth="3" />
              {/* head with subtle bounce; when hovered, swing the body to mimic guessing wrong */}
              <g>
                <circle cx="70" cy="22" r="6" fill={pal.primary}>
                  {!prefersReduced && <animate attributeName="cy" values={isHovered ? '22;10;22' : '22;16;22'} dur={isHovered ? '1.1s' : '1.2s'} repeatCount="indefinite" />}
                </circle>
                {!prefersReduced && (
                  <g>
                    <line x1="70" y1="28" x2={isHovered ? '90' : '78'} y2={isHovered ? '56' : '50'} stroke={pal.primary} strokeWidth="3">
                      <animate attributeName="x2" values={isHovered ? '90;74;90' : '78;82;78'} dur={isHovered ? '1.2s' : '1.8s'} repeatCount="indefinite" />
                    </line>
                  </g>
                )}
              </g>
            </g>
          </svg>
        );
      case 'minesweeper':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(18,18)">
              <rect x="0" y="0" width="28" height="28" rx="4" fill="#94a3b8" />
              <rect x="34" y="0" width="28" height="28" rx="4" fill={pal.primary} />
              <rect x="68" y="0" width="28" height="28" rx="4" fill="#60a5fa" />
              <circle cx="82" cy="36" r="6" fill={pal.primary} opacity="0.9">
                <animate attributeName="r" values="4;8;4" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        );
      case 'war-card-game':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(160,24)">
              <g>
                <rect x="0" y="10" width="56" height="80" rx="6" fill={pal.primary} opacity="0.08" transform="rotate(-6 28 50)">
                  <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;4 0;0 0" dur="1.6s" repeatCount="indefinite" />
                </rect>
              </g>
              <g>
                <rect x="8" y="0" width="56" height="80" rx="6" fill={pal.primary} opacity="0.12" transform="rotate(6 36 40)">
                  <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;-4 0;0 0" dur="1.8s" repeatCount="indefinite" />
                </rect>
              </g>
            </g>
          </svg>
        );
      case 'math-quiz':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            {/* show different equations on hover */}
            {isHovered ? (
              <>
                <text x="18" y="36" fontSize="20" fontWeight="800" fill={pal.secondary}>8 × 7 =</text>
                <rect x="110" y="16" width="48" height="34" rx="6" fill={pal.primary} opacity="0.95" />
                <text x="134" y="40" fontSize="18" fontWeight="800" fill="#071226" textAnchor="middle">56</text>
              </>
            ) : (
              <>
                <text x="18" y="36" fontSize="20" fontWeight="800" fill={pal.secondary}>7 × 6 =</text>
                <rect x="110" y="16" width="48" height="34" rx="6" fill={pal.primary} opacity="0.95" />
                <text x="134" y="40" fontSize="18" fontWeight="800" fill="#071226" textAnchor="middle">42</text>
              </>
            )}
          </svg>
        );
      case 'higher-lower':
        return (
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="300" height="180" rx="0" fill="none" />
            <g transform="translate(80,30)">
              <g>
                <rect x="0" y="0" width="64" height="96" rx="8" fill={pal.primary} opacity="0.12" transform="rotate(-8 32 48)">
                  <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;6 -6;0 0" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.06;0.16;0.06" dur="1.8s" repeatCount="indefinite" />
                </rect>
              </g>
              <g>
                <rect x="18" y="6" width="64" height="96" rx="8" fill={pal.secondary} opacity="0.14" transform="rotate(6 50 54)">
                  <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;-6 6;0 0" dur="2.0s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.04;0.14;0.04" dur="2.0s" repeatCount="indefinite" />
                </rect>
              </g>
              <g transform="translate(34,20)">
                <text x="18" y="34" fontSize="18" fontWeight="800" fill="#071226">?</text>
                <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="1.2s" repeatCount="indefinite" />
              </g>
            </g>
          </svg>
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 }); }}
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
          {/* Accent Line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentColor, zIndex: 10 }}></div>
          
          <div style={{ position: 'absolute', inset: 0, zIndex: 6, overflow: 'hidden' }}>
            <motion.img
              src={game.thumbnail}
              alt={game.title}
              loading="lazy"
              animate={ !prefersReduced ? (hovered ? { scale: 1.12, x: tilt.tx / 6, y: tilt.ty / 6 } : { scale: 1, x: 0, y: 0 }) : { scale: 1 } }
              transition={{ type: 'spring', stiffness: 160, damping: 20, mass: 0.85 }}
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