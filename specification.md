## Spezifikation: Arkanoid-ähnliches Browser-Spiel (Standalone, 2D mit three.js, reines JavaScript)

### Ziele

* Standalone im Browser, **ohne Backend**
* **Reines JavaScript**, keine TypeScript-Pflicht
* 2D-Gameplay mit **three.js** (Orthographic Camera)
* Klare, KI-freundliche Modul-Struktur: Simulation getrennt von Rendering

---

## 1) Technologie-Stack

### Laufzeit / Rendering

* **JavaScript (ES Modules)**
* **three.js** (WebGLRenderer)
* **OrthographicCamera** (2D-Ansicht)
* **requestAnimationFrame** Game-Loop

#### Resize-Strategie

* Spielfeld-Weltkoordinaten: fest `800x600`
* Canvas skaliert proportional (maintain aspect ratio)
* Letterboxing bei abweichenden Seitenverhältnissen
* Mindestgröße: 400x300 (für Mobile)

### Tooling (minimal, empfohlen)

* **Vite** (Dev-Server + Build)

  * Alternative: Direktes Einbinden von three.js per CDN (für „single folder“), aber Vite vereinfacht Module/Assets.

### Audio

* Minimal: HTMLAudio (`<audio>`) + Preload
* Optional: Web Audio API (für bessere Latenz / Mixing)

#### Sound-Effekte (MVP)

* `paddle_hit.mp3`: Ball trifft Paddle
* `brick_hit.mp3`: Ball trifft Brick
* `wall_hit.mp3`: Ball trifft Wand
* `brick_destroy.mp3`: Brick zerstört
* `life_lost.mp3`: Leben verloren
* `level_complete.mp3`: Level abgeschlossen
* `game_over.mp3`: Game Over

### Persistenz

* **localStorage**: Highscore, letzte Level-Freischaltung, Sound an/aus

### UI

* **DOM Overlay** (HTML/CSS) über dem Canvas:

  * Score, Lives, Level, Pause-Menü, Start/Game-Over
  * Rendering der Spielwelt bleibt im three.js Canvas

---

## 2) Architektur

### Grundprinzip

Trennung in:

* **Simulation (Game State)**: Positionen, Kollisionslogik, Regeln
* **Rendering (View)**: three.js Meshes, Material, Kamera
* **Input**: Pointer/Keyboard → Aktionen
* **Assets**: Sounds, Texturen (optional), Konfiguration

### Modulübersicht (Dateien)

* `main.js`: Bootstrapping, init, Startscreen, Loop
* `engine/`

  * `loop.js`: rAF Loop, Delta-Time mit Fixed-Step
  * `time.js`: Delta, Clamping (max 33ms für Stabilität)
* `render/`

  * `renderer.js`: WebGLRenderer, resize handling
  * `scene.js`: Scene + OrthographicCamera + Licht (minimal)
  * `entitiesView.js`: erstellt/updated Meshes für Paddle/Ball/Bricks/Powerups
  * `fx.js` (optional): Trails/Particles/Bloom (später)
* `game/`

  * `state.js`: zentraler GameState (score, lives, level, entities)
  * `rules.js`: Punkte, Leben, Level-Completion, Spawn-Regeln
  * `collision.js`: Circle-vs-AABB, reflektieren, Brick-Hits
  * `levels.js`: Level-Definitionen (1–3)
* `input/`

  * `input.js`: Pointer/Keyboard, Normalisierung auf Weltkoordinaten
* `audio/`

  * `audio.js`: sfx play, mute toggle
* `ui/`

  * `hud.js`: Score/Lives/Level update
  * `menus.js`: Start/Pause/GameOver overlays

### Datenmodell (Simulation)

**Weltkoordinaten**: z.B. Breite `W = 800`, Höhe `H = 600`.
Kamera: Orthographic, so dass Welt 1:1 auf Screen skaliert.

**Entities**

* `Paddle`

  * `x, y, width, height, speed`
