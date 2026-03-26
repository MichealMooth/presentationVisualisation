'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey, IconBuilding, IconGlühbirne } from '../icons/SlideIcons'

interface InfographicLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for ki-beratung slide 5
const slideData: Record<string, {
  title: string
  subtitle: string
  kpis: Array<{ value: string; label: string; source: string }>
  pressurePoints: Array<{ title: string; icon: string; items: string[] }>
  callout: string
}> = {
  '05-wettbewerbsdruck-marktdynamik': {
    title: 'Der Markt wartet nicht',
    subtitle: 'Warum Abwarten ein Risiko ist',
    kpis: [
      { value: '86%', label: 'erkennen KI-Relevanz', source: 'Bitkom 2024' },
      { value: '23%', label: 'haben Projekte umgesetzt', source: 'Bitkom 2024' },
    ],
    pressurePoints: [
      {
        title: 'Wettbewerber handeln',
        icon: 'trend',
        items: [
          'Branchenübergreifend setzen KMU auf KI',
          'Wer später startet, muss schneller aufholen'
        ]
      },
      {
        title: 'Fachkräftemangel',
        icon: 'users',
        items: [
          'Weniger Mitarbeiter = höherer Produktivitätsdruck',
          'KI macht Teams leistungsfähiger'
        ]
      },
      {
        title: 'Kundenerwartungen',
        icon: 'strategie',
        items: [
          'Schnellere Antworten, individuellere Angebote',
          'Konzern-Standards werden zum KMU-Standard'
        ]
      },
      {
        title: 'Regulatorik kommt',
        icon: 'waage',
        items: [
          'EU AI Act tritt schrittweise in Kraft',
          'Frühzeitige Struktur schützt vor Aufwand'
        ]
      }
    ],
    callout: 'Die Frage ist nicht mehr ob KI, sondern ob gesteuert oder ungesteuert.'
  }
}

// Icon mapping for key-fact cards based on title keywords
const keyFactIcons: Record<string, string> = {
  'interview': 'users',
  'umfrage': 'diagramm',
  'umfragezeit': 'uhr',
  'erhebungszeitraum': 'agenda',
  'erhebung': 'agenda',
  'methodik': 'search',
  'rücklauf': 'trend',
  'nutz': 'zahnrad',
  'account': 'schild',
  'regel': 'waage',
  'daten': 'daten',
}

function getIconForTitle(title: string): string {
  const lower = title.toLowerCase()
  for (const [keyword, icon] of Object.entries(keyFactIcons)) {
    if (lower.includes(keyword)) return icon
  }
  return 'strategie'
}

// Extract a leading number/percentage from a title (e.g. "91,5% nutzen KI" → "91,5%")
function extractHighlight(title: string): { highlight: string; rest: string } | null {
  const match = title.match(/^(\d[\d,.]*\s*%?)\s+(.+)/)
  if (match) return { highlight: match[1], rest: match[2] }
  const fracMatch = title.match(/^(\d+\s+von\s+\d+)\s+(.*)/)
  if (fracMatch) return { highlight: fracMatch[1], rest: fracMatch[2] }
  return null
}

