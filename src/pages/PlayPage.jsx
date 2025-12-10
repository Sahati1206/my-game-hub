import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import gamesData from '../data/games.json';
import { GAME_COMPONENTS } from '../games/GameRegistry';
import GameLoading from '../components/GameLoading/GameLoading';
import Mascot from '../assets/mascot.svg';
import Confetti from '../components/Confetti/Confetti';
import { addRecentlyPlayed } from '../utils/recentlyPlayed';
import { useEffect } from 'react';

const PlayPage = () => {
  const { id } = useParams();
  const game = gamesData.find(g => g.id === id);

  if (!game) return <div>Game not found</div>;

  const ActiveGameComponent = GAME_COMPONENTS[game.componentKey];
  const { search } = useLocation();
  const resume = new URLSearchParams(search).get('resume') === '1';
  const resetPR = new URLSearchParams(search).get('resetPR') === '1';

  // record this play in recentlyPlayed once when the PlayPage mounts
  useEffect(() => {
    if (game && game.id) {
      try { addRecentlyPlayed(game.id); } catch (e) { /* noop */ }
    }
  }, [game && game.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      style={{ position: 'fixed', inset: 0, background: '#1a1a1a', zIndex: 2000, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}
    >
      <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Playing: {game.title}</h2>
        <Link to={`/game/${game.id}`} style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X color="white" />
        </Link>
      </div>

      {/* Confetti overlay listens for badge events */}
      <Confetti />

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', minHeight: 0 }}>
        <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0.8 }} transition={{ duration: 0.18 }} style={{ width: '100%', maxWidth: '800px', height: '100%', maxHeight: '600px', background: 'black', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.5)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(31,159,255,0.04)' }}>
          <img src={Mascot} alt="" className="play-watermark" aria-hidden="true" />
          {ActiveGameComponent ? (
            <Suspense fallback={<div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GameLoading game={game} /></div>}>
              <ActiveGameComponent resume={resume} resetPR={resetPR} />
            </Suspense>
          ) : (
            <div style={{ color: 'white' }}>Component Missing</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlayPage;