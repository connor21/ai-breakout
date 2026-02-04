import { WORLD_WIDTH, WORLD_HEIGHT } from '../render/renderer.js';
import { checkWallCollisions, checkPaddleCollision, checkBrickCollisions } from './collision.js';
import { updateScore, loseLife, checkLevelComplete, levelComplete, checkGameOver, gameOver } from './rules.js';
import { removeBrick, updateBrick } from '../render/entitiesView.js';

const LERP_FACTOR = 0.15;

export function update(state, dt) {
  if (state.phase !== 'PLAYING') {
    return;
  }
  
  updatePaddle(state, dt);
  
  if (state.ball.stuck) {
    state.ball.x = state.paddle.x;
    state.ball.y = state.paddle.y + state.paddle.height / 2 + state.ball.radius + 2;
    
    if (state.input.keys['Space'] || state.input.keys['launch']) {
      launchBall(state);
    }
  } else {
    updateBall(state, dt);
  }
}

function updatePaddle(state, dt) {
  const paddle = state.paddle;
  const input = state.input;
  
  if (input.pointerX !== null) {
    paddle.targetX = input.pointerX;
  } else {
    if (input.keys['ArrowLeft'] || input.keys['KeyA']) {
      paddle.targetX -= paddle.speed * dt;
    }
    if (input.keys['ArrowRight'] || input.keys['KeyD']) {
      paddle.targetX += paddle.speed * dt;
    }
  }
  
  paddle.x += (paddle.targetX - paddle.x) * LERP_FACTOR;
  
  const halfWidth = paddle.width / 2;
  paddle.x = Math.max(halfWidth, Math.min(WORLD_WIDTH - halfWidth, paddle.x));
  paddle.targetX = Math.max(halfWidth, Math.min(WORLD_WIDTH - halfWidth, paddle.targetX));
}

function launchBall(state) {
  state.ball.stuck = false;
  state.ball.vx = 0;
  state.ball.vy = state.ball.speed;
  state.input.keys['Space'] = false;
  state.input.keys['launch'] = false;
}

function updateBall(state, dt) {
  const ball = state.ball;
  
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  
  checkWallCollisions(ball, WORLD_WIDTH, WORLD_HEIGHT);
  
  checkPaddleCollision(ball, state.paddle);
  
  const hits = checkBrickCollisions(ball, state.bricks);
  hits.forEach(hit => {
    updateScore(state, hit.scoreGained);
    if (hit.destroyed) {
      removeBrick(hit.brick.id);
    } else if (hit.brick.type === 'strong') {
      updateBrick(hit.brick);
    }
  });
  
  if (ball.y - ball.radius < 0) {
    loseLife(state);
    
    if (checkGameOver(state)) {
      gameOver(state);
    }
  }
  
  if (checkLevelComplete(state)) {
    levelComplete(state);
  }
}
