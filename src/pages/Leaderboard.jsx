import React from 'react';
import games from '../data/games.json';

const readHighScoreFor = (game) => {
  try {
    // common patterns
    const keys = [
      `highScore:${game.id}`,
      `${game.id}HighScore`,
      `${game.id}Highscore`,
      `${game.id}Highscore`,
      `${game.id}Highscore`,
      `${game.id}HighScore`,
      `${game.id}Highscore`,
      `${game.id}Highscore`,
      // fallback specific names
      game.id === 'box-dodger' ? 'tetrisHighScore' : null,
      game.id === 'snake' ? 'snakeHighScore' : null,
      game.id === 'clicker-hero' ? 'highScore:clicker-hero' : null,
    ].filter(Boolean);

    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw !== null && raw !== undefined) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
    }
    // fallback to games.json value
    return game.highScore || 0;
  } catch (e) {
    return game.highScore || 0;
  }
};

const Leaderboard = () => {
  const rows = games.map(g => ({ id: g.id, title: g.title, score: readHighScoreFor(g) }));
  rows.sort((a,b) => b.score - a.score);

  return (
    <div style={{ maxWidth: 960, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ color: 'white', marginBottom: '1rem' }}>Leaderboards</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Local high scores (from your browser). Encourage players to share screenshots — scores are stored locally.</p>
      <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: '0.5rem 0' }}>Rank</th>
              <th style={{ padding: '0.5rem 0' }}>Game</th>
              <th style={{ padding: '0.5rem 0' }}>High Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '0.75rem 0', color: '#cbd5e1', width: 60 }}>{idx+1}</td>
                <td style={{ padding: '0.75rem 0', color: 'white' }}>{r.title}</td>
                <td style={{ padding: '0.75rem 0', color: '#9fb1c9' }}>{r.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
