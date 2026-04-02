# KI-gestützte Systemmigration

## Block 0 -- Einstieg

### Folie 1 | KI-gestützte Systemmigration

**Inhalt:**
KI-gestützte Systemmigration
Von Avaloq zu einer modularen Bankenarchitektur

**Layout:**
- hero

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Begrüßung. Wir zeigen heute unseren Ansatz, wie die Avaloq-Ablösung mithilfe von KI-Tooling effizient und sicher umgesetzt werden kann. Nicht ob, sondern wie.

---

## Block 1 -- Ist-Zustand

### Folie 2 | Heutige Systemlandschaft

**Inhalt:**
**Kundenkanäle**
- Online Banking
- Mobile App
- Berater-Arbeitsplatz

**Integrationsschicht**
- API-Gateway / ESB
- Batch-Schnittstellen

**Avaloq – Kernbankensystem**
- Kontoführung | Zahlungsverkehr | Wertpapiere
- Stammdaten | Meldewesen | Compliance
- 500–600 Tabellen, monolithisch

**Umsysteme**
- CRM | Data Warehouse | Treasury | Meldewesen | DMS

**Layout:**
- infographic

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Typische Bankenarchitektur. Avaloq sitzt als Herzstück in der Mitte – alles läuft darüber. Das funktioniert, aber alles ist gekoppelt. Änderung an einer Stelle betrifft potenziell das gesamte System.

---

### Folie 3 | Avaloq – Datendomänen

**Inhalt:**
- **Kundenstammdaten** -- Personen, Adressen, KYC, Steuer, Klassifizierung
- **Kontoführung** -- Kontostamm, Salden, Positionen, Limiten
- **Zahlungsverkehr** -- SEPA, SWIFT, Daueraufträge, Sanktionsprüfung
- **Wertpapiere** -- Instrumente, Kurse, Depots, Corporate Actions
- **Transaktionen** -- Buchungen, Gebühren, Tagesendverarbeitung
- **Konditionen & Reporting** -- Zinsen, Gebührenmodelle, Aufsichtsmeldungen

**Layout:**
- matrix

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Das steckt alles in Avaloq. Jede Domäne hat dutzende bis hunderte Tabellen. Zusammen 500–600 Tabellen, die sauber aufgeteilt und überführt werden müssen – mit allen Abhängigkeiten und Geschäftsregeln.

---

### Folie 4 | Migrationsumfang

**Inhalt:**
- **500–600 Tabellen** -- Über Jahrzehnte gewachsen, komplex vernetzt
- **Dutzende Domänen** -- Konten, Zahlungen, Wertpapiere, Stammdaten, Reporting
- **3 Zielsysteme** -- Jede Tabelle muss zugeordnet werden
- **Tausende Feld-Mappings** -- Quellfelder → Zielfelder mit Transformationsregeln

**Layout:**
- bullets

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Das ist die Kernherausforderung: Die schiere Menge. Klassisch sitzt ein großes Team monatelang an Mapping-Tabellen. Unser Ansatz: KI übernimmt diese Routinearbeit.

---

## Block 2 -- Soll-Zustand

### Folie 5 | Modulare Zielarchitektur

**Inhalt:**
**Kundenkanäle**
- Online Banking
- Mobile App
- Berater-Arbeitsplatz

**Integrationsschicht**
- API-Gateway
- Event-Streaming

**INUS**
- Kontoführung
- Zahlungsverkehr

**Stammdatensystem**
- Kundenstammdaten
- Referenzdaten

**Upquest**
- Wertpapiere
- Depotführung

**Umsysteme**
- CRM | Data Warehouse | Treasury | Meldewesen | DMS

**Layout:**
- infographic

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Gleiche Architektur, aber statt einem Monolithen drei spezialisierte Systeme. Jedes macht eine Sache richtig gut. Integration über APIs und Event-Streaming statt über eine gemeinsame Datenbank. Dazwischen: KI-generierte Migrations-Tools als Brücke.

---

### Folie 6 | INUS – Konten & Zahlungsverkehr

**Inhalt:**
**Vorher:**
- Kontoführung (acct_)
- Zahlungsverkehr (pay_)
- Transaktionen (trx_)
- Konditionen (cond_)

**Jetzt:**
- Kontomanagement
- Payment Processing
- Buchungsmaschine
- Produktkonfiguration

**Layout:**
- comparison

