const STORAGE_KEY_HIGHSCORE = 'arkanoid_highscore';
const STORAGE_KEY_LAST_LEVEL = 'arkanoid_last_level';

export function saveHighscore(score) {
  const currentHighscore = getHighscore();
  if (score > currentHighscore) {
    localStorage.setItem(STORAGE_KEY_HIGHSCORE, score.toString());
    return true;
  }
  return false;
}

export function getHighscore() {
  const stored = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
  return stored ? parseInt(stored, 10) : 0;
}

export function saveLastLevel(level) {
  localStorage.setItem(STORAGE_KEY_LAST_LEVEL, level.toString());
}

export function getLastLevel() {
  const stored = localStorage.getItem(STORAGE_KEY_LAST_LEVEL);
  return stored ? parseInt(stored, 10) : 1;
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY_LAST_LEVEL);
}
