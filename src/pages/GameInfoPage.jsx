import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import gamesData from '../data/games.json';

const GameInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = gamesData.find(g => g.id === id);

  if (!game) return <div>Game not found</div>;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ maxWidth: 'min(900px,96%)', margin: '2rem auto', padding: '0 1rem' }}
    >
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', border: 'none', 
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: '1rem'
        }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Banner */}
        <div style={{ height: '300px', background: '#eee' }}>
          <img src={game.thumbnail} alt={game.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{game.title}</h1>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{game.category}</span>
            </div>
            <Link to={`/play/${game.id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'var(--primary)', color: 'white',
                  border: 'none', padding: '1rem 3rem',
                  borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                }}
              >
                <Play fill="white" /> PLAY NOW
              </motion.button>
            </Link>
          </div>

          <hr style={{ margin: '2rem 0', border: 'none', height: '1px', background: '#eee' }} />

          <div className="game-info-grid">
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{game.description}</p>
            </div>
            <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Controls</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {game.controls ? (
                  game.controls.map(key => (
                    <span key={key} style={{ 
                      background: '#08bad1ff', padding: '6px 12px', 
                      borderRadius: '8px', border: '1px solid #ddd',
                      fontSize: '0.9rem', fontWeight: 600 
                    }}>
                      {key}
                    </span>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No specific controls listed. Use standard inputs.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameInfoPage;