'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { usePreziStore } from '@/stores/preziStore'
import {
  IconBausteine,
  IconCheck, IconGlühbirne, IconDiagramm,
  IconSchild, IconStrategie, IconGovernance, IconRakete, IconSteuerrad,
  IconByKey,
} from '../icons/SlideIcons'

interface BulletsLayoutProps {
  slide: Slide
  isActive?: boolean
}

// ── Angebotspräsentation: Folie 3 – Rückblick Ersttermin ──
const rueckblickData = {
  title: 'Rückblick Ersttermin',
  intro: 'Am 20. Februar haben wir gemeinsam eure KI-Situation besprochen. Die Kernerkenntnisse:',
  items: [
    { icon: IconCheck, title: 'Produktive KI vorhanden', desc: 'Ihr habt bereits KI-Anwendungen im Einsatz (Chat-Assistent, Vertragserfassungsassistent)', color: '#059669' },
    { icon: IconWarningTriangle, title: 'Fehlende Struktur', desc: 'Governance, strategische Steuerung und klare Verantwortlichkeiten fehlen noch', color: '#f59e0b' },
    { icon: IconDiagramm, title: 'Unterschiedliche Affinität', desc: 'Die Spannbreite im Team reicht von stark KI-affin bis vorsichtig', color: '#0078FE' },
    { icon: IconSchild, title: 'Shadow-AI wahrscheinlich', desc: 'Nicht-autorisierte KI-Nutzung ist vorhanden, aber nicht systematisch erfasst', color: '#ef4444' },
    { icon: IconGlühbirne, title: 'Pragmatisch & konkret', desc: 'Euer Wunsch: Kein Overhead, direkt umsetzbare Empfehlungen', color: '#8b5cf6' },
  ],
}

// ── Folie 12 – Was ihr bekommt ──
const deliverableData = {
  title: 'Was ihr bekommt',
  subtitle: 'Konkrete Ergebnisse der Standortbestimmung',
  items: [
    { icon: IconDiagramm, title: 'Initiales Reifegradprofil', desc: 'Einordnung über 6 Dimensionen mit konkreten Stärken und Handlungsfeldern', color: '#001777' },
    { icon: IconBausteine, title: 'KI-Nutzungsübersicht', desc: 'Vollständiges Bild: autorisierte Anwendungen, Shadow-AI, technische Abhängigkeiten', color: '#0078FE' },
    { icon: IconSchild, title: 'Regulatorische Einordnung', desc: 'EU AI Act und DSGVO — besonders relevant für euer Finanzumfeld', color: '#059669' },
    { icon: IconStrategie, title: 'Priorisierte Handlungsfelder', desc: 'Die 2–3 Themen mit dem größten Hebel', color: '#8b5cf6' },
    { icon: IconGlühbirne, title: 'Klares Angebot', desc: 'Empfehlung für das weitere gemeinsame Vorgehen — basierend auf eurer Situation', color: '#f59e0b' },
  ],
}

// ── Folie 13 – Festpreis ──
const pricingData = {
  title: 'Standortbestimmung',
  items: [
    { label: 'Umfang', value: '3–5 Beratertage', accent: false, special: false },
    { label: 'Preismodell', value: 'Festpreis', accent: false, special: false },
    { label: 'Investition', value: '', accent: true, special: true },
    { label: 'Reisekosten', value: 'nach Aufwand', accent: false, special: false },
    { label: 'Euer Aufwand', value: 'ca. 5–6 Stunden', accent: false, special: false },
  ],
}

// ── Folie 16 – Aufwandsrahmen für Folgemodule ──
const folgemoduleData = {
  title: 'Aufwandsrahmen für Folgemodule',
  intro: 'Nach der Standortbestimmung entscheidet ihr frei, ob und wie es weitergeht.',
  modules: [
    { icon: IconStrategie, title: 'KI-Strategie & Use-Cases', when: 'Wenn Zielbild und Priorisierung fehlen', effort: '6–10 BT', model: 'Aufwandsbasiert', color: '#0078FE', slideIndex: 6 },
    { icon: IconGovernance, title: 'Governance & Vorbereitung', when: 'Wenn Rollen, Regeln und Entscheidungswege fehlen', effort: '5–8 BT', model: 'Aufwandsbasiert', color: '#2e5f8a', slideIndex: 7 },
    { icon: IconRakete, title: 'Einführungsbegleitung', when: 'Wenn KI-Anwendungen eingeführt werden sollen', effort: '4–8 BT/UC', model: 'Aufwandsbasiert', color: '#059669', slideIndex: 8 },
    { icon: IconSteuerrad, title: 'KI-Führungsbegleitung', when: 'Für die dauerhafte Steuerung im Betrieb', effort: '1–2 BT/Q', model: 'Retainer', color: '#8b5cf6', slideIndex: 9 },
  ],
}


