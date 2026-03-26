# Anleitung: Neue Prezi-Präsentation erstellen

## Übersicht

Diese Anleitung beschreibt, wie eine neue Prezi-artige Präsentation im System erstellt wird. Das Ergebnis ist eine Präsentation mit Zoom/Pan-Navigation auf einem 2D-Canvas, Topic-Navigation und Übersichtsmodus.

---

## 1. Inhalte vorbereiten: `content.md`

### Datei anlegen

```
decks/<slug>/content.md
```

Der `<slug>` darf **keine Umlaute** enthalten (wird Teil der URL), z.B. `angebotspraesentation-m1`.

### Format

```markdown
# Titel der Präsentation

## Block 0 -- Kapitelname

### Folie 1 | Folientitel

**Inhalt:**
Der eigentliche Folieninhalt mit korrekten Umlauten (ä, ö, ü, ß).
Bullet-Listen, Tabellen, **fett** etc. sind möglich.

**Layout:**
- hero

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Dieser Text wird nur im Presenter-Modus angezeigt.

---

### Folie 2 | Nächste Folie
...
```

### Wichtige Regeln

- **Umlaute:** Immer echte Umlaute (ä, ö, ü, ß) verwenden, nie ae/oe/ue
- **Trennzeichen:** Folien werden durch `---` getrennt
- **Blöcke/Kapitel:** `## Block N -- Kapitelname` definiert Themengruppen
- **Folienzählung:** `### Folie N | Titel` – fortlaufend nummeriert ab 1
- **Sektionen:** Nur diese werden als Sektionsheader erkannt:
  - `**Inhalt:**` – Hauptinhalt der Folie
  - `**Layout:**` – Layout-Typ (siehe unten)
  - `**Grafik-Idee:**` / `**Grafik-Beschreibung:**` – Layouthinweise
  - `**Moderationshinweis (nicht auf Folie, nur für Berater):**` – Sprechernotizen
- **Alles andere** innerhalb von `**Inhalt:**` wird als Folieninhalt behandelt (z.B. `**Badge:**`, `**Bausteine:**`, `**Vorher:**` etc.)

### Verfügbare Layout-Typen

| Layout | Wann verwenden | Inhalt-Format |
|--------|---------------|---------------|
| `hero` | Titel- und Abschlussfolien | Freier Text, Zeile 1 = Titel, Zeile 2 = Untertitel |
| `bullets` | Aufzählungen, Deliverables | `- **Titel** -- Beschreibung` oder einfache `- Bullet` |
| `timeline` | Prozesse, Phasen, Agenden | Tabelle mit `\| Phase \| Modul \| Leitfrage \|` oder Bullets |
| `matrix` | 2x2 oder 4-Quadranten-Darstellungen | Bullets mit `- **Titel** -- Beschreibung \| Detail` |
| `comparison` | Vorher/Nachher, Gegenüberstellung | `**Vorher:**` + Bullets, `**Jetzt:**` + Bullets |
| `module-detail` | Detailansichten mit Badge/Bausteinen | `**Badge:**`, `**Bausteine:**`, `**Ergebnisse:**`, `**Aufwand:**` |
| `dialog` | Interaktive Folien, Fragen | Leitfragen als Bullets |
| `infographic` | Treiber, Druck-Darstellungen | Strukturierte `**Titel**` + Bullets |
| `iceberg` | Sichtbar vs. verborgen | `**Titel**`-Sektionen (Shadow/Gap = "unter Wasser") |

### Beispiel: module-detail Format

```markdown
**Inhalt:**
**Badge:** Einstiegsmodul | Festpreis | 3-5 Beratertage | 1-2 Wochen

**Bausteine:**
- **B1 Reifegrad** (Kern) | Erhebung über 6 Dimensionen | ca. 2,5 BT
- **B6 Regulatorik** (Baseline) | Regulatorische Ersteinordnung | ca. 0,5 BT

**Ergebnisse:**
- Reifegradprofil über 6 Dimensionen
- KI-Nutzungsübersicht inkl. Shadow-AI

**Aufwand:** Gesamt 3-5 BT | Kundenaufwand ca. 5-6 Stunden
```

---

## 2. Prezi-Layout erstellen: `prezi-layout.json`

### Datei anlegen (zwei Kopien!)

1. `decks/<slug>/prezi-layout.json` – Quelldatei
2. `app/content/decks/<slug>-prezi.json` – Wird vom Code importiert

**Beide müssen identisch sein!** (Imports von außerhalb `app/` verursachen Webpack-Fehler)

### Struktur

```json
{
  "navigation": "prezi",
  "baseWidth": 1920,
  "baseHeight": 1080,
  "topics": [
    {
      "id": "thema-slug",
      "title": "Angezeigter Titel",
      "color": "#001777",
      "x": 960,
      "y": 540
    }
  ],
  "frames": [
    { "slideIndex": 0, "x": 0, "y": 0, "scale": 1, "topic": "thema-slug" }
  ],
  "overview": {
    "x": 1200,
    "y": 5000,
    "scale": 8
  }
}
```

### Topics (Themengruppen)

- Entsprechen den `## Block`-Kapiteln aus der content.md
- `id`: Slug ohne Umlaute (für Code)
- `title`: Angezeigter Name mit Umlauten
- `color`: Farbe aus dem Corporate Design (`#001777` oder `#0078FE`)
- `x`, `y`: Ungefähre Mitte der Topic-Gruppe auf dem Canvas (nur informativ)

### Frames (Folienpositionen)

