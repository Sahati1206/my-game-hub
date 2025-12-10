import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Shuffle } from 'lucide-react';
import gamesData from '../../data/games.json';
import Mascot from '../../assets/mascot.svg';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav style={{
      background: 'rgba(3,10,18,0.95)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '10px 0',
      boxShadow: '0 6px 30px rgba(2,6,23,0.6)'
    }}>
      {/* Logo fully left of the viewport */}
      <Link to="/" style={{ position: 'absolute', left: 16, top: 10, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', zIndex: 60 }}>
        <div className="mascot-inline mascot-glow" style={{ borderRadius: 8, background: 'linear-gradient(135deg, rgba(31,159,255,0.14), rgba(139,92,246,0.06))' }}>
          <img src={Mascot} alt="Game Hub" style={{ width: 28, height: 28, display: 'block' }} />
        </div>
      </Link>

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {/* Centered nav text buttons */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/games" style={{ color: location.pathname === '/games' ? '#7fb0ff' : '#b9c6d6', fontWeight: 600, textDecoration: 'none' }}>Library</Link>
          <Link to="/leaderboard" style={{ color: location.pathname === '/leaderboard' ? '#7fb0ff' : '#b9c6d6', fontWeight: 600, textDecoration: 'none' }}>Leaderboards</Link>
        </div>

        {/* Right side: icons anchored to the corner */}
        <div style={{ position: 'absolute', right: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={(e) => { e.preventDefault(); const id = gamesData[Math.floor(Math.random()*gamesData.length)].id; window.location.href = `/play/${id}`; }} title="Surprise Me" style={{ background: 'linear-gradient(90deg, rgba(31,159,255,0.08), rgba(139,92,246,0.04))', border: '1px solid rgba(255,255,255,0.04)', padding: 8, borderRadius: 8 }} aria-label="Surprise Me">
            <Shuffle size={18} color="#fef3c7" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;