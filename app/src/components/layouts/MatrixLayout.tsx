'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconKrone, IconServer, IconUser, IconSchild, IconByKey, IconGlühbirne } from '../icons/SlideIcons'
import { usePreziStore } from '@/stores/preziStore'

interface MatrixLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data with consistent color scheme
const slideData: Record<string, {
  title: string
  subtitle?: string
  cells: Array<{
    title: string
    icon: string
    items: string[]
    color: string
  }>
  callout?: string
}> = {
  '04-was-ki-fuer-kmu-konkret-leisten-kann': {
    title: 'KI im Mittelstand',
    subtitle: 'Konkrete Hebel, keine Zukunftsmusik',
    cells: [
      {
        title: 'Effizienz & Produktivität',
        icon: 'blitz',
        color: 'from-amber-400 to-orange-500',
        items: [
          'Routineaufgaben automatisieren',
          'Recherche beschleunigen',
          'Durchlaufzeiten verkürzen'
        ]
      },
      {
        title: 'Qualität & Entscheidung',
        icon: 'check',
        color: 'from-emerald-400 to-teal-500',
        items: [
          'Datenbasierte Entscheidungsvorbereitung',
          'Konsistentere Ergebnisse',
          'Fehlerreduktion durch KI-Prüfung'
        ]
      },
      {
        title: 'Mitarbeiter & Fachkräfte',
        icon: 'users',
        color: 'from-blue-400 to-indigo-500',
        items: [
          'Fachkräfte von Routine entlasten',
          'Wissenstransfer sichern',
          'Einstiegshürden senken'
        ]
      },
      {
        title: 'Wettbewerbsfähigkeit',
        icon: 'trophy',
        color: 'from-purple-400 to-pink-500',
        items: [
          'Schnellere Kundenreaktion',
          'Neue Serviceformate ermöglichen',
          'Innovation ohne große F&E'
        ]
      }
    ],
    callout: 'KI ersetzt keine Mitarbeiter – KI macht Ihre Mitarbeiter wirksamer.'
  },
  '10-was-uns-unterscheidet': {
    title: 'Unser Beratungsansatz',
    subtitle: 'Warum er für KMU funktioniert',
    cells: [
      {
        title: 'Management-Beratung',
        icon: 'strategie',
        color: 'from-rose-400 to-red-500',
        items: [
          'Wir helfen Ihnen, die richtigen Entscheidungen zu treffen',
          'KI wird steuerbar und nachvollziehbar',
          'Keine Technik-Implementierung durch uns'
        ]
      },
      {
        title: 'Herstellerunabhängig',
        icon: 'wrench',
        color: 'from-cyan-400 to-blue-500',
        items: [
          'Keine Produktempfehlungen oder Provisionen',
          'Solide Grundlage für Ihre eigene Tool-Auswahl',
          'Technologieagnostisch und offen'
        ]
      },
      {
        title: 'Für KMU gebaut',
        icon: 'building',
        color: 'from-violet-400 to-purple-500',
        items: [
          'Pragmatisch und direkt umsetzbar',
          '3 klare Regeln statt 30-Seiten-Dokumente',
          'Aufwand passend zu Ihrer Unternehmensgröße'
        ]
      },
      {
        title: 'Struktur statt Abhängigkeit',
        icon: 'ruler',
        color: 'from-teal-400 to-emerald-500',
        items: [
          'Sie steuern KI am Ende eigenständig',
          'Wir bauen Ihre internen Fähigkeiten auf',
          'Kein dauerhafter Beratungsbedarf geplant'
        ]
      }
    ],
    callout: 'Wir bauen Ihre KI-Fähigkeit auf – nicht unsere Beratungsbeziehung.'
  }
}

const genericIcons = ['blitz', 'check', 'users', 'trophy', 'strategie', 'dokument']
const genericColors = [
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-rose-400 to-red-500',
]

// Parse raw markdown into matrix cells as fallback
function parseRawMatrixCells(raw: string): Array<{ title: string; icon: string; items: string[]; color: string }> {
  const cells: Array<{ title: string; icon: string; items: string[]; color: string }> = []
  const lines = raw.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      const text = trimmed.slice(2)
      // Pattern: **Title** -- description | detail
      const boldMatch = text.match(/^\*\*([^*]+)\*\*\s*(?:--|--|-)\s*(.+)/)
      if (boldMatch) {
        const title = boldMatch[1]
        const rest = boldMatch[2]
        // Split on | for sub-items
        const parts = rest.split('|').map(p => p.trim()).filter(Boolean)
        cells.push({
          title,
          icon: genericIcons[cells.length % genericIcons.length],
          items: parts,
          color: genericColors[cells.length % genericColors.length],
        })
      }
    }
  }

  return cells
}

