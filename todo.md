# Arkanoid - Implementierungs-TODO

Basierend auf der finalisierten Spezifikation (`specification.md`)

**Status:** Phase 3 Polish ✅ VOLLSTÄNDIG ABGESCHLOSSEN  
**Letztes Update:** 4. Februar 2026, 13:45 Uhr  
**Git:** Initialisiert, Initial Commit erstellt  
**Dev-Server:** Läuft auf http://localhost:5173

---

## Phase 1: MVP - Grundlegendes Gameplay ✅ ABGESCHLOSSEN

### 1.1 Projekt-Setup ✅

- [x] Vite-Projekt initialisieren
  - [x] `npm create vite@latest . -- --template vanilla`
  - [x] `package.json` anpassen (Name, Version)
- [x] three.js installieren
  - [x] `npm install three`
- [x] Projektstruktur erstellen
  ```
  /src
    /engine
    /render
    /game
    /input
    /audio
    /ui
    /assets
      /sounds
    main.js
  /public
  index.html
  ```
- [x] `.gitignore` erstellen (node_modules, dist)
- [x] `README.md` mit Setup-Anleitung
- [x] Git initialisiert und Initial Commit erstellt

### 1.2 Engine & Loop ✅

- [x] **`engine/time.js`**
  - [x] Delta-Time Berechnung
  - [x] Clamping (max 33ms)
  - [x] Export: `getDelta()`, `clampDelta(dt)`

- [x] **`engine/loop.js`**
  - [x] requestAnimationFrame Loop
  - [x] Fixed-Step Integration (accumulator pattern)
  - [x] Callbacks: `onUpdate(dt)`, `onRender()`
  - [x] Start/Stop Funktionen

### 1.3 Rendering (three.js) ✅

- [x] **`render/renderer.js`**
  - [x] WebGLRenderer initialisieren
  - [x] Canvas-Größe setzen (800x600 Weltkoordinaten)
  - [x] Resize-Handler mit Aspect-Ratio-Erhaltung
  - [x] Letterboxing bei abweichenden Seitenverhältnissen
  - [x] Export: `init()`, `resize()`, `getRenderer()`

- [x] **`render/scene.js`**
  - [x] Scene erstellen
  - [x] OrthographicCamera (left: 0, right: 800, top: 600, bottom: 0)
  - [x] Minimales Licht (AmbientLight)
  - [x] Export: `getScene()`, `getCamera()`

- [x] **`render/entitiesView.js`**
  - [x] Mesh-Factory für Paddle (BoxGeometry + MeshBasicMaterial)
  - [x] Mesh-Factory für Ball (CircleGeometry oder Sprite)
  - [x] Mesh-Factory für Bricks (BoxGeometry, Farbe nach Typ/HP)
  - [x] `sync(state)`: Update Mesh-Positionen aus GameState
  - [x] `createPaddle()`, `createBall()`, `createBrick(brick)`
  - [x] `updatePositions(entities)`
  - [x] `removeBrick()` für zerstörte Bricks

### 1.4 Game State & Entities ✅

- [x] **`game/state.js`**
  - [ ] GameState-Objekt:
    ```js
    {
      phase: 'BOOT' | 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_COMPLETE' | 'GAME_OVER',
      score: 0,
      lives: 3,
      level: 1,
      paddle: { x, y, width, height, speed },
      ball: { x, y, radius, vx, vy, speed, stuck: true },
      bricks: [],
      input: { pointerX, keys: {} }
    }
    ```
  - [x] `initState()`: Initialer State
  - [x] `resetLevel(state, levelNum)`: Level-Reset
  - [x] `resetBall(state)`: Ball auf Paddle setzen (stuck=true)