function IconWarningTriangle({ size = 24, color }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// Parse raw markdown into bullet items for generic rendering
function parseRawBullets(raw: string): Array<{ title: string; description?: string; bold?: boolean; isSection?: boolean }> {
  const items: Array<{ title: string; description?: string; bold?: boolean; isSection?: boolean }> = []
  const lines = raw.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      const text = trimmed.slice(2)
      const boldMatch = text.match(/^\*\*([^*]+)\*\*\s*(?:--|--|-|:|\|)\s*(.+)/)
      if (boldMatch) {
        items.push({ title: boldMatch[1], description: boldMatch[2], bold: true })
      } else {
        const boldOnly = text.match(/^\*\*([^*]+)\*\*(.*)/)
        if (boldOnly) {
          items.push({ title: boldOnly[1], description: boldOnly[2].replace(/^\s*[:|\-]\s*/, '') || undefined, bold: true })
        } else {
          items.push({ title: text })
        }
      }
    } else {
      // Detect section headers: standalone **Bold:** lines (not bullets)
      const sectionMatch = trimmed.match(/^\*\*([^*]+)\*\*[:\s]*$/)
      if (sectionMatch) {
        items.push({ title: sectionMatch[1].replace(/:$/, ''), isSection: true })
      }
    }
  }
  return items
}

const genericColors = [
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-purple-500',
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
]

