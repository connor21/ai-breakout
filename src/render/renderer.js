import * as THREE from 'three';

let renderer = null;
let canvas = null;

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;

export function init(container) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WORLD_WIDTH, WORLD_HEIGHT);
  renderer.setClearColor(0x1a1a2e);
  
  canvas = renderer.domElement;
  container.appendChild(canvas);
  
  window.addEventListener('resize', resize);
  resize();
  
  return renderer;
}

export function resize() {
  if (!renderer || !canvas) return;
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowAspect = windowWidth / windowHeight;
  const gameAspect = WORLD_WIDTH / WORLD_HEIGHT;
  
  let width, height;
  
  if (windowAspect > gameAspect) {
    height = windowHeight;
    width = height * gameAspect;
  } else {
    width = windowWidth;
    height = width / gameAspect;
  }
  
  width = Math.max(400, width);
  height = Math.max(300, height);
  
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.position = 'absolute';
  canvas.style.left = `${(windowWidth - width) / 2}px`;
  canvas.style.top = `${(windowHeight - height) / 2}px`;
}

export function getRenderer() {
  return renderer;
}

export function getCanvas() {
  return canvas;
}

export { WORLD_WIDTH, WORLD_HEIGHT };