- [x] **`game/levels.js`**
  - [x] Level-Definitionen (1-3) als Arrays
  - [x] Level 1: 6 Reihen × 10 Spalten, nur `normal` (hp=1)
  - [x] Level 2: Mix `normal` + `strong` (hp=2) + `steel` Säule
  - [x] Level 3: Kanal-Design mit `steel` Wänden
  - [x] `getLevel(num)`: Gibt Brick-Array zurück
  - [x] Brick-Objekt: `{ id, x, y, width, height, hp, type, scoreValue }`

### 1.5 Kollisionen ✅

- [x] **`game/collision.js`**
  - [x] `circleVsAABB(ball, rect)`: Kollisionserkennung
  - [x] `reflectBall(ball, normal)`: Geschwindigkeit invertieren
  - [x] `checkWallCollisions(ball, worldBounds)`: Wände (links, rechts, oben)
  - [x] `checkPaddleCollision(ball, paddle)`:
    - [x] Kollisionserkennung
    - [x] Winkelberechnung basierend auf Treffpunkt
    - [x] `t = (ball.x - paddle.x) / (paddle.width/2)` in [-1..1]
    - [x] `vx = t * maxX`, `vy = sqrt(speed^2 - vx^2)`
  - [x] `checkBrickCollisions(ball, bricks)`:
    - [x] Kollision mit jedem Brick
    - [x] HP reduzieren
    - [x] Brick entfernen bei hp=0
    - [x] Score erhöhen
    - [x] Return: `{ hit: bool, brick, scoreGained }`

### 1.6 Game Rules & Logic ✅

- [x] **`game/rules.js`**
  - [x] `updateScore(state, points)`: Score erhöhen
  - [x] `loseLife(state)`: Leben -1, Ball/Paddle reset
  - [x] `checkLevelComplete(state)`: Alle zerstörbaren Bricks weg?
  - [x] `levelComplete(state)`: Bonus berechnen (+1000 pro Leben), nächstes Level
  - [x] `checkGameOver(state)`: Leben == 0?
  - [x] `gameOver(state)`: Phase auf GAME_OVER setzen

### 1.7 Game Update Loop ✅

- [x] **`game/update.js`**
  - [x] `update(state, dt)`:
    - [x] Paddle bewegen (Input → Position mit Clamp)
    - [x] Paddle Smoothing (Lerp 0.15)
    - [x] Ball-Launch-Check (Space/Tap + stuck=true → stuck=false, vy=speed)
    - [x] Ball bewegen (wenn !stuck)
    - [x] Kollisionen:
      - [x] Wände
      - [x] Paddle
      - [x] Bricks (mit Mesh-Removal)
    - [x] Ball unter Boden? → `loseLife()`
    - [x] Level complete? → `levelComplete()`
    - [x] Game Over? → `gameOver()`

### 1.8 Input ✅

- [x] **`input/input.js`**
  - [x] Pointer-Events (mousemove, touchmove)
    - [x] Normalisierung auf Weltkoordinaten (0-800)
  - [x] Keyboard-Events (keydown, keyup)
    - [x] Left/Right, A/D, Space, P, Esc, R
    - [x] Pointer/Keyboard Priorität korrekt implementiert
  - [x] `getState()`: Return `{ pointerX, keys: {} }`
  - [x] `init()`: Event-Listener registrieren

### 1.9 UI (DOM Overlay) ✅

- [x] **`ui/hud.js`**
  - [x] HTML-Elemente für Score, Lives, Level
  - [x] `update(state)`: DOM aktualisieren

- [x] **`ui/menus.js`**
  - [x] Start-Menü (MENU phase)
    - [x] "Start Game" Button
  - [x] Pause-Menü (PAUSED phase)
    - [x] "Resume", "Restart", "Main Menu"
  - [x] Level-Complete-Overlay (LEVEL_COMPLETE phase)
    - [x] Score-Anzeige, "Next Level" Button
  - [x] Game-Over-Menü (GAME_OVER phase)
    - [x] Final Score, "Restart", "Main Menu"
    - [x] Event-Listener Fix (nur bei Phase-Wechsel)
  - [x] `show(menuType)`, `hide()`

