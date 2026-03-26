'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface CompanyProfileLayoutProps {
  slide: Slide
  isActive?: boolean
}

function autoIcon(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('branche') || lower.includes('fokus') || lower.includes('geschäftsfeld')) return 'building'
  if (lower.includes('größe') || lower.includes('mitarbeiter') || lower.includes('personal')) return 'users'
  if (lower.includes('geschäftsmodell') || lower.includes('modell') || lower.includes('leistung')) return 'zahnrad'
  if (lower.includes('it') || lower.includes('aufstellung') || lower.includes('server') || lower.includes('infrastruktur')) return 'server'
  if (lower.includes('ki') || lower.includes('erfahrung') || lower.includes('innovation')) return 'gluehbirne'
  if (lower.includes('kunde') || lower.includes('compliance') || lower.includes('regulat')) return 'waage'
  if (lower.includes('daten') || lower.includes('information')) return 'daten'
  if (lower.includes('standort') || lower.includes('sitz')) return 'mappin'
  return 'building'
}

const profileGradients = [
  'from-blue-500 to-indigo-600',
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
]

export function CompanyProfileLayout({ slide, isActive = false }: CompanyProfileLayoutProps) {
  // Try matrix cells first, then fall back to rawMarkdown sections
  const matrixCells = slide.content?.matrix || []
  let cards: Array<{ title: string; description: string; icon: string }> = []

  if (matrixCells.length > 0) {
    cards = matrixCells.map((cell: { title: string; items: string[] }) => ({
      title: cell.title.replace(/:$/, ''),
      description: cell.items[0] || '',
      icon: autoIcon(cell.title),
    }))
  } else {
    // Parse from rawMarkdown sections
    const raw = slide.content?.rawMarkdown || ''
    const lines = raw.split('\n')
    let currentTitle = ''

    for (const line of lines) {
      const trimmed = line.trim()
      const sectionMatch = trimmed.match(/^\*\*([^*]+)\*\*[:\s]*$/)
      if (sectionMatch) {
        currentTitle = sectionMatch[1].replace(/:$/, '')
      } else if (trimmed.startsWith('- ') && currentTitle) {
        const text = trimmed.slice(2).replace(/^\*\*([^*]+)\*\*\s*/, '$1 ')
        cards.push({ title: currentTitle, description: text, icon: autoIcon(currentTitle) })
        currentTitle = ''
      }
    }
  }

  // Extract subtitle: first non-bullet, non-section line
  const raw = slide.content?.rawMarkdown || ''
  const subtitle = raw.split('\n').find((l: string) => {
    const t = l.trim()
    return t && !t.startsWith('-') && !t.startsWith('**') && !t.includes('Kernbotschaft') && !t.includes('Überschrift')
  })?.trim()

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
        {subtitle && (
          <p className="text-lg text-[#000039]/50 mt-1">{subtitle}</p>
        )}
      </motion.div>

      <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
        {cards.map((card, i) => {
          const gradient = profileGradients[i % profileGradients.length]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.07 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-md p-5 relative overflow-hidden"
            >
              {/* Decorative background icon */}
              <div className="absolute -bottom-2 -right-2 opacity-[0.05] pointer-events-none">
                <IconByKey icon={card.icon} size={90} color="#000039" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-11 h-11 rounded-xl shadow-sm flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient}`}>
                  <IconByKey icon={card.icon} size={22} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#000039] text-base leading-tight mb-1">{card.title}</h3>
                  <p className="text-base text-[#000039]/60 leading-relaxed">{card.description}</p>
                </div>
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

export default CompanyProfileLayout
