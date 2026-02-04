# Arkanoid - Implementierungs-TODO

Basierend auf der finalisierten Spezifikation (`specification.md`)

---

## Phase 1: MVP - Grundlegendes Gameplay

### 1.1 Projekt-Setup

- [ ] Vite-Projekt initialisieren
  - [ ] `npm create vite@latest . -- --template vanilla`
  - [ ] `package.json` anpassen (Name, Version)
- [ ] three.js installieren
  - [ ] `npm install three`
- [ ] Projektstruktur erstellen
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
- [ ] `.gitignore` erstellen (node_modules, dist)
- [ ] `README.md` mit Setup-Anleitung

### 1.2 Engine & Loop

- [ ] **`engine/time.js`**
  - [ ] Delta-Time Berechnung
  - [ ] Clamping (max 33ms)
  - [ ] Export: `getDelta()`, `clampDelta(dt)`

- [ ] **`engine/loop.js`**
  - [ ] requestAnimationFrame Loop
  - [ ] Fixed-Step Integration (accumulator pattern)
  - [ ] Callbacks: `onUpdate(dt)`, `onRender()`
  - [ ] Start/Stop Funktionen

### 1.3 Rendering (three.js)

- [ ] **`render/renderer.js`**
  - [ ] WebGLRenderer initialisieren
  - [ ] Canvas-Größe setzen (800x600 Weltkoordinaten)
  - [ ] Resize-Handler mit Aspect-Ratio-Erhaltung
  - [ ] Letterboxing bei abweichenden Seitenverhältnissen
  - [ ] Export: `init()`, `resize()`, `getRenderer()`

- [ ] **`render/scene.js`**
  - [ ] Scene erstellen
  - [ ] OrthographicCamera (left: 0, right: 800, top: 600, bottom: 0)
  - [ ] Minimales Licht (AmbientLight)
  - [ ] Export: `getScene()`, `getCamera()`

- [ ] **`render/entitiesView.js`**
  - [ ] Mesh-Factory für Paddle (BoxGeometry + MeshBasicMaterial)
  - [ ] Mesh-Factory für Ball (CircleGeometry oder Sprite)
  - [ ] Mesh-Factory für Bricks (BoxGeometry, Farbe nach Typ/HP)
  - [ ] `sync(state)`: Update Mesh-Positionen aus GameState
  - [ ] `createPaddle()`, `createBall()`, `createBrick(brick)`
  - [ ] `updatePositions(entities)`

### 1.4 Game State & Entities

- [ ] **`game/state.js`**
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
  - [ ] `initState()`: Initialer State
  - [ ] `resetLevel(state, levelNum)`: Level-Reset
  - [ ] `resetBall(state)`: Ball auf Paddle setzen (stuck=true)

- [ ] **`game/levels.js`**
  - [ ] Level-Definitionen (1-3) als Arrays
  - [ ] Level 1: 6 Reihen × 10 Spalten, nur `normal` (hp=1)
  - [ ] Level 2: Mix `normal` + `strong` (hp=2) + `steel` Säule
  - [ ] Level 3: Kanal-Design mit `steel` Wänden
  - [ ] `getLevel(num)`: Gibt Brick-Array zurück
  - [ ] Brick-Objekt: `{ id, x, y, width, height, hp, type, scoreValue }`

### 1.5 Kollisionen

- [ ] **`game/collision.js`**
  - [ ] `circleVsAABB(ball, rect)`: Kollisionserkennung
  - [ ] `reflectBall(ball, normal)`: Geschwindigkeit invertieren
  - [ ] `checkWallCollisions(ball, worldBounds)`: Wände (links, rechts, oben)
  - [ ] `checkPaddleCollision(ball, paddle)`:
    - [ ] Kollisionserkennung
    - [ ] Winkelberechnung basierend auf Treffpunkt
    - [ ] `t = (ball.x - paddle.x) / (paddle.width/2)` in [-1..1]
    - [ ] `vx = t * maxX`, `vy = sqrt(speed^2 - vx^2)`
  - [ ] `checkBrickCollisions(ball, bricks)`:
    - [ ] Kollision mit jedem Brick
    - [ ] HP reduzieren
    - [ ] Brick entfernen bei hp=0
    - [ ] Score erhöhen
    - [ ] Return: `{ hit: bool, brick, scoreGained }`

