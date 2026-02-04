import * as THREE from 'three';

let scene = null;
let particles = [];
let ballTrail = [];
let paddleFlashMesh = null;

const MAX_TRAIL_POINTS = 10;
const PARTICLE_LIFETIME = 0.5;

export function init(sceneObj) {
  scene = sceneObj;
}

export function createBallTrail(ball) {
  const trailPoint = {
    x: ball.x,
    y: ball.y,
    alpha: 1.0,
    mesh: null
  };
  
  const geometry = new THREE.CircleGeometry(ball.radius * 0.6, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00d9ff,
    transparent: true,
    opacity: 0.6
  });
  
  trailPoint.mesh = new THREE.Mesh(geometry, material);
  trailPoint.mesh.position.set(ball.x, ball.y, -1);
  scene.add(trailPoint.mesh);
  
  ballTrail.push(trailPoint);
  
  if (ballTrail.length > MAX_TRAIL_POINTS) {
    const old = ballTrail.shift();
    if (old.mesh) {
      scene.remove(old.mesh);
      old.mesh.geometry.dispose();
      old.mesh.material.dispose();
    }
  }
}

export function updateBallTrail(dt) {
  for (let i = ballTrail.length - 1; i >= 0; i--) {
    const point = ballTrail[i];
    point.alpha -= dt * 2;
    
    if (point.mesh) {
      point.mesh.material.opacity = Math.max(0, point.alpha * 0.6);
    }
    
    if (point.alpha <= 0) {
      if (point.mesh) {
        scene.remove(point.mesh);
        point.mesh.geometry.dispose();
        point.mesh.material.dispose();
      }
      ballTrail.splice(i, 1);
    }
  }
}

export function createBrickDestroyParticles(brick) {
  const particleCount = 8;
  const colors = {
    normal: 0x00ff00,
    strong: 0xffaa00,
    steel: 0x808080
  };
  
  const color = colors[brick.type] || 0x00ff00;
  const centerX = brick.x + brick.width / 2;
  const centerY = brick.y + brick.height / 2;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 100 + Math.random() * 100;
    
    const particle = {
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      lifetime: PARTICLE_LIFETIME,
      maxLifetime: PARTICLE_LIFETIME,
      mesh: null
    };
    
    const geometry = new THREE.CircleGeometry(3, 8);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1.0
    });
    
    particle.mesh = new THREE.Mesh(geometry, material);
    particle.mesh.position.set(particle.x, particle.y, 0);
    scene.add(particle.mesh);
    
    particles.push(particle);
  }
}

export function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.lifetime -= dt;
    
    const alpha = particle.lifetime / particle.maxLifetime;
    
    if (particle.mesh) {
      particle.mesh.position.set(particle.x, particle.y, 0);
      particle.mesh.material.opacity = alpha;
    }
    
    if (particle.lifetime <= 0) {
      if (particle.mesh) {
        scene.remove(particle.mesh);
        particle.mesh.geometry.dispose();
        particle.mesh.material.dispose();
      }
      particles.splice(i, 1);
    }
  }
}

export function createPaddleFlash(paddle) {
  if (paddleFlashMesh) {
    scene.remove(paddleFlashMesh);
    paddleFlashMesh.geometry.dispose();
    paddleFlashMesh.material.dispose();
  }
  
  const geometry = new THREE.BoxGeometry(paddle.width, paddle.height, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  
  paddleFlashMesh = new THREE.Mesh(geometry, material);
  paddleFlashMesh.position.set(paddle.x, paddle.y, 1);
  paddleFlashMesh.userData = { lifetime: 0.1, maxLifetime: 0.1 };
  scene.add(paddleFlashMesh);
}

export function updatePaddleFlash(dt) {
  if (paddleFlashMesh && paddleFlashMesh.userData) {
    paddleFlashMesh.userData.lifetime -= dt;
    const alpha = paddleFlashMesh.userData.lifetime / paddleFlashMesh.userData.maxLifetime;
    paddleFlashMesh.material.opacity = alpha * 0.8;
    
    if (paddleFlashMesh.userData.lifetime <= 0) {
      scene.remove(paddleFlashMesh);
      paddleFlashMesh.geometry.dispose();
      paddleFlashMesh.material.dispose();
      paddleFlashMesh = null;
    }
  }
}

export function update(dt) {
  updateBallTrail(dt);
  updateParticles(dt);
  updatePaddleFlash(dt);
}

export function clearAll() {
  ballTrail.forEach(point => {
    if (point.mesh) {
      scene.remove(point.mesh);
      point.mesh.geometry.dispose();
      point.mesh.material.dispose();
    }
  });
  ballTrail = [];
  
  particles.forEach(particle => {
    if (particle.mesh) {
      scene.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      particle.mesh.material.dispose();
    }
  });
  particles = [];
  
  if (paddleFlashMesh) {
    scene.remove(paddleFlashMesh);
    paddleFlashMesh.geometry.dispose();
    paddleFlashMesh.material.dispose();
    paddleFlashMesh = null;
  }
}
