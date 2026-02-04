import './style.css';
import * as loop from './engine/loop.js';
import * as renderer from './render/renderer.js';
import * as scene from './render/scene.js';
import * as entitiesView from './render/entitiesView.js';
import * as input from './input/input.js';
import * as hud from './ui/hud.js';
import * as menus from './ui/menus.js';
import { createInitialState, resetLevel } from './game/state.js';
import { getLevel } from './game/levels.js';
import { update } from './game/update.js';
import { clearBricks } from './render/entitiesView.js';

let state = null;
let sceneObj = null;
let camera = null;
let rendererObj = null;
let previousPhase = null;

function init() {
  const app = document.querySelector('#app');
  
  rendererObj = renderer.init(app);
  const sceneData = scene.init();
  sceneObj = sceneData.scene;
  camera = sceneData.camera;
  
  entitiesView.init(sceneObj);
  
  state = createInitialState();
  
  entitiesView.createPaddle(state.paddle);
  entitiesView.createBall(state.ball);
  
  input.init(renderer.getCanvas());
  
  hud.init();
  menus.init();
  
  state.phase = 'MENU';
  showCurrentMenu();
  
  loop.start(onUpdate, onRender);
}

function onUpdate(dt) {
  state.input = input.getState();
  
  if (state.phase === 'PLAYING') {
    update(state, dt);
    
    if (state.input.keys['KeyP'] || state.input.keys['Escape']) {
      state.phase = 'PAUSED';
      input.clearKey('KeyP');
      input.clearKey('Escape');
    }
  }
  
  if (state.phase !== previousPhase) {
    if (state.phase === 'PAUSED' || state.phase === 'LEVEL_COMPLETE' || state.phase === 'GAME_OVER') {
      showCurrentMenu();
    }
    previousPhase = state.phase;
  }
}

function onRender() {
  entitiesView.sync(state);
  rendererObj.render(sceneObj, camera);
  hud.update(state);
}

function showCurrentMenu() {
  const callbacks = {
    onStart: () => {
      startGame();
    },
    onResume: () => {
      state.phase = 'PLAYING';
      menus.hide();
    },
    onRestart: () => {
      restartLevel();
    },
    onMainMenu: () => {
      state.phase = 'MENU';
      showCurrentMenu();
    },
    onNextLevel: () => {
      nextLevel();
    }
  };
  
  menus.showMenu(state.phase, state, callbacks);
}

function startGame() {
  state.score = 0;
  state.lives = 3;
  state.level = 1;
  
  clearBricks();
  const levelBricks = getLevel(1);
  resetLevel(state, 1, levelBricks);
  
  levelBricks.forEach(brick => {
    entitiesView.createBrick(brick);
  });
  
  state.phase = 'PLAYING';
  menus.hide();
}

function restartLevel() {
  clearBricks();
  const levelBricks = getLevel(state.level);
  resetLevel(state, state.level, levelBricks);
  
  levelBricks.forEach(brick => {
    entitiesView.createBrick(brick);
  });
  
  state.phase = 'PLAYING';
  menus.hide();
}

function nextLevel() {
  state.level++;
  
  if (state.level > 3) {
    state.phase = 'GAME_OVER';
    showCurrentMenu();
    return;
  }
  
  clearBricks();
  const levelBricks = getLevel(state.level);
  resetLevel(state, state.level, levelBricks);
  
  levelBricks.forEach(brick => {
    entitiesView.createBrick(brick);
  });
  
  state.phase = 'PLAYING';
  menus.hide();
}

init();
