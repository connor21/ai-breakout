import * as audio from '../audio/audio.js';

let scoreElement = null;
let livesElement = null;
let levelElement = null;
let muteButton = null;

export function init() {
  const hudContainer = document.createElement('div');
  hudContainer.id = 'hud';
  hudContainer.innerHTML = `
    <div class="hud-item">Score: <span id="score">0</span></div>
    <div class="hud-item">Lives: <span id="lives">3</span></div>
    <div class="hud-item">Level: <span id="level">1</span></div>
    <button id="mute-btn" class="mute-btn">🔊</button>
  `;
  document.body.appendChild(hudContainer);
  
  scoreElement = document.getElementById('score');
  livesElement = document.getElementById('lives');
  levelElement = document.getElementById('level');
  muteButton = document.getElementById('mute-btn');
  
  updateMuteButton();
  
  muteButton.addEventListener('click', () => {
    audio.toggleMute();
    updateMuteButton();
  });
}

function updateMuteButton() {
  if (muteButton) {
    muteButton.textContent = audio.isMuted() ? '🔇' : '🔊';
  }
}

export function update(state) {
  if (scoreElement) scoreElement.textContent = state.score;
  if (livesElement) livesElement.textContent = state.lives;
  if (levelElement) levelElement.textContent = state.level;
}
