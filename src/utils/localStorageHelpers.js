export function resetClickerPR() {
  const keys = [
    'highScore:clicker-hero',
    'highScore_clicker-hero',
    'clickerHighScore',
    'clicker-pr',
    'clicker_highscore'
  ];
  try {
    keys.forEach(k => localStorage.removeItem(k));
    // ensure canonical key is set to '0' so UI that reads it shows zero
    localStorage.setItem('highScore:clicker-hero', '0');
  } catch (e) {
    // ignore storage exceptions
  }
}

export function getClickerPR() {
  return Number(localStorage.getItem('highScore:clicker-hero')) || 0;
}
