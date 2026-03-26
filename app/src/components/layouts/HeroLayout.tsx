'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Slide } from '@/lib/content/schema'

interface HeroLayoutProps {
  slide: Slide
  isActive?: boolean
}

export function HeroLayout({ slide, isActive = false }: HeroLayoutProps) {
  const isTitleSlide = slide.number === 1
  const isClosingSlide = !isTitleSlide && (
    slide.title.toLowerCase().includes('abschluss') ||
    slide.title.toLowerCase().includes('kontakt') ||
    slide.title.toLowerCase().includes('closing')
  )

  return (
    <div className={`flex flex-col items-center h-full text-center px-8 relative overflow-hidden ${isTitleSlide ? 'justify-start pt-[12%]' : isClosingSlide ? 'justify-start pt-[15%]' : 'justify-center'}`}>
      {/* Background pattern - KI/Network nodes - subtle on title, visible on closing */}
      <div className={`absolute inset-0 overflow-hidden ${isTitleSlide ? 'opacity-[0.06]' : 'opacity-[0.12]'}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {/* Network pattern - denser grid */}
          {[...Array(30)].map((_, i) => (
            <g key={i}>
              <circle cx={5 + (i % 6) * 18} cy={5 + Math.floor(i / 6) * 20} r="1.5" fill="currentColor" />
              {i < 24 && <line x1={5 + (i % 6) * 18} y1={5 + Math.floor(i / 6) * 20} x2={5 + ((i + 1) % 6) * 18} y2={5 + Math.floor((i + 1) / 6) * 20} stroke="currentColor" strokeWidth="0.6" opacity="0.7" />}
              {i < 24 && <line x1={5 + (i % 6) * 18} y1={5 + Math.floor(i / 6) * 20} x2={5 + (i % 6) * 18} y2={5 + Math.floor(i / 6 + 1) * 20} stroke="currentColor" strokeWidth="0.4" opacity="0.5" />}
            </g>
          ))}
        </svg>
      </div>

      {/* Gradient orbs - subtle */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-accent/40 to-transparent rounded-full blur-3xl"
      />

      {/* Logo/Wordmark - only once, prominently */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 relative z-10"
      >
        {/* Try SVG consulting logo first, fallback to PNG */}
        <img
          src="/assets/TRICEPT-CONSULTING-Wortmarke-ElectricBlue.svg"
          alt="Tricept Consulting"
          className="h-16 md:h-20 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = '/assets/IT-Consulting-Grafik.png'
          }}
        />
      </motion.div>

      {/* Main Title - from rawMarkdown content */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold max-w-5xl mb-6 leading-tight font-headline relative z-10"
      >
        {(() => {
          const raw = slide.content?.rawMarkdown || ''
          const lines = raw.split('\n').filter((l: string) => l.trim())
          if (lines.length > 0) {
            const title = lines[0].trim()
            // Try to find accent-worthy word (KI or key term)
            const accentMatch = title.match(/(KI[-\s]?\w*)/i)
            if (accentMatch) {
              const idx = title.indexOf(accentMatch[1])
              return (
                <>
                  <span className="text-white/90">{title.slice(0, idx)}</span>
                  <span className="text-accent">{accentMatch[1]}</span>
                  <span className="text-white/90">{title.slice(idx + accentMatch[1].length)}</span>
                </>
              )
            }
            return <span className="text-white/90">{title}</span>
          }
          return <span className="text-white/90">{slide.displayTitle || slide.title}</span>
        })()}
      </motion.h1>

      {/* Subtitle from second line of content */}
      {(() => {
        const raw = slide.content?.rawMarkdown || ''
        const lines = raw.split('\n').filter((l: string) => l.trim())
        const subtitle = lines.length > 1 ? lines[1].trim() : ''
        if (subtitle && isTitleSlide) {
          return (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl lg:text-3xl max-w-3xl mb-8 text-white/80 font-medium relative z-10"
            >
              {subtitle}
            </motion.p>
          )
        }
        return null
      })()}

      {/* Decorative accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isActive ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-20 h-1 bg-accent rounded-full mb-8 relative z-10"
      />

      {/* Additional content lines for title slide */}
      {isTitleSlide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center relative z-10"
        >
          {(() => {
            const raw = slide.content?.rawMarkdown || ''
            const lines = raw.split('\n').filter((l: string) => l.trim())
            // Show lines 3+ as additional info (lines 1-2 are title/subtitle)
            return lines.slice(2).map((line: string, i: number) => (
              <p key={i} className={`${i === 0 ? 'text-2xl md:text-3xl text-white/80 font-medium mb-3' : 'text-lg text-white/60'}`}>
                {line.trim()}
              </p>
            ))
          })()}
        </motion.div>
      )}

      {/* Closing slide content from rawMarkdown */}
      {isClosingSlide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 w-[80%] max-w-4xl relative z-10"
        >
          {(() => {
            const raw = slide.content?.rawMarkdown || ''
            const lines = raw.split('\n').filter((l: string) => l.trim())
            return (
              <div className="space-y-4">
                {lines.map((line: string, i: number) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className={`text-center ${i === 0 ? 'text-2xl md:text-3xl text-white/90 font-medium' : 'text-lg md:text-xl text-white/70'}`}
                  >
                    {line.trim()}
                  </motion.p>
                ))}
              </div>
            )
          })()}
        </motion.div>
      )}

      {/* NO duplicate logo at bottom - removed */}
    </div>
  )
}

export default HeroLayout
