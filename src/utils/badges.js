// Simple localStorage-backed badge helper for games
const PREFIX = 'badges:';

function _key(gameId) {
  return `${PREFIX}${gameId}`;
}

function read(gameId) {
  try {
    const raw = localStorage.getItem(_key(gameId));
    if (!raw) return { plays: 0, badges: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.warn('badges.read error', e);
    return { plays: 0, badges: [] };
  }
}

function write(gameId, obj) {
  try {
    localStorage.setItem(_key(gameId), JSON.stringify(obj));
  } catch (e) {
    console.warn('badges.write error', e);
  }
}

export function getBadgeData(gameId) {
  return read(gameId);
}

export function getBadgesForGame(gameId) {
  return read(gameId).badges || [];
}

export function hasBadge(gameId, badgeKey) {
  const d = read(gameId);
  return Array.isArray(d.badges) && d.badges.includes(badgeKey);
}

export function awardBadge(gameId, badgeKey) {
  const d = read(gameId);
  d.badges = Array.isArray(d.badges) ? d.badges : [];
  if (!d.badges.includes(badgeKey)) {
    d.badges.push(badgeKey);
    write(gameId, d);
    return true;
  }
  return false;
}

// Increment play counter and optionally award 'played-10'
export function incrementPlays(gameId) {
  const d = read(gameId);
  d.plays = (d.plays || 0) + 1;
  // award at thresholds
  if (d.plays === 10) {
    d.badges = Array.isArray(d.badges) ? d.badges : [];
    if (!d.badges.includes('played-10')) d.badges.push('played-10');
  }
  write(gameId, d);
  return d;
}

// Award beat-pr badge helper
export function awardBeatPR(gameId) {
  const ok = awardBadge(gameId, 'beat-pr');
  try {
    if (ok && typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('badge:beat-pr', { detail: { gameId } }));
    }
  } catch (e) { /* noop */ }
  return ok;
}

// Utility to reset (for testing)
export function resetBadges(gameId) {
  try { localStorage.removeItem(_key(gameId)); } catch (e) { /* noop */ }
}

export default {
  getBadgeData, getBadgesForGame, hasBadge, awardBadge, incrementPlays, awardBeatPR, resetBadges
};