const perspektivenData = [
  {
    icon: IconKrone, title: 'Geschäftsführung / Vorstand', dauer: '60–90 Min.', color: '#001777', accent: '#c5d5e8',
    themen: ['Strategische Einordnung von KI', 'Erwartungen & Investitionsbereitschaft', 'Entscheidungsstrukturen'],
    vorschlag: 'Name abstimmen',
  },
  {
    icon: IconServer, title: 'IT-Verantwortung', dauer: '60 Min.', color: '#0078FE', accent: '#e0eaf4',
    themen: ['Eingesetzte KI-Dienste', 'Technische Infrastruktur', 'Datenlandschaft & IT-Sicherheit'],
    vorschlag: 'Name abstimmen',
  },
  {
    icon: IconUser, title: 'Fachbereich / Key User', dauer: '45 Min. je Gespräch', color: '#059669', accent: '#d1fae5',
    themen: ['Tatsächliche KI-Nutzung im Alltag', 'Akzeptanz & Shadow AI', 'Schmerzpunkte und Potenziale'],
    bereiche: ['ITS (IT Consulting)', 'DIS (RIMAGO/Phoenix)', 'COS (Consulting)', 'Office / Verwaltung'],
    vorschlag: 'Namen abstimmen',
  },
  {
    icon: IconSchild, title: 'Compliance / Datenschutz', dauer: '30–45 Min.', color: '#dc2626', accent: '#fee2e2',
    themen: ['Bestehende Richtlinien', 'EU AI Act, DSGVO, Branchenauflagen', 'Risikobewertung'],
    vorschlag: 'Datenschutzbeauftragter',
  },
]

