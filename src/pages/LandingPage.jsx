import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import games from '../data/games.json';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071226 0%, #071b2a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/src/assets/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25) saturate(0.6)', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.65))', zIndex: 1 }} />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: 18, background: 'linear-gradient(135deg,#2b7df0,#1f9fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-15deg)', boxShadow: '0 30px 80px rgba(8,28,60,0.6)' }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 28 }}>s2p</div>
          </div>
        </div>
        <div style={{ fontSize: 14, color: '#7fb0ff', fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>INSTANT PLAY • NO INSTALL • NO BS</div>

        <h1 style={{ color: 'white', fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.02, margin: '0 0 12px', fontWeight: 800 }}>
          Source 2 Playground
        </h1>

        <p style={{ color: '#c7d4df', maxWidth: 900, margin: '12px auto 26px', fontSize: 18 }}>No frills — no downloads, no sign-ups. Load in and play instantly, solo or with friends.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/games">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ background: 'linear-gradient(180deg,#2b7df0,#1f9fff)', color: 'white', border: 'none', padding: '14px 36px', borderRadius: 40, fontSize: 16, fontWeight: 700, boxShadow: '0 22px 60px rgba(43,125,240,0.22), 0 6px 18px rgba(8,28,60,0.45)' }}>
              get it now
            </motion.button>
          </Link>
        </div>
      </motion.div>
      {/* Background rotated low-opacity game cards */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {games.slice(0,8).map((g, i) => {
          const positions = [
            { left: '5%', top: '28%', rotate: -18, scale: 1.05, opacity: 0.12 },
            { left: '18%', top: '62%', rotate: 8, scale: 1.12, opacity: 0.10 },
            { left: '33%', top: '40%', rotate: -12, scale: 1.0, opacity: 0.12 },
            { left: '50%', top: '74%', rotate: 16, scale: 1.15, opacity: 0.09 },
            { left: '68%', top: '36%', rotate: -14, scale: 1.0, opacity: 0.12 },
            { left: '82%', top: '60%', rotate: 12, scale: 1.08, opacity: 0.10 },
            { left: '92%', top: '26%', rotate: -20, scale: 0.95, opacity: 0.08 },
            { left: '60%', top: '50%', rotate: 6, scale: 1.02, opacity: 0.09 }
          ];
          const p = positions[i % positions.length];
          const renderGraphic = (id) => {
            switch(id) {
              case 'snake':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <linearGradient id={`sgrad-${i}`} x1="0" x2="1"><stop offset="0" stopColor="#34d399"/><stop offset="1" stopColor="#059669"/></linearGradient>
                    </defs>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.4)" />
                    {/* main snake body (subtle interior curve) */}
                    <path d="M14 82 C44 16, 84 16, 114 66 S168 118, 186 66" stroke={`url(#sgrad-${i})`} strokeWidth="10" strokeLinecap="round" fill="none" strokeLinejoin="round" opacity="0.9"/>
                    <circle cx="186" cy="66" r="5" fill="#065f46" />
                    {/* clearer snake border wrap: rounded rectangle stroke to make it look wrapped */}
                    <rect x="6" y="6" width="188" height="108" rx="12" fill="none" stroke={`url(#sgrad-${i})`} strokeWidth="6" opacity="0.7" />
                    {/* head detail on top-left corner */}
                    <g>
                      <ellipse cx="22" cy="12" rx="8" ry="6" fill="#10b981" opacity="0.95" transform="rotate(-18 22 12)" />
                      <circle cx="26" cy="10" r="1.4" fill="#071226" />
                      <circle cx="18" cy="11" r="1.4" fill="#071226" />
                    </g>
                    {/* tail dot bottom-right */}
                    <circle cx="178" cy="96" r="3" fill="#065f46" opacity="0.9" />
                  </svg>
                );
              case 'box-dodger':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.38)" />
                    <g transform="translate(20,20)">
                      <rect x="0" y="0" width="28" height="28" rx="4" fill="#60a5fa" />
                      <rect x="30" y="0" width="28" height="28" rx="4" fill="#34d399" />
                      <rect x="60" y="0" width="28" height="28" rx="4" fill="#f59e0b" />
                      <rect x="30" y="30" width="28" height="28" rx="4" fill="#ef4444" />
                    </g>
                    {/* floating blocks around edges for decoration */}
                    <g opacity="0.9">
                      <rect x="6" y="6" width="18" height="18" rx="3" fill="#60a5fa" opacity="0.95" transform="rotate(-14 15 15)" />
                      <rect x="170" y="14" width="20" height="20" rx="3" fill="#34d399" opacity="0.9" transform="rotate(10 180 24)" />
                      <rect x="150" y="86" width="24" height="24" rx="3" fill="#f59e0b" opacity="0.85" transform="rotate(6 162 98)" />
                      <rect x="18" y="86" width="22" height="22" rx="3" fill="#ef4444" opacity="0.8" transform="rotate(-8 29 97)" />
                    </g>
                  </svg>
                );
              case 'clicker-hero':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <circle cx="100" cy="60" r="34" fill="#0ea5e9" opacity="0.95" />
                    <text x="100" y="68" fontSize="22" fontWeight="700" fill="#ffffff" textAnchor="middle">+1</text>
                    {/* decorative plus marks */}
                    <g fill="#60a5fa" opacity="0.9">
                      <rect x="18" y="16" width="6" height="18" rx="2" />
                      <rect x="11" y="23" width="18" height="6" rx="2" />
                      <rect x="170" y="16" width="6" height="18" rx="2" transform="rotate(22 173 25)" />
                      <rect x="163" y="23" width="18" height="6" rx="2" transform="rotate(22 172 25)" />
                    </g>
                  </svg>
                );
              case 'memory-card':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <g transform="translate(30,20)">
                      <rect x="0" y="0" width="36" height="48" rx="6" fill="#08b7c1" />
                      <rect x="44" y="0" width="36" height="48" rx="6" fill="#f97316" />
                      <rect x="88" y="0" width="36" height="48" rx="6" fill="#60a5fa" />
                    </g>
                    {/* fanned cards at top-right */}
                    <g transform="translate(118,8)">
                      <rect x="0" y="0" width="44" height="60" rx="6" fill="#ffffff" opacity="0.08" transform="rotate(-8 22 30)" />
                      <rect x="6" y="0" width="44" height="60" rx="6" fill="#ffffff" opacity="0.12" transform="rotate(2 28 30)" />
                      <rect x="12" y="0" width="44" height="60" rx="6" fill="#ffffff" opacity="0.16" transform="rotate(12 34 30)" />
                    </g>
                  </svg>
                );
              case 'tic-tac-toe':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <g transform="translate(48,18) scale(0.9)">
                      <rect x="0" y="0" width="84" height="84" rx="8" fill="#0f172a" stroke="#c7d4df" strokeWidth="2" />
                      <text x="22" y="48" fontSize="28" fill="#c7d4df">X O</text>
                      <text x="22" y="74" fontSize="28" fill="#c7d4df">O X</text>
                    </g>
                    {/* decor: corner X and O marks */}
                    <g fill="#c7d4df" opacity="0.14">
                      <text x="18" y="18" fontSize="20" fontWeight="700">X</text>
                      <text x="182" y="18" fontSize="20" fontWeight="700">O</text>
                      <text x="18" y="102" fontSize="20" fontWeight="700">O</text>
                      <text x="182" y="102" fontSize="20" fontWeight="700">X</text>
                    </g>
                  </svg>
                );
              case 'math-quiz':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <g transform="translate(18,30)">
                      <text x="0" y="28" fontSize="28" fontWeight="700" fill="#fef3c7">12 + 7 =</text>
                      <rect x="106" y="6" width="58" height="34" rx="6" fill="#f59e0b" opacity="0.95" />
                      <text x="135" y="32" fontSize="22" fontWeight="800" fill="#071226" textAnchor="middle">19</text>
                    </g>
                  </svg>
                );
              case 'rock-paper-scissors':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <g transform="translate(24,28)">
                      {/* left: rock (rounded fist) */}
                      <circle cx="36" cy="34" r="22" fill="#94a3b8" />
                      <rect x="18" y="18" width="8" height="12" rx="4" fill="#6b7280" transform="rotate(-18 22 24)" />
                      {/* right: scissors */}
                      <g transform="translate(92,10) rotate(8)">
                        <rect x="0" y="22" width="56" height="8" rx="4" fill="#7c3aed" transform="rotate(18 28 26)" />
                        <rect x="0" y="22" width="56" height="8" rx="4" fill="#7c3aed" transform="rotate(-18 28 26)" />
                        <circle cx="28" cy="26" r="5" fill="#6d28d9" />
                      </g>
                    </g>
                  </svg>
                );
              case 'blackjack':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    {/* two overlapping cards */}
                    <g transform="translate(48,20)">
                      <rect x="0" y="6" width="88" height="56" rx="6" fill="#ffffff" opacity="0.08" transform="rotate(-8 44 34)" />
                      <rect x="12" y="0" width="88" height="56" rx="6" fill="#ffffff" opacity="0.12" transform="rotate(6 56 28)" />
                      <text x="56" y="36" fontSize="18" fill="#fef3c7" fontWeight="800" textAnchor="middle">A ♠︎</text>
                    </g>
                  </svg>
                );
              case 'hangman':
                return (
                  <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
                    <rect width="100%" height="100%" rx="8" fill="rgba(10,15,20,0.36)" />
                    <g transform="translate(40,20)">
                      <line x1="0" y1="80" x2="80" y2="80" stroke="#c7d4df" strokeWidth="3" />
                      <line x1="40" y1="80" x2="40" y2="10" stroke="#c7d4df" strokeWidth="3" />
                      <line x1="40" y1="10" x2="70" y2="10" stroke="#c7d4df" strokeWidth="3" />
                      <circle cx="70" cy="22" r="6" fill="#c7d4df" />
                    </g>
                  </svg>
                );
              default:
                return (
                  <div style={{ width: '100%', height: '100%', backgroundImage: `url(${g.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 8 }} />
                );
            }
          };

          return (
            <motion.div key={g.id} style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              transform: `translate(-50%,-50%) rotate(${p.rotate}deg) scale(${p.scale})`,
              width: 420,
              height: 250,
              borderRadius: 12,
              overflow: 'hidden',
              opacity: p.opacity,
              filter: 'blur(0.6px)'
            }}>
            
              {renderGraphic(g.id)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;