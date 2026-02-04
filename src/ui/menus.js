let menuContainer = null;
let currentMenu = null;

export function init() {
  menuContainer = document.createElement('div');
  menuContainer.id = 'menu-container';
  document.body.appendChild(menuContainer);
}

export function showMenu(type, state, callbacks) {
  hide();
  
  currentMenu = type;
  menuContainer.style.display = 'flex';
  
  switch (type) {
    case 'MENU':
      showStartMenu(callbacks);
      break;
    case 'PAUSED':
      showPauseMenu(callbacks);
      break;
    case 'LEVEL_COMPLETE':
      showLevelCompleteMenu(state, callbacks);
      break;
    case 'GAME_OVER':
      showGameOverMenu(state, callbacks);
      break;
  }
}

export function hide() {
  menuContainer.style.display = 'none';
  menuContainer.innerHTML = '';
  currentMenu = null;
}

function showStartMenu(callbacks) {
  menuContainer.innerHTML = `
    <div class="menu">
      <h1>ARKANOID</h1>
      <button id="start-btn" class="menu-btn">Start Game</button>
      <div class="instructions">
        <p>Move: Mouse or Arrow Keys</p>
        <p>Launch: Space</p>
        <p>Pause: P or ESC</p>
      </div>
    </div>
  `;
  
  document.getElementById('start-btn').addEventListener('click', callbacks.onStart);
}

function showPauseMenu(callbacks) {
  menuContainer.innerHTML = `
    <div class="menu">
      <h2>PAUSED</h2>
      <button id="resume-btn" class="menu-btn">Resume</button>
      <button id="restart-btn" class="menu-btn">Restart</button>
      <button id="main-menu-btn" class="menu-btn">Main Menu</button>
    </div>
  `;
  
  document.getElementById('resume-btn').addEventListener('click', callbacks.onResume);
  document.getElementById('restart-btn').addEventListener('click', callbacks.onRestart);
  document.getElementById('main-menu-btn').addEventListener('click', callbacks.onMainMenu);
}

function showLevelCompleteMenu(state, callbacks) {
  menuContainer.innerHTML = `
    <div class="menu">
      <h2>LEVEL ${state.level} COMPLETE!</h2>
      <p class="score-display">Score: ${state.score}</p>
      <button id="next-level-btn" class="menu-btn">Next Level</button>
    </div>
  `;
  
  document.getElementById('next-level-btn').addEventListener('click', callbacks.onNextLevel);
}

function showGameOverMenu(state, callbacks) {
  menuContainer.innerHTML = `
    <div class="menu">
      <h2>GAME OVER</h2>
      <p class="score-display">Final Score: ${state.score}</p>
      <button id="restart-game-btn" class="menu-btn">Restart</button>
      <button id="main-menu-btn" class="menu-btn">Main Menu</button>
    </div>
  `;
  
  document.getElementById('restart-game-btn').addEventListener('click', callbacks.onRestart);
  document.getElementById('main-menu-btn').addEventListener('click', callbacks.onMainMenu);
}

export function getCurrentMenu() {
  return currentMenu;
}