**Moderationshinweis (nicht auf Folie, nur für Berater):**
INUS übernimmt den größten Tabellenanteil – alles rund um Konten und Zahlungen. KI analysiert die Avaloq-Quellstrukturen und generiert die Mapping-Skripte automatisch.

---

### Folie 7 | Stammdatensystem

**Inhalt:**
**Vorher:**
- Kundenstammdaten (bp_)
- Referenzdaten
- Klassifizierungen
- KYC / Compliance-Daten

**Jetzt:**
- Kundenmanagement
- Referenzdatenbank
- Taxonomie-Service
- Compliance-Datenhaltung

**Layout:**
- comparison

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Stammdaten sind oft die schwierigste Domäne – Datenqualität, Dubletten, historisch gewachsene Strukturen. Genau hier spielt KI ihre Stärke aus: Muster erkennen, Regeln ableiten, Qualitätschecks generieren.

---

### Folie 8 | Upquest – Wertpapiere

**Inhalt:**
**Vorher:**
- Wertpapiere (asset_)
- Depotführung
- Orders (ord_)
- Corporate Actions

**Jetzt:**
- Instrumentenverwaltung
- Depotmanagement
- Order Management
- Event Processing

**Layout:**
- comparison

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Upquest übernimmt alles rund um Wertpapiere. Besonders komplex: Corporate Actions und historische Bestände. Auch hier generiert KI die Überführungslogik.

---

## Block 3 -- KI-Ansatz

### Folie 9 | KI-gestützte Migration

**Inhalt:**
| Phase | Schritt | Beschreibung |
| 1 | Schema-Analyse | KI analysiert Avaloq-Schemas und Zielstrukturen |
| 2 | Mapping | Automatische Zuordnung Quellfelder → Zielfelder |
| 3 | Tool-Generierung | Migrationsskripte und Recon-Tools werden erzeugt |
| 4 | Migration | Generierte Tools laufen ohne KI auf Produktivdaten |
| 5 | Validierung | Recon-Tools prüfen Vollständigkeit und Korrektheit |

**Layout:**
- timeline

**Moderationshinweis (nicht auf Folie, nur für Berater):**
KI arbeitet nur in Phase 1–3, ausschließlich mit Schemas und anonymisierten Testdaten. Ab Phase 4 laufen nur die generierten Tools – ohne KI, ohne Zugriff auf echte Daten. Nach erfolgreicher Migration werden die Tools entsorgt.

---

### Folie 10 | Was die KI bekommt – und was sie liefert

**Inhalt:**
**Vorher:**
- Avaloq-Datenbankschemas (DDL, Metadaten)
- Zielstrukturen der neuen Systeme
- Geschäftsregeln und Transformationslogik
- Anonymisierte Testdatensätze

**Jetzt:**
- Feld-für-Feld-Mapping-Dokumentation
- SQL/ETL-Migrationsskripte
- Transformationsfunktionen
- Testfälle und Validierungsregeln

**Layout:**
- comparison

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Die KI bekommt nie echte Kundendaten. Sie arbeitet auf Strukturebene: Tabellendefinitionen, Spaltentypen, Beziehungen, Geschäftsregeln. Daraus generiert sie die Skripte, die dann auf den echten Daten laufen.

---

### Folie 11 | Recon-Tools – Qualitätssicherung

**Inhalt:**
- **Vollständigkeit** -- Alle Datensätze migriert? Zählung Quelle vs. Ziel
- **Wertabgleich** -- Salden, Bestände, Referenzdaten identisch?
- **Beziehungen** -- Verknüpfungen zwischen Entitäten korrekt übernommen?
- **Geschäftslogik** -- Regeln in den neuen Systemen konsistent?
- **Differenzreport** -- Automatische Abweichungsberichte

**Layout:**
- bullets

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Recon-Tools sind genauso wichtig wie die Migrationsskripte. Auch diese generiert die KI – basierend auf Schemas und Geschäftsregeln. Sie liefern nach jeder Migration einen klaren Report: Was passt, was weicht ab, wo muss nachgebessert werden.

---

## Block 4 -- Abschluss

### Folie 12 | Nächste Schritte

**Inhalt:**
Nächste Schritte
Gemeinsam die Migration gestalten

**Layout:**
- hero

**Moderationshinweis (nicht auf Folie, nur für Berater):**
Konkreter nächster Schritt: Workshop-Termin, um die Avaloq-Schemas gemeinsam durchzugehen und den Migrationsumfang zu quantifizieren. Erste Ergebnisse innerhalb weniger Wochen möglich.
