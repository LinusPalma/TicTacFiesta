# Silvester Countdown

Eine minimalistische React-Anwendung, die einen visuellen Countdown bis Silvester darstellt. Die Anwendung zeigt drei verschiedene Visualisierungsmodi, abhängig von der verbleibenden Zeit.

## Features

Die Anwendung durchläuft drei verschiedene Anzeigemodi:

1. Countdown-Modus (Standard)
   - Zeigt die verbleibende Zeit im Format HH:MM:SS
   - Klares, minimalistisches Design

2. Finale Countdown-Modus (letzte 10 Sekunden)
   - Große Zahlendarstellung
   - Dramatischer Übergang zur finalen Phase

3. Feuerwerk-Modus (bei 0)
   - Animierte Feuerwerksdarstellung
   - Festliche Visualisierung zum Jahreswechsel

## Technologie-Stack

- React 18+
- TypeScript
- Vite (als Build-Tool)
- CSS Modules für Styling
- Framer Motion (für Animationen)
- Vite PWA Plugin (für Progressive Web App Funktionalität)

## PWA Installation

Die Anwendung kann als Progressive Web App (PWA) auf verschiedenen Geräten installiert werden:

### iOS Installation
1. Öffne die Webseite in Safari
2. Tippe auf das "Teilen"-Symbol
3. Wähle "Zum Home-Bildschirm hinzufügen"
4. Die App erscheint nun als eigenständige Anwendung auf deinem iPhone

### Desktop Installation
1. Öffne die Webseite in Chrome oder Edge
2. Klicke auf das Install-Symbol in der Adressleiste
3. Folge den Anweisungen zur Installation

## Entwickler-Installation

```bash
# Repository klonen
git clone [repository-url]
cd silvester-countdown

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Entwicklung

Die Anwendung unterstützt zwei Modi:

### Entwicklungsmodus
Im Entwicklungsmodus kann ein beliebiger Countdown-Zeitpunkt festgelegt werden:

```typescript
// src/config/countdown.ts
export const DEV_COUNTDOWN_TIME = 60; // Sekunden für den Countdown
```

### Produktivmodus
Im Produktivmodus wird automatisch der Countdown bis zum nächsten Silvester (00:00 Uhr, Berlin) berechnet.

```bash
# Entwicklungsserver mit Hot-Reload
npm run dev

# Production Build erstellen
npm run build

# Production Build lokal testen
npm run preview
```

## Projektstruktur

```
src/
├── components/
│   ├── Countdown/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── FinalCountdown/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── Fireworks/
│       ├── index.tsx
│       └── styles.module.css
├── hooks/
│   └── useCountdown.ts
├── utils/
│   └── timeCalculation.ts
└── App.tsx
```

## Konfiguration

Die Zeitzonen-Einstellungen und andere Konfigurationen können in der `.env`-Datei angepasst werden:

```env
VITE_TIMEZONE=Europe/Berlin
VITE_DEV_MODE=true
```

## Autor

Linus Palma