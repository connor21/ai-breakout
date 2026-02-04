import { WORLD_WIDTH, WORLD_HEIGHT } from '../render/renderer.js';

export function createInitialState() {
  return {
    phase: 'BOOT',
    score: 0,
    lives: 3,
    level: 1,
    paddle: {
      x: WORLD_WIDTH / 2,
      y: 50,
      width: 100,
      height: 20,
      speed: 500,
      targetX: WORLD_WIDTH / 2
    },
    ball: {
      x: WORLD_WIDTH / 2,
      y: 80,
      radius: 8,
      vx: 0,
      vy: 0,
      speed: 320,
      stuck: true
    },
    bricks: [],
    input: {
      pointerX: WORLD_WIDTH / 2,
      keys: {}
    }
  };
}

export function resetBall(state) {
  state.ball.x = state.paddle.x;
  state.ball.y = state.paddle.y + state.paddle.height / 2 + state.ball.radius + 2;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.ball.stuck = true;
}

export function resetLevel(state, levelNum, bricks) {
  state.level = levelNum;
  state.bricks = bricks;
  state.paddle.x = WORLD_WIDTH / 2;
  state.paddle.targetX = WORLD_WIDTH / 2;
  resetBall(state);
  
  const speeds = { 1: 320, 2: 380, 3: 440 };
  state.ball.speed = speeds[levelNum] || 320;
}
