'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Slide } from '@/lib/content/schema'
import { IconByKey, IconCheck, IconDialog } from '../icons/SlideIcons'

interface MaturityLayoutProps {
  slide: Slide
  isActive?: boolean
}

// ── Tricept Reifegrad-Assessment (Folie 5 Ergebnispräsentation) ──

interface AssessmentDimension {
  name: string
  icon: string
  category: 'tragend' | 'unterstuetzend'
  currentLevel: number       // 1-based
  rangeLow?: number          // for 1-2 or 2-3 ranges
  change?: string            // e.g. "2→1-2"
  cells: string[]            // text per stufe (1-5)
}

interface AssessmentData {
  title: string
  overallLevel: number
  overallLabel: string
  subtitle: string
  stufen: Array<{ nr: number; name: string; sub: string }>
  dimensions: AssessmentDimension[]
  findings: Array<{ label: string; text: string }>
}

const assessmentDataById: Record<string, AssessmentData> = {
  '05-gesamtreifegrad-stufe-2-bewusst': {
    title: 'KI-Reifegradmodell',
    overallLevel: 2,
    overallLabel: 'Stufe 2 – Bewusst',
    subtitle: 'Konsolidierte Einschätzung auf Basis von 10 Interviews und MA-Umfrage (n=59)',
    stufen: [
      { nr: 1, name: 'Einstieg', sub: 'Kein bewusstes Thema' },
      { nr: 2, name: 'Bewusst', sub: 'Erkannt, nicht strukturiert' },
      { nr: 3, name: 'Strukturiert', sub: 'Erste Ansätze & Regeln' },
      { nr: 4, name: 'Gesteuert', sub: 'Aktiv geführt & gemessen' },
      { nr: 5, name: 'Optimierend', sub: 'Integraler Bestandteil' },
    ],
    dimensions: [
      {
        name: 'Strategie', icon: 'kompass', category: 'tragend',
        currentLevel: 2,
        cells: [
          'Kein Bezug zu Geschäftszielen',
          'Interesse, aber keine Richtung',
          'Definierte Ziele und Leitplanken',
          'Formuliert, kommuniziert, überprüft',
          'KI prägt das Geschäftsmodell',
        ],
      },
      {
        name: 'Governance', icon: 'waage', category: 'tragend',
        currentLevel: 2, rangeLow: 1, change: '2→1-2',
        cells: [
          'KI nicht adressiert',
          'Bewusstsein, informelle Absprachen',
          'Dokumentierte Grundregeln',
          'Entscheidungsprozesse & Kontrollen',
          'Kontinuierliche Weiterentwicklung',
        ],
      },
      {
        name: 'Kompetenz', icon: 'gluehbirne', category: 'tragend',
        currentLevel: 2,
        cells: [
          'Kein systematisches Verständnis',
          'Einzelne mit Grundwissen',
          'Entscheider verstehen Grundprinzipien',
          'Systematischer Kompetenzaufbau',
          'Breite KI-Literacy',
        ],
      },
      {
        name: 'Organisation', icon: 'users', category: 'unterstuetzend',
        currentLevel: 2, rangeLow: 1, change: '2→1-2',
        cells: [
          'Keine Zuständigkeiten',
          'Eine Person „nebenbei"',
          'Benannte Verantwortlichkeit',
          'In Linienorganisation eingebettet',
          'Verteilte KI-Kompetenz',
        ],
      },
      {
        name: 'Technologie', icon: 'server', category: 'unterstuetzend',
        currentLevel: 3, rangeLow: 2, change: '3→2-3',
        cells: [
          'Standard-IT, keine KI-Infra',
          'Punktuelle Nutzung, Inseln',
          'Bewusste Auswahl, erste Integration',
          'In IT-Architektur integriert',
          'Teil der IT-Strategie',
        ],
      },
      {
        name: 'Daten', icon: 'daten', category: 'unterstuetzend',
        currentLevel: 2,
        cells: [
          'Nicht als KI-Ressource betrachtet',
          'Punktuelle Kenntnis',
          'Quellen identifiziert & bewertet',
          'Datenmanagement etabliert',
          'Strategische Ressource',
        ],
      },
    ],
    findings: [
      { label: 'Shadow AI', text: '91,5% nutzen KI – 59% über private Accounts, 33% geben interne Daten ein' },
      { label: 'Governance', text: 'KI-Richtlinie de facto wirkungslos – 76% ohne klare Orientierung' },
      { label: 'Organisation', text: '10 verschiedene Antworten auf „Wer treibt KI?" – keine formale Verantwortung' },
      { label: 'Stärken', text: '68% wollen mehr KI bei klarem Rahmen, technische Infra steht' },
    ],
  },
}

