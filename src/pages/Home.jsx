import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071226 0%, #071b2a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* faint blurred background shape */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/src/assets/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px) brightness(0.25)', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 2, width: 'min(760px, 92%)' }}>
        <div style={{ background: 'rgba(15,23,38,0.9)', borderRadius: 18, padding: '40px 48px', boxShadow: '0 30px 80px rgba(2,6,23,0.6)', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 14, color: '#7fb0ff', fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>WELCOME TO GAMEHUB</div>
          <h1 style={{ fontSize: '2.25rem', lineHeight: 1.05, margin: '0 0 16px', fontWeight: 800 }}>Your Next Adventure<br/>Starts Here.</h1>
          <p style={{ color: '#9fb1c9', maxWidth: 640, margin: '0 auto 22px', lineHeight: 1.6 }}>Dive into a curated collection of arcade classics, puzzles, and action games. Instant play, no downloads.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link to="/games">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(180deg,#1f9fff,#08bad1)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 28, fontSize: 16, fontWeight: 700, boxShadow: '0 10px 30px rgba(8,186,209,0.18)' }}>
                <Play size={16} /> Browse Library
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* subtle vignette */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 200px 200px rgba(2,6,23,0.6)', pointerEvents: 'none', zIndex: 1 }} />
    </div>
  );
};

export default Home;