- [x] **CSS für Overlays**
  - [x] Zentrierte Menüs
  - [x] Semi-transparenter Hintergrund
  - [x] Responsive Buttons
  - [x] Modernes Cyan-Theme

### 1.10 Main Integration ✅

- [x] **`main.js`**
  - [x] Import aller Module
  - [x] `init()`:
    - [x] Renderer initialisieren
    - [x] Scene/Camera erstellen
    - [x] Input initialisieren
    - [x] State initialisieren
    - [x] Entities-View erstellen
    - [x] UI initialisieren
  - [x] Game-Loop starten:
    - [x] `loop.start(onUpdate, onRender)`
    - [x] `onUpdate(dt)`: `game.update(state, dt)`
    - [x] `onRender()`: `view.sync(state)`, `renderer.render(scene, camera)`, `ui.update(state)`
  - [x] Phase-Transitions:
    - [x] BOOT → MENU
    - [x] MENU → PLAYING (Start Button)
    - [x] PLAYING ↔ PAUSED (P/Esc)
    - [x] LEVEL_COMPLETE → PLAYING (Next Level)
    - [x] GAME_OVER → MENU (Restart)
  - [x] Phase-Tracking Fix (previousPhase für Menu-Rendering)

### 1.11 Testing & Debugging ✅

- [x] Paddle-Steuerung testen (Maus + Keyboard) - Funktioniert
- [x] Ball-Launch testen (Space) - Funktioniert
- [x] Kollisionen testen:
  - [x] Ball vs Wände - Funktioniert
  - [x] Ball vs Paddle (Winkel korrekt?) - Funktioniert
  - [x] Ball vs Bricks (HP, Entfernung, Score) - Funktioniert, Meshes werden entfernt
- [x] Leben-System testen (Ball unter Boden) - Funktioniert
- [x] Level-Übergänge testen (1→2→3) - Funktioniert
- [x] Game-Over testen (3 Leben verloren) - Funktioniert, Buttons arbeiten korrekt
- [x] Pause-Menü testen - Funktioniert
- [x] Edge-Cases:
  - [x] Ball steckt nicht in Bricks/Wänden fest - OK
  - [x] Paddle bleibt im Spielfeld (Clamp) - OK
  - [x] Koordinatensystem korrigiert (Bricks oben, Paddle unten)

---

## Phase 2: Stabilisierung ✅ ABGESCHLOSSEN

### 2.1 Kollisions-Verbesserungen ✅

- [x] Edge-Cases beheben (Ball-Ecken vs Brick-Ecken)
- [x] Continuous Collision Detection (optional, bei hohen Geschwindigkeiten)
- [x] Brick-Kollision: Normale korrekt berechnen (X vs Y Penetration)

### 2.2 Resize & Scaling ✅

- [x] Resize-Handler testen auf verschiedenen Bildschirmgrößen
- [x] Mobile-Optimierung (min 400x300)
- [x] Touch-Input verfeinern (Drag-Smoothing)

### 2.3 Audio-System ✅

- [x] **`audio/audio.js`**
  - [x] Web Audio API implementiert (Synthesizer-Sounds statt MP3)
    - [x] `paddle_hit` (440Hz Sine)
    - [x] `brick_hit` (523Hz Square)
    - [x] `wall_hit` (330Hz Sine)
    - [x] `brick_destroy` (659Hz Sawtooth)
    - [x] `life_lost` (220Hz Triangle)
    - [x] `level_complete` (880Hz Sine)
    - [x] `game_over` (165Hz Triangle)
  - [x] `play(soundName)`: Sound abspielen
  - [x] `toggleMute()`: Mute on/off
  - [x] localStorage: Mute-State speichern

