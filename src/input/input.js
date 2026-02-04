import { WORLD_WIDTH } from '../render/renderer.js';

let pointerX = null;
let pointerActive = false;
const keys = {};
let canvas = null;

export function init(canvasElement) {
  canvas = canvasElement;
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

function handleMouseMove(e) {
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const scaleX = WORLD_WIDTH / rect.width;
  const x = (e.clientX - rect.left) * scaleX;
  
  pointerX = Math.max(0, Math.min(WORLD_WIDTH, x));
  pointerActive = true;
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!canvas || e.touches.length === 0) return;
  
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = WORLD_WIDTH / rect.width;
  const x = (touch.clientX - rect.left) * scaleX;
  
  pointerX = Math.max(0, Math.min(WORLD_WIDTH, x));
  pointerActive = true;
}

function handleTouchStart(e) {
  keys['launch'] = true;
}

function handleKeyDown(e) {
  keys[e.code] = true;
  
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyA' || e.code === 'KeyD') {
    pointerActive = false;
  }
  
  if (e.code === 'Space' || e.code === 'KeyP' || e.code === 'Escape' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    e.preventDefault();
  }
}

function handleKeyUp(e) {
  keys[e.code] = false;
}

export function getState() {
  return {
    pointerX: pointerActive ? pointerX : null,
    keys: { ...keys }
  };
}

export function clearKey(key) {
  keys[key] = false;
}
