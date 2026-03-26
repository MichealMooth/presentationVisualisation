'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface DualColumnLayoutProps {
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

export function DualColumnLayout({ slide, isActive = false }: DualColumnLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const allItems = parseItems(raw)

  // Group items under their section headers
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

  // Determine layout mode
  let bannerSection: typeof sections[0] | null = null
  let leftSection: typeof sections[0] | null = null
  let rightSection: typeof sections[0] | null = null

  if (sections.length === 2) {
    leftSection = sections[0]
    rightSection = sections[1]
  } else if (sections.length >= 3) {
    // Find the 1-item section (banner candidate)
    const singleIdx = sections.findIndex(s => s.items.length === 1)
    if (singleIdx >= 0) {
      bannerSection = sections[singleIdx]
      const remaining = sections.filter((_, i) => i !== singleIdx)
      leftSection = remaining[0] || null
      rightSection = remaining[1] || null
    } else {
      leftSection = sections[0]
      rightSection = sections[1]
    }
  } else if (sections.length === 1) {
    leftSection = sections[0]
  }

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">
          {slide.displayTitle || slide.title}
        </h2>
      </motion.div>

      {/* Banner section */}
      {bannerSection && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4 max-w-6xl w-full px-5 py-3 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl flex items-center gap-4 shadow-lg"
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <IconByKey icon="strategie" size={22} color="#17f0f0" />
          </div>
          <p className="text-white font-medium text-base leading-relaxed">
            {bannerSection.items[0]?.title}
            {bannerSection.items[0]?.description ? ` -- ${bannerSection.items[0].description}` : ''}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-5 max-w-6xl w-full">
        {/* Left column */}
        {leftSection && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl bg-blue-50 border border-blue-200 shadow-md overflow-hidden"
          >
            <div className="bg-[#001777] px-5 py-3">
              <h3 className="font-bold text-white text-lg font-headline">{leftSection.title}</h3>
            </div>
            <div className="p-4 space-y-2">
              {leftSection.items.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-100"
                >
                  <span className="w-7 h-7 rounded-full bg-[#001777] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-[#000039]/80 leading-relaxed">
                      {it.title}{it.description ? ` -- ${it.description}` : ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Right column */}
        {rightSection && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl bg-teal-50 border border-teal-200 shadow-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3">
              <h3 className="font-bold text-white text-lg font-headline">{rightSection.title}</h3>
            </div>
            <div className="p-4 space-y-2">
              {rightSection.items.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-teal-100"
                >
                  <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-[#000039]/80 leading-relaxed">
                      {it.title}{it.description ? ` -- ${it.description}` : ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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

export default DualColumnLayout
