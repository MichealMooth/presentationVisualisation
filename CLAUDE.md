# CLAUDE.md

Diese Datei gibt Claude Code (claude.ai/code) Orientierung für die Arbeit am Code in diesem Repository.

## Projektübersicht

Corporate Web Slideshow (Website-Deck) – ein webbasiertes Präsentationssystem, das Folien aus Markdown-Dateien im Stammverzeichnis rendert. Das System soll sich wie eine Premium-Website anfühlen (flüssige Übergänge, saubere Typografie, interaktive Elemente) und gleichzeitig stabil für Präsentationen sein (Beamer/Teams).

## Tech Stack

- **Framework**: Next.js 15 (App Router) + Tailwind CSS
- **State**: Zustand
- **Inhalte**: Markdown in `decks/<slug>/content.md`, geparst durch `app/scripts/parseContent.js`
- **Animationen**: Framer Motion

## Build- & Entwicklungsbefehle

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build
npm run start        # Produktionsserver starten
npm run lint         # Linter ausführen
```

## Corporate-Design-Tokens

### Typografie
- **Überschriften**: TT Firs (primär), Fallback auf System-Sans-Serif
- **Fließtext**: Work Sans (primär), Fallback auf "Segoe UI", System-Sans-Serif
- **System-Fallback**: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif

### Farben
Basisfarben (als CSS-Variablen in `/styles/tokens.css`):
- `--base-blue-dark`: #000039
- `--base-blue`: #001777
- `--base-grey-dark`: #E3E4E2
- `--base-grey`: #F5F5F3
- `--accent`: #17f0f0 (sparsam einsetzen: CTAs, aktive Zustände, Umfrageergebnisse, Fokusringe)

## Inhaltssystem

### Deck-Quelldateien
Alle Decks liegen in `decks/<slug>/content.md`. Manifest: `decks/decks.json`.

Jedes Deck hat in `decks.json`:
- `slug`, `title`, `description`, `tags`
- `customer`: Kundenname oder `null` (generisches Deck)
- `type`: `"sales-pitch"` | `"kundenspezifisch"` | `"angebot"` | ...
- `navigation`: `"scroll"` (Standard) | `"prezi"`

Aktuelle Decks:
| Slug | Kunde | Typ | Navigation |
|---|---|---|---|
| `ki-beratung` | — | Sales-Pitch | Scroll |
| `tricept-ag` | Tricept AG | Kundenspezifisch | Scroll |
| `angebotspraesentation-m1` | Tricept AG | Angebot | Prezi |

### Marken-Assets (`app/public/assets/`)
- `Bildmarke.png` – Logozeichen (Header, Presenter-UI, Favicon)
- `IT-Consulting-Grafik.png` – Wortmarke (Fallback)
- `TRICEPT-*.svg` – SVG-Logos (bevorzugt)

Regeln zur Asset-Verwendung:
- Titelfolien: Wortmarke prominent + Logozeichen sekundär
- Reguläre Folien: Dezentes Logozeichen im Footer (rechte Seite)
- Presenter-Modus: Logozeichen in der UI

## Architektur

```
/
├── CLAUDE.md
├── ANLEITUNG_PREZI_ERSTELLUNG.md
├── Corporate_Design/           # Quell-Assets (Logos, Fonts) – nur Referenz
├── decks/
│   ├── decks.json              # Deck-Manifest (slug, customer, type, navigation)
│   ├── ki-beratung/
│   │   └── content.md
│   ├── tricept-ag/
│   │   └── content.md
│   └── angebotspraesentation-m1/
│       ├── content.md
│       ├── prezi-layout.json
│       └── original-vorlage.md # Ursprüngliches Quelldokument
└── app/                        # Next.js-App (npm-Befehle hier ausführen)
    ├── scripts/
    │   └── parseContent.js     # MD → JSON Parser
    ├── content/
    │   ├── hub.json            # Generiertes Hub-Manifest
    │   └── decks/              # Generierte Deck-JSONs + Prezi-Layouts
    ├── public/
    │   ├── assets/             # SVG-Logos, PNG-Fallbacks
    │   └── fonts/              # TT Firs Neue, Work Sans
    └── src/
        ├── app/                # Next.js Pages (Hub, Deck, Presenter)
        ├── components/
        │   ├── layouts/        # Layout-Komponenten (Hero, Bullets, Timeline, Matrix, ...)
        │   ├── icons/          # SVG-Icon-Komponenten
        │   ├── navigation/     # ProgressBar, NavigationControls
        │   └── prezi/          # PreziCanvas, PreziOverview, PreziProgress
        ├── stores/             # Zustand Stores (deck, presenter, prezi)
        ├── lib/
        │   ├── content/        # Schema, Parser-Typen
        │   └── hooks/          # useNavigation, useDeepLink
        └── styles/
            ├── tokens.css      # Design-Tokens
            └── typography.css  # Font-Definitionen
