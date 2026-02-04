import { getDelta, resetTime } from './time.js';

let animationFrameId = null;
let isRunning = false;
let updateCallback = null;
let renderCallback = null;

const FIXED_TIMESTEP = 16.67;
let accumulator = 0;

function gameLoop(currentTime) {
  if (!isRunning) return;
  
  const delta = getDelta(currentTime);
  accumulator += delta;
  
  while (accumulator >= FIXED_TIMESTEP) {
    if (updateCallback) {
      updateCallback(FIXED_TIMESTEP / 1000);
    }
    accumulator -= FIXED_TIMESTEP;
  }
  
  if (renderCallback) {
    renderCallback();
  }
  
  animationFrameId = requestAnimationFrame(gameLoop);
}

export function start(onUpdate, onRender) {
  if (isRunning) return;
  
  updateCallback = onUpdate;
  renderCallback = onRender;
  isRunning = true;
  resetTime();
  accumulator = 0;
  
  animationFrameId = requestAnimationFrame(gameLoop);
}

export function stop() {
  isRunning = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

export function isLoopRunning() {
  return isRunning;
}