export function BulletsLayout({ slide, isActive = false }: BulletsLayoutProps) {
  const goToFrame = usePreziStore((s) => s.goToFrame)
  const slideId = slide.id

  // ─── Folie 3: Rückblick ───
  if (slideId === '03-rueckblick-ersttermin') {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-2">{rueckblickData.title}</h2>
          <p className="text-xl text-[#000039]/60 mb-6 max-w-4xl">{rueckblickData.intro}</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4">
          {rueckblickData.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className={`rounded-xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col gap-3 ${i >= 3 ? 'col-span-1' : ''}`}
              style={{ borderLeft: `4px solid ${item.color}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: item.color + '15' }}>
                  <item.icon size={22} color={item.color} />
                </div>
                <h3 className="font-bold text-[#000039] text-lg">{item.title}</h3>
              </div>
              <p className="text-base text-[#000039]/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Folie 12: Deliverables ───
  if (slideId === '12-was-ihr-bekommt') {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{deliverableData.title}</h2>
          <p className="text-xl text-[#000039]/60 mt-1">{deliverableData.subtitle}</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4">
          {deliverableData.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className={`rounded-xl bg-white border border-gray-100 shadow-md p-5 flex flex-col items-center text-center gap-3 ${i >= 3 ? '' : ''}`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: item.color + '12' }}>
                <item.icon size={28} color={item.color} />
              </div>
              <h3 className="font-bold text-[#000039] text-lg">{item.title}</h3>
              <p className="text-base text-[#000039]/55 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Folie 13: Pricing ───
  if (slideId === '13-standortbestimmung-festpreis') {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-8"
        >
          {pricingData.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-[#001777] to-[#000039] text-white p-10 shadow-2xl max-w-3xl w-full"
        >
          <div className="grid grid-cols-2 gap-6">
            {pricingData.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className={`flex flex-col ${item.accent ? 'col-span-2 items-center py-4 border-y border-white/20' : ''}`}
              >
                <span className="text-xs uppercase tracking-widest text-white/50 mb-1">{item.label}</span>
                {item.special ? (
                  <span className="font-bold text-4xl text-[#17f0f0]">
                    <span className="line-through text-white/40 text-2xl mr-3">4.500 EUR</span>
                    <span>0 EUR</span>
                  </span>
                ) : (
                  <span className={`font-bold ${item.accent ? 'text-4xl text-[#17f0f0]' : 'text-xl text-white'}`}>{item.value}</span>
                )}
                {item.accent && <span className="text-xs text-white/40 mt-1">zzgl. MwSt.</span>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Folie 16: Aufwandsrahmen Folgemodule ───
  if (slideId === '16-aufwandsrahmen-fuer-folgemodule' || slideId === '14-orientierung-folgemodule') {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-2">{folgemoduleData.title}</h2>
          <p className="text-xl text-[#000039]/60 mb-5">{folgemoduleData.intro}</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-5">
          {folgemoduleData.modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="rounded-xl bg-white border border-gray-100 shadow-md p-6 cursor-pointer group"
              style={{ borderLeft: `4px solid ${mod.color}` }}
              onClick={() => goToFrame(mod.slideIndex)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: mod.color + '15' }}>
                  <mod.icon size={26} color={mod.color} />
                </div>
                <h3 className="font-bold text-[#000039] text-xl">{mod.title}</h3>
              </div>
              <p className="text-base text-[#000039]/55 mb-4">{mod.when}</p>
              <div className="flex items-center gap-3">
                <span className="text-lg px-4 py-2 rounded-xl font-bold" style={{ background: mod.color + '12', color: mod.color }}>{mod.effort}</span>
                <span className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium">{mod.model}</span>
              </div>
              <div className="mt-2 text-xs opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: mod.color }}>
                ▸ Details anzeigen
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.6 }}
          className="text-sm text-[#000039]/50 mt-4 text-center"
        >
          Optional: Technisches Sparring — zuschaltbar ab Governance-Phase
        </motion.p>
      </div>
    )
  }

  // ─── Predefined deliverable data (ki-beratung slide 12) ───
  const predefinedDeliverables: Record<string, {
    title: string; subtitle?: string;
    deliverables: Array<{ module: string; result: string; iconKey: string; color: string }>
    callout?: string
  }> = {
    '12-was-sie-konkret-in-die-hand-bekommen': {
      title: 'Was Sie konkret erhalten',
      subtitle: 'Dokumente, mit denen Sie arbeiten können',
      deliverables: [
        { module: 'KI-Standortbestimmung', result: 'Reifegrad-Profil mit Stärken, Lücken und Handlungsempfehlungen', iconKey: 'mappin', color: 'from-blue-500 to-indigo-500' },
        { module: 'KI-Strategie & Use-Cases', result: 'Dokumentierte Strategie mit Leitplanken und priorisierten Anwendungsfällen', iconKey: 'kompass', color: 'from-purple-500 to-pink-500' },
        { module: 'Governance', result: 'Rollen, Entscheidungswege, verbindliche Regeln', iconKey: 'dokument', color: 'from-emerald-500 to-teal-500' },
        { module: 'Einführungsbegleitung', result: 'Go-Live-Checkliste, Betriebsregeln, Lessons Learned', iconKey: 'rakete', color: 'from-orange-500 to-red-500' },
        { module: 'KI-Führungsbegleitung', result: 'Quartals-Reviews, Entscheidungsdokumentation, KI-Verzeichnis', iconKey: 'diagramm', color: 'from-cyan-500 to-blue-500' },
      ],
      callout: 'Jedes Dokument gehört Ihnen und funktioniert auch ohne uns.'
    }
  }

  // Check predefined deliverable data by slide number (for ki-beratung deck)
  const predefData = predefinedDeliverables[slide.id]
  if (predefData) {
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{predefData.title}</h2>
          {predefData.subtitle && <p className="text-xl text-[#000039]/60 mt-1">{predefData.subtitle}</p>}
        </motion.div>
        <div className="space-y-4 max-w-5xl mx-auto w-full">
          {predefData.deliverables.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }} className="bg-white rounded-xl shadow-md overflow-hidden group">
              <div className="flex items-center gap-5 p-5">
                <div className={`w-2 self-stretch rounded-full bg-gradient-to-b ${item.color}`} />
                <div className={`w-14 h-14 rounded-xl shadow-md bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <IconByKey icon={item.iconKey} size={28} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#000039] text-lg mb-1">{item.module}</h3>
                  <p className="text-base text-gray-600">{item.result}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {predefData.callout && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg">
            <p className="text-white font-semibold">{predefData.callout}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Folie 9: Ausarbeitungsstand ───
  if (slideId === '03-uebersicht-ausarbeitungsstand') {
    const statusData = [
      { module: 'M1', name: 'KI-Standortbestimmung', status: 'grün', detail: 'Playbook, Templates, 6 DFH, 4 E-Mail-Vorlagen, 4 Excel-Bögen', icon: 'kompass', color: '#059669' },
      { module: 'M2', name: 'KI-Strategie & Use-Cases', status: 'gelb', detail: 'Playbook + Templates fertig, DFH ausstehend', icon: 'strategie', color: '#f59e0b' },
      { module: 'M3', name: 'Governance & Umsetzungsvorbereitung', status: 'gelb', detail: 'Playbook + Template fertig, DFH ausstehend', icon: 'zahnrad', color: '#f59e0b' },
      { module: 'M4', name: 'Einführungsbegleitung', status: 'gelb', detail: 'Playbook + Template fertig, DFH ausstehend', icon: 'rakete', color: '#f59e0b' },
      { module: 'M5', name: 'KI-Führungsbegleitung', status: 'gelb', detail: 'Playbook + Template fertig, DFH ausstehend', icon: 'steuerrad', color: '#f59e0b' },
      { module: 'TS', name: 'Technisches Sparring', status: 'gelb', detail: 'Playbook fertig, DFH ausstehend', icon: 'bausteine', color: '#f59e0b' },
    ]
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline">Ausarbeitungsstand</h2>
          <p className="text-xl text-[#000039]/60 mt-1">COS-KI Beratungskonzept — Stand 10.03.2026</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto w-full">
          {statusData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="rounded-xl bg-white border border-gray-100 shadow-md p-5"
              style={{ borderLeft: `4px solid ${item.color}` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: item.color + '15' }}>
                  <IconByKey icon={item.icon} size={22} color={item.color} />
                </div>
                <div>
                  <span className="text-base font-bold" style={{ color: item.color }}>{item.module}</span>
                  <h3 className="font-bold text-[#000039] text-lg leading-tight">{item.name}</h3>
                </div>
                <div className="ml-auto w-4 h-4 rounded-full" style={{ background: item.status === 'grün' ? '#059669' : '#f59e0b' }} title={item.status === 'grün' ? 'Vollständig praxisreif' : 'Playbook fertig, DFH ausstehend'} />
              </div>
              <p className="text-base text-[#000039]/55">{item.detail}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} className="mt-4 flex items-center justify-center gap-6 text-base text-[#000039]/50">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#059669]" /> Vollständig praxisreif</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /> Playbook + Templates fertig</span>
        </motion.div>
      </div>
    )
  }

  // ─── Folie 10: Was wurde erarbeitet ───
  if (slideId === '04-was-wurde-erarbeitet') {
    const artifacts = [
      { title: 'Playbook', desc: 'Kompletter Ablaufplan: Vorbereitung, Erhebung, Auswertung, Präsentation', icon: 'dokument', color: '#001777' },
      { title: 'Template', desc: 'Ergebnisdokument mit Reifegradprofil, Shadow-AI-Befund, Handlungsempfehlungen', icon: 'notiz', color: '#0078FE' },
      { title: '6 Durchführungshilfen', desc: 'Reifegradmodell, Erhebungsbögen, Shadow-AI, KI-Umfrage, Kickoff, Tag-5-Präsentation', icon: 'bausteine', color: '#059669' },
      { title: '4 E-Mail-Vorlagen', desc: 'Einladungen für alle Interview-Formate', icon: 'dokument', color: '#8b5cf6' },
      { title: '4 Excel-Erhebungsbögen', desc: 'Automatisierte Erstellung via Python-Scripts', icon: 'diagramm', color: '#e97316' },
    ]
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#000039] font-headline">Was wurde erarbeitet</h2>
          <p className="text-xl text-[#000039]/60 mt-1">M1 ist das erste vollständig praxisreife Modul</p>
        </motion.div>
        <div className="space-y-3 max-w-5xl w-full">
          {artifacts.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="flex items-center gap-5 p-5 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="w-2 self-stretch rounded-full shrink-0" style={{ background: item.color }} />
              <div className="w-14 h-14 rounded-xl shadow-sm flex items-center justify-center shrink-0" style={{ background: item.color + '12' }}>
                <IconByKey icon={item.icon} size={28} color={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#000039] text-xl">{item.title}</h3>
                <p className="text-lg text-[#000039]/55">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-5xl">
          <p className="text-white font-semibold text-lg">M1 ist der Maßstab — M2–M5 werden schrittweise auf dieses Niveau gebracht.</p>
        </motion.div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 6 – Dimensionsprofil ───
  if (slideId === '06-dimensionsprofil-die-6-dimensionen-im-detail') {
    const dimItems = parseRawBullets(slide.content?.rawMarkdown || '')
    const dimIcons = ['kompass', 'users', 'gluehbirne', 'server', 'daten', 'waage']
    const callout6 = slide.content?.callout?.text
    const stufeColors: Record<string, { bg: string; bar: string }> = {
      '1': { bg: 'bg-gray-400', bar: 'w-[20%] bg-gray-400' },
      '1-2': { bg: 'bg-slate-500', bar: 'w-[30%] bg-slate-500' },
      '2': { bg: 'bg-blue-500', bar: 'w-[40%] bg-blue-500' },
      '2-3': { bg: 'bg-blue-600', bar: 'w-[50%] bg-blue-600' },
      '3': { bg: 'bg-indigo-600', bar: 'w-[60%] bg-indigo-600' },
    }
    const dims = dimItems.filter(d => !d.isSection).map((d, i) => {
      const stufeMatch = d.title.match(/\(Stufe\s+([\d-]+)\)/)
      const stufe = stufeMatch ? stufeMatch[1] : '2'
      const name = d.title.replace(/\s*\(Stufe\s+[\d-]+\)\s*:?/, '').replace(/:$/, '')
      return { name, stufe, desc: d.description || '', icon: dimIcons[i] || 'kompass' }
    })
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
          {dims.map((d, i) => {
            const colors = stufeColors[d.stufe] || stufeColors['2']
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-md p-5 flex flex-col gap-3 relative overflow-hidden" style={{ borderTop: '3px solid #001777' }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#001777]/10 flex items-center justify-center shrink-0">
                    <IconByKey icon={d.icon} size={22} color="#001777" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#000039] text-lg leading-tight">{d.name}</h3>
                  </div>
                </div>
                {/* Stufe bar */}
                <div className="flex items-center gap-3">
                  <span className={`text-base font-bold text-white px-4 py-1.5 rounded-full shrink-0 min-w-[100px] text-center ${colors.bg}`}>Stufe {d.stufe}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bar}`} />
                  </div>
                </div>
                <p className="text-base text-[#000039]/60 leading-relaxed">{d.desc}</p>
              </motion.div>
            )
          })}
        </div>
        {callout6 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }} className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg max-w-6xl w-full">
            <p className="text-white font-semibold text-lg">{callout6}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 8 – 7 Stärken ───
  if (slideId === '08-7-staerken-ihr-startkapital') {
    const strengthItems = parseRawBullets(slide.content?.rawMarkdown || '').filter(d => !d.isSection)
    const strengthIcons = ['diagramm', 'server', 'users', 'check', 'waage', 'rakete', 'daten']
    const rawLines = (slide.content?.rawMarkdown || '').split('\n')
    const footerLine = rawLines.filter(l => l.trim() && !l.trim().startsWith('-') && !l.trim().startsWith('**')).pop()?.trim()
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 max-w-5xl w-full">
          {strengthItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm p-4 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <IconByKey icon={strengthIcons[i] || 'check'} size={22} color="#059669" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#000039] text-base leading-tight">{item.title}</h3>
                {item.description && <p className="text-sm text-[#000039]/55 leading-relaxed mt-0.5">{item.description?.trim()}</p>}
              </div>
            </motion.div>
          ))}
        </div>
        {footerLine && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }} className="mt-4 p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-center shadow-lg max-w-6xl w-full">
            <p className="text-white font-semibold text-lg">{footerLine}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 9 – 6 Risiken ───
  if (slideId === '09-6-handlungsfelder-wo-verbesserungspotenzial-liegt') {
    const riskItems = parseRawBullets(slide.content?.rawMarkdown || '').filter(d => !d.isSection)
    const riskIcons = ['versteckt', 'dokument', 'warnung', 'users', 'waage', 'euro']
    const risks = riskItems.map((item, i) => {
      const sevMatch = item.title.match(/^(Hoch|Mittel|Priorität\s*\d):\s*/i)
      const severity = sevMatch ? sevMatch[1] : 'Priorität 2'
      const name = item.title.replace(/^(Hoch|Mittel|Priorität\s*\d):\s*/i, '')
      return { name, severity, desc: item.description || '', icon: riskIcons[i] || 'warnung' }
    })
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
          {risks.map((r, i) => {
            const isHigh = r.severity.includes('1') || r.severity === 'Hoch'
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                className={`rounded-2xl shadow-md p-5 flex flex-col gap-3 relative ${isHigh ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white ${isHigh ? 'bg-red-500' : 'bg-amber-500'}`}>{r.severity}</span>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHigh ? 'bg-red-500/15' : 'bg-amber-500/15'}`}>
                    <IconByKey icon={r.icon} size={22} color={isHigh ? '#ef4444' : '#f59e0b'} />
                  </div>
                  <h3 className="font-bold text-[#000039] text-base leading-tight pr-12">{r.name}</h3>
                </div>
                <p className="text-base text-[#000039]/60 leading-relaxed">{r.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 11 – Schadensfälle ───
  if (slideId === '11-konkrete-schadensfaelle-bereits-eingetreten') {
    const incItems = parseRawBullets(slide.content?.rawMarkdown || '').filter(d => !d.isSection)
    const incIcons = ['server', 'daten', 'dokument']
    const incidents = incItems.filter(it => !it.title.includes('Muster'))
    const patternItem = incItems.find(it => it.title.includes('Muster'))
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
          {incidents.map((inc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 shadow-md p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg">{i + 1}</div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <IconByKey icon={incIcons[i] || 'warnung'} size={22} color="#ef4444" />
                </div>
              </div>
              <h3 className="font-bold text-[#000039] text-base leading-tight">{inc.title.replace(/^Vorfall\s*\d+:\s*/, '')}</h3>
              {inc.description && <p className="text-base text-[#000039]/60 leading-relaxed">{inc.description}</p>}
            </motion.div>
          ))}
        </div>
        {patternItem && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
            className="mt-4 p-5 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl shadow-lg max-w-6xl w-full flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <IconByKey icon="warnung" size={26} color="#f59e0b" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{patternItem.title.replace(/^[⚠️\s]*/, '').replace(/:$/, '')}</h3>
              {patternItem.description && <p className="text-white/70 text-base mt-1">{patternItem.description.trim()}</p>}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 12 – Kein Freigabeprozess ───
  if (slideId === '12-kein-freigabeprozess-nicht-nur-fuer-ki') {
    const fpItems = parseRawBullets(slide.content?.rawMarkdown || '')
    const fpIcons = ['dokument', 'waage', 'zahnrad']
    const befundItem = fpItems.find(it => it.isSection && it.title.toLowerCase().includes('befund'))
    const sections: Array<{ title: string; desc: string }> = []
    let befundText = ''
    let currentTitle = ''
    for (const it of fpItems) {
      if (it.isSection) {
        if (it.title.toLowerCase().includes('befund')) {
          currentTitle = '__befund__'
        } else {
          currentTitle = it.title
        }
      } else if (currentTitle === '__befund__') {
        befundText = it.title + (it.description ? ` – ${it.description}` : '')
      } else if (currentTitle) {
        sections.push({ title: currentTitle, desc: it.title + (it.description ? ` – ${it.description}` : '') })
        currentTitle = ''
      }
    }
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-5 max-w-6xl w-full">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden">
              {/* Decorative bg icon */}
              <div className="absolute -bottom-2 -right-2 opacity-[0.05] pointer-events-none">
                <IconByKey icon={fpIcons[i] || 'dokument'} size={100} color="#000039" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#001777]/10 flex items-center justify-center">
                <IconByKey icon={fpIcons[i] || 'dokument'} size={26} color="#001777" />
              </div>
              <h3 className="font-bold text-[#000039] text-lg font-headline leading-tight">{s.title}</h3>
              <p className="text-base text-[#000039]/60 leading-relaxed relative z-10">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        {befundText && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55 }}
            className="mt-5 p-5 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl shadow-lg max-w-6xl w-full flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <IconByKey icon="warnung" size={26} color="#f59e0b" />
            </div>
            <p className="text-white font-medium text-lg">{befundText}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 14 – Annahmen und Leitplanken ───
  if (slideId === '14-annahmen-und-leitplanken') {
    const alItems = parseRawBullets(slide.content?.rawMarkdown || '')
    const sections: Array<{ title: string; items: Array<{ title: string; description?: string }> }> = []
    let currentSection: typeof sections[0] | null = null
    for (const it of alItems) {
      if (it.isSection) {
        currentSection = { title: it.title, items: [] }
        sections.push(currentSection)
      } else if (currentSection) {
        currentSection.items.push({ title: it.title, description: it.description })
      }
    }
    // Separate: banner sections (1 item, standalone message) vs column sections (multiple items)
    const bannerSections = sections.filter(s => s.items.length === 1 && s.title.toLowerCase().includes('chefsache'))
    const columnSections = sections.filter(s => !bannerSections.includes(s))
    const leftSection = columnSections[0]
    const rightSection = columnSections[1]
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        {/* Chefsache banner */}
        {bannerSections.map((bs, bi) => (
          <motion.div key={`banner-${bi}`} initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4 max-w-6xl w-full px-5 py-3 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl flex items-center gap-4 shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <IconByKey icon="strategie" size={22} color="#17f0f0" />
            </div>
            <p className="text-white font-medium text-base leading-relaxed">{bs.items[0]?.title}{bs.items[0]?.description ? ` – ${bs.items[0].description}` : ''}</p>
          </motion.div>
        ))}
        <div className="grid grid-cols-2 gap-5 max-w-6xl w-full">
          {/* Left column: Annahmen */}
          {leftSection && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl bg-blue-50 border border-blue-200 shadow-md overflow-hidden">
              <div className="bg-[#001777] px-5 py-3">
                <h3 className="font-bold text-white text-lg font-headline">{leftSection.title}</h3>
              </div>
              <div className="p-4 space-y-2">
                {leftSection.items.map((it, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-100">
                    <span className="w-7 h-7 rounded-full bg-[#001777] text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-[#000039]/80 leading-relaxed">{it.title}{it.description ? ` – ${it.description}` : ''}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Right column: Leitplanken */}
          {rightSection && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl bg-teal-50 border border-teal-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3">
                <h3 className="font-bold text-white text-lg font-headline">{rightSection.title}</h3>
              </div>
              <div className="p-4 space-y-2">
                {rightSection.items.map((it, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-teal-100">
                    <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-[#000039]/80 leading-relaxed">{it.title}{it.description ? ` – ${it.description}` : ''}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 15 – Handlungsplan ───
  if (slideId === '15-handlungsplan-gemeinsam-ins-handeln-kommen') {
    const hpItems = parseRawBullets(slide.content?.rawMarkdown || '')
    const phases: Array<{ title: string; subtitle: string; items: Array<{ title: string; description?: string }> }> = []
    let curPhase: typeof phases[0] | null = null
    for (const it of hpItems) {
      if (it.isSection) {
        const parts = it.title.split('–').map(s => s.trim())
        curPhase = { title: parts[0] || it.title, subtitle: parts[1] || '', items: [] }
        phases.push(curPhase)
      } else if (curPhase) {
        curPhase.items.push({ title: it.title, description: it.description })
      }
    }
    const phaseConfig = [
      { gradient: 'from-red-500 to-orange-500', bg: 'bg-red-50', border: 'border-red-200', icon: 'dialog', dot: 'bg-red-500', label: 'Jetzt' },
      { gradient: 'from-[#001777] to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'handshake', dot: 'bg-[#001777]', label: 'Kurzfristig' },
      { gradient: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'kompass', dot: 'bg-indigo-500', label: 'In M2' },
    ]
    const itemIcons = ['dialog', 'rakete', 'waage', 'warnung', 'dokument', 'check', 'zahnrad', 'strategie', 'gluehbirne']
    let iconIdx = 0
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        {/* Timeline bar with dots */}
        <div className="max-w-6xl w-full relative mb-6">
          <motion.div initial={{ scaleX: 0 }} animate={isActive ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-0 left-[16.67%] right-[16.67%] h-1.5 bg-gradient-to-r from-red-400 via-blue-500 to-indigo-500 rounded-full" style={{ transformOrigin: 'left' }} />
          <div className="flex justify-between px-[12%]">
            {phases.map((_, pi) => {
              const cfg = phaseConfig[pi] || phaseConfig[2]
              return (
                <motion.div key={pi} initial={{ scale: 0 }} animate={isActive ? { scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.4 + pi * 0.15, type: 'spring' }}
                  className="flex flex-col items-center gap-1 -mt-2.5">
                  <div className={`w-7 h-7 rounded-full ${cfg.dot} border-4 border-white shadow-md`} />
                  <span className="text-xs font-bold text-[#000039]/50 uppercase tracking-wider">{cfg.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
        {/* Phase cards */}
        <div className="grid grid-cols-3 gap-5 max-w-6xl w-full">
          {phases.map((phase, pi) => {
            const cfg = phaseConfig[pi] || phaseConfig[2]
            return (
              <motion.div key={pi} initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + pi * 0.12 }}
                className={`rounded-2xl ${cfg.bg} border ${cfg.border} shadow-lg overflow-hidden`}>
                <div className={`bg-gradient-to-r ${cfg.gradient} px-5 py-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <IconByKey icon={cfg.icon} size={22} color="white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg font-headline leading-tight">{phase.title}</h3>
                      {phase.subtitle && <p className="text-white/70 text-sm">{phase.subtitle}</p>}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2.5">
                  {phase.items.map((it, i) => {
                    const ic = itemIcons[iconIdx++ % itemIcons.length]
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: 0.5 + pi * 0.12 + i * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${cfg.gradient} opacity-80`}>
                          <IconByKey icon={ic} size={16} color="white" />
                        </div>
                        <p className="text-base text-[#000039]/80 leading-relaxed">{it.title}{it.description ? ` – ${it.description}` : ''}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 21 – Empfehlung Umfassend ───
  if (slideId === '27-unsere-empfehlung-paket-umfassend') {
    const empItems = parseRawBullets(slide.content?.rawMarkdown || '').filter(d => !d.isSection)
    const empIcons = ['users', 'rakete', 'server', 'waage', 'euro']
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-5 flex items-center gap-4 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001777] to-[#000039] flex items-center justify-center shadow-lg">
            <IconByKey icon="strategie" size={26} color="#17f0f0" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="space-y-3 max-w-5xl w-full">
          {empItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              className={`flex items-start gap-5 p-5 rounded-2xl border border-gray-100 shadow-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F3]'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001777] to-[#000039] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-lg">{i + 1}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#001777]/10 flex items-center justify-center shrink-0">
                <IconByKey icon={empIcons[i] || 'check'} size={22} color="#001777" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#000039] text-lg">{item.title}</h3>
                {item.description && <p className="text-base text-[#000039]/60 mt-1 leading-relaxed">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 22 – Fazit in 3 Sätzen ───
  if (slideId === '28-unser-fazit') {
    const allItems = parseRawBullets(slide.content?.rawMarkdown || '')
    const sectionIdx = allItems.findIndex(it => it.isSection)
    const fazitItems = (sectionIdx >= 0 ? allItems.slice(0, sectionIdx) : allItems).filter(d => !d.isSection)
    const roiItems = sectionIdx >= 0 ? allItems.slice(sectionIdx).filter(d => !d.isSection) : []
    const fazitConfig = [
      { icon: 'check' as const, gradient: 'from-emerald-100 to-emerald-200', border: 'border-emerald-400', iconBg: 'bg-emerald-600', numColor: 'text-emerald-300' },
      { icon: 'waage' as const, gradient: 'from-blue-100 to-indigo-200', border: 'border-blue-400', iconBg: 'bg-blue-600', numColor: 'text-blue-300' },
      { icon: 'uhr' as const, gradient: 'from-amber-100 to-orange-200', border: 'border-amber-400', iconBg: 'bg-amber-600', numColor: 'text-amber-300' },
    ]
    const roiIcons = ['rakete', 'trend', 'gluehbirne', 'users', 'waage']
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline mb-5 text-center">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        {/* 3 Fazit Cards */}
        <div className="grid grid-cols-3 gap-4 max-w-6xl w-full">
          {fazitItems.slice(0, 3).map((item, i) => {
            const cfg = fazitConfig[i] || fazitConfig[0]
            const titleClean = item.title.replace(/^\d+\.\s*/, '')
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={isActive ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className={`rounded-2xl bg-gradient-to-br ${cfg.gradient} border ${cfg.border} shadow-lg p-5 flex flex-col items-center text-center relative overflow-hidden`}>
                <span className={`absolute top-2 right-4 text-6xl font-bold ${cfg.numColor} select-none pointer-events-none`}>{i + 1}</span>
                <div className={`w-12 h-12 rounded-2xl ${cfg.iconBg} flex items-center justify-center mb-3 shadow-md`}>
                  <IconByKey icon={cfg.icon} size={24} color="white" />
                </div>
                <h3 className="font-bold text-[#000039] text-lg mb-2 font-headline">{titleClean}</h3>
                {item.description && <p className="text-sm text-[#000039]/65 leading-relaxed">{item.description}</p>}
              </motion.div>
            )
          })}
        </div>
        {/* ROI Key Facts */}
        {roiItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 max-w-6xl w-full">
            <div className="flex gap-3">
              {roiItems.map((item, i) => {
                const icon = roiIcons[i % roiIcons.length]
                const highlight = item.title.match(/^\+?[\d,.]+\s?[%×]?\s*/)
                const rest = highlight ? item.title.slice(highlight[0].length).trim() : item.title
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
                    className="flex-1 rounded-xl bg-[#000039]/5 border border-[#001777]/10 px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#001777]/10 flex items-center justify-center shrink-0">
                      <IconByKey icon={icon} size={18} color="#001777" />
                    </div>
                    <div className="min-w-0">
                      {highlight ? (
                        <>
                          <span className="text-lg font-extrabold text-[#001777]">{highlight[0].trim()}</span>
                          <span className="text-sm text-[#000039]/70 ml-1">{rest}</span>
                        </>
                      ) : (
                        <span className="text-sm text-[#000039]/70 font-medium leading-tight">{item.title}</span>
                      )}
                      {item.description && <p className="text-xs text-[#000039]/40 mt-0.5">{item.description}</p>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
        {/* Bottom callout */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-4 p-4 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl text-center shadow-lg max-w-6xl w-full">
          <p className="text-white font-semibold text-lg">Die Basis steht, die Bereitschaft ist da. Wir bringen die Struktur – gemeinsam wird aus Dynamik Wettbewerbsvorteil.</p>
        </motion.div>
      </div>
    )
  }

  // ─── Ergebnispräsentation: Folie 23 – Nächste Schritte ───
  if (slideId === '29-naechste-schritte') {
    const stepItems = parseRawBullets(slide.content?.rawMarkdown || '').filter(d => !d.isSection)
    const stepIcons = ['dialog', 'dokument', 'paket', 'rakete', 'agenda', 'users']
    const urgentItems = stepItems.slice(0, 2)
    const planItems = stepItems.slice(2, 5)
    const contactItem = stepItems[5]
    return (
      <div className="flex flex-col h-full w-full px-6 justify-center items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{slide.displayTitle || slide.title}</h2>
        </motion.div>
        <div className="max-w-5xl w-full space-y-4 mx-auto">
          {/* Urgent group */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">SOFORT – Diese Woche</span>
            </motion.div>
            <div className="space-y-2">
              {urgentItems.map((it, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                  className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                    <IconByKey icon={stepIcons[i]} size={22} color="#ef4444" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#000039] text-base">{it.title}</h3>
                    {it.description && <p className="text-base text-[#000039]/60 mt-0.5">{it.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Planning group */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">PLANUNG</span>
            </motion.div>
            <div className="space-y-2">
              {planItems.map((it, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.35, delay: 0.35 + i * 0.06 }}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#001777]/10 flex items-center justify-center shrink-0">
                    <IconByKey icon={stepIcons[i + 2]} size={22} color="#001777" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#000039] text-base">{it.title}</h3>
                    {it.description && <p className="text-base text-[#000039]/60 mt-0.5">{it.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Contact card */}
          {contactItem && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55 }}
              className="p-5 bg-gradient-to-r from-[#000039] to-[#001777] rounded-xl shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <IconByKey icon="users" size={26} color="#17f0f0" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{contactItem.title}</h3>
                {contactItem.description && <p className="text-white/70 text-base mt-0.5">{contactItem.description.trim()}</p>}
                {!contactItem.description && contactItem.title.includes('|') && (
                  <p className="text-white/70 text-base mt-0.5">{contactItem.title}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // ─── Generic fallback ───
  const rawItems = slide.content?.rawMarkdown ? parseRawBullets(slide.content.rawMarkdown) : []
  // Skip section headers, Kernbotschaft, and bold-only lines for intro text
  const introText = slide.content?.rawMarkdown
    ? slide.content.rawMarkdown.split('\n').find((l: string) => {
        const t = l.trim()
        return t && !t.startsWith('-') && !t.startsWith('**') && !t.includes('Kernbotschaft')
      })?.trim()
    : undefined
  const title = slide.displayTitle || slide.title
  const calloutText = slide.content?.callout?.text
  const hasSections = rawItems.some(item => item.isSection)
  let colorIdx = 0

  return (
    <div className="flex flex-col h-full w-full px-6 justify-center items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className={`text-center ${hasSections ? 'mb-4' : 'mb-6'}`}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000039] font-headline">{title}</h2>
        {introText && <p className="text-xl text-[#000039]/60 mt-2 max-w-3xl mx-auto">{introText}</p>}
      </motion.div>
      <div className={`${hasSections ? 'space-y-1.5' : 'space-y-3'} max-w-5xl w-full`}>
        {rawItems.map((item, i) => {
          if (item.isSection) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
                className={`${i > 0 ? 'mt-4' : ''} mb-1`}
              >
                <h3 className="text-xl font-bold text-[#000039]/80 font-headline flex items-center gap-2">
                  <div className={`w-8 h-1 rounded bg-gradient-to-r ${genericColors[colorIdx % genericColors.length]}`} />
                  {item.title}
                </h3>
              </motion.div>
            )
          }
          const currentColor = colorIdx
          colorIdx++
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.04 }}
              className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className={`w-1.5 self-stretch rounded-full bg-gradient-to-b ${genericColors[currentColor % genericColors.length]} shrink-0`} />
              <div className="flex-1">
                {item.bold ? (
                  <>
                    <h3 className="font-semibold text-[#000039] text-lg">{item.title}</h3>
                    {item.description && <p className="text-base text-[#000039]/60 mt-0.5">{item.description}</p>}
                  </>
                ) : (
                  <p className="text-base text-[#000039]/80">{item.title}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      {calloutText && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="mt-4 p-4 bg-gradient-to-r from-[#001777] to-[#000039] rounded-xl text-center shadow-lg">
          <p className="text-white font-semibold text-lg">{calloutText}</p>
        </motion.div>
      )}
    </div>
  )
}

export default BulletsLayout
