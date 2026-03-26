'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconKompass, IconStrategie, IconGovernance, IconRakete, IconSteuerrad, IconCheck, IconUhr, IconPfeil } from '../icons/SlideIcons'
import { usePreziStore } from '@/stores/preziStore'

interface ModuleDetailLayoutProps {
  slide: Slide
  isActive?: boolean
}

const roleColors: Record<string, { bg: string; text: string; accent: string }> = {
  'Kern': { bg: '#001777', text: '#ffffff', accent: '#001777' },
  'Baseline': { bg: '#0078FE', text: '#ffffff', accent: '#0078FE' },
  'Filter': { bg: '#0078FE', text: '#ffffff', accent: '#0078FE' },
  'Einfach': { bg: '#17f0f0', text: '#004444', accent: '#059669' },
  'Aufbau': { bg: '#17f0f0', text: '#004444', accent: '#059669' },
  'Struktur': { bg: '#0ea5e9', text: '#ffffff', accent: '#0ea5e9' },
  'Prüfung': { bg: '#f59e0b', text: '#ffffff', accent: '#f59e0b' },
  'Nutzung': { bg: '#10b981', text: '#ffffff', accent: '#10b981' },
  'Pflege': { bg: '#10b981', text: '#ffffff', accent: '#10b981' },
  'Review': { bg: '#8b5cf6', text: '#ffffff', accent: '#8b5cf6' },
}

const defaultRoleColor = { bg: '#94a3b8', text: '#ffffff', accent: '#64748b' }

