const POWERUP_TYPES = {
  WIDER_PADDLE: 'wider_paddle',
  SLOW_BALL: 'slow_ball',
  MULTIBALL: 'multiball'
};

const POWERUP_COLORS = {
  wider_paddle: 0x00ff00,
  slow_ball: 0x0099ff,
  multiball: 0xff00ff
};

const DROP_RATES = {
  1: 0.05,
  2: 0.10,
  3: 0.15
};

const POWERUP_DURATION = 10;
const POWERUP_FALL_SPEED = 100;

export function shouldDropPowerup(level) {
  const dropRate = DROP_RATES[level] || 0.05;
  return Math.random() < dropRate;
}

export function createPowerup(brick, level) {
  const types = Object.values(POWERUP_TYPES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: `powerup_${Date.now()}_${Math.random()}`,
    x: brick.x + brick.width / 2,
    y: brick.y + brick.height / 2,
    width: 20,
    height: 20,
    vx: 0,
    vy: -POWERUP_FALL_SPEED,
    kind: randomType,
    active: false,
    activeDuration: 0
  };
}

export function updatePowerups(powerups, dt) {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const powerup = powerups[i];
    
    if (!powerup.active) {
      powerup.y += powerup.vy * dt;
      
      if (powerup.y < -50) {
        powerups.splice(i, 1);
      }
    }
  }
}

export function checkPowerupCollision(powerup, paddle) {
  const paddleRect = {
    x: paddle.x - paddle.width / 2,
    y: paddle.y - paddle.height / 2,
    width: paddle.width,
    height: paddle.height
  };
  
  const powerupRect = {
    x: powerup.x - powerup.width / 2,
    y: powerup.y - powerup.height / 2,
    width: powerup.width,
    height: powerup.height
  };
  
  return (
    powerupRect.x < paddleRect.x + paddleRect.width &&
    powerupRect.x + powerupRect.width > paddleRect.x &&
    powerupRect.y < paddleRect.y + paddleRect.height &&
    powerupRect.y + powerupRect.height > paddleRect.y
  );
}

export function activatePowerup(state, powerup) {
  const originalPaddle = state.paddle.originalWidth || state.paddle.width;
  const originalBall = state.ball.originalSpeed || state.ball.speed;
  
  switch (powerup.kind) {
    case POWERUP_TYPES.WIDER_PADDLE:
      if (!state.paddle.originalWidth) {
        state.paddle.originalWidth = state.paddle.width;
      }
      state.paddle.width = state.paddle.originalWidth * 1.5;
      break;
      
    case POWERUP_TYPES.SLOW_BALL:
      if (!state.ball.originalSpeed) {
        state.ball.originalSpeed = state.ball.speed;
      }
      state.ball.speed = state.ball.originalSpeed * 0.7;
      const currentSpeed = Math.sqrt(state.ball.vx * state.ball.vx + state.ball.vy * state.ball.vy);
      if (currentSpeed > 0) {
        const ratio = state.ball.speed / currentSpeed;
        state.ball.vx *= ratio;
        state.ball.vy *= ratio;
      }
      break;
      
    case POWERUP_TYPES.MULTIBALL:
      if (!state.ball.stuck) {
        const ball1 = createExtraBall(state.ball, -30);
        const ball2 = createExtraBall(state.ball, 30);
        if (!state.extraBalls) {
          state.extraBalls = [];
        }
        state.extraBalls.push(ball1, ball2);
      }
      break;
  }
  
  powerup.active = true;
  powerup.activeDuration = POWERUP_DURATION;
  powerup.startTime = Date.now();
}

function createExtraBall(mainBall, angleOffset) {
  const currentAngle = Math.atan2(mainBall.vy, mainBall.vx);
  const newAngle = currentAngle + (angleOffset * Math.PI / 180);
  
  return {
    x: mainBall.x,
    y: mainBall.y,
    radius: mainBall.radius,
    vx: Math.cos(newAngle) * mainBall.speed,
    vy: Math.sin(newAngle) * mainBall.speed,
    speed: mainBall.speed,
    stuck: false
  };
}

export function updateActivePowerups(state, dt) {
  if (!state.activePowerups) {
    state.activePowerups = [];
  }
  
  for (let i = state.activePowerups.length - 1; i >= 0; i--) {
    const powerup = state.activePowerups[i];
    powerup.activeDuration -= dt;
    
    if (powerup.activeDuration <= 0) {
      deactivatePowerup(state, powerup);
      state.activePowerups.splice(i, 1);
    }
  }
}

export function deactivatePowerup(state, powerup) {
  switch (powerup.kind) {
    case POWERUP_TYPES.WIDER_PADDLE:
      if (state.paddle.originalWidth) {
        state.paddle.width = state.paddle.originalWidth;
        delete state.paddle.originalWidth;
      }
      break;
      
    case POWERUP_TYPES.SLOW_BALL:
      if (state.ball.originalSpeed) {
        state.ball.speed = state.ball.originalSpeed;
        const currentSpeed = Math.sqrt(state.ball.vx * state.ball.vx + state.ball.vy * state.ball.vy);
        if (currentSpeed > 0) {
          const ratio = state.ball.speed / currentSpeed;
          state.ball.vx *= ratio;
          state.ball.vy *= ratio;
        }
        delete state.ball.originalSpeed;
      }
      break;
  }
}

export function getPowerupColor(kind) {
  return POWERUP_COLORS[kind] || 0xffffff;
}

export { POWERUP_TYPES, POWERUP_DURATION };
