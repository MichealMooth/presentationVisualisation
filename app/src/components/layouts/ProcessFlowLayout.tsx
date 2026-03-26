'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { usePreziStore } from '@/stores/preziStore'

interface ProcessFlowLayoutProps {
  slide: Slide
  isActive?: boolean
}

const phases = [
  {
    nr: 'Phase 1',
    name: 'Orientierung &\nEinordnung',
    char: 'Einmalig',
    headerBg: '#c5d5e8',
    headerColor: '#001777',
    module: { id: 'Modul 1', name: 'Standortbestimmung', bg: '#d1fae5', color: '#059669', moduleIndex: 0 },
    bausteine: [
      { name: 'B1 Reifegrad', role: 'Kern', isKern: true },
    ],
    footer: '1–2 Wochen',
  },
  {
    nr: 'Phase 2',
    name: 'Zielbild &\nFokussetzung',
    char: 'Einmalig',
    headerBg: '#5b8db8',
    headerColor: '#fff',
    module: { id: 'Modul 2', name: 'Strategie & Use-Cases', bg: '#e0eaf4', color: '#0078FE', moduleIndex: 1 },
    bausteine: [
      { name: 'B2 Strategie', role: 'Kern', isKern: true },
      { name: 'B3 Use-Cases', role: 'Kern', isKern: true },
    ],
    footer: '3–5 Wochen',
  },
  {
    nr: 'Phase 3',
    name: 'Vorbereitung &\nBefähigung',
    char: 'Einmalig',
    headerBg: '#3d7199',
    headerColor: '#fff',
    module: { id: 'Modul 3', name: 'Governance & Vorbereitung', bg: '#d6e3f0', color: '#2e5f8a', moduleIndex: 2 },
    bausteine: [
      { name: 'B4 Organisation', role: 'Kern', isKern: true },
      { name: 'B5 Governance', role: 'Kern', isKern: true },
      { name: 'TS Techn. Sparring', role: '', isKern: false, isDashed: true },
    ],
    footer: '3–5 Wochen',
  },
  {
    nr: 'Phase 4',
    name: 'Einführung &\nNutzung',
    char: 'Pro Use Case',
    headerBg: '#2e5f8a',
    headerColor: '#fff',
    module: { id: 'Modul 4', name: 'Einführungsbegleitung', bg: '#ccdae9', color: '#1a365d', moduleIndex: 3 },
    bausteine: [
      { name: 'B7 Einführung', role: 'Kern', isKern: true },
      { name: 'B8 Transformation', role: 'Kern', isKern: true },
      { name: 'TS Techn. Sparring', role: '', isKern: false, isDashed: true },
    ],
    footer: '4–8 Wochen / UC',
  },
]

const crossThemes = [
  {
    name: 'B6 Regulatorik',
    levels: [
      { role: 'Baseline', intensity: 'basis' },
      { role: 'Filter', intensity: 'aktiv' },
      { role: 'Kern', intensity: 'kern' },
      { role: 'Prüfung', intensity: 'aktiv' },
      { role: 'Review', intensity: 'aktiv' },
    ],
  },
  {
    name: 'B9 Dokumentation',
    levels: [
      { role: 'Einfach', intensity: 'basis' },
      { role: 'Aufbau', intensity: 'aktiv' },
      { role: 'Struktur', intensity: 'aktiv' },
      { role: 'Nutzung', intensity: 'aktiv' },
      { role: 'Pflege', intensity: 'aktiv' },
    ],
  },
]

const intensityBg: Record<string, string> = {
  kern: '#d5e0ee',
  aktiv: '#e4ecf4',
  basis: '#f0f4f8',
}

// Module frame indices per deck (keyed by process-flow slide ID)
const moduleFrameConfig: Record<string, number[]> = {
  '05-ihr-weg-zur-strukturierten-ki-fuehrung': [5, 6, 7, 8, 9],
  '07-vorgehensmodell-5-phasen-5-module': [7, 8, 9, 10, 11],
  '16-unser-vorgehensmodell-5-module-fuer-den-weg-zur-ki-fuehrung': [16, 17, 18, 19, 20, 21],
}

