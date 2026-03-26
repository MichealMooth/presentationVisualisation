'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface GanttLayoutProps {
  slide: Slide
  isActive?: boolean
}

interface GanttItem {
  label: string
  start: number
  end: number
  status: 'done' | 'active' | 'planned'
}

interface GanttTrack {
  label: string
  color: string
  items: GanttItem[]
  oldPlan?: GanttItem[]
}

interface GanttData {
  title: string
  subtitle?: string
  months: string[]
  tracks: GanttTrack[]
  absences: GanttItem[]
  footnotes: string[]
  callout?: string
}

const slideDataById: Record<string, GanttData> = {
  '13-aktualisierter-zeitplan': {
    title: 'Aktualisierter Zeitplan',
    subtitle: 'Zwei Spuren: Interne Ausarbeitung und Verprobung bei Tricept',
    months: ['Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul'],
    tracks: [
      {
        label: 'Ausarbeitung (intern)',
        color: '#11EF94',
        items: [
          { label: 'M1', start: 0, end: 1, status: 'done' },
          { label: 'M2', start: 2, end: 3, status: 'planned' },
          { label: 'M3', start: 3, end: 3.8, status: 'planned' },
          { label: 'M4+M5', start: 3.8, end: 4.5, status: 'planned' },
        ],
        oldPlan: [
          { label: 'M2', start: 0.9, end: 1.3, status: 'planned' },
          { label: 'M3', start: 1.9, end: 2.7, status: 'planned' },
          { label: 'M4', start: 2.9, end: 3.5, status: 'planned' },
          { label: 'M5', start: 3.8, end: 4.2, status: 'planned' },
        ],
      },
      {
        label: 'Verprobung Tricept',
        color: '#16EFEF',
        items: [
          { label: 'Kick-off + Interviews', start: 0, end: 1.5, status: 'done' },
          { label: 'M1-Auswertung', start: 1.5, end: 2, status: 'active' },
          { label: 'M2 Tricept', start: 3, end: 3.8, status: 'planned' },
          { label: 'M3 Tricept', start: 3.8, end: 4.5, status: 'planned' },
          { label: 'M4+M5', start: 4.5, end: 5, status: 'planned' },
        ],
        oldPlan: [
          { label: 'M2', start: 1, end: 2, status: 'planned' },
          { label: 'M3', start: 2.5, end: 3.5, status: 'planned' },
          { label: 'M4+M5', start: 3.5, end: 4.5, status: 'planned' },
        ],
      },
    ],
    absences: [
      { label: 'Urlaub Markus', start: 1.3, end: 1.9, status: 'planned' },
      { label: 'Urlaub Johannes', start: 2, end: 2.55, status: 'planned' },
    ],
    footnotes: [
      'Gesamtverschiebung: ca. 4–6 Wochen',
      'Alle Termine vorbehaltlich finaler Bestätigung',
    ],
    callout: 'Ziel bleibt: Praxistaugliches und erprobtes Konzept inkl. aller Materialien, um direkt bei einem Kunden zu starten.',
  },
}

