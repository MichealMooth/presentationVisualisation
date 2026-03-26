'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface NumberedCardsLayoutProps {
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

const tripleConfig = [
  { icon: 'check', gradient: 'from-emerald-100 to-emerald-200', border: 'border-emerald-400', iconBg: 'bg-emerald-600', numColor: 'text-emerald-300' },
  { icon: 'waage', gradient: 'from-blue-100 to-indigo-200', border: 'border-blue-400', iconBg: 'bg-blue-600', numColor: 'text-blue-300' },
  { icon: 'uhr', gradient: 'from-amber-100 to-orange-200', border: 'border-amber-400', iconBg: 'bg-amber-600', numColor: 'text-amber-300' },
]

const listIcons = ['strategie', 'rakete', 'server', 'waage', 'euro', 'check']

const listGradients = [
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-purple-500',
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
]

export function NumberedCardsLayout({ slide, isActive = false }: NumberedCardsLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const allItems = parseItems(raw).filter(i => !i.isSection)

  // Strip leading numbers from titles
  const cards = allItems.map(item => ({
    title: item.title.replace(/^\d+\.\s*/, ''),
    description: item.description,
  }))

  const calloutText = slide.content?.callout?.text

  // === 3 items: large gradient cards ===
  if (cards.length === 3) {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-6 text-center">
            {slide.displayTitle || slide.title}
          </h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-5 max-w-6xl w-full">
          {cards.map((card, i) => {
            const cfg = tripleConfig[i] || tripleConfig[0]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className={`rounded-2xl bg-gradient-to-br ${cfg.gradient} border ${cfg.border} shadow-lg p-6 flex flex-col items-center text-center relative overflow-hidden`}
              >
                <span className={`absolute top-2 right-4 text-7xl font-bold ${cfg.numColor} select-none pointer-events-none`}>
                  {i + 1}
                </span>
                <div className={`w-14 h-14 rounded-2xl ${cfg.iconBg} flex items-center justify-center mb-4 shadow-md`}>
                  <IconByKey icon={cfg.icon} size={28} color="white" />
                </div>
                <h3 className="font-bold text-[#000039] text-xl mb-3 font-headline">{card.title}</h3>
                {card.description && (
                  <p className="text-base text-[#000039]/65 leading-relaxed">{card.description}</p>
                )}
              </motion.div>
            )
          })}
        </div>
        {calloutText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65 }}
            className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-6xl w-full"
          >
            <p className="text-white font-semibold text-lg">{calloutText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // === 4-6 items: numbered vertical list ===
  if (cards.length >= 4 && cards.length <= 6) {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-5 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">
            {slide.displayTitle || slide.title}
          </h2>
        </motion.div>
        <div className="space-y-3 max-w-5xl w-full">
          {cards.map((card, i) => {
            const icon = listIcons[i % listIcons.length]
            const gradient = listGradients[i % listGradients.length]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                className={`flex items-start gap-5 p-5 rounded-2xl border border-gray-100 shadow-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F3]'}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <span className="text-white font-bold text-lg">{i + 1}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#001777]/10 flex items-center justify-center shrink-0">
                  <IconByKey icon={icon} size={22} color="#001777" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#000039] text-lg">{card.title}</h3>
                  {card.description && (
                    <p className="text-base text-[#000039]/60 mt-1 leading-relaxed">{card.description}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        {calloutText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65 }}
            className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-5xl w-full"
          >
            <p className="text-white font-semibold text-lg">{calloutText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // === 7+ items: compact numbered list ===
  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-4 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">
          {slide.displayTitle || slide.title}
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 max-w-5xl w-full">
        {cards.map((card, i) => {
          const gradient = listGradients[i % listGradients.length]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
              className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                <span className="text-white font-bold text-sm">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#000039] text-base leading-tight">{card.title}</h3>
                {card.description && (
                  <p className="text-base text-[#000039]/55 mt-0.5 leading-relaxed">{card.description}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-5xl w-full"
        >
          <p className="text-white font-semibold text-lg">{calloutText}</p>
        </motion.div>
      )}
    </div>
  )
}

export default NumberedCardsLayout
