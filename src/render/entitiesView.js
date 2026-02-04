import * as THREE from 'three';

let paddleMesh = null;
let ballMesh = null;
const brickMeshes = new Map();
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
  }
}

export function updateBall(ball) {
  if (ballMesh) {
    ballMesh.position.x = ball.x;
    ballMesh.position.y = ball.y;
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
}

export function clearBricks() {
  brickMeshes.forEach((mesh, id) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  brickMeshes.clear();
}