export function GanttLayout({ slide, isActive = false }: GanttLayoutProps) {
  const data = slideDataById[slide.id]
  if (!data) {
    return (
      <div className="flex flex-col h-full w-full px-8 justify-center items-center">
        <h2 className="text-3xl font-bold text-base-blue-dark font-headline">
          {slide.displayTitle || slide.title}
        </h2>
        <p className="text-lg text-gray-500 mt-4">Gantt-Daten nicht gefunden für: {slide.id}</p>
      </div>
    )
  }

  const totalMonths = data.months.length

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-xl text-base-blue-dark/60 mt-1">{data.subtitle}</p>
        )}
      </motion.div>

      {/* Gantt Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-[1400px] mx-auto w-full"
      >
        {/* Month headers */}
        <div className="flex mb-4">
          <div className="w-56 shrink-0" />
          <div className="flex-1 flex">
            {data.months.map((month, i) => (
              <div
                key={i}
                className="flex-1 text-center text-base font-bold uppercase tracking-wider"
                style={{ color: '#001777', opacity: 0.5 }}
              >
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Tracks */}
        {data.tracks.map((track, ti) => (
          <motion.div
            key={ti}
            initial={{ opacity: 0, x: -15 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + ti * 0.12 }}
            className="flex items-center mb-4"
          >
            {/* Track label */}
            <div className="w-56 shrink-0 pr-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded"
                  style={{ background: track.color }}
                />
                <span className="text-base font-bold text-[#000039]">
                  {track.label}
                </span>
              </div>
            </div>

            {/* Track bar area */}
            <div className="flex-1 relative h-28 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              {/* Month grid lines */}
              {data.months.map((_, i) =>
                i > 0 ? (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-gray-200/60"
                    style={{ left: `${(i / totalMonths) * 100}%` }}
                  />
                ) : null
              )}

              {/* Old plan bars (dashed, top row) */}
              {track.oldPlan?.map((item, i) => (
                <div
                  key={`old-${i}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${(item.start / totalMonths) * 100}%`,
                    width: `${((item.end - item.start) / totalMonths) * 100}%`,
                    top: '8px',
                    height: '28px',
                    borderRadius: '5px',
                    border: '2px dashed #b0b8c9',
                    background: 'rgba(176,184,201,0.06)',
                    zIndex: 1,
                  }}
                >
                  <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}

              {/* Row label for old plan */}
              {track.oldPlan && track.oldPlan.length > 0 && (
                <div className="absolute right-2 text-xs text-gray-300 font-semibold uppercase tracking-wider" style={{ top: '12px' }}>
                  Feb-Plan
                </div>
              )}

              {/* New plan bars (bottom row) */}
              {track.items.map((item, i) => {
                const isDone = item.status === 'done'
                const isActive_ = item.status === 'active'
                return (
                  <motion.div
                    key={`new-${i}`}
                    initial={{ scaleX: 0 }}
                    animate={isActive ? { scaleX: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + ti * 0.12 + i * 0.08,
                      ease: 'easeOut',
                    }}
                    className="absolute flex items-center justify-center shadow-sm"
                    style={{
                      left: `${(item.start / totalMonths) * 100}%`,
                      width: `${((item.end - item.start) / totalMonths) * 100}%`,
                      bottom: '8px',
                      height: '38px',
                      borderRadius: '8px',
                      background: isDone
                        ? track.color
                        : isActive_
                          ? `linear-gradient(135deg, ${track.color}cc, ${track.color}88)`
                          : `${track.color}35`,
                      border: `2px solid ${track.color}`,
                      transformOrigin: 'left center',
                      zIndex: 2,
                    }}
                  >
                    <span
                      className="text-sm font-bold whitespace-nowrap px-1"
                      style={{
                        color: isDone || isActive_ ? '#000039' : '#374151',
                        textShadow: isDone ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                      }}
                    >
                      {item.label}
                    </span>
                    {isDone && (
                      <span className="ml-1 flex-shrink-0">
                        <IconByKey icon="check" size={14} color="#000039" />
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Absences track */}
        {data.absences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex items-center mb-4"
          >
            <div className="w-56 shrink-0 pr-4">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded bg-gray-300" />
                <span className="text-base font-bold text-[#000039]">
                  Abwesenheiten
                </span>
              </div>
            </div>
            <div className="flex-1 relative h-14 bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100/50">
              {data.months.map((_, i) =>
                i > 0 ? (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-gray-200/30"
                    style={{ left: `${(i / totalMonths) * 100}%` }}
                  />
                ) : null
              )}
              {data.absences.map((item, i) => (
                <div
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${(item.start / totalMonths) * 100}%`,
                    width: `${((item.end - item.start) / totalMonths) * 100}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '28px',
                    borderRadius: '6px',
                    background:
                      'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(156,163,175,0.18) 3px, rgba(156,163,175,0.18) 6px)',
                    border: '1.5px solid #d1d5db',
                  }}
                >
                  <span className="text-sm text-gray-500 font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div
          className="flex items-center flex-wrap gap-5 mt-3 pt-4 border-t border-gray-100"
          style={{ fontSize: '15px', color: '#6b7280' }}
        >
          {data.tracks.map((track, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                style={{
                  width: '22px',
                  height: '12px',
                  borderRadius: '4px',
                  background: track.color,
                }}
              />
              <span>{track.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '22px',
                height: '12px',
                borderRadius: '4px',
                border: '2px dashed #9ca3af',
              }}
            />
            <span>Alter Plan (Feb)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '22px',
                height: '12px',
                borderRadius: '4px',
                background:
                  'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.3) 2px, rgba(156,163,175,0.3) 4px)',
                border: '1px solid #d1d5db',
              }}
            />
            <span>Abwesenheiten</span>
          </div>
        </div>
      </motion.div>

      {/* Callout */}
      {data.callout && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-4 p-4 rounded-xl text-center shadow-lg bg-gradient-to-r from-base-blue to-base-blue-dark text-white max-w-[1400px] mx-auto w-full"
        >
          <p className="font-semibold text-xl">{data.callout}</p>
        </motion.div>
      )}

      {/* Footnotes */}
      {data.footnotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-2 text-center max-w-[1400px] mx-auto"
        >
          {data.footnotes.map((fn, i) => (
            <p key={i} className="text-base text-base-blue-dark/40">
              {fn}
            </p>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default GanttLayout