* `Ball`

  * `x, y, radius, vx, vy, speed`
* `Brick`

  * `id, x, y, width, height, hp, type, scoreValue`

### Update-Flow pro Frame

1. `input.update()`
2. `game.update(dt)`

   * paddle bewegen (mit Clamp)
   * ball bewegen
   * collisions:

     * Ball ↔ Wände
     * Ball ↔ Paddle (Winkel abhängig vom Treffpunkt)
     * Ball ↔ Bricks (hp--, remove bei 0, score++)
   * lose condition: Ball unter Boden → life--
   * win condition: keine Bricks → next level
3. `view.sync(state)` (Mesh Positionen)
4. `renderer.render(scene, camera)`
5. `ui.render(state)`

### Kollisionen (MVP)

* Ball (Circle) vs Brick/Paddle (AABB)
* Vereinfachung:

  * Berechne nächsten Ball-Position-Vektor
  * Finde *Penetration* bzw. Kollisionsnormalen (X oder Y) und invertiere `vx` oder `vy`
* Paddle-Reflexion:

  * Trefferpunkt `t = (ball.x - paddle.x) / (paddle.width/2)` in [-1..1]
  * setze `vx = t * maxX`, `vy = -sqrt(speed^2 - vx^2)` (nach oben)

### Zustandsmaschine

* `BOOT` → `MENU` → `PLAYING` ↔ `PAUSED` → `LEVEL_COMPLETE` → `PLAYING` → `GAME_OVER`

### Ball-Launch-Mechanik

* Ball startet je Leben „am Paddle klebend":
  * Position: mittig auf Paddle (`ball.x = paddle.x`, `ball.y = paddle.y + paddle.height/2 + ball.radius`)
  * Ball folgt Paddle-X-Bewegung während geklebt
  * Launch via `Space` oder Tap → Ball erhält initiale Geschwindigkeit (`vx = 0`, `vy = ballSpeed`)
  * Kein Timeout: Spieler kann beliebig lange warten

---

## 3) Spielbeschreibung

### Kern-Gameplay

Arkanoid/Breakout: Paddle unten, Ball prallt, Bricks oben. Ziel: alle Bricks zerstören, ohne den Ball zu verlieren.

### Regeln

* Start: 3 Leben
* Punkte:

  * `normal` brick (hp=1): 50 Punkte
  * `strong` brick (hp=2): 100 Punkte (50 Punkte pro Hit)
  * `steel` brick: 0 Punkte (unzerstörbar)
  * Bonus bei Levelabschluss: +1000 pro verbleibendem Leben
* Ballverlust:

  * Ball unter Boden → Leben -1
  * Wenn Leben > 0: Reset Ball/Paddle Position
* Levelabschluss:

  * Wenn alle zerstörbaren Bricks weg: nächstes Level
* Game Over:

  * Leben == 0

### Visuelle Anforderungen (MVP)

* Klare, flache 2D-Optik über three.js:

  * Paddle: Rechteck
  * Ball: Kreis (Plane + Shader/Texture) oder einfache Circle-Approximation per Sprite
  * Bricks: farbige Rechtecke, hp sichtbar über Farbe

---

## 4) Steuerung

### Desktop

* **Mausbewegung**: Paddle folgt Maus-X mit Smoothing (Lerp-Faktor: 0.15)
* **Keyboard**:

  * `Left/Right` oder `A/D`: Paddle bewegen
  * `Space`: Ball starten (Launch) / im Menü Start
  * `P` oder `Esc`: Pause togglen
  * `R`: Level neu starten (nur Pause/GameOver)

### Mobile

* **Touch / Drag**: Paddle folgt Finger-X
* Tap-Button im Overlay:

  * Start/Launch, Pause

### Input-Priorität

* Wenn Pointer aktiv: Pointer steuert Paddle
* Sonst Keyboard

---

## 5) Level 1–3

### Gemeinsame Parameter (für alle Level)

