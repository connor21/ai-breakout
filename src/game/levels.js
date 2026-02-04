const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 25;
const BRICK_SPACING = 5;
const GRID_COLS = 10;
const GRID_ROWS = 6;
const GRID_OFFSET_X = 50;
const GRID_OFFSET_Y = 350;

const ROW_COLORS = [
  0xff6b6b,
  0xffa500,
  0xffff00,
  0x4ecdc4,
  0x45b7d1,
  0x96ceb4
];

function createBrick(row, col, type, hp) {
  const x = GRID_OFFSET_X + col * (BRICK_WIDTH + BRICK_SPACING);
  const y = GRID_OFFSET_Y + row * (BRICK_HEIGHT + BRICK_SPACING);
  
  const scoreValues = {
    normal: 50,
    strong: 100,
    steel: 0
  };
  
  return {
    id: `brick_${row}_${col}`,
    x,
    y,
    width: BRICK_WIDTH,
    height: BRICK_HEIGHT,
    hp,
    type,
    scoreValue: scoreValues[type] || 50,
    color: type === 'normal' ? ROW_COLORS[row % ROW_COLORS.length] : null
  };
}

export function getLevel(levelNum) {
  switch (levelNum) {
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
    case 3:
      return createLevel3();
    default:
      return createLevel1();
  }
}

function createLevel1() {
  const bricks = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      bricks.push(createBrick(row, col, 'normal', 1));
    }
  }
  
  return bricks;
}

function createLevel2() {
  const bricks = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if ((col === 4 || col === 5) && row >= 1 && row <= 4) {
        bricks.push(createBrick(row, col, 'steel', Infinity));
      } else if (row >= 2 && row <= 3) {
        bricks.push(createBrick(row, col, 'strong', 2));
      } else {
        bricks.push(createBrick(row, col, 'normal', 1));
      }
    }
  }
  
  return bricks;
}

function createLevel3() {
  const bricks = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if ((col === 0 || col === 1 || col === 8 || col === 9) && row >= 1) {
        bricks.push(createBrick(row, col, 'steel', Infinity));
      } else if (row <= 2) {
        const type = Math.random() > 0.5 ? 'strong' : 'normal';
        const hp = type === 'strong' ? 2 : 1;
        bricks.push(createBrick(row, col, type, hp));
      } else {
        bricks.push(createBrick(row, col, 'normal', 1));
      }
    }
  }
  
  return bricks;
}
