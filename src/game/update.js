import { WORLD_WIDTH, WORLD_HEIGHT } from '../render/renderer.js';
import { checkWallCollisions, checkPaddleCollision, checkBrickCollisions } from './collision.js';
import { updateScore, loseLife, checkLevelComplete, levelComplete, checkGameOver, gameOver } from './rules.js';
import { removeBrick, updateBrick, removePowerup } from '../render/entitiesView.js';
import * as audio from '../audio/audio.js';
import * as powerups from './powerups.js';
import * as combo from './combo.js';
import * as fx from '../render/fx.js';
import * as cameraEffects from '../render/cameraEffects.js';

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
    
    if (!state.extraBalls) {
      state.extraBalls = [];
    }
    updateExtraBalls(state, dt);
  }
  
  if (!state.powerups) {
    state.powerups = [];
  }
  powerups.updatePowerups(state.powerups, dt);
  updatePowerupCollisions(state);
  
  if (!state.activePowerups) {
    state.activePowerups = [];
  }
  powerups.updateActivePowerups(state, dt);
  
  combo.update(dt);
  fx.update(dt);
  cameraEffects.update(dt);
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
  
  if (checkWallCollisions(ball, WORLD_WIDTH, WORLD_HEIGHT)) {
    audio.play('wall_hit');
  }
  
  if (checkPaddleCollision(ball, state.paddle)) {
    audio.play('paddle_hit');
    fx.createPaddleFlash(state.paddle);
  }
  
  if (!ball.stuck) {
    fx.createBallTrail(ball);
  }
  
  const hits = checkBrickCollisions(ball, state.bricks);
  hits.forEach(hit => {
    if (hit.destroyed || hit.scoreGained > 0) {
      combo.addHit();
      const comboBonus = combo.getComboBonus();
      updateScore(state, hit.scoreGained + comboBonus);
    }
    
    if (hit.destroyed) {
      removeBrick(hit.brick.id);
      audio.play('brick_destroy');
      fx.createBrickDestroyParticles(hit.brick);
      cameraEffects.screenShake(5, 0.1);
      
      if (powerups.shouldDropPowerup(state.level)) {
        const powerup = powerups.createPowerup(hit.brick, state.level);
        state.powerups.push(powerup);
      }
      
      const remainingDestructible = state.bricks.filter(b => b.type !== 'steel').length;
      if (remainingDestructible === 0) {
        cameraEffects.screenShake(15, 0.3);
      }
    } else {
      audio.play('brick_hit');
      if (hit.brick.type === 'strong') {
        updateBrick(hit.brick);
      }
    }
  });
  
  if (ball.y - ball.radius < 0) {
    loseLife(state);
    audio.play('life_lost');
    combo.resetCombo();
    
    if (state.extraBalls) {
      state.extraBalls = [];
    }
    
    if (checkGameOver(state)) {
      gameOver(state);
      audio.play('game_over');
    }
  }
  
  if (checkLevelComplete(state)) {
    levelComplete(state);
    audio.play('level_complete');
  }
}

function updateExtraBalls(state, dt) {
  if (!state.extraBalls) return;
  
  for (let i = state.extraBalls.length - 1; i >= 0; i--) {
    const ball = state.extraBalls[i];
    
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    
    checkWallCollisions(ball, WORLD_WIDTH, WORLD_HEIGHT);
    checkPaddleCollision(ball, state.paddle);
    
    const hits = checkBrickCollisions(ball, state.bricks);
    hits.forEach(hit => {
      if (hit.destroyed || hit.scoreGained > 0) {
        combo.addHit();
        const comboBonus = combo.getComboBonus();
        updateScore(state, hit.scoreGained + comboBonus);
      }
      
      if (hit.destroyed) {
        removeBrick(hit.brick.id);
        fx.createBrickDestroyParticles(hit.brick);
        
        if (powerups.shouldDropPowerup(state.level)) {
          const powerup = powerups.createPowerup(hit.brick, state.level);
          state.powerups.push(powerup);
        }
      } else if (hit.brick.type === 'strong') {
        updateBrick(hit.brick);
      }
    });
    
    if (ball.y - ball.radius < 0) {
      state.extraBalls.splice(i, 1);
    }
  }
}

function updatePowerupCollisions(state) {
  if (!state.powerups) return;
  
  for (let i = state.powerups.length - 1; i >= 0; i--) {
    const powerup = state.powerups[i];
    
    if (!powerup.active && powerups.checkPowerupCollision(powerup, state.paddle)) {
      powerups.activatePowerup(state, powerup);
      state.activePowerups.push(powerup);
      removePowerup(powerup.id);
      state.powerups.splice(i, 1);
    }
  }
}
