import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../components/GameCard/GameCard';
import gamesData from '../data/games.json';
import { getRecentlyPlayed } from '../utils/recentlyPlayed';
import { Link } from 'react-router-dom';
import { useGameSearch } from '../hooks/useGameSearch';
import { Search, X } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useState } from 'react';

const categories = [
  "All", "Arcade", "Action", "Puzzle", "Strategy", "Card", "Board", "Word"
];

const GameLibrary = () => {
  const { search, setSearch, category, setCategory, filteredGames } = useGameSearch();
  const [favorites] = useLocalStorage('favorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [playerFilter, setPlayerFilter] = useState('all'); // 'all' | '1' | '2'

  // IDs for games that support 2 players. Edit this list to add/remove titles.
  const TWO_PLAYER_IDS = new Set(['tic-tac-toe', 'memory-card', 'rock-paper-scissors', 'hangman', 'war-card-game']);

  // Themed button styles for the mode controls
  const modeBtnBase = {
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    transition: 'all 0.18s ease',
    outline: 'none'
  };
  const modeBtnActive = {
    border: '1px solid var(--primary)',
    background: 'var(--primary)',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(49,130,246,0.12)'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="container"
      style={{ paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle background for the games tab */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(1200px 400px at 10% 20%, rgba(99,102,241,0.03), transparent 8%), radial-gradient(900px 300px at 90% 80%, rgba(99,102,241,0.02), transparent 10%), linear-gradient(180deg, rgba(10,14,25,0.0), rgba(10,14,25,0.02))'
      }} />
      {/* Animated decorative blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6, ease: 'easeInOut' }}
        style={{ position: 'absolute', zIndex: 0, top: '-8%', left: '-6%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14), rgba(14,165,233,0.02))' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.16, scale: 1 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 8, ease: 'easeInOut' }}
        style={{ position: 'absolute', zIndex: 0, bottom: '-6%', right: '-8%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), rgba(99,102,241,0.01))' }}
      />
      {/* Header Section */}
      <div style={{ 
        padding: '1.2rem 0 1rem 0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center' 
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 700, 
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Discover Games
        </h2>
        
        {/* 🔎 Redesigned Search Bar */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '620px',
          marginBottom: '0.9rem' 
        }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input 
            type="text" 
            placeholder="Search for games..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', 
              padding: '12px 16px 12px 48px',
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border-light)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-main)',
              fontSize: '0.95rem', 
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 4px rgba(49, 130, 246, 0.1)';
              e.target.style.background = 'rgba(255,255,255,0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255,255,255,0.03)';
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 🔘 Redesigned Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                border: category === cat ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)',
                background: category === cat ? 'var(--primary)' : 'transparent',
                color: category === cat ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (category !== cat) {
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  e.target.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (category !== cat) {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.color = 'var(--text-muted)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Played (top) */}
      {(() => {
        const recent = getRecentlyPlayed();
        if (!recent || recent.length === 0) return null;
        // map ids to game data
        const items = recent.map(r => ({ ...r, game: gamesData.find(g => g.id === r.id) })).filter(i => i.game);
        if (items.length === 0) return null;
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12, marginBottom: 12 }}>
            <div style={{ width: '100%', maxWidth: 1100, padding: '0 12px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 8 }}>Continue Last Played</h4>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {items.map(it => (
                  <Link key={it.id} to={`/play/${it.id}?resume=1`} style={{ textDecoration: 'none' }}>
                    <div tabIndex={0} role="button" aria-label={`Resume ${it.game.title}`} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                      <img src={it.game.thumbnail} alt={it.game.title} style={{ width: 84, height: 52, objectFit: 'cover', borderRadius: 8 }} loading="lazy" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{it.game.title}</div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', background: '#fbbf24', padding: '4px 8px', borderRadius: 10, fontWeight: 700, color: '#071226' }}>Resume</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(it.at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ marginTop: 8, marginBottom: 6, display: 'flex', gap: 8, justifyContent: 'center', position: 'relative', zIndex: 5 }}>
        <button
          onClick={() => setShowFavorites(s => !s)}
          style={{
            padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: showFavorites ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
            background: showFavorites ? 'var(--primary)' : 'transparent', color: showFavorites ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
          }}
        >
          {showFavorites ? `Favorites (${Array.isArray(favorites) ? favorites.length : 0})` : 'Show Favorites'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setPlayerFilter('1')}
            onMouseEnter={(e) => { if (playerFilter !== '1') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'var(--text-main)'; } }}
            onMouseLeave={(e) => { if (playerFilter !== '1') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            style={ playerFilter === '1' ? { ...modeBtnBase, ...modeBtnActive } : modeBtnBase }
          >
            1 Player
          </button>
          <button
            onClick={() => setPlayerFilter('2')}
            onMouseEnter={(e) => { if (playerFilter !== '2') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'var(--text-main)'; } }}
            onMouseLeave={(e) => { if (playerFilter !== '2') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            style={ playerFilter === '2' ? { ...modeBtnBase, ...modeBtnActive } : modeBtnBase }
          >
            2 Players
          </button>
          <button
            onClick={() => setPlayerFilter('all')}
            onMouseEnter={(e) => { if (playerFilter !== 'all') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'var(--text-main)'; } }}
            onMouseLeave={(e) => { if (playerFilter !== 'all') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            style={ playerFilter === 'all' ? { ...modeBtnBase, ...modeBtnActive } : modeBtnBase }
          >
            All
          </button>
        </div>
      </div>

      {/* 🧩 Grid Layout */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div 
            layout
            className="games-grid"
            style={{ 
              width: '100%',
              maxWidth: 1100,
              marginTop: '1rem',
              position: 'relative',
              zIndex: 5
            }}
          >
      <AnimatePresence>
          {(() => {
            // start from the search/category filtered set
            let list = filteredGames.slice();
            // apply player filter
            if (playerFilter === '2') list = list.filter(g => TWO_PLAYER_IDS.has(g.id));
            else if (playerFilter === '1') list = list.filter(g => !TWO_PLAYER_IDS.has(g.id));
            // apply favorites filter if enabled
            if (showFavorites && Array.isArray(favorites)) list = list.filter(g => favorites.includes(g.id));

            return (list.length > 0) ? (
              list.map((game, idx) => (
                <motion.div key={game.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.28, delay: idx * 0.06 }}>
                  <GameCard game={game} />
                </motion.div>
                ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>No games found matching your search.</p>
              </div>
            );
          })()}
        </AnimatePresence>
      </motion.div>
    </div>
    </motion.div>
  );
};

export default GameLibrary;