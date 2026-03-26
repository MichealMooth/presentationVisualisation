'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey, IconNotiz } from '../icons/SlideIcons'

interface ParallelPathsLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for ki-beratung slide 14
const slideData: Record<string, {
  title: string
  subtitle: string
  paths: Array<{
    id: string
    title: string
    subtitle: string
    icon: string
    color: string
    items: string[]
    result: string
  }>
  callout: string
  nextStep?: string
}> = {
  '14-empfohlener-einstieg-naechste-schritte': {
    title: 'Zwei Wege zum gleichen Ziel',
    subtitle: 'Je nachdem, wo Sie starten',
    paths: [
      {
        id: 'A',
        title: 'KI-Standortbestimmung',
        subtitle: 'Für Unternehmen am Anfang',
        icon: 'mappin',
        color: 'blue',
        items: [
          'Strukturierte Bestandsaufnahme (1-2 Wochen)',
          'Gespräche mit GF, IT, Schlüsselpersonen',
          'Reifegrad-Profil, Stärken, Lücken',
          'Umfang: 3-5 Beratertage',
        ],
        result: 'Fundierte Entscheidung für nächste Schritte',
      },
      {
        id: 'B',
        title: 'Gap-Check',
        subtitle: 'Für Unternehmen mit KI-Erfahrung',
        icon: 'search',
        color: 'green',
        items: [
          'Systematische Lückenanalyse (1 Woche)',
          'Abgleich mit Erfolgsfaktoren',
          'Transparenz über Vorhandenes',
          'Umfang: 2-3 Beratertage',
        ],
        result: 'Direkter Einstieg in passende Phase',
      },
    ],
    callout: 'Beide Wege liefern in 1-2 Wochen ein konkretes Ergebnis – ohne langfristige Verpflichtung.',
    nextStep: 'Auf Basis unseres Gesprächs erarbeiten wir ein konkretes Angebot.'
  }
}

export function ParallelPathsLayout({ slide, isActive = false }: ParallelPathsLayoutProps) {
  const data = slideData[slide.id]
  const contentAny = slide.content as Record<string, unknown> | undefined
  const parsedPaths = contentAny?.paths as Array<{ id: string; title: string; subtitle?: string; icon?: string; items: string[] }> | undefined
  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const paths = data?.paths || (parsedPaths || []).map((p, i) => ({
    ...p,
    color: i === 0 ? 'blue' : 'green',
    icon: p.icon || (i === 0 ? 'kompass' : 'shield'),
    result: '',
  }))
  const calloutText = data?.callout || slide.content?.callout?.text
  const nextStep = data?.nextStep

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-base-blue-dark/60 mt-1">{subtitle}</p>
        )}
      </motion.div>

      {/* Two paths */}
      <div className="grid grid-cols-2 gap-20 relative pt-8">
        {/* ODER badge - above the cards */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isActive ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, type: 'spring' }}
          className="absolute left-1/2 -top-2 -translate-x-1/2 z-20"
        >
          <div className="bg-white px-6 py-2 rounded-full border-2 border-gray-300 shadow-xl">
            <span className="text-base font-bold text-gray-600">ODER</span>
          </div>
        </motion.div>

        {paths.map((path, index) => {
          const isPathA = index === 0
          const colors = isPathA
            ? { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-400', badge: 'from-blue-500 to-indigo-600', text: 'text-blue-800', light: 'text-blue-600', dot: 'bg-blue-400' }
            : { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-400', badge: 'from-emerald-500 to-teal-600', text: 'text-emerald-800', light: 'text-emerald-600', dot: 'bg-emerald-400' }

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20, x: isPathA ? -15 : 15 }}
              animate={isActive ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`
                relative rounded-2xl p-6 border-2 shadow-lg min-h-[340px]
                bg-gradient-to-br ${colors.bg} ${colors.border}
                hover:shadow-xl transition-shadow
              `}
            >
              {/* Path badge - LARGER and more prominent */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1, type: 'spring' }}
                className={`
                  absolute -top-4 left-5 px-5 py-1.5 rounded-full text-base font-bold uppercase tracking-wider shadow-lg
                  bg-gradient-to-r ${colors.badge} text-white
                `}
              >
                Pfad {path.id}
              </motion.div>

              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-xl shadow-md mb-4 mt-4
                bg-gradient-to-br ${colors.badge}
                flex items-center justify-center
              `}>
                <IconByKey icon={path.icon} size={32} color="white" />
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-bold mb-1 ${colors.text}`}>
                {path.title}
              </h3>

              {/* Subtitle */}
              <p className={`text-base italic mb-4 ${colors.light}`}>
                {path.subtitle}
              </p>

              {/* Items */}
              <ul className="space-y-2 mb-4">
                {path.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.45 + index * 0.1 + i * 0.04 }}
                    className={`text-base flex items-start gap-2 ${colors.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* Result */}
              <div className={`pt-3 border-t ${colors.border}`}>
                <p className={`text-base font-bold flex items-center gap-2 ${colors.text}`}>
                  <span className={`
                    w-7 h-7 rounded-lg flex items-center justify-center
                    bg-gradient-to-br ${colors.badge} text-white shadow-sm text-xs
                  `}>→</span>
                  {path.result}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Converging paths visualization - bolder lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center py-3"
      >
        <svg width="280" height="50" viewBox="0 0 280 50" fill="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={isActive ? { pathLength: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            d="M30 10 Q80 10, 140 40"
            stroke="url(#gradBlue)" strokeWidth="5" strokeLinecap="round" fill="none"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={isActive ? { pathLength: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            d="M250 10 Q200 10, 140 40"
            stroke="url(#gradGreen)" strokeWidth="5" strokeLinecap="round" fill="none"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={isActive ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.8, type: 'spring' }}
            cx="140" cy="40" r="8" fill="url(#gradAccent)"
          />
          <defs>
            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="gradGreen" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="gradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#17f0f0" />
              <stop offset="100%" stopColor="#00d4d4" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Callout */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="p-4 bg-gradient-to-r from-base-blue to-base-blue-dark rounded-xl text-center shadow-lg"
        >
          <p className="text-white font-medium text-lg">{calloutText}</p>
        </motion.div>
      )}

      {/* Next step - more readable */}
      {nextStep && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="text-center text-base text-base-blue-dark mt-3 font-medium flex items-center justify-center gap-2"
        >
          <IconNotiz size={16} color="#000039" /> {nextStep}
        </motion.p>
      )}
    </div>
  )
}

export default ParallelPathsLayout
