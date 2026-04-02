'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey, IconGlühbirne, IconRefresh } from '../icons/SlideIcons'
import { usePreziStore } from '@/stores/preziStore'

interface TimelineLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Consistent color scheme - blue gradient for all
const stepColors = [
  'from-blue-500 to-blue-600',
  'from-blue-600 to-indigo-600',
  'from-indigo-600 to-indigo-700',
  'from-indigo-700 to-purple-700',
  'from-purple-700 to-purple-800',
]

// Predefined data for specific slides
const slideData: Record<number, {
  steps: Array<{
    id: string
    title: string
    description?: string
    result?: string
    icon?: string
  }>
  title: string
  callout?: string
  isAgenda?: boolean
  isModuleView?: boolean
  isVertical?: boolean
}> = {
  2: {
    title: 'Unser gemeinsames Ziel heute',
    isAgenda: true,
    callout: 'Gemeinsam verstehen, wo Sie stehen – und wie ein strukturierter KI-Weg aussehen kann.',
    steps: [
      { id: '1', title: 'Ihre Ausgangslage', description: '~10 Min', icon: 'strategie' },
      { id: '2', title: 'KI-Chancen', description: '~20 Min', icon: 'gluehbirne' },
      { id: '3', title: 'Unser Ansatz', description: '~20 Min', icon: 'kompass' },
      { id: '4', title: 'Nächste Schritte', description: '~10 Min', icon: 'rakete' },
    ],
  },
  9: {
    title: 'Von der Orientierung zur dauerhaften KI-Führung',
    callout: 'Phasen 1–4 bauen Ihre KI-Fähigkeit auf. Phase 5 stellt sicher, dass sie bleibt.',
    steps: [
      { id: '1', title: 'Orientierung', description: '1-3 Wochen', result: 'Klarheit über Ausgangslage', icon: 'search' },
      { id: '2', title: 'Zielbild', description: '3-5 Wochen', result: 'KI-Strategie & Use-Cases', icon: 'strategie' },
      { id: '3', title: 'Vorbereitung', description: '3-5 Wochen', result: 'Governance & Rollen', icon: 'zahnrad' },
      { id: '4', title: 'Einführung', description: '4-8 Wochen', result: 'KI produktiv im Einsatz', icon: 'paket' },
      { id: '5', title: 'Dauerhafte Führung', description: 'Permanent', result: 'KI in der Steuerung verankert', icon: 'refresh' },
    ],
  },
  11: {
    title: 'Unsere Leistungsmodule',
    callout: 'Nicht jedes Unternehmen startet bei Schritt 1. Wo Sie einsteigen, klären wir gemeinsam.',
    isModuleView: true,
    steps: [
      { id: '1', title: 'Standortbestimmung', description: 'Wo stehen wir?', result: 'Reifegrad & Lücken', icon: 'kompass' },
      { id: '2', title: 'Strategie', description: 'Wohin?', result: 'Priorisierte Fälle', icon: 'strategie' },
      { id: '3', title: 'Governance', description: 'Wer entscheidet?', result: 'Rollen & Regeln', icon: 'dokument' },
      { id: '4', title: 'Einführung', description: 'Wie starten?', result: 'Go-Live-Begleitung', icon: 'rakete' },
      { id: '5', title: 'Führung', description: 'Optional', result: 'Quartalsreviews', icon: 'diagramm' },
    ],
  },
}

// Parse timeline steps from rawMarkdown as fallback
function parseRawTimelineSteps(raw: string): Array<{ id: string; title: string; description?: string; result?: string; icon?: string }> {
  const steps: Array<{ id: string; title: string; description?: string; result?: string; icon?: string }> = []

  // Try table format: | col1 | col2 | col3 |
  const tableLines = raw.split('\n').filter((l: string) => l.includes('|') && !l.match(/^\s*\|[-\s]+\|/))
  if (tableLines.length > 1) {
    // Skip header row
    for (let i = 1; i < tableLines.length; i++) {
      const cells = tableLines[i].split('|').map((c: string) => c.trim()).filter((c: string) => c)
      if (cells.length >= 2) {
        const cleanTitle = cells[1]?.replace(/\*\*/g, '') || ''
        steps.push({
          id: cells[0] || String(i),
          title: cleanTitle,
          description: cells[2] || undefined,
        })
      }
    }
    if (steps.length > 0) return steps
  }

  // Try bullet format: - **Title** -- description
  const lines = raw.split('\n')
  let idx = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      idx++
      const text = trimmed.slice(2)
      const boldMatch = text.match(/^\*\*([^*]+)\*\*\s*(?:--|--|-)\s*(.+)/)
      if (boldMatch) {
        steps.push({ id: String(idx), title: boldMatch[1], description: boldMatch[2] })
      } else {
        steps.push({ id: String(idx), title: text.replace(/\*\*/g, '') })
      }
    }
  }
  return steps
}