const moduleThemeData = {
  m1: { color: '#059669', gradient: 'from-emerald-500 to-teal-600', icon: IconKompass, label: 'Modul 1', subtitle: 'Orientierung' },
  m2: { color: '#0078FE', gradient: 'from-blue-500 to-indigo-600', icon: IconStrategie, label: 'Modul 2', subtitle: 'Zielbild' },
  m3: { color: '#2e5f8a', gradient: 'from-slate-600 to-blue-700', icon: IconGovernance, label: 'Modul 3', subtitle: 'Struktur' },
  m4: { color: '#e97316', gradient: 'from-orange-500 to-amber-600', icon: IconRakete, label: 'Modul 4', subtitle: 'Umsetzung' },
  m5: { color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600', icon: IconSteuerrad, label: 'Modul 5', subtitle: 'Steuerung' },
} as const

const moduleThemes: Record<string, { color: string; gradient: string; icon: typeof IconKompass; label: string; subtitle: string }> = {
  // Angebotspräsentation M1
  '06-ki-standortbestimmung': moduleThemeData.m1,
  '07-ki-strategie-und-use-cases': moduleThemeData.m2,
  '08-governance-und-umsetzungsvorbereitung': moduleThemeData.m3,
  '09-einfuehrungsbegleitung': moduleThemeData.m4,
  '10-ki-fuehrungsbegleitung': moduleThemeData.m5,
  // Steuerungskreis COS-KI
  '08-ki-standortbestimmung': moduleThemeData.m1,
  '09-ki-strategie-und-use-cases': moduleThemeData.m2,
  '10-governance-und-umsetzungsvorbereitung': moduleThemeData.m3,
  '11-einfuehrungsbegleitung': moduleThemeData.m4,
  '12-ki-fuehrungsbegleitung': moduleThemeData.m5,
}

// Frame indices for back-navigation per deck (must match prezi layout JSON)
const NAV_TARGETS_BY_DECK: Record<string, { vorgehensmodell: number; folgemodule: number | null }> = {
  // Angebotspräsentation M1 (slide IDs 06-10)
  '06-ki-standortbestimmung': { vorgehensmodell: 4, folgemodule: 15 },
  '07-ki-strategie-und-use-cases': { vorgehensmodell: 4, folgemodule: 15 },
  '08-governance-und-umsetzungsvorbereitung': { vorgehensmodell: 4, folgemodule: 15 },
  '09-einfuehrungsbegleitung': { vorgehensmodell: 4, folgemodule: 15 },
  '10-ki-fuehrungsbegleitung': { vorgehensmodell: 4, folgemodule: 15 },
  // Steuerungskreis COS-KI (slide IDs 08-12)
  '08-ki-standortbestimmung': { vorgehensmodell: 6, folgemodule: null },
  '09-ki-strategie-und-use-cases': { vorgehensmodell: 6, folgemodule: null },
  '10-governance-und-umsetzungsvorbereitung': { vorgehensmodell: 6, folgemodule: null },
  '11-einfuehrungsbegleitung': { vorgehensmodell: 6, folgemodule: null },
  '12-ki-fuehrungsbegleitung': { vorgehensmodell: 6, folgemodule: null },
  // Ergebnispräsentation M1: Module → Vorgehensmodell (frame 15)
  '17-m1-ki-standortbestimmung': { vorgehensmodell: 15, folgemodule: null },
  '18-m2-ki-strategie-und-use-cases': { vorgehensmodell: 15, folgemodule: null },
  '19-m3-governance-und-umsetzungsvorbereitung': { vorgehensmodell: 15, folgemodule: null },
  '20-m4-einfuehrungsbegleitung': { vorgehensmodell: 15, folgemodule: null },
  '21-m5-ki-fuehrungsbegleitung': { vorgehensmodell: 15, folgemodule: null },
  '22-technisches-sparring': { vorgehensmodell: 15, folgemodule: null },
  // Ergebnispräsentation M1: Pakete → Paketübersicht (frame 22)
  '24-paket-fokus-schlanker-durchlauf': { vorgehensmodell: 22, folgemodule: null },
  '25-paket-professionell-solide-breite': { vorgehensmodell: 22, folgemodule: null },
  '26-paket-umfassend-volle-tiefe': { vorgehensmodell: 22, folgemodule: null },
}
const DEFAULT_NAV = { vorgehensmodell: 4, folgemodule: 15 }

export function ModuleDetailLayout({ slide, isActive = false }: ModuleDetailLayoutProps) {
  const goToFrame = usePreziStore((s) => s.goToFrame)
  const detail = slide.content?.moduleDetail
  const navTargets = NAV_TARGETS_BY_DECK[slide.id] || DEFAULT_NAV
  if (!detail) return null

  const badgeParts = detail.badge.split('|').map((s: string) => s.trim())
  const theme = moduleThemes[slide.id]
  const accent = theme?.color || '#001777'
  const Icon = theme?.icon

  return (
    <div className="w-full h-full flex flex-col">
      {/* Back-navigation buttons */}
      <div className="flex justify-between items-center mb-3 px-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
          onClick={() => goToFrame(navTargets.vorgehensmodell)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000039]/5 hover:bg-[#000039]/10 text-[#000039]/60 hover:text-[#000039] text-sm font-medium transition-all group"
        >
          <span className="rotate-180 group-hover:-translate-x-0.5 transition-transform"><IconPfeil size={16} color="currentColor" /></span>
          Vorgehensmodell
        </motion.button>
        {navTargets.folgemodule !== null && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            onClick={() => goToFrame(navTargets.folgemodule!)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000039]/5 hover:bg-[#000039]/10 text-[#000039]/60 hover:text-[#000039] text-sm font-medium transition-all group"
          >
            Folgemodule
            <span className="group-hover:translate-x-0.5 transition-transform"><IconPfeil size={16} color="currentColor" /></span>
          </motion.button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-5 px-4">
        {/* Header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl px-7 py-5 bg-gradient-to-r ${theme?.gradient || 'from-blue-600 to-indigo-700'} relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%"><defs><pattern id={`dots-${slide.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern></defs><rect fill={`url(#dots-${slide.id})`} width="100%" height="100%"/></svg>
          </div>
          <div className="flex items-center gap-5 relative z-10">
            {Icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={isActive ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 shadow-lg"
              >
                <Icon size={34} color="white" />
              </motion.div>
            )}
            <div className="flex-1 min-w-0">
              {theme && (
                <span className="text-base uppercase tracking-[0.15em] font-semibold text-white/70 mb-1 block">
                  {theme.label} &mdash; {theme.subtitle}
                </span>
              )}
              <h2 className="text-3xl font-bold font-headline text-white leading-tight">
                {slide.title}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {badgeParts.map((part: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full text-base font-semibold whitespace-nowrap"
                  style={i === 0
                    ? { background: 'white', color: accent }
                    : { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }
                  }
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bausteine */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#000039]/40 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/></svg>
            Bausteine
          </h3>
          <div className="grid gap-2.5">
            {detail.bausteine.map((baustein: { name: string; role: string; description: string; effort: string }, i: number) => {
              const colors = roleColors[baustein.role] || defaultRoleColor
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white shadow-sm border border-gray-100"
                >
                  <div className="w-1.5 self-stretch rounded-full shrink-0" style={{ background: colors.accent }} />
                  <div className="shrink-0 w-[150px]">
                    <span className="text-lg font-bold text-[#000039] block leading-tight">
                      {baustein.name}
                    </span>
                    <span
                      className="inline-block text-sm px-2.5 py-0.5 rounded-full font-semibold mt-1"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {baustein.role}
                    </span>
                  </div>
                  <p className="text-lg text-[#000039]/65 flex-1 leading-snug">
                    {baustein.description}
                  </p>
                  <div className="shrink-0 flex items-center gap-1.5 text-base text-[#000039]/45 font-mono whitespace-nowrap">
                    <IconUhr size={14} color={accent} />
                    {baustein.effort}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom row: Ergebnisse + Aufwand side by side */}
        <div className="flex gap-5">
          {/* Ergebnisse */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-5"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#000039]/40 mb-3 flex items-center gap-2">
              <IconCheck size={16} color={accent} />
              Ergebnisse
            </h3>
            <ul className="space-y-2.5">
              {detail.ergebnisse.map((item: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                  className="flex items-start gap-3 text-lg text-[#000039]/75"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: accent + '15' }}>
                    <IconCheck size={13} color={accent} />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Aufwand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.55 }}
            className={`shrink-0 w-[200px] rounded-xl text-white p-5 bg-gradient-to-br ${theme?.gradient || 'from-blue-600 to-indigo-700'} shadow-lg relative overflow-hidden self-center`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              {Icon && <Icon size={80} color="white" />}
            </div>
            <div className="relative z-10">
              <div className="text-sm uppercase tracking-[0.15em] text-white/50 mb-1.5 flex items-center gap-1.5">
                <IconUhr size={13} color="rgba(255,255,255,0.5)" />
                Aufwand
              </div>
              <div className="text-2xl font-bold">{detail.aufwand}</div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  )
}