// Stufen color palette
const stufeColors = [
  { bg: 'bg-gray-100', text: 'text-gray-600', headerBg: 'bg-gray-200', headerText: 'text-gray-700' },
  { bg: 'bg-blue-50', text: 'text-blue-800', headerBg: 'bg-[#c5d5e8]', headerText: 'text-[#2d3e50]' },
  { bg: 'bg-blue-100', text: 'text-blue-900', headerBg: 'bg-[#5b8db8]', headerText: 'text-white' },
  { bg: 'bg-blue-200', text: 'text-blue-950', headerBg: 'bg-[#2e5f8a]', headerText: 'text-white' },
  { bg: 'bg-blue-300', text: 'text-blue-950', headerBg: 'bg-[#1a365d]', headerText: 'text-white' },
]

// ── Generic interactive matrix (ki-beratung) ──

const maturityMatrix = [
  {
    dimension: 'Strategie',
    icon: 'kompass',
    levels: [
      'Kein explizites Thema in der Führung',
      'Interesse vorhanden, aber kein Zielbild',
      'Klare Vorstellung, was KI leisten soll',
    ],
  },
  {
    dimension: 'Nutzung',
    icon: 'zahnrad',
    levels: [
      'Keine bekannte KI-Nutzung',
      'Einzelne Anwendungen, kein Überblick',
      'Mehrere Anwendungen gesteuert im Einsatz',
    ],
  },
  {
    dimension: 'Organisation',
    icon: 'users',
    levels: [
      'Keine Zuständigkeiten definiert',
      'Einzelne kümmern sich, keine Rollen',
      'Klare Verantwortlichkeiten vorhanden',
    ],
  },
  {
    dimension: 'Wissen',
    icon: 'gluehbirne',
    levels: [
      'Wenig Wissen über KI-Möglichkeiten',
      'Grundverständnis, Unsicherheit',
      'Team schätzt Chancen/Risiken realistisch',
    ],
  },
]

