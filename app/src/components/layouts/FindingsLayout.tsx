'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface FindingsLayoutProps {
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

function autoIcon(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('freigabe') || lower.includes('prozess')) return 'dokument'
  if (lower.includes('compliance') || lower.includes('regulat') || lower.includes('governance')) return 'waage'
  if (lower.includes('bewertung') || lower.includes('pragmatik') || lower.includes('umsetzung')) return 'zahnrad'
  if (lower.includes('kommunikation') || lower.includes('dialog') || lower.includes('austausch')) return 'dialog'
  if (lower.includes('befund') || lower.includes('ergebnis') || lower.includes('fazit')) return 'warnung'
  return 'gluehbirne'
}

const cardIcons = ['dokument', 'waage', 'zahnrad', 'gluehbirne', 'dialog', 'strategie']

export function FindingsLayout({ slide, isActive = false }: FindingsLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const allItems = parseItems(raw)

  // Group items under sections
  const sections: Array<{ title: string; items: Array<{ title: string; description?: string }> }> = []
  let currentSection: typeof sections[0] | null = null

  for (const item of allItems) {
    if (item.isSection) {
      currentSection = { title: item.title, items: [] }
      sections.push(currentSection)
    } else if (currentSection) {
      currentSection.items.push({ title: item.title, description: item.description })
    }
  }

  // Separate conclusion section from finding sections
  const conclusionKeywords = ['befund', 'fazit', 'ergebnis', 'schluss', 'zusammenfassung']
  const conclusionIdx = sections.findIndex(s =>
    conclusionKeywords.some(kw => s.title.toLowerCase().includes(kw))
  )

  let conclusionSection: typeof sections[0] | null = null
  let findingSections = sections

  if (conclusionIdx >= 0) {
    conclusionSection = sections[conclusionIdx]
    findingSections = sections.filter((_, i) => i !== conclusionIdx)
  }

  const gridCols = findingSections.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">
          {slide.displayTitle || slide.title}
        </h2>
      </motion.div>

      <div className={`grid ${gridCols} gap-5 max-w-6xl w-full`}>
        {findingSections.map((section, i) => {
          const icon = autoIcon(section.title)
          const fallbackIcon = cardIcons[i % cardIcons.length]
          const usedIcon = icon !== 'gluehbirne' ? icon : fallbackIcon
          const desc = section.items.map(it => {
            let text = it.title
            if (it.description) text += ` -- ${it.description}`
            return text
          }).join('. ')

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Decorative background icon */}
              <div className="absolute -bottom-2 -right-2 opacity-[0.05] pointer-events-none">
                <IconByKey icon={usedIcon} size={100} color="#000039" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#001777]/10 flex items-center justify-center">
                <IconByKey icon={usedIcon} size={26} color="#001777" />
              </div>
              <h3 className="font-bold text-[#000039] text-lg font-headline leading-tight">{section.title}</h3>
              <p className="text-base text-[#000039]/60 leading-relaxed relative z-10">{desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Conclusion bar */}
      {conclusionSection && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-5 p-5 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl shadow-lg max-w-6xl w-full flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <IconByKey icon="warnung" size={26} color="#f59e0b" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{conclusionSection.title}</h3>
            <p className="text-white/70 text-base mt-1">
              {conclusionSection.items.map(it => {
                let text = it.title
                if (it.description) text += ` -- ${it.description}`
                return text
              }).join('. ')}
            </p>
          </div>
        </motion.div>
      )}

      {!conclusionSection && slide.content?.callout?.text && (
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

export default FindingsLayout
