import * as audio from '../audio/audio.js';
import * as combo from '../game/combo.js';

let scoreElement = null;
let livesElement = null;
let levelElement = null;
let comboElement = null;
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
  
  const comboContainer = document.createElement('div');
  comboContainer.id = 'combo-display';
  comboContainer.innerHTML = '<span id="combo-text"></span>';
  document.body.appendChild(comboContainer);
  
  scoreElement = document.getElementById('score');
  livesElement = document.getElementById('lives');
  levelElement = document.getElementById('level');
  comboElement = document.getElementById('combo-text');
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
  
  if (comboElement) {
    const comboCount = combo.getComboCount();
    if (combo.isComboActive()) {
      comboElement.textContent = `COMBO x${comboCount}!`;
      comboElement.parentElement.style.display = 'block';
    } else {
      comboElement.parentElement.style.display = 'none';
    }
  }
}