const levelConfig = [
  { label: 'Stufe 1', sublabel: 'Am Anfang', bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', selected: 'bg-gray-300', colBg: 'bg-gray-100/50' },
  { label: 'Stufe 2', sublabel: 'Erste Schritte', bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', selected: 'bg-blue-200', colBg: 'bg-blue-50/50' },
  { label: 'Stufe 3', sublabel: 'Strukturiert', bg: 'bg-accent/10', border: 'border-accent', text: 'text-base-blue-dark', selected: 'bg-accent/30', colBg: 'bg-accent/10' },
]

export function MaturityLayout({ slide, isActive = false }: MaturityLayoutProps) {
  const assessmentData = assessmentDataById[slide.id]

  if (assessmentData) {
    return <AssessmentView data={assessmentData} isActive={isActive} />
  }

  return <GenericMaturityView slide={slide} isActive={isActive} />
}

// ── Assessment View (Tricept Reifegradmodell) ──

function AssessmentView({ data, isActive }: { data: AssessmentData; isActive: boolean }) {
  const tragend = data.dimensions.filter(d => d.category === 'tragend')
  const unterstuetzend = data.dimensions.filter(d => d.category === 'unterstuetzend')

  return (
    <div className="flex flex-col h-full w-full px-4 py-3 justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-baseline justify-between mb-1"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-base-blue-dark font-headline">
          {data.title}
        </h2>
        <div className="flex items-center gap-2 bg-[#c5d5e8] text-[#2d3e50] px-4 py-2 rounded-lg text-sm font-semibold">
          Gesamteinordnung:
          <span className="text-base font-bold">{data.overallLabel}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="text-sm text-gray-500 mb-3"
      >
        {data.subtitle}
      </motion.p>

      {/* Matrix */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-auto"
      >
        {/* Stufen Header */}
        <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-[3px] mb-[3px]">
          <div />
          {data.stufen.map((s, i) => (
            <div
              key={s.nr}
              className={`${stufeColors[i].headerBg} ${stufeColors[i].headerText} text-center py-2.5 px-2 rounded-t-lg`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Stufe {s.nr}</div>
              <div className="text-sm font-bold">{s.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tragende Dimensionen */}
        <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-[3px] mb-[3px]">
          <div className="col-span-6 flex items-center gap-2 pt-1 pb-0.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Tragende Dimensionen</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
        {tragend.map((dim, di) => (
          <DimensionRow key={dim.name} dim={dim} index={di} isActive={isActive} delayBase={0.25} />
        ))}

        {/* Unterstützende Dimensionen */}
        <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-[3px] mb-[3px] mt-1">
          <div className="col-span-6 flex items-center gap-2 pt-1 pb-0.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Unterstützende Dimensionen</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
        {unterstuetzend.map((dim, di) => (
          <DimensionRow key={dim.name} dim={dim} index={di} isActive={isActive} delayBase={0.35} />
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex items-center gap-5 mt-2 text-xs text-gray-500"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#dbeafe] border-2 border-[#5b8db8]" />
          Einordnung Tricept AG
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#e8f0f8] border-2 border-dashed border-[#8babc7]" />
          Untere Grenze (Spreizung)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">↓</span>
          Korrektur nach Umfrage
        </div>
      </motion.div>

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="mt-2.5 p-3 bg-gray-50 rounded-lg border-l-4 border-[#5b8db8]"
      >
        <h3 className="text-sm font-bold text-base-blue-dark uppercase tracking-wide mb-2">
          Zentrale Befunde
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {data.findings.map((f, i) => (
            <div key={i} className="text-sm text-gray-600 leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400 block">{f.label}</span>
              <span className="font-medium text-base-blue-dark">{f.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function DimensionRow({ dim, index, isActive, delayBase }: {
  dim: AssessmentDimension; index: number; isActive: boolean; delayBase: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isActive ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: delayBase + index * 0.04 }}
      className="grid grid-cols-[150px_repeat(5,1fr)] gap-[3px] mb-[3px]"
    >
      {/* Dimension label */}
      <div className={`flex items-center gap-2 pr-2 text-base font-semibold text-base-blue-dark`}>
        <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
          dim.category === 'tragend' ? 'bg-[#2e5f8a]' : 'bg-[#7ba3c4]'
        }`}>
          <IconByKey icon={dim.icon} size={14} color="white" />
        </div>
        <span className="leading-tight">
          {dim.name}
          {dim.change && (
            <span className="ml-1 inline-block bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
              ↓ {dim.change}
            </span>
          )}
        </span>
      </div>

      {/* Cells */}
      {dim.cells.map((cellText, ci) => {
        const stufeNr = ci + 1
        const isCurrent = stufeNr === dim.currentLevel
        const isRangeLow = dim.rangeLow !== undefined && stufeNr === dim.rangeLow
        const isHighlighted = isCurrent || isRangeLow

        return (
          <div
            key={ci}
            className={`
              px-2.5 py-2 text-xs leading-snug rounded-sm transition-all
              flex items-center min-h-[54px]
              ${isCurrent
                ? 'bg-[#dbeafe] border-2 border-[#5b8db8] font-semibold text-[#1a365d]'
                : isRangeLow
                ? 'bg-[#e8f0f8] border-2 border-dashed border-[#8babc7] text-[#3d5a72]'
                : 'bg-[#f8f9fb] text-gray-500'
              }
            `}
          >
            {cellText}
          </div>
        )
      })}
    </motion.div>
  )
}

// ── Generic Maturity View (interactive, for ki-beratung) ──

function GenericMaturityView({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  const [selectedByRow, setSelectedByRow] = useState<Record<number, number | null>>({})

  const handleCellClick = (rowIndex: number, levelIndex: number) => {
    setSelectedByRow(prev => ({
      ...prev,
      [rowIndex]: prev[rowIndex] === levelIndex ? null : levelIndex
    }))
  }

  return (
    <div className="flex flex-col h-full w-full px-5 justify-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark mb-2 text-center font-headline"
      >
        Wo stehen Sie?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-center text-base-blue-dark/60 mb-4 text-base"
      >
        Klicken Sie in jeder Zeile auf die Stufe, die am besten zu Ihnen passt.
      </motion.p>

      <div className="overflow-auto">
        <div className="grid grid-cols-[160px_1fr_1fr_1fr] gap-3 mb-3">
          <div />
          {levelConfig.map((level, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
              className={`p-4 text-center rounded-lg ${level.bg} border ${level.border} transition-all duration-200`}
            >
              <span className={`text-lg font-bold ${level.text}`}>{level.label}</span>
              <p className="text-sm text-gray-500 mt-1">{level.sublabel}</p>
            </motion.div>
          ))}
        </div>

        {maturityMatrix.map((row, rowIndex) => (
          <motion.div
            key={row.dimension}
            initial={{ opacity: 0, x: -15 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.25 + rowIndex * 0.06 }}
            className="grid grid-cols-[160px_1fr_1fr_1fr] gap-3 mb-3"
          >
            <div className="p-4 bg-gradient-to-r from-base-blue to-indigo-600 rounded-lg flex items-center gap-3 shadow-md">
              <IconByKey icon={row.icon} size={24} color="white" />
              <span className="font-bold text-white text-base">{row.dimension}</span>
            </div>

            {row.levels.map((level, levelIndex) => {
              const config = levelConfig[levelIndex]
              const isSelected = selectedByRow[rowIndex] === levelIndex

              return (
                <button
                  key={levelIndex}
                  onClick={() => handleCellClick(rowIndex, levelIndex)}
                  className={`
                    p-5 rounded-lg text-base leading-relaxed text-left min-h-[90px]
                    transition-all duration-200 cursor-pointer
                    hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-accent
                    ${isSelected ? `${config.selected} shadow-lg border-2` : `${config.colBg} border`}
                    ${config.border} ${config.text}
                  `}
                >
                  <span className="flex items-start gap-2">
                    {isSelected && <IconCheck size={18} />}
                    <span>{level}</span>
                  </span>
                </button>
              )
            })}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl text-center border border-gray-100 shadow-sm"
      >
        <p className="text-lg text-base-blue-dark font-medium flex items-center justify-center gap-2">
          <IconDialog size={20} color="#000039" /> „Wo würden Sie sich in diesen vier Bereichen einordnen?"
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Jeder Startpunkt ist ein guter Startpunkt.
        </p>
      </motion.div>
    </div>
  )
}

export default MaturityLayout
