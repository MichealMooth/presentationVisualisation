'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface SeverityListLayoutProps {
  slide: Slide
  isActive?: boolean
}

function parseItems(raw: string): Array<{ title: string; description?: string; isSection?: boolean }> {
  const items: Array<{ title: string; description?: string; isSection?: boolean }> = []
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      const text = trimmed.slice(2)
      const boldOnly = text.match(/^\*\*([^*]+)\*\*(.*)/)
      if (boldOnly) {
        items.push({ title: boldOnly[1].replace(/:$/, ''), description: boldOnly[2].replace(/^\s*[:|\-]\s*/, '').trim() || undefined })
      } else {
        items.push({ title: text })
      }
    } else {
      const sectionMatch = trimmed.match(/^\*\*([^*]+)\*\*[:\s]*$/)
      if (sectionMatch) {
        items.push({ title: sectionMatch[1].replace(/:$/, ''), isSection: true })
      }
    }
  }
  return items
}

type SeverityLevel = 'hoch' | 'mittel' | 'niedrig'

function parseSeverity(title: string): { severity: SeverityLevel; cleanTitle: string } {
  const match = title.match(/^(Hoch|Mittel|Niedrig|Priorität\s*\d):\s*/i)
  if (match) {
    const raw = match[1].toLowerCase()
    let severity: SeverityLevel = 'mittel'
    if (raw === 'hoch' || raw.includes('1')) severity = 'hoch'
    else if (raw === 'niedrig' || raw.includes('3')) severity = 'niedrig'
    return { severity, cleanTitle: title.slice(match[0].length) }
  }
  return { severity: 'mittel', cleanTitle: title }
}

const severityConfig: Record<SeverityLevel, { badge: string; bg: string; border: string; iconBg: string; iconColor: string; label: string }> = {
  hoch: { badge: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-500/15', iconColor: '#ef4444', label: 'Hoch' },
  mittel: { badge: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-500/15', iconColor: '#f59e0b', label: 'Mittel' },
  niedrig: { badge: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', iconBg: 'bg-gray-400/15', iconColor: '#9ca3af', label: 'Niedrig' },
}

function autoIcon(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('shadow') || lower.includes('versteck')) return 'versteckt'
  if (lower.includes('richtlinie') || lower.includes('freigabe') || lower.includes('prozess')) return 'dokument'
  if (lower.includes('schaden') || lower.includes('vorfall') || lower.includes('risiko')) return 'warnung'
  if (lower.includes('verantwort') || lower.includes('rolle')) return 'users'
  if (lower.includes('regulat') || lower.includes('compliance') || lower.includes('gesetz')) return 'waage'
  if (lower.includes('budget') || lower.includes('kosten') || lower.includes('invest')) return 'euro'
  if (lower.includes('kompetenz') || lower.includes('wissen') || lower.includes('skill')) return 'gluehbirne'
  if (lower.includes('daten') || lower.includes('information')) return 'daten'
  return 'warnung'
}

export function SeverityListLayout({ slide, isActive = false }: SeverityListLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const allItems = parseItems(raw).filter(i => !i.isSection)
  const calloutText = slide.content?.callout?.text

  const cards = allItems.map(item => {
    const { severity, cleanTitle } = parseSeverity(item.title)
    return { severity, title: cleanTitle, description: item.description, icon: autoIcon(cleanTitle) }
  })

  const gridCols = cards.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">
          {slide.displayTitle || slide.title}
        </h2>
      </motion.div>

      <div className={`grid ${gridCols} gap-4 max-w-6xl w-full`}>
        {cards.map((card, i) => {
          const cfg = severityConfig[card.severity]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className={`rounded-2xl ${cfg.bg} border ${cfg.border} shadow-md p-5 flex flex-col gap-3 relative`}
            >
              <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white ${cfg.badge}`}>
                {cfg.label}
              </span>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.iconBg}`}>
                  <IconByKey icon={card.icon} size={22} color={cfg.iconColor} />
                </div>
                <h3 className="font-bold text-[#000039] text-base leading-tight pr-16">{card.title}</h3>
              </div>
              {card.description && (
                <p className="text-base text-[#000039]/60 leading-relaxed">{card.description}</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-6xl w-full"
        >
          <p className="text-white font-semibold text-lg">{calloutText}</p>
        </motion.div>
      )}
    </div>
  )
}

export default SeverityListLayout
