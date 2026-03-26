'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconWarnung, IconCheck, IconSchild, IconRakete } from '../icons/SlideIcons'

interface ComparisonLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for specific slides
const slideData: Record<string, {
  title: string
  items: Array<{
    title: string
    description: string
    type: 'negative' | 'positive'
  }>
  callout?: string
  transition?: string
}> = {
  '07-typische-fehlstarts-und-was-sie-kosten': {
    title: 'Vier Wege, wie KI-Einführung schiefgeht',
    items: [
      {
        title: '„Wir brauchen ein KI-Tool"',
        description: 'Tool im Fokus statt Problem → Geringe Nutzung, Frustration.',
        type: 'negative'
      },
      {
        title: '„Einfach mal ausprobieren"',
        description: 'Piloten ohne Strategie → Einzelerfolge versanden.',
        type: 'negative'
      },
      {
        title: '„Das macht die IT"',
        description: 'KI als Tech-Projekt → Organisatorisch nicht verankert.',
        type: 'negative'
      },
      {
        title: '„Wir regeln das später"',
        description: 'Governance aufgeschoben → Risiken wachsen.',
        type: 'negative'
      },
    ],
    callout: 'Jeder dieser Wege kostet Zeit, Geld und Vertrauen. Struktur von Anfang an verhindert das.'
  },
  '08-was-erfolgreiche-ki-einfuehrung-ausmacht': {
    title: 'Was Unternehmen richtig machen',
    transition: 'Im Gegensatz dazu:',
    items: [
      {
        title: 'Struktur vor Tools',
        description: 'Erst verstehen, dann auswählen. Ziele und Rahmenbedingungen klären – dann Lösungen suchen.',
        type: 'positive'
      },
      {
        title: 'KI ist Führungsthema',
        description: 'Geschäftsführung steuert Richtung und Grenzen. IT setzt um, Führung entscheidet.',
        type: 'positive'
      },
      {
        title: 'Fokus statt Breite',
        description: 'Wenige, gut gewählte Anwendungsfälle mit klarem Nutzen – statt langer Wunschlisten.',
        type: 'positive'
      },
      {
        title: 'Dauerhafte Führungsaufgabe',
        description: 'KI-Einführung hat Anfang. KI-Führung nicht. Steuerungsmodell, das bleibt.',
        type: 'positive'
      },
    ],
    callout: 'Genau dafür haben wir ein Vorgehensmodell entwickelt.'
  }
}

// Parse rawMarkdown into comparison columns (Vorher/Jetzt or similar dual-section format)
function parseRawComparison(raw: string): { columns: Array<{ title: string; items: string[]; type: 'negative' | 'positive' | 'neutral' }>; intro?: string } {
  const columns: Array<{ title: string; items: string[]; type: 'negative' | 'positive' | 'neutral' }> = []
  let intro: string | undefined

  // Split by **Section:** headers
  const parts = raw.split(/(?=\*\*[^*]+:\*\*)/)
  for (const part of parts) {
    const headerMatch = part.match(/^\*\*([^*]+):\*\*/)
    if (headerMatch) {
      const sectionTitle = headerMatch[1].trim()
      const items: string[] = []
      const lines = part.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          items.push(trimmed.slice(2))
        }
      }
      if (items.length > 0) {
        const lower = sectionTitle.toLowerCase()
        const type = lower.includes('vorher') || lower.includes('alt') || lower.includes('problem')
          ? 'negative' as const
          : lower.includes('jetzt') || lower.includes('neu') || lower.includes('lösung') || lower.includes('loesung') || lower.includes('gut') || lower.includes('positiv') || lower.includes('bewährt') || lower.includes('bewaehrt')
            ? 'positive' as const
            : 'neutral' as const
        columns.push({ title: sectionTitle, items, type })
      }
    } else {
      // Text before any header is intro
      const text = part.trim()
      if (text && !text.startsWith('-')) {
        intro = text.split('\n')[0].trim()
      }
    }
  }

  return { columns, intro }
}

