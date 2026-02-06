# Brick Smash

Ein klassisches Breakout-Spiel, implementiert mit JavaScript und three.js.

## Features

- 3 spielbare Level mit steigender Schwierigkeit
- Verschiedene Brick-Typen (normal, strong, steel)
- Paddle-Steuerung mit Maus, Keyboard oder Touch
- Sticky-Ball-Mechanik beim Start
- Fixed-Step Game Loop für stabile Physik
- Responsive Design mit Letterboxing

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Das Spiel läuft dann auf `http://localhost:5173`

## Build

```bash
npm run build
```

Die statischen Dateien werden in `dist/` erstellt.

## Steuerung

### Desktop
- **Maus**: Paddle folgt der Maus-X-Position (mit Smoothing)
- **Pfeiltasten** oder **A/D**: Paddle bewegen
- **Space**: Ball starten (Launch)
- **P** oder **ESC**: Pause

### Mobile
- **Touch/Drag**: Paddle folgt dem Finger
- **Tap**: Ball starten

## Spielregeln

- **Ziel**: Zerstöre alle Bricks, ohne den Ball zu verlieren
- **Leben**: 3 Leben beim Start
- **Punkte**:
  - Normal Brick (hp=1): 50 Punkte
  - Strong Brick (hp=2): 100 Punkte (50 pro Hit)
  - Steel Brick: Unzerstörbar, 0 Punkte
  - Level-Bonus: +1000 pro verbleibendem Leben

## Level

### Level 1: Einführung
- 6 Reihen normale Bricks
- Ball-Speed: 320 px/s
- Keine Hindernisse

### Level 2: Struktur & Hindernisse
- Mix aus normal und strong Bricks
- Steel-Säule in der Mitte
- Ball-Speed: 380 px/s

### Level 3: Kanäle & Tempo
- Kanal-Design mit Steel-Wänden
- Höhere Geschwindigkeit
- Ball-Speed: 440 px/s

## Technologie-Stack

- **JavaScript (ES Modules)**
- **three.js** für Rendering (OrthographicCamera)
- **Vite** für Dev-Server und Build
- **Reines JavaScript** - kein TypeScript, kein Backend

## Projektstruktur

```
/src
  /engine       - Game Loop, Time Management
  /render       - three.js Rendering, Scene, Entities
  /game         - Game State, Levels, Collision, Rules
  /input        - Input Handling (Maus, Keyboard, Touch)
  /ui           - HUD, Menüs
  main.js       - Main Entry Point
  style.css     - Styling
```

## Lizenz

MIT
