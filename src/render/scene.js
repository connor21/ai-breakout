import * as THREE from 'three';
import { WORLD_WIDTH, WORLD_HEIGHT } from './renderer.js';

let scene = null;
let camera = null;

export function init() {
  scene = new THREE.Scene();
  
  camera = new THREE.OrthographicCamera(
    0,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    0,
    0.1,
    1000
  );
  camera.position.z = 10;
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  return { scene, camera };
}

export function getScene() {
  return scene;
}

export function getCamera() {
  return camera;
}
