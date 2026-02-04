export function circleVsAABB(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  
  const distX = circle.x - closestX;
  const distY = circle.y - closestY;
  const distSquared = distX * distX + distY * distY;
  
  return distSquared < (circle.radius * circle.radius);
}

export function reflectBall(ball, normalX, normalY) {
  if (normalX !== 0) {
    ball.vx = -ball.vx;
  }
  if (normalY !== 0) {
    ball.vy = -ball.vy;
  }
}

export function checkWallCollisions(ball, worldWidth, worldHeight) {
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx);
    return true;
  }
  
  if (ball.x + ball.radius >= worldWidth) {
    ball.x = worldWidth - ball.radius;
    ball.vx = -Math.abs(ball.vx);
    return true;
  }
  
  if (ball.y + ball.radius >= worldHeight) {
    ball.y = worldHeight - ball.radius;
    ball.vy = -Math.abs(ball.vy);
    return true;
  }
  
  return false;
}

export function checkPaddleCollision(ball, paddle) {
  const paddleRect = {
    x: paddle.x - paddle.width / 2,
    y: paddle.y - paddle.height / 2,
    width: paddle.width,
    height: paddle.height
  };
  
  if (!circleVsAABB(ball, paddleRect)) {
    return false;
  }
  
  if (ball.vy > 0) {
    return false;
  }
  
  const hitPos = ball.x - paddle.x;
  const t = hitPos / (paddle.width / 2);
  const clampedT = Math.max(-1, Math.min(1, t));
  
  const maxAngle = 60 * (Math.PI / 180);
  const angle = clampedT * maxAngle;
  
  const speed = ball.speed;
  ball.vx = Math.sin(angle) * speed;
  ball.vy = Math.cos(angle) * speed;
  
  ball.y = paddleRect.y + paddleRect.height + ball.radius;
  
  return true;
}

export function checkBrickCollisions(ball, bricks) {
  const hits = [];
  
  for (let i = bricks.length - 1; i >= 0; i--) {
    const brick = bricks[i];
    
    const brickRect = {
      x: brick.x,
      y: brick.y,
      width: brick.width,
      height: brick.height
    };
    
    if (circleVsAABB(ball, brickRect)) {
      if (brick.type === 'steel') {
        const centerX = brick.x + brick.width / 2;
        const centerY = brick.y + brick.height / 2;
        
        const dx = ball.x - centerX;
        const dy = ball.y - centerY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          ball.vx = -ball.vx;
        } else {
          ball.vy = -ball.vy;
        }
        
        hits.push({ brick, destroyed: false, scoreGained: 0 });
        continue;
      }
      
      brick.hp--;
      const destroyed = brick.hp <= 0;
      const scoreGained = destroyed ? brick.scoreValue : brick.scoreValue / 2;
      
      const centerX = brick.x + brick.width / 2;
      const centerY = brick.y + brick.height / 2;
      
      const dx = ball.x - centerX;
      const dy = ball.y - centerY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        ball.vx = -ball.vx;
      } else {
        ball.vy = -ball.vy;
      }
      
      hits.push({ brick, destroyed, scoreGained });
      
      if (destroyed) {
        bricks.splice(i, 1);
      }
      
      break;
    }
  }
  
  return hits;
}