* Spielfeld: `800x600`
* Brick-Grid: z.B. 10 Spalten × 6 Reihen
* Brick-Größe: `70x25` mit Spacing
* Unzerstörbar: Brick `type="steel"` (hp = ∞)

#### Brick-Typen

* `normal` (hp=1) - Farbe: variiert nach Reihe
* `strong` (hp=2) - Farbe: dunkler/intensiver, wechselt bei hp=1
* `steel` (unzerstörbar) - Farbe: grau/metallic

#### Basisgeschwindigkeit

* Ball-Speed pro Level leicht erhöhen:

  * L1: 320 px/s
  * L2: 380 px/s
  * L3: 440 px/s

---

### Level 1: „Einführung“

**Ziel:** einfache Muster, nur hp=1, wenige Sonderfälle.

* Layout:

  * 6 Reihen `normal` Bricks
  * Farben pro Reihe (rein visuell)
* Keine `steel`, keine `strong`
* Drop-System: 5% Chance (für zukünftige Powerup-Erweiterung)

**Erwartetes Verhalten**

* Spieler lernt Winkel am Paddle, Grundtempo moderat.

---

### Level 2: „Struktur & Hindernisse“

**Ziel:** erste Robustheit durch hp=2 und unzerstörbare Felder.

* Layout:

  * Reihen 1–2: `normal`
  * Reihen 3–4: `strong` (hp=2)
  * In der Mitte (z.B. Spalten 5–6, Reihen 2–5): `steel` als „Säule"
* Keine Powerups

**Erwartetes Verhalten**

* Ball bleibt länger im Brick-Feld, Spieler muss Winkel kontrollieren.
* `steel` erzeugt interessante Abpraller.

---

### Level 3: „Kanäle & Tempo“

**Ziel:** höheres Tempo, gezielte Durchgänge, mehr `steel`.

* Layout:

  * „Kanal“-Design: `steel` bildet Wände links/rechts, in der Mitte ein schmaler Durchgang nach oben
  * Obere Reihen: Mix aus `strong` + `normal`
  * Untere Reihen: mehr `normal`, damit Einstieg nicht blockiert
* Drop-System: 15% Chance (für zukünftige Powerup-Erweiterung)

**Erwartetes Verhalten**

* Spieler versucht, Ball in den Kanal zu „schießen“ für schnelle Brick-Clears.
* Höhere Geschwindigkeit fordert Reaktionszeit.

---

## Implementierungsphasen (KI-freundlich)

1. **MVP**

   * Paddle, Ball, Bricks (hp=1, hp=2, steel), Score, Lives, 3 Level, Menüs (Start/Pause/GameOver)
   * Fixed-step Game Loop (max delta clamping)
   * Paddle Smoothing (Lerp)
   * Ball-Launch-Mechanik (sticky ball)
2. **Stabilisierung**

   * Bessere Kollision (Edge-Cases), Resize/Scaling sauber
   * Audio-System (Sounds für Kollisionen, Leben verloren, Level Complete)
3. **Polish (Post-MVP)**

   * Partikel/Trail-Effekte
   * Powerups (wider paddle, slow ball, multiball)
   * Erweiterte Visuals (Bloom, Shader)

---

## Akzeptanzkriterien (MVP)

* Läuft lokal via `vite dev` und als statischer Build (nur `dist/`)
* Level 1–3 spielbar, Übergänge funktionieren
* Keine Backend-Abhängigkeiten
* Steuerung Maus/Touch + Keyboard funktioniert
* Kollisionen zuverlässig (kein „Ball steckt fest“ in Bricks/Wänden)
* HUD zeigt Score/Lives/Level, Pause-Menü funktioniert

Wenn du möchtest, kann ich daraus direkt eine konkrete Projektstruktur inkl. minimaler `main.js`/`renderer.js`/`collision.js` Skeletons ableiten (ohne Backend, three.js Orthographic).