export function ProcessFlowLayout({ slide, isActive = false }: ProcessFlowLayoutProps) {
  const goToFrame = usePreziStore((s) => s.goToFrame)
  const moduleIndices = moduleFrameConfig[slide.id] || [5, 6, 7, 8, 9]

  const handleModuleClick = (moduleIndex: number) => {
    goToFrame(moduleIndices[moduleIndex] ?? moduleIndex)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col items-center justify-center"
    >
      <div style={{ width: '100%', maxWidth: '1760px' }}>
        {/* Title */}
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontFamily: "'TT Firs Neue', sans-serif", fontSize: '38px', fontWeight: 600, color: '#001777', letterSpacing: '-0.3px', marginBottom: '4px' }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: '20px', fontWeight: 300, color: '#6b7280' }}>
            Beratungsmodule, Phasen und Bausteine im Überblick
          </p>
        </div>

        {/* Entry pill above Phase 1 */}
        <div className="flex" style={{ marginBottom: '2px' }}>
          <div className="flex flex-col items-center" style={{ width: 'calc(25% - 40px)' }}>
            <div style={{
              background: '#fff', color: '#001777', fontSize: '16px', fontWeight: 600,
              padding: '8px 20px', borderRadius: '6px', border: '1.5px solid #c5d5e8',
              textAlign: 'center', lineHeight: 1.35,
              fontFamily: "'TT Firs Neue', sans-serif",
            }}>
              Einstieg über die<br />initiale Standortbestimmung
            </div>
            <div style={{ width: '2px', height: '10px', background: '#001777', marginTop: '3px' }} />
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #001777' }} />
          </div>
        </div>

        {/* Phase flow + Donut */}
        <div className="flex items-stretch" style={{ gap: '14px', marginBottom: '14px' }}>
          {/* P1–P4 columns */}
          {phases.map((phase, pi) => (
            <div key={pi} className="flex flex-col relative" style={{ flex: '1 1 0' }}>
              {/* Arrow between columns */}
              {pi < 3 && (
                <div style={{
                  position: 'absolute', right: '-11px', top: '50%', transform: 'translateY(-50%)',
                  width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent',
                  borderLeft: '12px solid #0078FE', zIndex: 2, opacity: 0.45,
                }} />
              )}

              {/* Phase header */}
              <div className="text-center" style={{
                background: phase.headerBg, color: phase.headerColor,
                padding: '12px 8px 10px', borderRadius: '10px 10px 0 0',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.85, marginBottom: '2px' }}>
                  {phase.nr}
                </div>
                <div style={{ fontFamily: "'TT Firs Neue', sans-serif", fontSize: '19px', fontWeight: 600, lineHeight: 1.25, whiteSpace: 'pre-line' }}>
                  {phase.name}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '3px', fontWeight: 300 }}>
                  {phase.char}
                </div>
              </div>

              {/* Module - clickable */}
              <div
                onClick={() => handleModuleClick(phase.module.moduleIndex)}
                className="text-center cursor-pointer"
                style={{
                  padding: '8px 8px',
                  background: phase.module.bg,
                  borderLeft: '1px solid #e2e6ed', borderRight: '1px solid #e2e6ed',
                  transition: 'filter 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.93)' }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
                title={`→ ${phase.module.name} Details`}
              >
                <div style={{ fontFamily: "'TT Firs Neue', sans-serif", fontSize: '18px', fontWeight: 600, letterSpacing: '.3px', color: phase.module.color }}>
                  {phase.module.id}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 500, color: '#1a1a2e', lineHeight: 1.25 }}>
                  {phase.module.name}
                </div>
                <div style={{ fontSize: '13px', color: '#0078FE', marginTop: '2px', opacity: 0.7 }}>
                  ▸ Details anzeigen
                </div>
              </div>

              {/* Bausteine */}
              <div className="flex flex-col flex-1" style={{ borderLeft: '1px solid #e2e6ed', borderRight: '1px solid #e2e6ed', background: '#e8eef6' }}>
                {phase.bausteine.map((b, bi) => (
                  <div
                    key={bi}
                    className="flex items-center justify-center gap-2 text-center"
                    style={{
                      padding: '6px 8px',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: b.isDashed ? '#6b7280' : '#001777',
                      background: b.isDashed ? '#f3f4f6' : (b.isKern ? '#d5e0ee' : '#e8eef6'),
                      borderBottom: bi < phase.bausteine.length - 1 ? '1px solid #c5d5e8' : 'none',
                      boxShadow: b.isKern ? 'inset 3px 0 0 #001777' : 'none',
                      fontStyle: b.isDashed ? 'italic' : 'normal',
                      border: b.isDashed ? '1px dashed #9ca3af' : undefined,
                      lineHeight: 1.3,
                      minHeight: '36px',
                    }}
                  >
                    {b.name}
                    {b.role && (
                      <span style={{
                        fontSize: '13px', fontWeight: 400, color: '#334b73', padding: '2px 6px',
                        background: 'rgba(255,255,255,.5)', borderRadius: '3px',
                      }}>
                        {b.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center" style={{
                padding: '7px 8px', fontSize: '15px', color: '#6b7280', fontWeight: 300,
                borderLeft: '1px solid #e2e6ed', borderRight: '1px solid #e2e6ed',
                borderBottom: '1px solid #e2e6ed', borderRadius: '0 0 8px 8px', background: '#fafbfc',
              }}>
                {phase.footer}
              </div>
            </div>
          ))}

          {/* P5 Donut */}
          <div className="flex flex-col items-center" style={{ width: '220px', flexShrink: 0 }}>
            <div className="text-center" style={{ marginBottom: '6px' }}>
              <span style={{
                fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px',
                color: '#fff', background: '#001777', display: 'inline-block', padding: '3px 14px', borderRadius: '5px',
              }}>
                Phase 5
              </span>
              <div style={{ fontFamily: "'TT Firs Neue', sans-serif", fontSize: '19px', fontWeight: 600, color: '#001777', marginTop: '4px', lineHeight: 1.25 }}>
                Dauerhafte Führung
              </div>
            </div>
            <div
              onClick={() => handleModuleClick(4)}
              className="cursor-pointer"
              title="→ KI-Führungsbegleitung Details"
              style={{ transition: 'filter 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.93)' }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
            >
              <svg viewBox="0 0 200 200" width="180" height="180">
                <circle cx="100" cy="100" r="72" fill="none" stroke="#c5d5e8" strokeWidth="22" opacity=".45" />
                <circle cx="100" cy="100" r="83" fill="none" stroke="#001777" strokeWidth="1.5" opacity=".4" />
                <circle cx="100" cy="100" r="61" fill="none" stroke="#001777" strokeWidth="1.5" opacity=".4" />
                <circle cx="100" cy="100" r="60" fill="#fff" />
                <text x="100" y="88" textAnchor="middle" fontFamily="'TT Firs Neue', sans-serif" fontSize="18" fontWeight="600" fill="#001777">Modul 5</text>
                <text x="100" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fontWeight="500" fill="#374151">KI-Führungs-</text>
                <text x="100" y="124" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fontWeight="500" fill="#374151">begleitung</text>
                <text x="100" y="144" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#0078FE" opacity=".7">▸ Details</text>
              </svg>
            </div>
            <div style={{ width: '180px', border: '1px solid #e2e6ed', borderRadius: '0 0 6px 6px', overflow: 'hidden', marginTop: '-2px' }}>
              <div className="flex items-center justify-center gap-2" style={{
                padding: '6px 8px', fontSize: '16px', fontWeight: 500, color: '#001777',
                background: '#d5e0ee', boxShadow: 'inset 3px 0 0 #001777', minHeight: '34px',
              }}>
                B5 Governance
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#334b73', padding: '2px 6px', background: 'rgba(255,255,255,.5)', borderRadius: '3px' }}>Kern</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '15px', color: '#6b7280', fontWeight: 300 }}>
              Laufend (quartalsweise)
            </div>
          </div>
        </div>

        {/* Cross-cutting themes — aligned with phase columns */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#8899aa', marginBottom: '5px' }}>
            Phasenübergreifende Bausteine
          </div>
          {crossThemes.map((ct, ci) => (
            <div key={ci} className="flex" style={{
              marginBottom: '4px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid #c8d5e4',
              gap: '0px',
            }}>
              {ct.levels.map((level, li) => (
                <div
                  key={li}
                  className="flex items-center justify-center gap-2"
                  style={{
                    flex: li < 4 ? '1 1 0' : '0 0 234px',
                    padding: '7px 6px', fontSize: '15px', fontWeight: 500, color: '#001777',
                    background: intensityBg[level.intensity] || '#f0f4f8',
                    borderRight: li < ct.levels.length - 1 ? '1px solid rgba(200,213,230,.5)' : 'none',
                  }}
                >
                  {li === 0 && (
                    <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '.2px', whiteSpace: 'nowrap' }}>
                      {ct.name}
                    </span>
                  )}
                  <span style={{
                    fontSize: '14px', padding: '2px 7px', borderRadius: '3px',
                    background: 'rgba(255,255,255,.55)',
                    color: level.intensity === 'kern' ? '#3d7199' : (level.intensity === 'basis' ? '#8899aa' : '#3d7199'),
                  }}>
                    {level.role}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-5" style={{ fontSize: '15px', color: '#6b7280' }}>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '20px', height: '10px', borderRadius: '2px', background: '#059669' }} />
            <span>Einstieg (Modul 1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '20px', height: '10px', borderRadius: '2px', background: '#3d7199' }} />
            <span>Phasen & Module</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '20px', height: '10px', borderRadius: '2px', background: '#d5e0ee', boxShadow: 'inset 3px 0 0 #001777' }} />
            <span>Kern (Hauptfokus)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '20px', height: '10px', borderRadius: '2px', background: '#e4ecf4' }} />
            <span>Ergänzend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '20px', height: '10px', borderRadius: '2px', background: '#f0f4f8' }} />
            <span>Angelegt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: '24px', height: 0, borderTop: '2px dashed #9ca3af' }} />
            <span>Techn. Sparring (optional)</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
