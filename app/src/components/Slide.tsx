'use client'

import { forwardRef, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Slide as SlideType } from '@/lib/content/schema'
import Image from 'next/image'

interface SlideProps {
  slide: SlideType
  isActive?: boolean
  children?: ReactNode
}

export const Slide = forwardRef<HTMLDivElement, SlideProps>(
  function Slide({ slide, isActive = false, children }, ref) {
    const themeClass = slide.theme === 'dark' ? 'slide-dark theme-dark' : 'slide-light'

    return (
      <section
        ref={ref}
        id={slide.id}
        className={`slide ${themeClass}`}
        aria-label={`Folie ${slide.number}: ${slide.title}`}
        data-slide-number={slide.number}
        data-slide-layout={slide.layout}
      >
        {/* Background image if specified */}
        {slide.bg && (
          <div className="slide-bg">
            <Image
              src={`/assets/${slide.bg}`}
              alt=""
              fill
              className="object-cover"
              priority={slide.number <= 2}
            />
            <div className="slide-bg-overlay" />
          </div>
        )}

        {/* Slide content */}
        <motion.div
          className="slide-content relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>

        {/* Logo in footer (non-hero slides) */}
        {slide.layout !== 'hero' && (
          <div className="slide-logo">
            <Image
              src="/assets/Bildmarke.png"
              alt="Tricept Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        )}
      </section>
    )
  }
)

export default Slide