export function MatrixLayout({ slide, isActive = false }: MatrixLayoutProps) {
  const goToFrame = usePreziStore((s) => s.goToFrame)

  // ─── Avaloq Migration: Datendomänen Detail ───
  if (slide.id === '03-avaloq-datendomaenen') {
    const domains = [
      { title: 'Kundenstammdaten', prefix: 'bp_', items: ['Personen & Adressen', 'KYC & Steuer', 'Klassifizierung'], icon: 'users', color: '#0078FE' },
      { title: 'Kontoführung', prefix: 'acct_', items: ['Kontostamm & Salden', 'Positionen & Limiten', 'Berechtigungen'], icon: 'daten', color: '#001777' },
      { title: 'Zahlungsverkehr', prefix: 'pay_', items: ['SEPA & SWIFT', 'Daueraufträge', 'Sanktionsprüfung'], icon: 'zahnrad', color: '#059669' },
      { title: 'Wertpapiere', prefix: 'asset_', items: ['Instrumente & Kurse', 'Depots', 'Corporate Actions'], icon: 'trend', color: '#e97316' },
      { title: 'Transaktionen', prefix: 'trx_', items: ['Buchungen & Gebühren', 'Stornierungen', 'Tagesendverarbeitung'], icon: 'rakete', color: '#DC2626' },
      { title: 'Konditionen & Reporting', prefix: 'cond_/rpt_', items: ['Zinsen & Gebühren', 'Aufsichtsmeldungen', 'Steuerreporting'], icon: 'waage', color: '#7c3aed' },
    ]
    return (
      <div className="flex flex-col h-full w-full px-10 py-6 justify-center items-center">
        <motion.button initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          onClick={() => goToFrame(1)}
          className="absolute top-6 left-8 text-sm font-semibold text-[#000039]/50 hover:text-[#000039] flex items-center gap-1 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
          Zurück
        </motion.button>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-[#000039] font-headline mb-2 text-center">
          Avaloq – Datendomänen
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isActive ? { opacity: 0.5 } : {}} transition={{ delay: 0.1 }}
          className="text-base text-[#000039]/50 mb-6">500–600 Tabellen, aufgeteilt in 6 Hauptdomänen</motion.p>
        <div className="grid grid-cols-3 gap-4 max-w-[1050px] w-full">
          {domains.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: d.color + '15' }}>
                  <IconByKey icon={d.icon} size={20} color={d.color} />
                </div>
                <div>
                  <h4 className="font-bold text-[#000039] text-sm">{d.title}</h4>
                  <code className="text-xs text-[#000039]/40 font-mono">{d.prefix}</code>
                </div>
              </div>
              <ul className="space-y-1">
                {d.items.map((item, j) => (
                  <li key={j} className="text-sm text-[#000039]/60 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color + '50' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Folie 14/15: Vier Perspektiven (mit Interview-Details) ───
  if (slide.id === '14-vier-perspektiven' || slide.id === '15-vier-perspektiven') {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-start pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline">Vier Perspektiven</h2>
          <p className="text-xl text-[#000039]/60 mt-2">Strukturierte, dialogische Interviews — keine Prüfungssituation</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-5">
          {perspektivenData.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="rounded-xl bg-white border border-gray-100 shadow-md p-6"
                style={{ borderTop: `4px solid ${p.color}` }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: p.accent }}>
                    <Icon size={28} color={p.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#000039] text-xl leading-tight">{p.title}</h3>
                  </div>
                  <span className="text-sm px-3 py-1.5 rounded-full font-medium flex-shrink-0" style={{ background: p.accent, color: p.color }}>{p.dauer}</span>
                </div>

                {/* Themen */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.themen.map((t, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isActive ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.25 + i * 0.1 + j * 0.04 }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                      style={{ borderColor: p.color + '25', background: p.color + '08', color: p.color }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>

                {/* Bereiche (nur Fachbereich) */}
                {'bereiche' in p && p.bereiche && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.bereiche.map((b, j) => (
                      <span key={j} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-sm text-[#000039]/60">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {/* Vorschlag */}
                {'vorschlag' in p && p.vorschlag && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg mt-1" style={{ background: p.accent }}>
                    <IconUser size={16} color={p.color} />
                    <span className="text-sm" style={{ color: p.color }}>
                      <strong>Vorschlag:</strong> {p.vorschlag}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Unternehmensprofil ───
  if (slide.id === '04-unternehmensprofil-rueckspiegelung') {
    const profileCells = slide.content?.matrix || []
    const profileIcons = ['building', 'users', 'zahnrad', 'server', 'gluehbirne', 'waage']
    const profileColors = [
      'from-blue-500 to-indigo-600',
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
    ]
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-5"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">{slide.displayTitle || slide.title}</h2>
          <p className="text-lg text-base-blue-dark/50 mt-1">Konsolidiertes Profil auf Basis der Erhebungen, März 2026</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
          {profileCells.map((cell: { title: string; items: string[] }, i: number) => {
            const icon = profileIcons[i] || 'building'
            const color = profileColors[i] || profileColors[0]
            const cleanTitle = cell.title.replace(/:$/, '')
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.12 + i * 0.07 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-md p-5 relative overflow-hidden"
              >
                <div className="absolute -bottom-2 -right-2 opacity-[0.05] pointer-events-none">
                  <IconByKey icon={icon} size={90} color="#000039" />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-11 h-11 rounded-xl shadow-sm flex items-center justify-center shrink-0 bg-gradient-to-br ${color}`}>
                    <IconByKey icon={icon} size={22} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#000039] text-base leading-tight mb-1">{cleanTitle}</h3>
                    <p className="text-base text-[#000039]/60 leading-relaxed">{cell.items[0] || ''}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const data = slideData[slide.id]

  // Fallback: parse rawMarkdown if no predefined data and no parsed matrix cells
  const parsedCells = slide.content?.matrix || []
  const rawCells = !data && parsedCells.length === 0 && slide.content?.rawMarkdown
    ? parseRawMatrixCells(slide.content.rawMarkdown)
    : []

  const cells = data?.cells || (parsedCells.length > 0
    ? parsedCells.map((c: { title: string; items: string[] }, i: number) => ({
        ...c,
        icon: genericIcons[i % genericIcons.length],
        color: genericColors[i % genericColors.length],
      }))
    : rawCells)

  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const calloutText = data?.callout || slide.content?.callout?.text
  const introText = !data && slide.content?.rawMarkdown
    ? slide.content.rawMarkdown.split('\n').find((l: string) => l.trim() && !l.trim().startsWith('-'))?.trim()
    : undefined

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-5"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
        {(subtitle || introText) && (
          <p className="text-xl text-base-blue-dark/60 mt-1">{subtitle || introText}</p>
        )}
      </motion.div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-5">
        {cells.map((cell, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group min-h-[220px]"
          >
            {/* Color bar - matches icon color */}
            <div className={`h-2 bg-gradient-to-r ${cell.color}`} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Icon with matching gradient */}
                <div className={`
                  w-14 h-14 rounded-xl shadow-md
                  bg-gradient-to-br ${cell.color}
                  flex items-center justify-center
                  group-hover:scale-105 transition-transform
                `}>
                  <IconByKey icon={cell.icon} size={28} color="white" />
                </div>
                <h3 className="flex-1 font-bold text-base-blue-dark text-xl leading-tight pt-3">
                  {cell.title}
                </h3>
              </div>

              {/* Items */}
              <ul className="space-y-2.5">
                {cell.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.35 + index * 0.08 + i * 0.04 }}
                    className="text-lg text-gray-600 flex items-start gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${cell.color}`} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Callout - full width */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-5 -mx-6 p-5 bg-gradient-to-r from-base-blue to-base-blue-dark text-center shadow-lg"
        >
          <p className="text-white font-semibold text-lg flex items-center justify-center gap-2">
            <IconGlühbirne size={20} color="white" /> {calloutText}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default MatrixLayout
