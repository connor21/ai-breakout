const COMBO_TIMEOUT = 2.0;
const COMBO_BONUS_MULTIPLIER = 50;

let comboCount = 0;
let comboTimer = 0;
let totalComboScore = 0;

export function init() {
  comboCount = 0;
  comboTimer = 0;
  totalComboScore = 0;
}

export function addHit() {
  comboCount++;
  comboTimer = COMBO_TIMEOUT;
}

export function update(dt) {
  if (comboTimer > 0) {
    comboTimer -= dt;
    
    if (comboTimer <= 0) {
      resetCombo();
    }
  }
}

export function resetCombo() {
  comboCount = 0;
  comboTimer = 0;
}

export function getComboBonus() {
  if (comboCount <= 1) return 0;
  return (comboCount - 1) * COMBO_BONUS_MULTIPLIER;
}

export function getComboCount() {
  return comboCount;
}

export function isComboActive() {
  return comboCount > 1 && comboTimer > 0;
}

export function getComboTimer() {
  return comboTimer;
}
