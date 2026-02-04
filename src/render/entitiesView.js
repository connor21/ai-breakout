import * as THREE from 'three';
import { getPowerupColor } from '../game/powerups.js';

let paddleMesh = null;
let ballMesh = null;
let ballGlow = null;
const brickMeshes = new Map();
const powerupMeshes = new Map();
const extraBallMeshes = [];
let scene = null;

const BRICK_COLORS = {
  normal: {
    1: 0x00ff88,
    row0: 0xff6b6b,
    row1: 0xffa500,
    row2: 0xffff00,
    row3: 0x4ecdc4,
    row4: 0x45b7d1,
    row5: 0x96ceb4
  },
  strong: {
    2: 0xff4757,
    1: 0xff6348
  },
  steel: 0x7f8c8d
};

export function init(sceneRef) {
  scene = sceneRef;
}

export function createPaddle(paddle) {
  const geometry = new THREE.PlaneGeometry(paddle.width, paddle.height);
  const material = new THREE.MeshBasicMaterial({ color: 0x00d9ff });
  paddleMesh = new THREE.Mesh(geometry, material);
  paddleMesh.position.set(paddle.x, paddle.y, 0);
  scene.add(paddleMesh);
  return paddleMesh;
}

export function createBall(ball) {
  const geometry = new THREE.CircleGeometry(ball.radius, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  ballMesh = new THREE.Mesh(geometry, material);
  ballMesh.position.set(ball.x, ball.y, 0);
  scene.add(ballMesh);
  
  const glowGeometry = new THREE.CircleGeometry(ball.radius * 1.5, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d9ff,
    transparent: true,
    opacity: 0.3
  });
  ballGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  ballGlow.position.set(ball.x, ball.y, -0.5);
  scene.add(ballGlow);
  
  return ballMesh;
}

export function createBrick(brick) {
  const geometry = new THREE.PlaneGeometry(brick.width, brick.height);
  
  let color;
  if (brick.type === 'steel') {
    color = BRICK_COLORS.steel;
  } else if (brick.type === 'strong') {
    color = BRICK_COLORS.strong[brick.hp] || BRICK_COLORS.strong[2];
  } else {
    color = brick.color || BRICK_COLORS.normal[1];
  }
  
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(brick.x + brick.width / 2, brick.y + brick.height / 2, 0);
  
  scene.add(mesh);
  brickMeshes.set(brick.id, mesh);
  
  return mesh;
}

export function updatePaddle(paddle) {
  if (paddleMesh) {
    paddleMesh.position.x = paddle.x;
    paddleMesh.position.y = paddle.y;
    
    if (paddleMesh.geometry.parameters.width !== paddle.width) {
      paddleMesh.geometry.dispose();
      paddleMesh.geometry = new THREE.PlaneGeometry(paddle.width, paddle.height);
    }
  }
}

export function updateBall(ball) {
  if (ballMesh) {
    ballMesh.position.x = ball.x;
    ballMesh.position.y = ball.y;
  }
  if (ballGlow) {
    ballGlow.position.x = ball.x;
    ballGlow.position.y = ball.y;
  }
}

export function updateBrick(brick) {
  const mesh = brickMeshes.get(brick.id);
  if (mesh && brick.type === 'strong') {
    const color = BRICK_COLORS.strong[brick.hp] || BRICK_COLORS.strong[2];
    mesh.material.color.setHex(color);
  }
}

export function removeBrick(brickId) {
  const mesh = brickMeshes.get(brickId);
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    brickMeshes.delete(brickId);
  }
}

export function createPowerup(powerup) {
  const geometry = new THREE.PlaneGeometry(powerup.width, powerup.height);
  const color = getPowerupColor(powerup.kind);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(powerup.x, powerup.y, 0);
  scene.add(mesh);
  powerupMeshes.set(powerup.id, mesh);
  return mesh;
}

export function updatePowerup(powerup) {
  const mesh = powerupMeshes.get(powerup.id);
  if (mesh) {
    mesh.position.x = powerup.x;
    mesh.position.y = powerup.y;
  }
}

export function removePowerup(powerupId) {
  const mesh = powerupMeshes.get(powerupId);
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    powerupMeshes.delete(powerupId);
  }
}

export function createExtraBall(ball) {
  const geometry = new THREE.CircleGeometry(ball.radius, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(ball.x, ball.y, 0);
  scene.add(mesh);
  extraBallMeshes.push({ ball, mesh });
  return mesh;
}

export function updateExtraBalls(extraBalls) {
  for (let i = extraBallMeshes.length - 1; i >= 0; i--) {
    const { ball, mesh } = extraBallMeshes[i];
    const stillExists = extraBalls.find(b => b === ball);
    
    if (!stillExists) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      extraBallMeshes.splice(i, 1);
    } else {
      mesh.position.x = ball.x;
      mesh.position.y = ball.y;
    }
  }
  
  extraBalls.forEach(ball => {
    const exists = extraBallMeshes.find(eb => eb.ball === ball);
    if (!exists) {
      createExtraBall(ball);
    }
  });
}

export function sync(state) {
  updatePaddle(state.paddle);
  updateBall(state.ball);
  
  state.bricks.forEach(brick => {
    if (!brickMeshes.has(brick.id)) {
      createBrick(brick);
    } else {
      updateBrick(brick);
    }
  });
  
  if (state.powerups) {
    state.powerups.forEach(powerup => {
      if (!powerup.active) {
        if (!powerupMeshes.has(powerup.id)) {
          createPowerup(powerup);
        } else {
          updatePowerup(powerup);
        }
      }
    });
  }
  
  if (state.extraBalls) {
    updateExtraBalls(state.extraBalls);
  }
}

export function clearBricks() {
  brickMeshes.forEach((mesh, id) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  brickMeshes.clear();
}

export function clearPowerups() {
  powerupMeshes.forEach((mesh, id) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  powerupMeshes.clear();
}

export function clearExtraBalls() {
  extraBallMeshes.forEach(({ mesh }) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  extraBallMeshes.length = 0;
}