export function InfographicLayout({ slide, isActive = false }: InfographicLayoutProps) {
  const data = slideData[slide.id]
  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const kpis = data?.kpis || []
  const hardcodedPoints = data?.pressurePoints || []
  const contentAny = slide.content as Record<string, unknown> | undefined
  const parsedPoints = (!data && contentAny?.pressurePoints as Array<{ title: string; items: string[] }>) || []
  const pressurePoints = hardcodedPoints.length > 0 ? hardcodedPoints : []
  const calloutText = data?.callout || slide.content?.callout?.text

  // Use parsed key-fact cards when no hardcoded data
  // Separate notice/hint items (e.g., "Vertraulichkeit") from regular cards
  const noticeKeywords = ['vertraulichkeit', 'hinweis', 'datenschutz']
  const regularPoints = parsedPoints.filter((p: { title: string }) => !noticeKeywords.some(k => p.title.toLowerCase().includes(k)))
  const noticePoints = parsedPoints.filter((p: { title: string }) => noticeKeywords.some(k => p.title.toLowerCase().includes(k)))
  const useKeyFacts = !data && regularPoints.length > 0

  return (
    <div className="flex flex-col h-full w-full px-8 justify-center items-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-base-blue-dark/60 mt-1">{subtitle}</p>
        )}
      </motion.div>

      {/* Key-fact card grid (parsed data) */}
      {useKeyFacts && (
        <div className={`grid gap-5 max-w-[1100px] mx-auto w-full ${
          regularPoints.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
          regularPoints.length <= 4 ? 'grid-cols-1 md:grid-cols-2' :
          regularPoints.length <= 6 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {regularPoints.map((point: { title: string; items: string[] }, index: number) => {
            const cleanTitle = point.title.replace(/:$/, '')
            const extracted = extractHighlight(cleanTitle)
            const icon = getIconForTitle(cleanTitle)
            const accentColors = [
              'border-[#17f0f0]',
              'border-blue-400',
              'border-emerald-400',
              'border-amber-400',
              'border-violet-400',
              'border-rose-400',
              'border-sky-400',
            ]
            const accent = accentColors[index % accentColors.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${accent}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-base-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconByKey icon={icon} size={22} color="#001777" />
                  </div>
                  <div className="min-w-0">
                    {extracted ? (
                      <>
                        <span className="text-3xl font-extrabold text-base-blue-dark leading-tight block">
                          {extracted.highlight}
                        </span>
                        <span className="text-lg font-semibold text-base-blue-dark/80">
                          {extracted.rest}
                        </span>
                      </>
                    ) : (
                      <h4 className="text-lg font-bold text-base-blue-dark leading-snug">
                        {cleanTitle}
                      </h4>
                    )}
                  </div>
                </div>
                {point.items.length > 0 && (
                  <ul className="space-y-1 pl-1 mt-2">
                    {point.items.map((item, i) => (
                      <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-base-blue/40 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Notice banner (e.g., Vertraulichkeit) */}
      {noticePoints.length > 0 && noticePoints.map((notice: { title: string; items: string[] }, ni: number) => (
        <motion.div
          key={`notice-${ni}`}
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.7 + ni * 0.1 }}
          className="mt-4 max-w-[1100px] w-full mx-auto px-5 py-4 bg-[#001777]/5 border border-[#001777]/15 rounded-xl flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#001777]/10 flex items-center justify-center shrink-0 mt-0.5">
            <IconByKey icon="schloss" size={20} color="#001777" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#000039]/80">{notice.title.replace(/:$/, '')}</h4>
            {notice.items.map((item, i) => (
              <p key={i} className="text-base text-[#000039]/60 leading-relaxed mt-1">{item}</p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* KPI Comparison - only when KPIs exist */}
      {kpis.length >= 2 && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center items-center gap-6 mb-6"
          >
            <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl px-10 py-6 border-2 border-emerald-200 shadow-lg min-w-[220px]">
              <span className="text-6xl font-extrabold text-emerald-600">{kpis[0]?.value}</span>
              <p className="text-base text-emerald-700 mt-2 font-medium">{kpis[0]?.label}</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-red-500 text-3xl font-bold">↔</div>
              <div className="text-sm text-red-500 font-bold uppercase tracking-wide">Gap</div>
            </div>
            <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl px-10 py-6 border-2 border-red-200 shadow-lg min-w-[220px]">
              <span className="text-6xl font-extrabold text-red-500">{kpis[1]?.value}</span>
              <p className="text-base text-red-700 mt-2 font-medium">{kpis[1]?.label}</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center text-sm text-gray-500 mb-4 font-medium"
          >
            Quelle: {kpis[0]?.source}
          </motion.p>
        </>
      )}

      {/* Pressure Points with center KMU (hardcoded data only) */}
      {pressurePoints.length > 0 && (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col gap-4 w-[320px]">
            {pressurePoints.slice(0, 2).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 border-r-4 border-red-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <IconByKey icon={point.icon} size={22} color="#dc2626" />
                  </div>
                  <h4 className="font-bold text-base-blue-dark text-lg">{point.title}</h4>
                </div>
                <ul className="space-y-1 pl-1">
                  {point.items.map((item, i) => (
                    <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-base-blue to-base-blue-dark flex items-center justify-center shadow-2xl border-4 border-white"
            >
              <div className="text-center text-white flex flex-col items-center">
                <IconBuilding size={30} color="white" />
                <p className="text-sm font-bold mt-1">Ihr KMU</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </motion.div>
          </div>
          <div className="flex flex-col gap-4 w-[320px]">
            {pressurePoints.slice(2, 4).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <IconByKey icon={point.icon} size={22} color="#dc2626" />
                  </div>
                  <h4 className="font-bold text-base-blue-dark text-lg">{point.title}</h4>
                </div>
                <ul className="space-y-1 pl-1">
                  {point.items.map((item, i) => (
                    <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Callout */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-4 p-4 bg-gradient-to-r from-base-blue to-base-blue-dark rounded-xl text-center shadow-lg"
        >
          <p className="text-white font-semibold text-lg flex items-center justify-center gap-2">
            <IconGlühbirne size={20} color="white" /> {calloutText}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default InfographicLayout
