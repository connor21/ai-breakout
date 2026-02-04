import { saveHighscore } from './persistence.js';

export function updateScore(state, points) {
  state.score += points;
}

export function loseLife(state) {
  state.lives--;
  
  if (state.lives > 0) {
    state.paddle.x = 400;
    state.paddle.targetX = 400;
    state.paddle.y = 50;
    state.ball.x = state.paddle.x;
    state.ball.y = state.paddle.y + state.paddle.height / 2 + state.ball.radius + 2;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.ball.stuck = true;
  }
}

export function checkLevelComplete(state) {
  return state.bricks.every(brick => brick.type === 'steel');
}

export function levelComplete(state) {
  const bonus = state.lives * 1000;
  updateScore(state, bonus);
  state.phase = 'LEVEL_COMPLETE';
}

export function checkGameOver(state) {
  return state.lives <= 0;
}

export function gameOver(state) {
  state.phase = 'GAME_OVER';
  saveHighscore(state.score);
}
