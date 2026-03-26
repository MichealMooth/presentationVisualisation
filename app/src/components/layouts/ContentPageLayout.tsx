'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey } from '../icons/SlideIcons'

interface ContentPageLayoutProps {
  slide: Slide
  isActive?: boolean
}

// ─── Section types ───────────────────────────────────────────────
interface Section {
  title: string
  type: 'paragraph' | 'bullets' | 'facts'
  text?: string
  items?: Array<{ title: string; description: string }>
  facts?: Array<{ label: string; value: string }>
  trailingText?: string
}

// ─── Icon keyword map ────────────────────────────────────────────
const iconMap: Array<[RegExp, string]> = [
  [/interview|gespräch|schlüsselperson/i, 'kommunikation'],
  [/umfrage|befragung/i, 'diagramm'],
  [/reifegrad|dimension|analyse/i, 'netz'],
  [/erhebung|unkontrolliert|shadow/i, 'lupe'],
  [/regulat|dsgvo|ai.?act|compliance/i, 'governance'],
  [/ergebnis|empfehlung|präsentation/i, 'check'],
  [/klarheit|vermutung|wissen/i, 'glühbirne'],
  [/risik|sichtbar|datenabfluss/i, 'schild'],
  [/orientierung|stehen|zukommt/i, 'kompass'],
  [/entscheidung|basis|investier/i, 'strategie'],
  [/dauer|wochen|zeit/i, 'uhr'],
  [/aufwand|stunden|personen/i, 'team'],
  [/umfang|beratertage/i, 'bausteine'],
  [/festpreis|€|euro|preis/i, 'rakete'],
  [/nutzung|passiert|belegschaft/i, 'team'],
  [/fenster|kompetenzpflicht|pflicht/i, 'governance'],
  [/monat|steuerung|chancen/i, 'uhr'],
]

function getIcon(text: string): string {
  for (const [re, icon] of iconMap) if (re.test(text)) return icon
  return 'check'
}

// ─── Parse rawMarkdown into sections (line-based) ───────────────
function parseSections(raw: string): Section[] {
  const sections: Section[] = []
  const lines = raw.split('\n')
  let curTitle = '', curBullets: string[] = [], curText: string[] = []

  function flush() {
    if (!curTitle) return
    const title = curTitle.replace(/:$/, '').trim()
    if (curBullets.length > 0) {
      // Key-value: **Label:** value (colon INSIDE the bold)
      const kvPat = /^\*\*([^*]+:)\*\*\s*(.+)/
      const isKV = curBullets.length > 0 && curBullets.every(l => kvPat.test(l))
      if (isKV) {
        const facts = curBullets.map(l => {
          const m = l.match(kvPat)
          return m ? { label: m[1].replace(/:$/, ''), value: m[2] } : { label: '', value: l }
        })
        sections.push({ title, type: 'facts', facts })
      } else {
        const items = curBullets.map(t => {
          const b = t.match(/^\*\*([^*]+)\*\*\s*(?:[–—\-|:])\s*(.+)/)
          if (b) return { title: b[1], description: b[2] }
          const b2 = t.match(/^\*\*([^*]+)\*\*\s*(.*)/)
          if (b2) return { title: b2[1], description: b2[2].replace(/^[–—\-|:]\s*/, '') }
          return { title: t, description: '' }
        })
        sections.push({ title, type: 'bullets', items, trailingText: curText.length > 0 ? curText.join(' ') : undefined })
      }
    } else if (curText.length > 0) {
      sections.push({ title, type: 'paragraph', text: curText.join(' ') })
    }
    curTitle = ''; curBullets = []; curText = []
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    const hdr = t.match(/^\*\*([^*]+)\*\*\s*$/)
    if (hdr && !t.startsWith('- ')) { flush(); curTitle = hdr[1]; continue }
    if (t.startsWith('- ')) { curBullets.push(t.slice(2).trim()); continue }
    curText.push(t)
  }
  flush()
  return sections
}

