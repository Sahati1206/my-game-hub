const KEY = 'recentlyPlayed';
const MAX = 3;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function write(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) { /* noop */ }
}

export function getRecentlyPlayed() {
  return read();
}

export function addRecentlyPlayed(gameId) {
  const list = read();
  // remove if exists
  const filtered = list.filter(i => i.id !== gameId);
  filtered.unshift({ id: gameId, at: Date.now() });
  const trimmed = filtered.slice(0, MAX);
  write(trimmed);
  return trimmed;
}

export function clearRecentlyPlayed() {
  try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
}

export default { getRecentlyPlayed, addRecentlyPlayed, clearRecentlyPlayed };