```

## Umzusetzende Hauptfunktionen

### Navigation & UX
- Scroll-Snap + Tastatur (←/→/Leertaste) + Touch-Swipes + Fortschrittsklick
- Fortschrittsanzeige mit Kapiteln und Position
- Deep-Linking über URL-Hash (`/deck#03-ansatz`)
- Responsiv: 16:9 (Beamer), Laptop, Mobil (Quer-/Hochformat)

### Presenter-Modus (`/presenter` oder Tastenkürzel)
- Vorschau der nächsten Folie
- Timer
- Moderationshinweise aus dem Frontmatter-Feld `notes`
- Optionaler Link zur Publikumsansicht

### Umfragen (Layout-Typ)
- Einzel-/Mehrfachauswahl und 1-5-Skala
- Live-Ergebnisbalken mit Prozentangaben
- Lokaler Modus (Demo, kein Backend) vs. Live-Modus (WebSocket, QR-Beitritt)
- DSGVO: Standardmäßig kein Tracking

### Export (Optional)
- PDF über Print-Stylesheet oder serverseitiges Rendering
- PWA-Offline-Cache für Beamer ohne Netzwerk

## Umsetzungs-Meilensteine

1. **MVP Deck Engine**: MD-Loader, Scroll-Snap, Tastaturnavigation, URL-Anker, 3 Layouts (Hero, Split, Bullets)
2. **Design-System**: Tokens, Buttons, Cards, Callouts, Marken-Assets-Integration
3. **Presenter-Modus**: Notizen, Vorschau, Timer
4. **Interaktion**: Umfrage-Layout + lokaler Modus, optionaler Live-Modus
5. **Feinschliff**: PDF-Export, PWA offline

## Prezi-Navigation

Für Prezi-artige Präsentationen siehe die ausführliche Anleitung: **`ANLEITUNG_PREZI_ERSTELLUNG.md`**

Kurzübersicht:
- Inhalte: `decks/<slug>/content.md` (Markdown mit `### Folie N | Titel`)
- Layout: `decks/<slug>/prezi-layout.json` + Kopie in `app/content/decks/<slug>-prezi.json`
- Registrierung: `decks/decks.json` + Imports in `page.tsx`
- Parsen: `cd app && node scripts/parseContent.js`
- Immer echte Umlaute (ä, ö, ü, ß) verwenden, nie ae/oe/ue

## Wichtige Einschränkungen

- Alle Inhalte ausschließlich aus Markdown-Dateien in `decks/<slug>/` – keine hartcodierten Folieninhalte
- Akzentfarbe (#17f0f0) nur in definierten Zuständen (CTAs, Fokus, Umfrageergebnisse)
- Asset-Resolver muss relative Pfade robust verarbeiten
- Präsentationsstabil: kein Layout-Jank, flüssige Übergänge, funktioniert auf Beamer/Teams
- Barrierefreiheit: korrekter Kontrast, Fokusringe (Akzentfarbe), vollständige Tastaturnavigation
- Prezi-Layout-JSONs müssen innerhalb `app/content/decks/` liegen (Webpack-Einschränkung)