// ─── Slide 2: "What we do" – Bento Grid + Numbered Journey ──────
function Slide2Layout({ sections, isActive }: { sections: Section[]; isActive: boolean }) {
  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const bulletSec = sections.find(s => s.type === 'bullets')
  const items = bulletSec?.items || []

  return (
    <div className="flex flex-col h-full w-full px-8 py-5">
      {/* Bento grid: intro left (big), "what is it" right (small) */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Main intro card – col-span-3 */}
        {paragraphs[0] && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="col-span-3 rounded-2xl bg-gradient-to-br from-[#000039] to-[#001777] p-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#17f0f0]/5 rounded-full -translate-y-8 translate-x-8" />
            <h3 className="text-xs font-semibold text-[#17f0f0] uppercase tracking-widest mb-2">{paragraphs[0].title}</h3>
            <p className="text-sm text-white/80 leading-relaxed">{paragraphs[0].text}</p>
          </motion.div>
        )}

        {/* Secondary card – col-span-2 */}
        {paragraphs[1] && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-2 rounded-2xl bg-[#F5F5F3] p-5 flex flex-col justify-center"
          >
            <h3 className="text-xs font-semibold text-[#001777] uppercase tracking-widest mb-2">{paragraphs[1].title}</h3>
            <p className="text-sm text-[#000039]/65 leading-relaxed">{paragraphs[1].text}</p>
          </motion.div>
        )}
      </div>

      {/* Section title */}
      {bulletSec && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="w-8 h-0.5 bg-[#17f0f0] rounded-full" />
          <h3 className="text-sm font-bold text-[#000039]/70">{bulletSec.title}</h3>
        </motion.div>
      )}

      {/* Numbered journey cards – 3x2 grid */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {items.map((item, i) => {
          const icon = getIcon(item.title + ' ' + item.description)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
              className="rounded-xl bg-white border border-gray-100 shadow-sm p-3.5 flex gap-3 items-start group hover:shadow-md hover:border-[#17f0f0]/30 transition-all"
            >
              {/* Numbered circle */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#000039] to-[#001777] flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <IconByKey icon={icon} size={14} color="#001777" />
                  <h4 className="font-semibold text-[#000039] text-sm leading-snug">{item.title}</h4>
                </div>
                {item.description && (
                  <p className="text-xs text-[#000039]/50 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trailing text */}
      {bulletSec?.trailingText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-xs text-[#000039]/35 mt-2 text-center italic"
        >
          {bulletSec.trailingText}
        </motion.p>
      )}
    </div>
  )
}

// ─── Slide 3: "What you get + Why now" – Highlight + Grid + Banner
function Slide3Layout({ sections, isActive }: { sections: Section[]; isActive: boolean }) {
  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const bulletSections = sections.filter(s => s.type === 'bullets')
  const benefitSec = bulletSections[0]
  const urgencySec = bulletSections[1]

  return (
    <div className="flex flex-col h-full w-full px-8 py-5 gap-4">
      {/* Hero result box */}
      {paragraphs[0] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-[#000039] to-[#001777] p-5 text-white relative overflow-hidden shrink-0"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#17f0f0]/10" />
          <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-[#17f0f0]/5" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#17f0f0]/20 flex items-center justify-center shrink-0 mt-0.5">
              <IconByKey icon="check" size={20} color="#17f0f0" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17f0f0] mb-1">{paragraphs[0].title}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{paragraphs[0].text}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Benefits section title */}
      {benefitSec && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-0.5 bg-[#17f0f0] rounded-full" />
          <h3 className="text-sm font-bold text-[#000039]/70">{benefitSec.title}</h3>
        </motion.div>
      )}

      {/* 2x2 benefit cards */}
      {benefitSec && (
        <div className="grid grid-cols-2 gap-3 flex-1">
          {benefitSec.items?.map((item, i) => {
            const colors = ['#001777', '#059669', '#7c3aed', '#0078FE']
            const color = colors[i % colors.length]
            const icon = getIcon(item.title + ' ' + item.description)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex gap-3 items-start"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: color + '10' }}>
                  <IconByKey icon={icon} size={18} color={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#000039] text-sm">{item.title}</h4>
                  <p className="text-xs text-[#000039]/50 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* "Warum jetzt?" urgency banner */}
      {urgencySec && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl bg-[#000039] p-4 shrink-0"
        >
          <h3 className="text-xs font-bold text-[#17f0f0] uppercase tracking-widest mb-2">{urgencySec.title}</h3>
          <div className="grid grid-cols-3 gap-3">
            {urgencySec.items?.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="w-5 h-5 rounded-full bg-[#17f0f0]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#17f0f0] text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{item.title}{item.description ? ` – ${item.description}` : ''}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Slide 4: "Your entry point" – Pricing Card + CTA ───────────
function Slide4Layout({ sections, isActive }: { sections: Section[]; isActive: boolean }) {
  const factsSec = sections.find(s => s.type === 'facts')
  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const facts = factsSec?.facts || []

  // Find the price fact
  const priceFact = facts.find(f => /€/.test(f.value))
  const otherFacts = facts.filter(f => f !== priceFact)

  return (
    <div className="flex flex-col h-full w-full px-8 py-5">
      {/* Top: section title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="w-8 h-0.5 bg-[#17f0f0] rounded-full" />
        <h3 className="text-sm font-bold text-[#000039]/70">{factsSec?.title || 'Auf einen Blick'}</h3>
      </motion.div>

      {/* Main content: pricing card left, facts right */}
      <div className="grid grid-cols-5 gap-5 flex-1">
        {/* Pricing card – premium centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-2 rounded-2xl overflow-hidden shadow-xl border border-[#17f0f0]/20 self-start"
        >
          {/* Price header */}
          <div className="bg-gradient-to-br from-[#000039] to-[#001777] p-5 text-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#17f0f0]/10" />
            <p className="text-xs uppercase tracking-widest text-white/50 mb-1">KI-Standortbestimmung</p>
            <p className="text-4xl font-headline font-bold text-[#17f0f0]">{priceFact?.value || '5.000 €'}</p>
            <p className="text-xs text-white/50 mt-1">Festpreis · keine versteckten Kosten</p>
          </div>

          {/* Included facts */}
          <div className="bg-white p-4 space-y-2.5">
            {otherFacts.map((fact, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#17f0f0]/10 flex items-center justify-center shrink-0">
                  <IconByKey icon="check" size={10} color="#17f0f0" />
                </div>
                <span className="text-sm text-[#000039]">
                  <span className="font-semibold">{fact.label}:</span>{' '}
                  <span className="text-[#000039]/60">{fact.value}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side: paragraphs stacked */}
        <div className="col-span-3 flex flex-col gap-4">
          {paragraphs.map((sec, i) => {
            const isLast = i === paragraphs.length - 1
            const isCTA = /gespräch|schritt|start|kontakt/i.test(sec.title)

            if (isCTA || isLast) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="rounded-2xl bg-gradient-to-r from-[#000039] to-[#001777] p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-[#17f0f0]/8" />
                  <h3 className="text-sm font-bold text-[#17f0f0] mb-2">{sec.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed">{sec.text}</p>

                  {/* Trust badges */}
                  <div className="flex gap-2 mt-3">
                    {['1–2 Wochen', 'Festpreis', 'Unverbindlich'].map(badge => (
                      <span key={badge} className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-medium text-white/60">
                        {badge}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="rounded-xl bg-[#F5F5F3] p-5"
              >
                <h3 className="text-sm font-bold text-[#000039] mb-1">{sec.title}</h3>
                <p className="text-sm text-[#000039]/60 leading-relaxed">{sec.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component – route to the right sub-layout ──────────────
export function ContentPageLayout({ slide, isActive = false }: ContentPageLayoutProps) {
  const raw = slide.content?.rawMarkdown || ''
  const sections = parseSections(raw)
  const title = slide.displayTitle || slide.title

  const hasFacts = sections.some(s => s.type === 'facts')
  const hasBullets = sections.some(s => s.type === 'bullets')
  const hasParagraphs = sections.some(s => s.type === 'paragraph')
  const bulletCount = sections.filter(s => s.type === 'bullets').reduce((n, s) => n + (s.items?.length || 0), 0)

  // Route to specialized layouts based on content structure
  // Slide with facts (pricing/overview page)
  if (hasFacts) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="px-8 pt-5 pb-2 shrink-0">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000039] font-headline"
          >{title}</motion.h2>
          <div className="w-16 h-1 bg-[#17f0f0] rounded-full mt-2" />
        </div>
        <Slide4Layout sections={sections} isActive={isActive} />
      </div>
    )
  }

  // Slide with paragraphs + one big bullet section (service overview)
  if (hasParagraphs && hasBullets && bulletCount >= 4) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="px-8 pt-5 pb-2 shrink-0">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000039] font-headline"
          >{title}</motion.h2>
          <div className="w-16 h-1 bg-[#17f0f0] rounded-full mt-2" />
        </div>
        <Slide2Layout sections={sections} isActive={isActive} />
      </div>
    )
  }

  // Slide with highlight + benefits + urgency
  if (hasParagraphs && hasBullets) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="px-8 pt-5 pb-2 shrink-0">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000039] font-headline"
          >{title}</motion.h2>
          <div className="w-16 h-1 bg-[#17f0f0] rounded-full mt-2" />
        </div>
        <Slide3Layout sections={sections} isActive={isActive} />
      </div>
    )
  }

  // Fallback: just paragraphs
  return (
    <div className="flex flex-col h-full w-full px-8 py-6 justify-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="text-3xl lg:text-4xl font-bold text-[#000039] font-headline mb-4"
      >{title}</motion.h2>
      <div className="w-16 h-1 bg-[#17f0f0] rounded-full mb-6" />
      <div className="space-y-4 max-w-4xl">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl bg-white border border-gray-100 shadow-sm p-5"
            style={{ borderLeft: '4px solid #001777' }}
          >
            <h3 className="text-base font-bold text-[#000039] mb-1">{sec.title}</h3>
            <p className="text-sm text-[#000039]/60 leading-relaxed">{sec.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ContentPageLayout