const defaultIcons = ['1', '2', '3', '4', '5', '6']

// Auto-detect thematic icon from step title keywords
function getTimelineIcon(title: string, index: number): string {
  const lower = title.toLowerCase()
  if (lower.includes('eröffnung') || lower.includes('methodik') || lower.includes('einleitung')) return 'mikrofon'
  if (lower.includes('stehen wir') || lower.includes('profil') || lower.includes('reifegrad')) return 'search'
  if (lower.includes('dora')) return 'waage'
  if (lower.includes('ai act')) return 'dokument'
  if (lower.includes('bafin')) return 'schild'
  if (lower.includes('hochrisiko')) return 'warnung'
  if (lower.includes('shadow')) return 'warnung'
  if (lower.includes('regulat')) return 'waage'
  if (lower.includes('empfehl') || lower.includes('leitplan') || lower.includes('maßnahm')) return 'kompass'
  if (lower.includes('angebot') || lower.includes('investit') || lower.includes('paket')) return 'euro'
  if (lower.includes('fazit') || lower.includes('nächste') || lower.includes('abschluss')) return 'rakete'
  if (lower.includes('strategie') || lower.includes('use-case')) return 'strategie'
  if (lower.includes('governance')) return 'waage'
  if (lower.includes('einführung') || lower.includes('begleitung')) return 'zahnrad'
  if (lower.includes('standort') || lower.includes('orientierung')) return 'kompass'
  if (lower.includes('stärken') || lower.includes('risiken')) return 'diagramm'
  return String(index + 1)
}

// id-based slide data for Angebotspräsentation
const slideDataById: Record<string, typeof slideData[number]> = {
  '02-agenda': {
    title: 'Unsere Agenda heute',
    isAgenda: true,
    steps: [
      { id: '1', title: 'Unser Beratungsansatz', description: 'Was hat sich seit dem Ersttermin verändert und wie sieht unser Vorgehensmodell aus', icon: 'kompass' },
      { id: '2', title: 'Kostenrahmen', description: 'Standortbestimmung als Festpreis, Orientierung für mögliche Folgeschritte', icon: 'euro' },
      { id: '3', title: 'Konkreter nächster Schritt', description: 'Wer nimmt an den Interviews teil, wie geht es weiter?', icon: 'rakete' },
    ],
  },
  '11-ablauf-der-standortbestimmung': {
    title: 'Ablauf der Standortbestimmung',
    callout: 'Euer Aufwand: insgesamt ca. 5–6 Stunden, verteilt auf 4–6 Personen.',
    steps: [
      { id: '1', title: 'Vorbereitung', description: 'Kein Aufwand für euch', result: 'Wir sichten vorab bereitgestellte Unterlagen und bereiten die Erhebung vor', icon: 'dokument' },
      { id: '2', title: 'Erhebung', description: 'ca. 4–5 Stunden', result: 'Strukturierte Interviews mit verschiedenen Perspektiven', icon: 'mikrofon' },
      { id: '3', title: 'Auswertung', description: 'Kein Aufwand für euch', result: 'Bewertung über das Reifegradmodell, Konsolidierung, Erstellung des Berichts', icon: 'diagramm' },
      { id: '4', title: 'Ergebnis', description: 'ca. 60–90 Min.', result: 'Vorstellung der Ergebnisse bei der Geschäftsführung, Diskussion', icon: 'strategie' },
    ],
  },
  '15-so-geht-es-weiter': {
    title: 'So geht es weiter',
    isVertical: true,
    steps: [
      { id: '1', title: 'Standortbestimmung', description: 'Interviews + Auswertung (1–2 Wochen)', icon: 'search' },
      { id: '2', title: 'Ergebnispräsentation', description: 'Vorstellung bei der Geschäftsführung', icon: 'diagramm' },
      { id: '3', title: 'Präzisiertes Angebot', description: 'Konkrete Modulvorschläge auf Basis der Ergebnisse', icon: 'dokument' },
    ],
  },
  '02-heutige-agenda': {
    title: 'Heutige Agenda',
    isAgenda: true,
    steps: [
      { id: '1', title: 'Beratungskonzept', description: 'Vorgehensmodell & Module in Erinnerung rufen', icon: 'kompass' },
      { id: '2', title: 'Gesamtstatus', description: 'Stand der Ausarbeitung und Verprobung', icon: 'diagramm' },
      { id: '3', title: 'Zeitplan', description: 'Aktualisierter Plan und offene Punkte', icon: 'uhr' },
    ],
  },
  '05-stand-der-verprobung': { title: 'CUSTOM', steps: [] },
  '15-naechste-schritte': {
    title: 'Nächste Schritte',
    isVertical: true,
    steps: [
      { id: '1', title: 'M1-Auswertung finalisieren', description: 'Verprobung Tricept abschließen', icon: 'check' },
      { id: '2', title: 'M2-Ausarbeitung starten', description: 'Durchführungshilfen entwickeln — Ende März', icon: 'rakete' },
      { id: '3', title: 'Verfügbarkeitsplanung', description: 'Zeitplan mit Urlauben abgleichen — KW 12', icon: 'uhr' },
      { id: '4', title: 'Nächster Steuerungskreis', description: 'Termin KW 16/17 vereinbaren', icon: 'agenda' },
    ],
  },
}

