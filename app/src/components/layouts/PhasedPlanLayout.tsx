'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface PhasedPlanLayoutProps {
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

function stripEmoji(text: string): string {
  return text.replace(/^[^\w\säöüÄÖÜ]+\s*/u, '').trim()
}

function phaseIcon(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('sofort') || lower.includes('dringend') || lower.includes('akut')) return 'warnung'
  if (lower.includes('planung') || lower.includes('vorbereitung') || lower.includes('analyse')) return 'agenda'
  if (lower.includes('umsetzung') || lower.includes('einführung') || lower.includes('roll')) return 'rakete'
  return 'zahnrad'
}

const phaseColors = [
  { header: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { header: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { header: 'bg-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { header: 'bg-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
]

export function PhasedPlanLayout({ slide, isActive = false }: PhasedPlanLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const allItems = parseItems(raw)

  // Group items under their section headers as phases
  const phases: Array<{ title: string; items: Array<{ title: string; description?: string }> }> = []
  let currentPhase: typeof phases[0] | null = null

  for (const item of allItems) {
    if (item.isSection) {
      currentPhase = { title: stripEmoji(item.title), items: [] }
      phases.push(currentPhase)
    } else if (currentPhase) {
      currentPhase.items.push({ title: item.title, description: item.description })
    }
  }

  // If no sections found, treat all items as a single phase
  if (phases.length === 0 && allItems.length > 0) {
    phases.push({ title: 'Maßnahmen', items: allItems.filter(i => !i.isSection).map(i => ({ title: i.title, description: i.description })) })
  }

  const colCount = Math.min(phases.length, 4)
  const gridClass = colCount <= 2 ? 'grid-cols-2' : colCount === 3 ? 'grid-cols-3' : 'grid-cols-4'

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

      <div className={`grid ${gridClass} gap-4 max-w-6xl w-full`}>
        {phases.map((phase, pi) => {
          const cfg = phaseColors[pi % phaseColors.length]
          const icon = phaseIcon(phase.title)
          return (
            <motion.div
              key={pi}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + pi * 0.1 }}
              className={`rounded-2xl ${cfg.bg} border ${cfg.border} shadow-md overflow-hidden`}
            >
              <div className={`${cfg.header} px-4 py-3 flex items-center gap-3`}>
                <IconByKey icon={icon} size={20} color="white" />
                <h3 className="font-bold text-white text-lg font-headline">{phase.title}</h3>
              </div>
              <div className="p-3 space-y-2">
                {phase.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.25 + pi * 0.1 + i * 0.04 }}
                    className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <p className="text-base text-[#000039]/80 leading-relaxed font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-base text-[#000039]/55 mt-1 leading-relaxed">{item.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {slide.content?.callout?.text && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-6xl w-full"
        >
          <p className="text-white font-semibold text-lg">{slide.content.callout.text}</p>
        </motion.div>
      )}
    </div>
  )
}

export default PhasedPlanLayout
