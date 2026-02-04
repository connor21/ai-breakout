let camera = null;
let shakeIntensity = 0;
let shakeDuration = 0;
let originalX = 0;
let originalY = 0;

export function init(cameraObj) {
  camera = cameraObj;
  originalX = camera.position.x;
  originalY = camera.position.y;
}

export function screenShake(intensity = 10, duration = 0.2) {
  shakeIntensity = intensity;
  shakeDuration = duration;
}

export function update(dt) {
  if (shakeDuration > 0) {
    shakeDuration -= dt;
    
    const offsetX = (Math.random() - 0.5) * shakeIntensity;
    const offsetY = (Math.random() - 0.5) * shakeIntensity;
    
    camera.position.x = originalX + offsetX;
    camera.position.y = originalY + offsetY;
    
    if (shakeDuration <= 0) {
      camera.position.x = originalX;
      camera.position.y = originalY;
      shakeIntensity = 0;
    }
  }
}

export function reset() {
  if (camera) {
    camera.position.x = originalX;
    camera.position.y = originalY;
  }
  shakeIntensity = 0;
  shakeDuration = 0;
}