export function ComparisonLayout({ slide, isActive = false }: ComparisonLayoutProps) {
  const data = slideData[slide.id]
  const title = data?.title || slide.displayTitle || slide.title
  // Use parsed comparison data from JSON before falling back to rawMarkdown
  const parsedComparison = !data ? ((slide.content as Record<string, unknown>)?.comparison as Array<{ title: string; description: string; type: string; items: string[] }>) : undefined
  const items = data?.items || (parsedComparison && parsedComparison.length > 0 ? parsedComparison : [])
  const calloutText = data?.callout || slide.content?.callout?.text
  const transition = data?.transition

  // Fallback: parse rawMarkdown for comparison columns
  const rawComparison = !data && items.length === 0 && slide.content?.rawMarkdown
    ? parseRawComparison(slide.content.rawMarkdown)
    : null

  const isNegativeSlide = slide.number === 7 || slide.id?.includes('fehlstarts') || (parsedComparison && parsedComparison.every(i => i.type === 'negative'))
  const isGapAnalysis = !data && parsedComparison && parsedComparison.length >= 4 && parsedComparison.every(i => i.type === 'negative')
  const isColumnMode = !data && !isGapAnalysis && rawComparison && rawComparison.columns.length >= 2

  // ─── Gap Analysis mode: Erwartung → Realität table ───
  if (isGapAnalysis && parsedComparison) {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
            {title}
          </h2>
        </motion.div>
        {/* Table header */}
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-[1fr_auto_1.4fr] gap-0 mb-2">
            <div className="px-4 py-3 bg-[#001777] rounded-tl-xl">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Erwartung</span>
            </div>
            <div className="w-10" />
            <div className="px-4 py-3 bg-[#8B0000] rounded-tr-xl">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Realität</span>
            </div>
          </div>
          {/* Gap rows */}
          <div className="space-y-1.5">
            {parsedComparison.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                className="grid grid-cols-[1fr_auto_1.4fr] gap-0 group"
              >
                {/* Erwartung (left) */}
                <div className="bg-[#001777]/5 border border-[#001777]/15 rounded-l-xl px-4 py-3 flex items-center">
                  <p className="text-base text-[#000039] font-medium leading-snug">
                    <span className="text-[#001777]">&ldquo;</span>{item.title.replace(/^["„]+|["":]+$/g, '').trim()}<span className="text-[#001777]">&rdquo;</span>
                  </p>
                </div>
                {/* Arrow */}
                <div className="w-10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-400">
                    <path d="M5 12h14m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Realität (right) */}
                <div className="bg-red-50 border border-red-200 rounded-r-xl px-4 py-3">
                  {(() => {
                    const subItems = (item as Record<string, unknown>).items as string[] | undefined
                    return subItems && subItems.length > 0 ? (
                      <p className="text-base text-red-800 leading-snug">{subItems[0]}</p>
                    ) : null
                  })()}
                  {item.description && (
                    <p className="text-sm text-red-600 font-semibold mt-1">→ {item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {calloutText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-4 p-4 rounded-xl text-center shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white max-w-6xl w-full"
          >
            <p className="font-semibold text-lg">{calloutText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Column comparison mode (Vorher/Jetzt)
  if (isColumnMode && rawComparison) {
    return (
      <div className="flex flex-col h-full w-full px-8 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
            {title}
          </h2>
          {rawComparison.intro && (
            <p className="text-xl text-base-blue-dark/60 mt-2">{rawComparison.intro}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-8">
          {rawComparison.columns.map((col, colIdx) => {
            const isNeg = col.type === 'negative'
            const isPos = col.type === 'positive'
            return (
              <motion.div
                key={colIdx}
                initial={{ opacity: 0, x: colIdx === 0 ? -20 : 20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + colIdx * 0.15 }}
                className={`
                  rounded-xl p-6 shadow-lg
                  ${isNeg
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-red-300'
                    : isPos
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300'
                      : 'bg-white border border-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white ${isNeg ? 'bg-gradient-to-br from-red-400 to-orange-500' : isPos ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gray-400'}`}>
                    {isNeg ? <IconWarnung size={20} color="white" /> : isPos ? <IconCheck size={20} color="white" /> : <span>&#8226;</span>}
                  </div>
                  <h3 className={`text-xl font-bold ${isNeg ? 'text-red-700' : isPos ? 'text-emerald-700' : 'text-base-blue-dark'}`}>
                    {col.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {col.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isActive ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.35 + colIdx * 0.15 + i * 0.05 }}
                      className={`flex items-start gap-2 text-lg ${isNeg ? 'text-red-700' : isPos ? 'text-emerald-700' : 'text-gray-700'}`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isNeg ? 'bg-red-400' : isPos ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {calloutText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-5 p-4 rounded-xl text-center shadow-lg bg-gradient-to-r from-base-blue to-base-blue-dark text-white"
          >
            <p className="font-semibold text-lg">{calloutText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full px-8 justify-center">
      {/* Transition hint for positive slide */}
      {transition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-lg font-semibold">
            {transition}
          </span>
        </motion.div>
      )}

      {/* Title with icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-5"
      >
        <span className="mb-2 block flex justify-center">{isNegativeSlide ? <IconWarnung size={36} color="#dc2626" /> : <IconCheck size={36} color="#059669" />}</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
      </motion.div>

      {/* Grid of items */}
      <div className={`grid ${items.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-5`}>
        {items.map((item, index) => {
          const isNegative = item.type === 'negative'
          const subItems = (item as Record<string, unknown>).items as string[] | undefined
          const isRecommended = item.title.includes('★') || item.title.toLowerCase().includes('empfohlen')

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              className={`
                relative p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
                ${isRecommended
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-accent ring-2 ring-accent/30 shadow-lg shadow-accent/20'
                  : isNegative
                    ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 shadow-lg shadow-red-200'
                    : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-lg shadow-emerald-200'
                }
              `}
            >
              {/* Empfohlen badge */}
              {isRecommended && (
                <div className="absolute -top-3 right-4 bg-accent text-base-blue-dark text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
                  ★ Empfohlen
                </div>
              )}

              {/* Large icon badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.08, type: 'spring' }}
                className={`
                  absolute -top-4 -left-3 w-14 h-14 rounded-xl shadow-lg
                  flex items-center justify-center text-2xl font-bold
                  ${isNegative
                    ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                  }
                `}
              >
                {isNegative ? <IconWarnung size={24} color="white" /> : <IconCheck size={24} color="white" />}
              </motion.div>

              {/* Content */}
              <div className="mt-4">
                {/* Title - bold, prominent */}
                <h3 className={`
                  font-bold text-2xl mb-3 leading-tight
                  ${isNegative ? 'text-red-800' : 'text-emerald-800'}
                `}>
                  {item.title}
                </h3>

                {/* Sub-items (e.g., Realität details or package features) */}
                {subItems && subItems.length > 0 && (
                  <ul className={`space-y-1 mb-3 ${isNegative ? 'text-red-700/80' : 'text-emerald-700/80'}`}>
                    {subItems.map((si, i) => (
                      <li key={i} className="flex items-start gap-2 text-base">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isNegative ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        <span>{si}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Separator */}
                <div className={`w-12 h-1 mb-3 rounded ${isNegative ? 'bg-red-300' : 'bg-emerald-300'}`} />

                {/* Description */}
                <p className={`
                  text-lg leading-relaxed font-medium
                  ${isNegative ? 'text-red-700' : 'text-emerald-700'}
                `}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Callout */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`
            mt-5 p-4 rounded-xl text-center shadow-lg
            ${isNegativeSlide
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white'
              : 'bg-gradient-to-r from-base-blue to-base-blue-dark text-white'
            }
          `}
        >
          <p className="font-semibold text-lg flex items-center justify-center gap-2">
            {isNegativeSlide ? <IconSchild size={20} color="white" /> : <IconRakete size={20} color="white" />} {calloutText}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default ComparisonLayout
