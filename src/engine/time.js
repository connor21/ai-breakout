let lastTime = 0;
const MAX_DELTA = 33;

export function getDelta(currentTime) {
  if (lastTime === 0) {
    lastTime = currentTime;
    return 0;
  }
  
  const delta = currentTime - lastTime;
  lastTime = currentTime;
  
  return clampDelta(delta);
}

export function clampDelta(dt) {
  return Math.min(dt, MAX_DELTA);
}

export function resetTime() {
  lastTime = 0;
}
