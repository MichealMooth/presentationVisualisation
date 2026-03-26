'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconVersteckt, IconPuzzle, IconDiagramm, IconAuge, IconBuilding, IconWelle, IconWarnung, IconCheck } from '../icons/SlideIcons'

interface IcebergLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for ki-beratung slide 6
const slideData: Record<string, {
  title: string
  subtitle: string
  kpi: { value: string; label: string; source: string }
  sections: Array<{ title: string; subtitle: string; icon: string; items: string[] }>
  callout: string
}> = {
  '06-wo-kmu-wirklich-stehen-der-realitaetscheck': {
    title: 'Die Realität in den meisten KMU',
    subtitle: 'Ehrlich betrachtet',
    kpi: { value: '57%', label: 'der Mitarbeiter nutzen bereits KI-Tools – oft ohne Wissen der Führung', source: 'Salesforce 2024' },
    sections: [
      {
        title: 'Shadow-AI',
        subtitle: 'Ihre Mitarbeiter nutzen KI bereits',
        icon: 'versteckt',
        items: [
          'ChatGPT, Übersetzungstools, Office-KI',
          'Pragmatische Problemlösung, keine böse Absicht',
          'Risiko: Unkontrollierter Datenfluss'
        ]
      },
      {
        title: 'Insellösungen',
        subtitle: 'Statt Gesamtbild',
        icon: 'puzzle',
        items: [
          'Teams experimentieren ohne Austausch',
          'Kein Überblick über KI im Einsatz',
          'Doppelarbeit, verlorenes Wissen'
        ]
      },
      {
        title: 'Erwartungs-Gap',
        subtitle: 'GF vs. Mitarbeiter',
        icon: 'diagramm',
        items: [
          'GF: schnelle Ergebnisse erwartet',
          'MA: Bedrohung oder Allheilmittel',
          'Beide führen zu Fehlentscheidungen'
        ]
      }
    ],
    callout: 'Das ist kein Defizit – das ist der typische Startpunkt. Entscheidend ist, jetzt Struktur zu schaffen.'
  }
}