### 1.6 Game Rules & Logic

- [ ] **`game/rules.js`**
  - [ ] `updateScore(state, points)`: Score erhöhen
  - [ ] `loseLife(state)`: Leben -1, Ball/Paddle reset
  - [ ] `checkLevelComplete(state)`: Alle zerstörbaren Bricks weg?
  - [ ] `levelComplete(state)`: Bonus berechnen (+1000 pro Leben), nächstes Level
  - [ ] `checkGameOver(state)`: Leben == 0?
  - [ ] `gameOver(state)`: Phase auf GAME_OVER setzen

### 1.7 Game Update Loop

- [ ] **`game/update.js`** (oder in `state.js`)
  - [ ] `update(state, dt)`:
    - [ ] Paddle bewegen (Input → Position mit Clamp)
    - [ ] Paddle Smoothing (Lerp 0.15)
    - [ ] Ball-Launch-Check (Space/Tap + stuck=true → stuck=false, vy=speed)
    - [ ] Ball bewegen (wenn !stuck)
    - [ ] Kollisionen:
      - [ ] Wände
      - [ ] Paddle
      - [ ] Bricks
    - [ ] Ball unter Boden? → `loseLife()`
    - [ ] Level complete? → `levelComplete()`
    - [ ] Game Over? → `gameOver()`

### 1.8 Input

- [ ] **`input/input.js`**
  - [ ] Pointer-Events (mousemove, touchmove)
    - [ ] Normalisierung auf Weltkoordinaten (0-800)
  - [ ] Keyboard-Events (keydown, keyup)
    - [ ] Left/Right, A/D, Space, P, Esc, R
  - [ ] `getState()`: Return `{ pointerX, keys: {} }`
  - [ ] `init()`: Event-Listener registrieren

### 1.9 UI (DOM Overlay)

- [ ] **`ui/hud.js`**
  - [ ] HTML-Elemente für Score, Lives, Level
  - [ ] `update(state)`: DOM aktualisieren

- [ ] **`ui/menus.js`**
  - [ ] Start-Menü (MENU phase)
    - [ ] "Start Game" Button
  - [ ] Pause-Menü (PAUSED phase)
    - [ ] "Resume", "Restart", "Main Menu"
  - [ ] Level-Complete-Overlay (LEVEL_COMPLETE phase)
    - [ ] Score-Anzeige, "Next Level" Button
  - [ ] Game-Over-Menü (GAME_OVER phase)
    - [ ] Final Score, "Restart", "Main Menu"
  - [ ] `show(menuType)`, `hide()`

- [ ] **CSS für Overlays**
  - [ ] Zentrierte Menüs
  - [ ] Semi-transparenter Hintergrund
  - [ ] Responsive Buttons

### 1.10 Main Integration

- [ ] **`main.js`**
  - [ ] Import aller Module
  - [ ] `init()`:
    - [ ] Renderer initialisieren
    - [ ] Scene/Camera erstellen
    - [ ] Input initialisieren
    - [ ] State initialisieren
    - [ ] Entities-View erstellen
    - [ ] UI initialisieren
  - [ ] Game-Loop starten:
    - [ ] `loop.start(onUpdate, onRender)`
    - [ ] `onUpdate(dt)`: `game.update(state, dt)`
    - [ ] `onRender()`: `view.sync(state)`, `renderer.render(scene, camera)`, `ui.update(state)`
  - [ ] Phase-Transitions:
    - [ ] BOOT → MENU
    - [ ] MENU → PLAYING (Start Button)
    - [ ] PLAYING ↔ PAUSED (P/Esc)
    - [ ] LEVEL_COMPLETE → PLAYING (Next Level)
    - [ ] GAME_OVER → MENU (Restart)

### 1.11 Testing & Debugging

