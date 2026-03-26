# Corporate Slide Deck Engine

A web-based presentation system that renders slides from Markdown files. Built with Next.js 15, Tailwind CSS, Framer Motion and Zustand.

Supports two navigation modes:
- **Scroll** -- classic slide-by-slide with scroll-snap, keyboard and touch
- **Prezi** -- zoom/pan on a 2D canvas with topic groups and overview mode

## Features

- Markdown-based content (no hardcoded slides)
- 21 built-in layout types (Hero, Bullets, Timeline, Matrix, Comparison, Pricing, ...)
- Presenter mode with speaker notes, timer and next-slide preview
- PDF export via print stylesheet
- PowerPoint (PPTX) export
- Deep-linking via URL hash
- Responsive: 16:9 (beamer), laptop, mobile
- Corporate design tokens (colors, typography)

## Quick Start

```bash
# 1. Install dependencies
cd app
npm install

# 2. Parse the example deck
node scripts/parseContent.js

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the hub with the example deck.

## Project Structure

```
/
├── README.md
├── CLAUDE.md                   # AI assistant instructions
├── ANLEITUNG_PREZI_ERSTELLUNG.md  # Prezi creation guide
├── decks/
│   ├── decks.json              # Deck manifest (slug, customer, type, navigation)
│   ├── decks.example.json      # Example manifest (copy to decks.json)
│   ├── _example/
│   │   └── content.md          # Example deck (3 slides)
│   └── <your-deck>/
│       ├── content.md          # Your presentation content
│       └── prezi-layout.json   # (optional) Prezi canvas layout
└── app/                        # Next.js application
    ├── scripts/
    │   └── parseContent.js     # Markdown -> JSON parser
    ├── content/
    │   ├── hub.json            # Generated hub manifest
    │   └── decks/              # Generated slide JSONs
    ├── public/
    │   ├── assets/             # Logo files (SVG/PNG)
    │   └── fonts/              # TT Firs Neue, Work Sans
    └── src/
        ├── app/                # Next.js pages (Hub, Deck, Presenter, Export)
        ├── components/
        │   ├── layouts/        # 21 layout components
        │   ├── icons/          # SVG icon components
        │   ├── navigation/     # ProgressBar, NavigationControls
        │   └── prezi/          # PreziCanvas, PreziOverview, PreziProgress
        ├── stores/             # Zustand stores (deck, presenter, prezi)
        ├── lib/
        │   ├── content/        # Schema, parser types
        │   └── hooks/          # useNavigation, useDeepLink
        └── styles/
            ├── tokens.css      # Design tokens (colors)
            └── typography.css  # Font definitions
```

## Creating a New Deck

### 1. Write your content

Create `decks/<slug>/content.md`:

```markdown
# My Presentation Title

> **Purpose:** What this deck is for
> **Audience:** Who it's for
> **Slides:** 3

---

## Block 0 -- Introduction

---

### Slide 01 | Title Slide

**Content:**
- Title: "My Presentation"
- Subtitle: "A brief overview"

**Layout:**
- hero

**Speaker notes (not on slide, presenter only):**
Welcome the audience and introduce yourself.

---

### Slide 02 | Key Points

**Content:**
- Heading: "What We Cover"
- **Point One** -- Description of the first topic
- **Point Two** -- Description of the second topic
- **Point Three** -- Description of the third topic

**Layout:**
- bullets

---

### Slide 03 | Closing

**Content:**
- Title: "Thank You"
- Subtitle: "Questions?"

**Layout:**
- hero
```

### 2. Register your deck

Add an entry to `decks/decks.json`:

```json
{
  "slug": "my-deck",
  "title": "My Presentation",
  "description": "A brief overview",
  "tags": ["Demo"],
  "customer": null,
  "type": "sales-pitch",
  "cover": null,
  "order": 1,
  "contentFile": "content.md",
  "updatedAt": "2026-01-01"
}
```

### 3. Parse the content

```bash
cd app
node scripts/parseContent.js
```

This generates `app/content/decks/<slug>.json` and updates `app/content/hub.json`.

### 4. Register in page files

Import the generated JSON in the following files and add it to the deck registry:

- `app/src/app/page.tsx` (Hub page + PPTX export)
- `app/src/app/deck/[slug]/page.tsx` (Deck viewer)
- `app/src/app/deck/[slug]/presenter/page.tsx` (Presenter mode)
- `app/src/app/deck/[slug]/export/page.tsx` (PDF/PPTX export)

Example import pattern:

```tsx
import myDeckData from '../../content/decks/my-deck.json'

const deckRegistry = {
  'my-deck': { data: myDeckData as DeckData, navigation: 'scroll' },
}
```

### 5. Start and test

```bash
npm run dev
# Open http://localhost:3000
```

## Available Layouts

| Layout | Use Case | Content Format |
|--------|----------|----------------|
| `hero` | Title/closing slides | Free text, line 1 = title, line 2 = subtitle |
| `bullets` | Lists, deliverables | `- **Title** -- Description` or simple `- Bullet` |
| `timeline` | Processes, phases | Table or bullets |
| `matrix` | 2x2 grids, quadrants | Bullets with `- **Title** -- Desc \| Detail` |
| `comparison` | Before/after | `**Before:**` + bullets, `**After:**` + bullets |
| `module-detail` | Detail views | `**Badge:**`, `**Components:**`, `**Results:**` |
| `dialog` | Interactive, questions | Questions as bullets |
| `infographic` | Drivers, pressure | Structured `**Title**` + bullets |
| `iceberg` | Visible vs hidden | `**Title**` sections |
| `process-flow` | Process diagrams | Structured process steps |
| `gantt` | Timelines, schedules | Phase-based timeline data |
| `severity-list` | Priority lists | `Priority N:` prefixed items |
| `phased-plan` | Roadmaps | Phase-grouped action items |
| `dual-column` | Two-column layouts | Two `**Header:**` sections |
| `findings` | Audit findings | Finding cards with details |
| `numbered-cards` | Numbered items | Numbered list items |
| `company-profile` | Company info | Key-value company data |
| `pricing` | Package comparison | SaaS-style pricing cards |
| `maturity` | Maturity models | Level-based assessments |
| `parallel-paths` | Parallel tracks | Multiple concurrent paths |

## Prezi Navigation

For Prezi-style presentations with zoom/pan navigation, see the detailed guide: [`ANLEITUNG_PREZI_ERSTELLUNG.md`](ANLEITUNG_PREZI_ERSTELLUNG.md)

Key steps:
1. Create `decks/<slug>/prezi-layout.json` with topics and frames
2. Copy it to `app/content/decks/<slug>-prezi.json`
3. Set `"navigation": "prezi"` in `decks.json`
4. Import both JSON files in `page.tsx`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Right` / `Down` / `Space` | Next slide |
| `Left` / `Up` | Previous slide |
| `O` / `ESC` | Toggle overview (Prezi) |
| `Home` | First slide |
| `End` | Last slide |
| Touch swipe | Next/previous |

## Build Commands

```bash
cd app
npm install          # Install dependencies
npm run dev          # Development server (with HMR)
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run linter
```

## Design Tokens

Colors (defined in `app/src/styles/tokens.css`):
- `--base-blue-dark`: #000039
- `--base-blue`: #001777
- `--base-grey-dark`: #E3E4E2
- `--base-grey`: #F5F5F3
- `--accent`: #17f0f0 (use sparingly: CTAs, focus states)

Fonts:
- **Headlines**: TT Firs Neue (class: `font-headline`)
- **Body**: Work Sans

## License

Private / All rights reserved.