- [x] Sound-Effekte in Game-Loop integriert:
  - [x] Paddle-Kollision → `paddle_hit`
  - [x] Brick-Kollision → `brick_hit`
  - [x] Wand-Kollision → `wall_hit`
  - [x] Brick zerstört → `brick_destroy`
  - [x] Leben verloren → `life_lost`
  - [x] Level Complete → `level_complete`
  - [x] Game Over → `game_over`
  - [x] Mute-Button im HUD (🔊/🔇)

### 2.4 Persistenz (localStorage) ✅

- [x] Highscore speichern/laden
- [x] Highscore-Anzeige im Hauptmenü
- [x] "NEW HIGHSCORE" Anzeige bei Game Over
- [x] Sound-Einstellung speichern (via audio.js)
- [x] `persistence.js` Modul erstellt

---

## Phase 3: Polish (Post-MVP) ✅ ABGESCHLOSSEN

### 3.1 Visuelle Effekte ✅

- [x] **`render/fx.js`**
  - [x] Ball-Trail (Particle-System mit Fade-out)
  - [x] Brick-Destroy-Animation (8 Partikel pro Brick)
  - [x] Paddle-Hit-Feedback (Flash-Effekt)
  - [x] Ball-Glow-Effekt (1.5x Radius, 30% Opacity)

### 3.2 Powerups (Erweiterung) ✅

- [x] **`game/powerups.js`**
  - [x] PowerUp-Entity: `{ id, x, y, vx, vy, kind, activeDuration }`
  - [x] Drop-Logik (5%, 10%, 15% je Level)
  - [x] Typen:
    - [x] `wider_paddle`: Paddle-Breite +50% (10s Dauer)
    - [x] `slow_ball`: Ball-Speed -30% (10s Dauer)
    - [x] `multiball`: 2 zusätzliche Bälle spawnen
  - [x] Pickup-Kollision (Paddle vs PowerUp)
  - [x] Timer-System (10s Powerup-Dauer)
  - [x] Visual: PowerUp-Meshes mit Farb-Coding
  - [x] Extra-Ball-System mit eigenem Rendering

### 3.3 Erweiterte Visuals ✅

- [x] Ball Glow-Effekt (Cyan, 30% Opacity)
- [x] Paddle-Größen-Animation (bei Powerup)
- [x] Partikel-Farben nach Brick-Typ

### 3.4 Juice & Feedback ✅

- [x] **`render/cameraEffects.js`**
  - [x] Screen-Shake bei Brick-Destroy (5px, 0.1s)
  - [x] Intensiver Shake bei Level-Complete (15px, 0.3s)
- [x] **`game/combo.js`**
  - [x] Combo-System (2s Timeout)
  - [x] Bonus-Punkte: (Combo-1) × 50
  - [x] Combo-Display im HUD (pulsierend)
  - [x] Combo-Reset bei Leben verloren

---

## Akzeptanzkriterien (MVP)

- [ ] Läuft lokal via `npm run dev`
- [ ] Build funktioniert: `npm run build` → `dist/`
- [ ] Level 1–3 vollständig spielbar
- [ ] Steuerung (Maus/Keyboard/Touch) funktioniert einwandfrei
- [ ] Kollisionen zuverlässig (kein Steckenbleiben)
- [ ] HUD zeigt Score/Lives/Level korrekt an
- [ ] Menüs (Start/Pause/GameOver) funktionieren
- [ ] Keine Konsolen-Fehler
- [ ] Performance: 60 FPS auf modernen Browsern

---

## Deployment (Optional)

- [ ] Statische Dateien auf Netlify/Vercel/GitHub Pages deployen
- [ ] Domain konfigurieren (optional)
- [ ] README mit Live-Demo-Link aktualisieren

---

## Notizen

- **Keine Backend-Abhängigkeiten**: Alles client-side
- **Powerups erst nach MVP**: Drop-System vorbereitet (5%/10%/15%), aber keine Logik
- **Fixed-Step im MVP**: Für stabile Physik
- **Paddle-Smoothing aktiv**: Lerp-Faktor 0.15
- **Audio optional in Phase 2**: Kann auch später hinzugefügt werden
