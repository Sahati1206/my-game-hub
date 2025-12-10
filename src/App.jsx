import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import GameLibrary from './pages/GameLibrary';
import GameInfoPage from './pages/GameInfoPage';
import PlayPage from './pages/PlayPage';
import Leaderboard from './pages/Leaderboard';
import ResetClickerPR from './pages/ResetClickerPR';
import './App.css';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // brief loading screen on cold load to improve perceived performance
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
    <Router>
      <ScrollToTop />
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/games" element={<GameLibrary />} />
            <Route path="/game/:id" element={<GameInfoPage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/reset-clicker-pr" element={<ResetClickerPR />} />
          </Routes>
        </main>
      </div>
    </Router>
    </>
  );
}

export default App;