export function IcebergLayout({ slide, isActive = false }: IcebergLayoutProps) {
  const data = slideData[slide.id]
  const contentAny = slide.content as Record<string, unknown> | undefined
  const parsedIceberg = contentAny?.iceberg as Array<{ title: string; position: string; items: string[] }> | undefined
  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const kpi = data?.kpi
  const calloutText = data?.callout || slide.content?.callout?.text

  // Use parsed iceberg data if no hardcoded data
  if (!data && parsedIceberg && parsedIceberg.length > 0) {
    const above = parsedIceberg.filter(s => s.position === 'above')
    const belowRaw = parsedIceberg.filter(s => s.position === 'below')
    // Extract Randnotiz items from below sections
    const randnotizItems: string[] = []
    const below = belowRaw.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (item.startsWith('Randnotiz:')) {
          randnotizItems.push(item.replace(/^Randnotiz:\s*/, ''))
          return false
        }
        return true
      })
    }))
    return (
      <div className="flex flex-col h-full max-w-6xl mx-auto px-4 justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">{title}</h2>
        </motion.div>
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl">
          {/* Above water */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-gradient-to-b from-emerald-50 to-emerald-100 p-5"
          >
            <div className="absolute top-2 left-4 flex items-center gap-1 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <IconAuge size={14} color="#047857" /> Sichtbar
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 max-w-3xl mx-auto">
              {above.map((section, si) => (
                <div key={si}>
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-4 bg-white/80 rounded-lg mb-1.5 shadow-sm">
                      <IconCheck size={16} color="#059669" />
                      <span className="text-base text-emerald-800">{item.replace(/[✓✔]/g, '').trim()}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
          {/* Waterline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isActive ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 flex items-center justify-center relative z-10"
          >
            <span className="bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full font-bold">Wasserlinie</span>
          </motion.div>
          {/* Below water */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-b from-blue-800 to-slate-900 p-5 relative"
          >
            <div className="absolute top-2 left-4 flex items-center gap-1 text-xs font-bold text-blue-300 uppercase tracking-wide z-10">
              <IconWelle size={14} color="#93c5fd" /> Verborgen
            </div>
            <div className="mt-5 grid grid-cols-1 gap-1.5 max-w-3xl mx-auto">
              {below.map((section, si) => (
                <div key={si}>
                  {section.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={isActive ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.55 + i * 0.06 }}
                      className="flex items-start gap-2 py-1.5 px-4 bg-white/10 rounded-lg"
                    >
                      <span className="flex-shrink-0 mt-0.5"><IconWarnung size={16} color="#fcd34d" /></span>
                      <span className="text-base text-blue-100">{item}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Randnotiz callout */}
        {randnotizItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-3 p-4 bg-accent/20 border-2 border-accent rounded-xl shadow-md"
          >
            {randnotizItems.map((note, i) => (
              <p key={i} className="text-blue-100 text-base font-medium flex items-start gap-2">
                <span className="text-accent font-bold shrink-0">Randnotiz:</span>
                <span className="text-base-blue-dark">{note}</span>
              </p>
            ))}
          </motion.div>
        )}
        {calloutText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-3 p-4 bg-gradient-to-r from-base-blue to-base-blue-dark rounded-xl text-center shadow-lg"
          >
            <p className="text-white font-medium text-lg">{calloutText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  const sections = data?.sections || []

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto px-4 justify-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
        {subtitle && <p className="text-xl text-base-blue-dark/60 mt-1">{subtitle}</p>}
      </motion.div>

      {/* Iceberg visualization - simplified */}
      <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl">

        {/* Above water - visible */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-32 bg-gradient-to-b from-sky-100 to-sky-200 flex items-center justify-center"
        >
          {/* Label */}
          <div className="absolute top-2 left-4 flex items-center gap-1 text-xs font-bold text-sky-700 uppercase tracking-wide">
            <IconAuge size={14} color="#0369a1" /> Sichtbar
          </div>

          {/* Official usage */}
          <div className="bg-white/90 backdrop-blur rounded-xl px-6 py-3 shadow-md border border-sky-200">
            <p className="text-sm text-sky-800 font-medium flex items-center gap-2"><IconBuilding size={16} color="#075985" /> Offizielle KI-Nutzung im Unternehmen</p>
          </div>
        </motion.div>

        {/* Waterline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 flex items-center justify-center relative z-10"
        >
          <span className="bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full font-bold">
            Wasserlinie
          </span>
        </motion.div>

        {/* Below water - hidden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-b from-blue-800 to-slate-900 p-5 relative"
        >
          {/* Label */}
          <div className="absolute top-2 left-4 flex items-center gap-1 text-xs font-bold text-blue-300 uppercase tracking-wide z-10">
            <IconWelle size={14} color="#93c5fd" /> Verborgen
          </div>

          {/* KPI - full width banner at top */}
          {kpi && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mb-4 mt-6 bg-gradient-to-r from-accent/30 via-accent/20 to-accent/30 rounded-xl px-8 py-5 border border-accent/50"
            >
              <div className="flex items-center justify-center gap-6">
                <span className="text-6xl font-extrabold text-accent">{kpi.value}</span>
                <div className="text-left">
                  <p className="text-lg text-blue-100 leading-snug">{kpi.label}</p>
                  <p className="text-sm text-blue-300/70 mt-1">Quelle: {kpi.source}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hidden sections - 3 cards */}
          <div className="grid grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.65 + index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-colors min-w-[280px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  {section.icon === 'versteckt' ? <IconVersteckt size={24} color="white" /> : section.icon === 'puzzle' ? <IconPuzzle size={24} color="white" /> : <IconDiagramm size={24} color="white" />}
                  <div>
                    <h4 className="font-bold text-white text-lg">{section.title}</h4>
                    <p className="text-xs text-blue-200">{section.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-base text-blue-100 flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5"><IconWarnung size={16} color="#fcd34d" /></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Callout - matching blue scheme */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-4 p-4 bg-gradient-to-r from-base-blue to-base-blue-dark rounded-xl text-center shadow-lg"
        >
          <p className="text-white font-medium text-lg flex items-center justify-center gap-2">
            <IconCheck size={20} color="white" /> {calloutText}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default IcebergLayout
