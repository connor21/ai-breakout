let audioContext = null;
let muted = false;

const soundConfigs = {
  paddle_hit: { freq: 440, duration: 0.05, type: 'sine' },
  brick_hit: { freq: 523, duration: 0.08, type: 'square' },
  wall_hit: { freq: 330, duration: 0.05, type: 'sine' },
  brick_destroy: { freq: 659, duration: 0.15, type: 'sawtooth' },
  life_lost: { freq: 220, duration: 0.3, type: 'triangle' },
  level_complete: { freq: 880, duration: 0.4, type: 'sine' },
  game_over: { freq: 165, duration: 0.5, type: 'triangle' }
};

export function init() {
  const savedMute = localStorage.getItem('arkanoid_muted');
  if (savedMute !== null) {
    muted = savedMute === 'true';
  }
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

export function play(soundName) {
  if (muted || !audioContext || !soundConfigs[soundName]) return;
  
  const config = soundConfigs[soundName];
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = config.type;
    oscillator.frequency.value = config.freq;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration);
  } catch (e) {
    console.warn(`Could not play sound ${soundName}:`, e);
  }
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem('arkanoid_muted', muted.toString());
  return muted;
}

export function isMuted() {
  return muted;
}

export function setVolume(soundName, volume) {
}