const agendaColors = ['#001777', '#0078FE', '#059669']

// ── Avaloq Migration: KI Process Flow ──
function KiMigrationFlow({ isActive }: { isActive: boolean }) {
  const goToFrame = usePreziStore((s) => s.goToFrame)
  const phases = [
    { num: '1', title: 'Schema-Analyse', desc: 'Avaloq-Schemas & Zielstrukturen analysieren', icon: 'search', ki: true, frame: 9 },
    { num: '2', title: 'Mapping', desc: 'Quellfelder → Zielfelder automatisch zuordnen', icon: 'daten', ki: true, frame: 9 },
    { num: '3', title: 'Tool-Generierung', desc: 'Migrationsskripte & Recon-Tools erzeugen', icon: 'zahnrad', ki: true, frame: 9 },
    { num: '4', title: 'Migration', desc: 'Generierte Tools laufen auf Produktivdaten', icon: 'rakete', ki: false, frame: 10 },
    { num: '5', title: 'Validierung', desc: 'Recon-Tools prüfen Vollständigkeit & Korrektheit', icon: 'schild', ki: false, frame: 10 },
  ]

  return (
    <div className="flex flex-col h-full w-full px-10 py-6 justify-center items-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-4 text-center"
      >KI-gestützte Migration</motion.h2>

      <motion.p
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        className="text-lg text-[#000039]/50 mb-8 text-center">
        KI baut die Werkzeuge – die Migration läuft ohne KI
      </motion.p>

      {/* Phase flow */}
      <div className="flex items-start gap-0 max-w-[1100px] w-full">
        {phases.map((phase, i) => {
          const bg = phase.ki ? 'from-[#001777] to-[#0078FE]' : 'from-emerald-600 to-emerald-700'
          const badge = phase.ki ? { text: 'KI', bg: 'bg-[#17f0f0] text-[#000039]' } : { text: 'Tool', bg: 'bg-emerald-100 text-emerald-800' }
          const isLast = i === phases.length - 1

          return (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.45 }}
                className="flex-1 flex flex-col items-center"
              >
                {/* Badge */}
                <div className={`text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 ${badge.bg}`}>{badge.text}</div>

                {/* Circle with number (clickable) */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg mb-3 cursor-pointer hover:scale-110 transition-transform duration-200`}
                  onClick={() => goToFrame(phase.frame)}
                >
                  <IconByKey icon={phase.icon} size={26} color="white" />
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-[#000039] text-center mb-1">{phase.title}</h4>

                {/* Description */}
                <p className="text-sm text-[#000039]/50 text-center leading-snug max-w-[160px]">{phase.desc}</p>
              </motion.div>

              {/* Arrow connector */}
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
                  transition={{ delay: 0.35 + i * 0.12 }}
                  className="flex items-center mt-8 -mx-2"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <path d="M2 10h30m0 0l-6-5m6 5l-6 5" stroke={i < 2 ? '#001777' : i === 2 ? '#059669' : '#059669'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Divider line showing KI boundary */}
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={isActive ? { opacity: 1, scaleX: 1 } : {}} transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-8 max-w-[1100px] w-full flex items-center gap-4">
        <div className="flex-1 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#001777]/30 to-[#001777]/30" />
          <span className="text-xs font-bold text-[#001777]/60 px-3 whitespace-nowrap">KI arbeitet nur mit Schemas & anonymisierten Testdaten</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#001777]/30 via-emerald-300/30 to-transparent" />
        </div>
      </motion.div>

      {/* Bottom callout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.0 }}
        className="mt-4 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl px-6 py-3 shadow-lg max-w-[700px]"
      >
        <p className="text-white font-semibold text-base text-center flex items-center justify-center gap-2">
          <IconGlühbirne size={18} color="white" />
          Keine KI im Produktivbetrieb · Einweg-Tools · Nach Migration entsorgt
        </p>
      </motion.div>
    </div>
  )
}

export function TimelineLayout({ slide, isActive = false }: TimelineLayoutProps) {
  // ── Custom renderer for avaloq-migration KI flow ──
  if (slide.id === '09-ki-gestuetzte-migration') {
    return <KiMigrationFlow isActive={isActive} />
  }

  let data: typeof slideDataById[string] | undefined = slideDataById[slide.id]

  // Guard against cross-deck ID collisions (e.g., '02-agenda' exists in multiple decks)
  const parsedTimeline = slide.content?.timeline || []
  if (data && parsedTimeline.length > (data.steps?.length || 0)) {
    data = undefined
  }

  // ─── Custom Agenda for Steuerungskreis ───
  if (slide.id === '02-heutige-agenda' && data) {
    const steps = data.steps
    return (
      <div className="flex flex-col h-full w-full px-8 justify-center items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-2"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.6 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-[#000039]/60 mb-10"
        >
          Steuerungskreis COS-KI — 10. März 2026
        </motion.p>

        <div className="flex items-stretch gap-6 max-w-5xl w-full">
          {steps.map((step, i) => {
            const color = agendaColors[i % agendaColors.length]
            const isLast = i === steps.length - 1
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                className="flex-1 flex items-center"
              >
                <div
                  className="w-full h-full rounded-2xl p-8 bg-white shadow-lg border border-gray-100 relative overflow-hidden flex flex-col"
                  style={{ borderTop: `5px solid ${color}` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.12] -mt-2 -mr-2">
                    <IconByKey icon={step.icon || String(i + 1)} size={96} color={color} />
                  </div>
                  <div className="relative z-10">
                    <div className="mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                        style={{ background: color }}
                      >
                        <IconByKey icon={step.icon || String(i + 1)} size={28} color="white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#000039] font-headline mb-2">{step.title}</h3>
                    <p className="text-lg text-[#000039]/55 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isActive ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
                    className="shrink-0 mx-2"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Custom: Stand der Verprobung ───
  if (slide.id === '05-stand-der-verprobung') {
    const doneItems = [
      { title: 'Kickoff-Meeting', date: '23.02.', icon: 'check' },
      { title: 'Shadow-AI Mitarbeiterbefragung', date: '06.03.', icon: 'check' },
    ]
    const interviews = [
      { title: 'Geschäftsführung', icon: 'mikrofon' },
      { title: 'IT-Leitung', icon: 'mikrofon' },
      { title: 'Fachbereich', icon: 'mikrofon' },
      { title: 'Compliance', icon: 'mikrofon' },
    ]
    const upcoming = [
      { title: 'Auswertung & Reifegradprofil', icon: 'diagramm' },
      { title: 'Ergebnispräsentation', icon: 'strategie' },
    ]
    return (
      <div className="flex flex-col h-full w-full px-8 justify-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-8 text-center"
        >
          Stand der Verprobung — Standortbestimmung M1
        </motion.h2>

        <div className="max-w-5xl mx-auto w-full space-y-5">
          {/* Phase 1: Erledigt */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-[#059669]" />
              <span className="text-base font-bold uppercase tracking-widest text-[#059669]">Erledigt</span>
            </div>
            <div className="flex gap-4">
              {doneItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex-1 flex items-center gap-4 p-4 rounded-xl bg-[#059669]/8 border border-[#059669]/20"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#059669] flex items-center justify-center shrink-0">
                    <IconByKey icon={item.icon} size={22} color="white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#000039] text-xl">{item.title}</h3>
                    <p className="text-base text-[#059669] font-semibold">{item.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connector */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isActive ? { scaleY: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="w-0.5 h-6 bg-gradient-to-b from-[#059669] to-[#0078FE]"
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Phase 2: Interviews (parallel) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-[#0078FE]" />
              <span className="text-base font-bold uppercase tracking-widest text-[#0078FE]">Interviews — parallel in Planung</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {interviews.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border-2 border-[#0078FE]/20 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0078FE]/10 flex items-center justify-center">
                    <IconByKey icon={item.icon} size={24} color="#0078FE" />
                  </div>
                  <h3 className="font-bold text-[#000039] text-lg text-center">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connector */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isActive ? { scaleY: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="w-0.5 h-6 bg-gradient-to-b from-[#0078FE] to-[#001777]"
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Phase 3: Auswertung & Ergebnis */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            <div className="flex items-center gap-2 mb-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-[#001777]" />
              <span className="text-base font-bold uppercase tracking-widest text-[#001777]">Nächste Schritte</span>
            </div>
            <div className="flex gap-4">
              {upcoming.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                  className="flex-1 flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#001777]/10 flex items-center justify-center shrink-0">
                    <IconByKey icon={item.icon} size={22} color="#001777" />
                  </div>
                  <h3 className="font-bold text-[#000039] text-xl">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Use parsed timeline data from content as fallback
  const parsedSteps = slide.content?.timeline || []
  const rawSteps = !data && parsedSteps.length === 0 && slide.content?.rawMarkdown
    ? parseRawTimelineSteps(slide.content.rawMarkdown)
    : []

  const fallbackSteps = parsedSteps.length > 0
    ? parsedSteps.map((s: { id?: string; title: string; description?: string; result?: string }, i: number) => ({
        id: (s as Record<string, unknown>).id as string || String(i + 1),
        title: s.title.replace(/\*\*/g, ''),
        description: s.description || undefined,
        result: s.result || undefined,
        icon: undefined as string | undefined,
      }))
    : rawSteps

  const steps = data?.steps || (fallbackSteps.length > 0 ? fallbackSteps : [])
  const title = data?.title || slide.displayTitle || slide.title
  const calloutText = data?.callout || slide.content?.callout?.text
  const isAgenda = data?.isAgenda
  const isModuleView = data?.isModuleView
  const isVertical = data?.isVertical

  // Extract intro text (first non-empty, non-table, non-bullet line) for generic slides
  const introText = !data && slide.content?.rawMarkdown
    ? slide.content.rawMarkdown.split('\n').find((l: string) => {
        const t = l.trim()
        return t && !t.startsWith('-') && !t.startsWith('|') && !t.startsWith('#')
      })?.trim()
    : undefined

  return (
    <div className={`flex flex-col h-full w-full px-5 justify-center items-center ${isModuleView ? 'bg-gradient-to-b from-gray-50 to-white rounded-2xl py-4' : ''}`}>
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark mb-3 text-center font-headline"
      >
        {title}
      </motion.h2>

      {/* Agenda subtitle */}
      {isAgenda && calloutText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4 text-center text-xl text-base-blue-dark/70"
        >
          {calloutText}
        </motion.p>
      )}

      {/* Intro text for generic timeline slides */}
      {!isAgenda && !data && introText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4 text-center text-lg text-base-blue-dark/60 max-w-4xl mx-auto"
        >
          {introText}
        </motion.p>
      )}

      {/* Vertical Steps Layout */}
      {isVertical && (
        <div className="flex flex-col items-center gap-0 max-w-3xl mx-auto w-full">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.12 }}
                className="w-full"
              >
                <div className="flex items-stretch gap-6">
                  {/* Left: number + vertical line */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-14 h-14 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0
                      bg-gradient-to-br ${stepColors[index % stepColors.length]}
                    `}>
                      <IconByKey icon={step.icon || String(index + 1)} size={26} color="white" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 my-1" style={{ background: 'linear-gradient(to bottom, #001777, #0078FE)', opacity: 0.25 }} />
                    )}
                  </div>
                  {/* Right: card */}
                  <div className={`flex-1 rounded-xl bg-white border border-gray-100 shadow-md p-6 ${isLast ? '' : 'mb-3'}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                        bg-gradient-to-br ${stepColors[index % stepColors.length]}
                      `}>{step.id}</span>
                      <h3 className="font-bold text-[#000039] text-2xl font-headline">{step.title}</h3>
                    </div>
                    {step.description && (
                      <p className="text-xl text-[#000039]/60 ml-11">{step.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Timeline Steps (horizontal) */}
      {!isVertical && <div className="flex items-center justify-center py-2 w-full">
        <div className="w-full flex items-center gap-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const isCyclic = slide.number === 9 && isLast

            return (
              <React.Fragment key={step.id}>
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                  className="flex-1 min-w-0"
                >
                  <div
                    className={`
                      p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col h-[340px]
                      ${isCyclic
                        ? 'bg-gradient-to-br from-accent/20 to-teal-50 border-2 border-accent'
                        : isModuleView
                          ? 'bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-base-blue border border-gray-100'
                          : 'bg-white border border-gray-100'
                      }
                    `}
                  >
                    {/* Decorative background icon */}
                    <div className="absolute -bottom-3 -right-3 opacity-[0.06] pointer-events-none">
                      <IconByKey icon={step.icon || getTimelineIcon(step.title, index)} size={120} color="#000039" />
                    </div>

                    {/* Step ID badge (top-right) */}
                    {(() => {
                      const label = step.id || String(index + 1)
                      const isDate = label.length > 3
                      return isDate ? (
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-br ${stepColors[index % stepColors.length]} shadow-sm`}>{label}</div>
                      ) : (
                        <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white/80 bg-gradient-to-br ${stepColors[index % stepColors.length]} opacity-60`}>{label}</div>
                      )
                    })()}

                    {/* Thematic icon */}
                    <div className="relative z-10 mb-4">
                      <div className={`w-14 h-14 rounded-xl shadow-md flex items-center justify-center bg-gradient-to-br ${stepColors[index % stepColors.length]}`}>
                        <IconByKey icon={step.icon || getTimelineIcon(step.title, index)} size={26} color="white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base-blue-dark text-xl leading-tight mb-2 relative z-10">
                      {step.title}
                    </h3>

                    {/* Description/Time */}
                    {step.description && !step.result && (
                      <p className={`text-lg relative z-10 mt-auto ${isCyclic ? 'text-accent font-semibold' : step.description.includes('Optional') ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    )}

                    {/* Result */}
                    {step.result && (
                      <div className="mt-auto relative z-10">
                        <p className="text-base text-gray-500 mb-1">{step.description}</p>
                        <div className="text-lg text-gray-700 bg-gray-50 rounded-lg p-2 border border-gray-100">
                          <span className="text-base-blue font-semibold">→</span> {step.result}
                        </div>
                      </div>
                    )}

                    {/* Cyclic indicator */}
                    {isCyclic && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-accent font-medium relative z-10">
                        <IconRefresh size={14} color="#17f0f0" /> Zyklisch
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Connector arrow — centered between cards */}
                {!isLast && (
                  <div className="shrink-0 px-1 flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isActive ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-gradient-to-r ${stepColors[index % stepColors.length]}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>}

      {/* Bottom callout - for non-agenda */}
      {!isAgenda && calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 p-3 bg-gray-50 rounded-xl text-center border border-gray-100"
        >
          <p className="text-lg text-gray-600 font-medium flex items-center justify-center gap-2">
            <IconGlühbirne size={18} color="#6b7280" /> {calloutText}
          </p>
        </motion.div>
      )}

      {/* Conclusion banner for Agenda - full width */}
      {isAgenda && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 -mx-5 p-5 bg-gradient-to-r from-base-blue to-base-blue-dark text-center shadow-lg"
        >
          <p className="text-white font-medium text-lg flex items-center justify-center gap-2">
            <IconByKey icon="dialog" size={20} color="white" /> {calloutText || 'Dies ist ein Dialog, kein Vortrag.'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default TimelineLayout