- [ ] Paddle-Steuerung testen (Maus + Keyboard)
- [ ] Ball-Launch testen (Space)
- [ ] Kollisionen testen:
  - [ ] Ball vs Wände
  - [ ] Ball vs Paddle (Winkel korrekt?)
  - [ ] Ball vs Bricks (HP, Entfernung, Score)
- [ ] Leben-System testen (Ball unter Boden)
- [ ] Level-Übergänge testen (1→2→3)
- [ ] Game-Over testen (3 Leben verloren)
- [ ] Pause-Menü testen
- [ ] Edge-Cases:
  - [ ] Ball steckt nicht in Bricks/Wänden fest
  - [ ] Paddle bleibt im Spielfeld (Clamp)
  - [ ] Mehrfach-Kollisionen pro Frame

---

## Phase 2: Stabilisierung

### 2.1 Kollisions-Verbesserungen

- [ ] Edge-Cases beheben (Ball-Ecken vs Brick-Ecken)
- [ ] Continuous Collision Detection (optional, bei hohen Geschwindigkeiten)
- [ ] Brick-Kollision: Normale korrekt berechnen (X vs Y Penetration)

### 2.2 Resize & Scaling

- [ ] Resize-Handler testen auf verschiedenen Bildschirmgrößen
- [ ] Mobile-Optimierung (min 400x300)
- [ ] Touch-Input verfeinern (Drag-Smoothing)

### 2.3 Audio-System

- [ ] **`audio/audio.js`**
  - [ ] Preload Sound-Dateien:
    - [ ] `paddle_hit.mp3`
    - [ ] `brick_hit.mp3`
    - [ ] `wall_hit.mp3`
    - [ ] `brick_destroy.mp3`
    - [ ] `life_lost.mp3`
    - [ ] `level_complete.mp3`
    - [ ] `game_over.mp3`
  - [ ] `play(soundName)`: Sound abspielen
  - [ ] `toggleMute()`: Mute on/off
  - [ ] localStorage: Mute-State speichern

- [ ] Sound-Effekte in Game-Loop integrieren:
  - [ ] Paddle-Kollision → `paddle_hit`
  - [ ] Brick-Kollision → `brick_hit`
  - [ ] Wand-Kollision → `wall_hit`
  - [ ] Brick zerstört → `brick_destroy`
  - [ ] Leben verloren → `life_lost`
  - [ ] Level Complete → `level_complete`
  - [ ] Game Over → `game_over`

### 2.4 Persistenz (localStorage)

- [ ] Highscore speichern/laden
- [ ] Letztes Level speichern (optional)
- [ ] Sound-Einstellung speichern

---

## Phase 3: Polish (Post-MVP)

### 3.1 Visuelle Effekte

- [ ] **`render/fx.js`**
  - [ ] Ball-Trail (Particle-System oder Line)
  - [ ] Brick-Destroy-Animation (Partikel)
  - [ ] Paddle-Hit-Feedback (Flash)
  - [ ] Optional: Bloom Post-Processing

### 3.2 Powerups (Erweiterung)

- [ ] **`game/powerups.js`**
  - [ ] PowerUp-Entity: `{ x, y, vx, vy, kind, activeDuration }`
  - [ ] Drop-Logik (5%, 10%, 15% je Level)
  - [ ] Typen:
    - [ ] `wider_paddle`: Paddle-Breite +50%
    - [ ] `slow_ball`: Ball-Speed -30%
    - [ ] `multiball`: 2 zusätzliche Bälle spawnen
  - [ ] Pickup-Kollision (Paddle vs PowerUp)
  - [ ] Timer-System (Powerup-Dauer)
  - [ ] Visual: PowerUp-Meshes in `entitiesView.js`

### 3.3 Erweiterte Visuals

- [ ] Shader für Ball (Glow-Effekt)
- [ ] Animierte Brick-Farben (Pulse bei low HP)
- [ ] Background-Gradient oder Parallax

### 3.4 Juice & Feedback

- [ ] Screen-Shake bei Brick-Destroy
- [ ] Slow-Motion bei letztem Brick
- [ ] Combo-System (schnelle Treffer → Bonus-Punkte)

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
