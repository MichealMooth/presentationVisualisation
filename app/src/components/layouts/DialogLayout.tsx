'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconFrage, IconEuro, IconUhr, IconSchloss, IconOhr, IconByKey } from '../icons/SlideIcons'

interface DialogLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for specific slides
const slideData: Record<string, {
  title: string
  subtitle?: string
  questions?: string[]
  hint?: string
  faqAnchors?: Array<{ topic: string; icon: string }>
}> = {
  '03-ihre-ausgangslage-dialog': {
    title: 'Zuerst: Über Sie',
    subtitle: 'Bevor wir über KI sprechen',
    questions: [
      'Was ist Ihr Geschäftsmodell – was macht Ihr Unternehmen besonders?',
      'Was war der Anlass, sich jetzt mit KI zu beschäftigen?',
      'Welche Erfahrungen haben Sie bereits mit KI gemacht?',
      'Wo sehen Sie das größte Potenzial für KI?',
      'Was erwarten Sie von diesem Termin?',
    ]
  },
  '15-ihre-offenen-fragen': {
    title: 'Ihre Fragen',
    subtitle: 'Was ist noch offen?',
    hint: 'Was beschäftigt Sie am meisten, wenn Sie an die nächsten Schritte denken?',
    faqAnchors: [
      { topic: 'Kosten & Aufwand', icon: 'euro' },
      { topic: 'Zeitrahmen', icon: 'uhr' },
      { topic: 'Datenschutz & Sicherheit', icon: 'schloss' },
    ]
  }
}

const questionColors = [
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-purple-500',
  'from-purple-500 to-pink-500',
  'from-pink-500 to-rose-500',
  'from-rose-500 to-orange-500',
]

// Parse dialog items from rawMarkdown: **Speaker:**\n- "quote"
function parseDialogFromRaw(raw: string): Array<{ speaker: string; quote: string }> {
  const items: Array<{ speaker: string; quote: string }> = []
  const pattern = /\*\*([^*]+):\*\*\n\s*-\s*(.+)/g
  let match
  while ((match = pattern.exec(raw)) !== null) {
    const speaker = match[1].trim()
    let quote = match[2].trim()
    // Strip italic markers and extra quotes
    quote = quote.replace(/^\*["„]?|[""]?\*$/g, '').replace(/^["„]|[""]$/g, '').trim()
    items.push({ speaker, quote })
  }
  return items
}

export function DialogLayout({ slide, isActive = false }: DialogLayoutProps) {
  const data = slideData[slide.id]
  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const questions = data?.questions || []
  const hint = data?.hint
  const faqAnchors = data?.faqAnchors || []

  // Fallback: parse dialog items from rawMarkdown
  const rawDialogItems = !data && slide.content?.rawMarkdown ? parseDialogFromRaw(slide.content.rawMarkdown) : []

  const isQuestionsSlide = data && slide.id === '15-ihre-offenen-fragen'
  const isIntroSlide = data && slide.id === '03-ihre-ausgangslage-dialog'

  return (
    <div className={`flex flex-col h-full w-full px-8 items-center ${isQuestionsSlide ? 'justify-start pt-[8%]' : 'justify-center'}`}>
      {/* Large icon - only for Q&A slide */}
      {isQuestionsSlide && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-center mb-4"
        >
          <IconFrage size={56} color="#001777" />
        </motion.div>
      )}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-blue-dark font-headline">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-base-blue-dark/60 mt-1">{subtitle}</p>
        )}
      </motion.div>

      {/* Parsed dialog items (fallback from rawMarkdown) */}
      {rawDialogItems.length > 0 && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {rawDialogItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              className="flex items-start gap-5 py-5 px-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br ${questionColors[index % questionColors.length]}
                text-white flex items-center justify-center
                text-lg font-bold shadow-md
              `}>
                <IconByKey icon="users" size={22} color="white" />
              </div>
              <div className="pt-1">
                <p className="text-sm font-bold text-base-blue-dark/60 uppercase tracking-wide mb-1">{item.speaker}</p>
                <p className="text-lg text-base-blue-dark leading-relaxed italic">„{item.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              className="flex items-start gap-5 py-5 px-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Number badge */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br ${questionColors[index]}
                text-white flex items-center justify-center
                text-xl font-bold shadow-md
              `}>
                {index + 1}
              </div>

              {/* Question */}
              <p className="text-xl text-base-blue-dark leading-relaxed pt-2">
                „{question}"
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Closing banner for intro slide - full width */}
      {isIntroSlide && questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 -mx-8 p-5 bg-gradient-to-r from-base-blue to-base-blue-dark text-center shadow-lg"
        >
          <p className="text-white font-medium text-lg flex items-center justify-center gap-2">
            <IconOhr size={22} color="white" /> Wir hören zu, bevor wir beraten.
          </p>
        </motion.div>
      )}

      {/* Q&A slide - empty state */}
      {isQuestionsSlide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {hint && (
            <p className="text-xl text-base-blue-dark/70 italic max-w-lg leading-relaxed">
              {hint}
            </p>
          )}

          {/* FAQ Anchors - typical customer concerns */}
          {faqAnchors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {faqAnchors.map((anchor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isActive ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-center gap-4 min-w-[240px] h-[70px] px-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-accent/50 transition-all cursor-pointer group"
                >
                  <span className="group-hover:scale-110 transition-transform"><IconByKey icon={anchor.icon} size={28} color="#001777" /></span>
                  <span className="text-lg font-semibold text-base-blue-dark group-hover:text-base-blue transition-colors">
                    {anchor.topic}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Placeholder box - solid style */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-md border-2 border-gray-200 min-w-[400px] min-h-[120px] flex items-center justify-center">
            <p className="text-gray-500 text-base flex items-center justify-center gap-2">
              Raum für Ihre individuellen Fragen
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DialogLayout