Jeder Frame definiert, wo eine Folie auf dem Canvas liegt:

- `slideIndex`: 0-basierter Index (Folie 1 = Index 0)
- `x`, `y`: Position der oberen linken Ecke auf dem Canvas (in Pixeln)
- `scale`: Größe relativ zur Basisgröße (1920x1080)
  - `1.0` = Standardgröße
  - `0.7-0.85` = Kleinere Detailfolien (z.B. Interview-Karten)
  - `1.1-1.3` = Hervorgehobene Übersichtsfolien
- `topic`: Muss einer der definierten Topic-IDs entsprechen

### Empfohlene Canvas-Anordnung

```
Abstand zwischen Folien:     ~2400px horizontal, ~1800px vertikal
Cluster-Abstand:              ~4800px zwischen Themengruppen
Detailfolien (scale < 1):    Enger zusammen, z.B. 1200px Abstand

Bewährtes Muster:
- Willkommen: Oben Mitte (0, 0)
- Hauptthema: Mitte (0, 2400) – größerer Bereich
- Detail-Cluster: Rechts versetzt (5760, 2400)
- Kosten: Links unten (-4800, 8400)
- Nächste Schritte: Rechts unten (5760, 8400)
```

### Tipp: Gleichmäßige Verteilung

- Zusammengehörige Folien nah beieinander (1200-2400px)
- Verschiedene Themen deutlich getrennt (4800+px)
- Detailfolien in Rastern anordnen (z.B. 3 nebeneinander, 2 darunter)
- Die `overview`-Werte werden automatisch berechnet – die Angabe wird ignoriert

---

## 3. Deck registrieren

### `decks/decks.json` erweitern

```json
{
  "decks": [
    ...bestehende Decks...,
    {
      "slug": "mein-neues-deck",
      "title": "Angezeigter Titel mit Umlauten",
      "description": "Kurzbeschreibung",
      "contentFile": "content.md",
      "tags": ["KI", "Beratung"],
      "order": 3,
      "navigation": "prezi",
      "updatedAt": "2026-03-05"
    }
  ]
}
```

### `app/src/app/deck/[slug]/page.tsx` erweitern

1. Import der JSON-Dateien oben hinzufügen:
```tsx
import meinDeckData from '../../../../content/decks/mein-neues-deck.json'
import preziLayoutMeinDeck from '../../../../content/decks/mein-neues-deck-prezi.json'
```

2. Im `deckRegistry` registrieren:
```tsx
'mein-neues-deck': {
  data: meinDeckData as DeckData,
  navigation: 'prezi',
  preziLayout: preziLayoutMeinDeck,
},
```

---

## 4. Parsen und testen

### Content parsen

```bash
cd app
node scripts/parseContent.js
```

Prüfe die Ausgabe:
- Alle Folien erkannt?
- Richtige Layouts zugewiesen?
- `moduleDetail`, `timeline`, `comparison` etc. korrekt geparst?

### Entwicklungsserver starten

```bash
cd app
rm -rf .next          # Cache löschen (wichtig bei Problemen!)
npm run dev
```

### Im Browser testen

- `http://localhost:3000/` – Hub-Übersicht, neues Deck sollte erscheinen
- `http://localhost:3000/deck/<slug>` – Prezi-Ansicht

### Navigation testen

| Taste | Funktion |
|-------|----------|
| `→` / `↓` / `Space` | Nächste Folie |
| `←` / `↑` | Vorherige Folie |
| `O` / `ESC` | Übersicht ein/aus |
| `Home` | Erste Folie |
| `End` | Letzte Folie |
| Touch-Swipe | Vor/Zurück |
| Klick (Übersicht) | Zu Folie zoomen |

---

## 5. Häufige Probleme

| Problem | Lösung |
|---------|--------|
| CSS/JS 404 Fehler | `.next` löschen, Server neu starten, Ctrl+Shift+R im Browser |
| Folie zeigt leeren Inhalt | Parser-Ausgabe prüfen – sind `rawMarkdown` oder spezifische Parser-Felder gefüllt? |
| `matrix:0` oder `comparison:0` | Layout-Komponenten haben Fallback-Parser für rawMarkdown – Inhalt wird trotzdem gerendert |
| Import-Fehler (webpack) | Prezi-JSON muss innerhalb `app/content/decks/` liegen, nicht außerhalb von `app/` |
| Umlaute falsch | Quelldatei `content.md` prüfen – Parser übernimmt 1:1 was dort steht |
| `**Bold:**` in Section wird als Header geparst | Nur die bekannten Sektionsnamen werden als Header erkannt (Inhalt, Layout, etc.) |

---

## 6. Checkliste für neue Präsentationen

- [ ] `decks/<slug>/content.md` mit korrekten Umlauten erstellt
- [ ] Alle Folien mit `### Folie N | Titel` Format
- [ ] `**Inhalt:**` und `**Layout:**` Sektionen pro Folie
- [ ] `decks/<slug>/prezi-layout.json` mit Topics und Frames
- [ ] Kopie als `app/content/decks/<slug>-prezi.json`
- [ ] Eintrag in `decks/decks.json` mit `"navigation": "prezi"`
- [ ] Imports und Registry in `page.tsx` ergänzt
- [ ] `node scripts/parseContent.js` erfolgreich
- [ ] `npm run build` ohne Fehler
- [ ] Alle Folien im Browser sichtbar
- [ ] Übersicht (O) zeigt alle Folien
- [ ] Topic-Navigation in der Leiste oben funktioniert
