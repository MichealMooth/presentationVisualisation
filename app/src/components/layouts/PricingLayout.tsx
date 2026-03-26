'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { usePreziStore } from '@/stores/preziStore'
import { IconByKey } from '../icons/SlideIcons'

interface PricingLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Frame indices for detail slides (keyed by pricing slide ID)
const detailFrameConfig: Record<string, number[]> = {
  '23-drei-pakete-ihr-weg-ihre-tiefe': [23, 24, 25],
}

function parsePrice(title: string): { name: string; price: string; isRecommended: boolean } {
  const isRecommended = title.includes('★') || title.toLowerCase().includes('empfohlen')
  const priceMatch = title.match(/([\d.]+(?:\.\d+)?)\s*€/)
  const price = priceMatch ? priceMatch[1] + ' €' : ''
  const name = title
    .replace(/[✓★]\s*/g, '')
    .replace(/\s*–\s*[\d.]+\s*€.*/, '')
    .replace(/\s*empfohlen\s*/i, '')
    .replace(/:$/, '')
    .trim()
  return { name, price, isRecommended }
}

function extractKeyMetrics(items: string[]): { features: string[]; bt: string; duration: string; retainer: string } {
  const features: string[] = []
  let bt = ''
  let duration = ''
  let retainer = ''

  for (const item of items) {
    const btMatch = item.match(/(\d+)\s*BT/)
    const durationMatch = item.match(/(\d+[–-]\d+)\s*Wochen/)
    const retainerMatch = item.match(/M5.*?:\s*([\d.]+\s*€\/Jahr)/)

    if (btMatch && durationMatch && !bt) {
      bt = btMatch[1] + ' BT'
      duration = durationMatch[1] + ' Wochen'
      if (retainerMatch) retainer = retainerMatch[1]
    } else if (item.toLowerCase().includes('tagessatz') || item.toLowerCase().includes('aufwandsbasierte')) {
      // Skip footer text
    } else {
      // Extract module label if present
      const moduleMatch = item.match(/\(([^)]+)\)\s*$/)
      const cleanItem = item.replace(/\([^)]*\)\s*$/, '').trim()
      features.push(cleanItem)
    }
  }

  return { features, bt, duration, retainer }
}

const packageConfig = [
  { gradient: 'from-slate-50 to-slate-100', border: 'border-slate-200', headerBg: 'bg-gradient-to-br from-slate-600 to-slate-700', icon: 'kompass', accentColor: '#475569' },
  { gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-200', headerBg: 'bg-gradient-to-br from-[#001777] to-indigo-700', icon: 'strategie', accentColor: '#001777' },
  { gradient: 'from-[#000039]/5 to-[#001777]/10', border: 'border-accent', headerBg: 'bg-gradient-to-br from-[#000039] to-[#001777]', icon: 'rakete', accentColor: '#17f0f0' },
]

export function PricingLayout({ slide, isActive = false }: PricingLayoutProps) {
  const goToFrame = usePreziStore((s) => s.goToFrame)
  const comparison = ((slide.content as Record<string, unknown>)?.comparison as Array<{ title: string; description: string; type: string; items: string[] }>) || []
  const detailFrames = detailFrameConfig[slide.id] || []

  if (comparison.length === 0) return null

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

      <div className="flex items-end justify-center gap-5 max-w-[1400px] w-full">
        {comparison.map((pkg, i) => {
          const { name, price, isRecommended } = parsePrice(pkg.title)
          const { features, bt, duration, retainer } = extractKeyMetrics(pkg.items)
          const cfg = packageConfig[i] || packageConfig[0]
          const detailFrame = detailFrames[i]

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className={`
                flex-1 rounded-2xl overflow-hidden shadow-lg relative
                ${isRecommended ? 'ring-2 ring-accent shadow-accent/20 -mt-4' : ''}
                bg-gradient-to-b ${cfg.gradient} border ${cfg.border}
              `}
            >
              {/* Empfohlen badge */}
              {isRecommended && (
                <div className="absolute -top-0 left-0 right-0 flex justify-center z-20">
                  <span className="bg-accent text-[#000039] text-xs font-bold px-5 py-1.5 rounded-b-xl shadow-md">
                    ★ Empfohlen
                  </span>
                </div>
              )}

              {/* Header with price */}
              <div className={`${cfg.headerBg} px-6 py-5 text-center ${isRecommended ? 'pt-8' : ''}`}>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                    <IconByKey icon={cfg.icon} size={24} color="white" />
                  </div>
                </div>
                <h3 className="font-bold text-white text-xl font-headline mb-2">{name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white">{price}</span>
                </div>
                {bt && (
                  <p className="text-white/70 text-sm mt-2">{bt} · {duration}</p>
                )}
              </div>

              {/* Features */}
              <div className="px-5 py-4 flex-1">
                <ul className="space-y-2.5">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-base text-[#000039]/75">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.accentColor + '18' }}>
                        <IconByKey icon="check" size={12} color={cfg.accentColor} />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Retainer info */}
                {retainer && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-[#000039]/50 flex items-center gap-2">
                      <IconByKey icon="refresh" size={14} color="#6b7280" />
                      M5 Retainer: {retainer}
                    </p>
                  </div>
                )}
              </div>

              {/* Result + CTA */}
              <div className="px-5 pb-5">
                {pkg.description && (
                  <p className="text-sm font-semibold text-[#000039]/60 mb-3 text-center">
                    → {pkg.description.replace(/^Ergebnis:\s*/, '')}
                  </p>
                )}
                {detailFrame !== undefined && (
                  <button
                    onClick={() => goToFrame(detailFrame)}
                    className={`
                      w-full py-3 rounded-xl font-semibold text-base transition-all
                      ${isRecommended
                        ? 'bg-gradient-to-r from-[#000039] to-[#001777] text-white hover:shadow-lg hover:shadow-[#001777]/30'
                        : 'bg-[#000039]/8 text-[#000039] hover:bg-[#000039]/15'
                      }
                    `}
                  >
                    Details ansehen →
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.5 } : {}}
        transition={{ delay: 0.8 }}
        className="text-sm text-[#000039]/40 mt-4 text-center max-w-3xl"
      >
        Aufwandsbasierte Abrechnung. Weitere Use Cases jederzeit ergänzbar (4–6 BT je UC).
      </motion.p>
    </div>
  )
}

export default PricingLayout
