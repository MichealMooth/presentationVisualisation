'use client'

import { motion } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { IconByKey, IconBuilding, IconGlühbirne } from '../icons/SlideIcons'
import { usePreziStore } from '@/stores/preziStore'

interface InfographicLayoutProps {
  slide: Slide
  isActive?: boolean
}

// Predefined data for ki-beratung slide 5
const slideData: Record<string, {
  title: string
  subtitle: string
  kpis: Array<{ value: string; label: string; source: string }>
  pressurePoints: Array<{ title: string; icon: string; items: string[] }>
  callout: string
}> = {
  '05-wettbewerbsdruck-marktdynamik': {
    title: 'Der Markt wartet nicht',
    subtitle: 'Warum Abwarten ein Risiko ist',
    kpis: [
      { value: '86%', label: 'erkennen KI-Relevanz', source: 'Bitkom 2024' },
      { value: '23%', label: 'haben Projekte umgesetzt', source: 'Bitkom 2024' },
    ],
    pressurePoints: [
      {
        title: 'Wettbewerber handeln',
        icon: 'trend',
        items: [
          'Branchenübergreifend setzen KMU auf KI',
          'Wer später startet, muss schneller aufholen'
        ]
      },
      {
        title: 'Fachkräftemangel',
        icon: 'users',
        items: [
          'Weniger Mitarbeiter = höherer Produktivitätsdruck',
          'KI macht Teams leistungsfähiger'
        ]
      },
      {
        title: 'Kundenerwartungen',
        icon: 'strategie',
        items: [
          'Schnellere Antworten, individuellere Angebote',
          'Konzern-Standards werden zum KMU-Standard'
        ]
      },
      {
        title: 'Regulatorik kommt',
        icon: 'waage',
        items: [
          'EU AI Act tritt schrittweise in Kraft',
          'Frühzeitige Struktur schützt vor Aufwand'
        ]
      }
    ],
    callout: 'Die Frage ist nicht mehr ob KI, sondern ob gesteuert oder ungesteuert.'
  }
}

// Icon mapping for key-fact cards based on title keywords
const keyFactIcons: Record<string, string> = {
  'interview': 'users',
  'umfrage': 'diagramm',
  'umfragezeit': 'uhr',
  'erhebungszeitraum': 'agenda',
  'erhebung': 'agenda',
  'methodik': 'search',
  'rücklauf': 'trend',
  'nutz': 'zahnrad',
  'account': 'schild',
  'regel': 'waage',
  'daten': 'daten',
}

function getIconForTitle(title: string): string {
  const lower = title.toLowerCase()
  for (const [keyword, icon] of Object.entries(keyFactIcons)) {
    if (lower.includes(keyword)) return icon
  }
  return 'strategie'
}

// Extract a leading number/percentage from a title (e.g. "91,5% nutzen KI" → "91,5%")
function extractHighlight(title: string): { highlight: string; rest: string } | null {
  const match = title.match(/^(\d[\d,.]*\s*%?)\s+(.+)/)
  if (match) return { highlight: match[1], rest: match[2] }
  const fracMatch = title.match(/^(\d+\s+von\s+\d+)\s+(.*)/)
  if (fracMatch) return { highlight: fracMatch[1], rest: fracMatch[2] }
  return null
}

// ── Avaloq Migration: Ist-Zustand Architecture Diagram ──
function BankArchitectureIst({ isActive }: { isActive: boolean }) {
  const goToFrame = usePreziStore((s) => s.goToFrame)

  const bizUnits = [
    { name: 'Retail Banking', sub: 'Privatkunden, Konten, Karten', color: '#0078FE' },
    { name: 'Corporate Banking', sub: 'Firmenkunden, Trade Finance', color: '#001777' },
    { name: 'Private Banking', sub: 'Wealth, Advisory, FIDLEG', color: '#7c3aed' },
    { name: 'Treasury', sub: 'FX, Geldmarkt, ALM', color: '#e97316' },
    { name: 'Risk & Compliance', sub: 'AML, Regulatorik', color: '#DC2626' },
  ]

  const channels = ['E-Banking', 'Mobile App', 'Berater-Frontend', 'ATM / SB', 'API-Portal']

  const avaloqModules = [
    { label: 'Kontoführung', sub: 'acct_ · GL, Salden, Limiten', icon: 'daten' },
    { label: 'Zahlungsverkehr', sub: 'pay_ · SEPA, SWIFT, SIC', icon: 'zahnrad' },
    { label: 'Securities', sub: 'asset_ · OMS, Depot, CA', icon: 'trend' },
    { label: 'Stammdaten', sub: 'bp_ · KYC, Adressen, Tax', icon: 'users' },
    { label: 'Kredit', sub: 'loan_ · Hypo, Sicherheiten', icon: 'strategie' },
    { label: 'Portfolio Mgmt', sub: 'pf_ · Mandate, Rebalancing', icon: 'diagramm' },
    { label: 'CRM', sub: 'crm_ · 360°, Beratung', icon: 'kompass' },
    { label: 'Compliance', sub: 'cpl_ · AML, Sanktionen', icon: 'schild' },
    { label: 'Meldewesen', sub: 'rpt_ · FINMA, BaFin, CRS', icon: 'waage' },
    { label: 'DMS / Output', sub: 'doc_ · Archiv, Auszüge', icon: 'search' },
    { label: 'Konditionen', sub: 'cond_ · Zinsen, Gebühren', icon: 'gluehbirne' },
    { label: 'Workflows', sub: 'wf_ · 4-Augen, Prozesse', icon: 'rakete' },
  ]

  const satellitesLeft = [
    { name: 'Treasury / Handel', product: 'Murex MX.3', color: '#e97316' },
    { name: 'Marktdaten', product: 'Bloomberg / Refinitiv', color: '#059669' },
    { name: 'DWH / Analytics', product: 'Snowflake / SAS', color: '#0078FE' },
    { name: 'Finanzplanung', product: 'additiv / CREALOGIX', color: '#7c3aed' },
  ]
  const satellitesRight = [
    { name: 'AML Screening', product: 'NICE Actimize', color: '#DC2626' },
    { name: 'Card Processing', product: 'SIX / Worldline', color: '#e97316' },
    { name: 'IAM', product: 'SailPoint / Airlock', color: '#001777' },
    { name: 'Trade Finance', product: 'Finastra / Surecomp', color: '#059669' },
  ]

  const externalsPayment = ['SIC / euroSIC', 'SWIFT', 'TARGET2', 'SEPA / STEP2', 'TWINT']
  const externalsSecurities = ['SIX SIS', 'Clearstream', 'SIX Exchange', 'Eurex', 'CLS']
  const externalsRegulators = ['FINMA', 'BaFin', 'SNB', 'EZB / SSM']
  const externalsData = ['WM Daten', 'SIX FI', 'ZEK / CRIF', 'S&P / Moody\'s']

  return (
    <div className="flex flex-col h-full w-full px-6 pt-12 pb-3 items-center">
      <motion.h2 initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-[#000039] font-headline mb-3 text-center">
        Heutige Systemlandschaft
      </motion.h2>

      <div className="w-full flex-1 flex flex-col gap-2">

        {/* ZONE 1: Geschäftsbereiche */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 }}
          className="relative bg-gray-50/80 border border-gray-200 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-[#000039]/40 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gray-200 uppercase tracking-wider">Geschäftsbereiche</span>
          <div className="flex gap-2">
            {bizUnits.map((bu, i) => (
              <div key={i} className="flex-1 rounded-lg px-3 py-2 text-center border bg-white" style={{ borderColor: bu.color + '30' }}>
                <div className="text-base font-bold" style={{ color: bu.color }}>{bu.name}</div>
                <div className="text-sm text-[#000039]/40">{bu.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ZONE 2: Kanäle & Integration */}
        <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          className="relative bg-[#001777]/4 border border-[#001777]/10 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-[#001777]/50 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#001777]/15 uppercase tracking-wider">Kanäle & Integration</span>
          <div className="flex gap-2 mb-1.5">
            {channels.map((ch, i) => (
              <div key={i} className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 text-center text-sm font-semibold text-[#000039]/60">{ch}</div>
            ))}
          </div>
          <div className="bg-[#001777]/8 border border-[#001777]/12 rounded-lg py-1.5 text-center text-sm font-semibold text-[#001777]/60 flex justify-center gap-5">
            <span>API-Gateway</span><span className="text-[#001777]/20">|</span>
            <span>ESB / MQ</span><span className="text-[#001777]/20">|</span>
            <span>Batch</span><span className="text-[#001777]/20">|</span>
            <span>Kafka</span><span className="text-[#001777]/40 ml-2">200+ Schnittstellen</span>
          </div>
        </motion.div>

        {/* ZONE 3: Applikationslandschaft – Satellites + Avaloq */}
        <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.15 }}
          className="relative bg-[#000039]/3 border border-[#000039]/10 rounded-xl px-4 pt-5 pb-3 flex-1 flex flex-col">
          <span className="absolute -top-2.5 left-4 bg-white text-[#000039]/50 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#000039]/15 uppercase tracking-wider">Applikationslandschaft</span>

          <div className="flex gap-3 flex-1 items-stretch">
            {/* Left satellites */}
            <div className="w-[190px] flex flex-col gap-2 shrink-0 justify-center">
              <div className="text-xs font-bold text-[#000039]/30 uppercase tracking-wider text-center">Satelliten</div>
              {satellitesLeft.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-white border rounded-xl px-3 py-2.5 text-center shadow-sm" style={{ borderColor: s.color + '30' }}>
                  <div className="text-sm font-bold text-[#000039]">{s.name}</div>
                  <div className="text-[13px]" style={{ color: s.color }}>{s.product}</div>
                </motion.div>
              ))}
            </div>

            {/* AVALOQ CENTER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={isActive ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1 relative border-2 border-[#001777] rounded-2xl bg-gradient-to-br from-[#000039] via-[#000039] to-[#001777] px-4 pt-5 pb-2.5 shadow-xl cursor-pointer hover:border-[#17f0f0] hover:shadow-[0_0_24px_rgba(23,240,240,0.15)] transition-all duration-300 flex flex-col"
              onClick={() => goToFrame(2)}
            >
              <div className="absolute -top-3 left-4 bg-[#001777] text-white text-sm font-bold px-4 py-0.5 rounded-full tracking-wider uppercase">
                Avaloq Banking Suite – Monolith
              </div>
              <div className="absolute -top-3 right-4 bg-[#17f0f0] text-[#000039] text-[13px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Details
              </div>

              {/* 6x2 Module grid */}
              <div className="grid grid-cols-6 gap-x-2 gap-y-2 flex-1 content-center">
                {avaloqModules.map((m, i) => (
                  <div key={i} className="bg-white/8 border border-white/12 rounded-lg py-2 px-1.5 text-center">
                    <div className="text-white text-sm font-semibold leading-tight">{m.label}</div>
                    <div className="text-[#17f0f0]/50 text-[13px] leading-tight mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Shared DB bar */}
              <div className="bg-amber-500/8 border border-amber-500/15 rounded-lg py-1.5 px-3 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center">
                    <IconByKey icon="daten" size={13} color="#f59e0b" />
                  </div>
                  <span className="text-amber-300/80 text-sm font-bold">Gemeinsame Oracle DB</span>
                </div>
                <span className="text-[#17f0f0]/60 text-sm font-bold">500–600 Tabellen · Single Point of Coupling</span>
                <span className="text-[#17f0f0] text-sm font-bold cursor-pointer hover:underline hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); goToFrame(3); }}>
                  Migrationsumfang →
                </span>
              </div>
            </motion.div>

            {/* Right satellites */}
            <div className="w-[190px] flex flex-col gap-2 shrink-0 justify-center">
              <div className="text-xs font-bold text-[#000039]/30 uppercase tracking-wider text-center">Ergänzung</div>
              {satellitesRight.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-white border rounded-xl px-3 py-2.5 text-center shadow-sm" style={{ borderColor: s.color + '30' }}>
                  <div className="text-sm font-bold text-[#000039]">{s.name}</div>
                  <div className="text-[13px]" style={{ color: s.color }}>{s.product}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ZONE 4: Externe Schnittstellen */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          className="relative border border-red-200/30 bg-red-50/30 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-red-400/70 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200/40 uppercase tracking-wider">Externe Schnittstellen</span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Zahlungsnetzwerke', items: externalsPayment, color: '#0078FE' },
              { label: 'Wertschriften', items: externalsSecurities, color: '#059669' },
              { label: 'Regulatoren', items: externalsRegulators, color: '#DC2626' },
              { label: 'Daten & Rating', items: externalsData, color: '#e97316' },
            ].map((cat, ci) => (
              <div key={ci} className="bg-white border rounded-lg px-3 py-2" style={{ borderColor: cat.color + '20' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: cat.color }}>{cat.label}</div>
                <div className="text-sm text-[#000039]/50">{cat.items.join(' · ')}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Avaloq Migration: Soll-Zustand Architecture Diagram ──
function BankArchitectureSoll({ isActive }: { isActive: boolean }) {
  const goToFrame = usePreziStore((s) => s.goToFrame)

  const bizUnits = [
    { name: 'Retail Banking', color: '#0078FE' },
    { name: 'Corporate Banking', color: '#001777' },
    { name: 'Private Banking', color: '#7c3aed' },
    { name: 'Treasury', color: '#e97316' },
    { name: 'Risk & Compliance', color: '#DC2626' },
  ]
  const channels = ['E-Banking', 'Mobile App', 'Berater-Frontend', 'ATM / SB', 'API-Portal']

  const newSystems = [
    {
      name: 'INUS', color: '#0078FE', frame: 5, icon: 'daten',
      modules: [
        { label: 'Kontoführung', sub: 'GL, Salden, Limiten' },
        { label: 'Zahlungsverkehr', sub: 'SEPA, SWIFT, SIC, Instant' },
        { label: 'Kreditmanagement', sub: 'Hypotheken, Sicherheiten' },
        { label: 'Konditionen', sub: 'Zinsen, Gebühren, Pricing' },
      ],
    },
    {
      name: 'Stammdatensystem', color: '#059669', frame: 6, icon: 'users',
      modules: [
        { label: 'Kundenstamm', sub: 'Golden Record, KYC' },
        { label: 'Referenzdaten', sub: 'Währungen, Länder, Codes' },
        { label: 'Instrumentenstamm', sub: 'ISIN, Valor, WKN' },
        { label: 'Compliance-Daten', sub: 'CRS, FATCA, PEP' },
      ],
    },
    {
      name: 'Upquest', color: '#e97316', frame: 7, icon: 'trend',
      modules: [
        { label: 'Order Management', sub: 'OMS, Routing, Execution' },
        { label: 'Depotführung', sub: 'Custody, Bestände' },
        { label: 'Corporate Actions', sub: 'Dividenden, Splits, Events' },
        { label: 'Portfolio Mgmt', sub: 'Mandate, Rebalancing' },
      ],
    },
  ]

  const satellitesLeft = [
    { name: 'Treasury / Handel', product: 'Murex MX.3', color: '#e97316' },
    { name: 'Marktdaten', product: 'Bloomberg / Refinitiv', color: '#059669' },
    { name: 'DWH / Analytics', product: 'Snowflake / SAS', color: '#0078FE' },
  ]
  const satellitesRight = [
    { name: 'AML Screening', product: 'NICE Actimize', color: '#DC2626' },
    { name: 'Card Processing', product: 'SIX / Worldline', color: '#e97316' },
    { name: 'IAM', product: 'SailPoint / Airlock', color: '#001777' },
  ]

  const externalsPayment = ['SIC / euroSIC', 'SWIFT', 'TARGET2', 'SEPA', 'TWINT']
  const externalsSecurities = ['SIX SIS', 'Clearstream', 'SIX Exchange', 'Eurex']
  const externalsRegulators = ['FINMA', 'BaFin', 'SNB', 'EZB']
  const externalsData = ['WM Daten', 'SIX FI', 'ZEK / CRIF', 'S&P']

  return (
    <div className="flex flex-col h-full w-full px-6 pt-12 pb-3 items-center">
      <motion.h2 initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-[#000039] font-headline mb-3 text-center">
        Modulare Zielarchitektur
      </motion.h2>

      <div className="w-full flex-1 flex flex-col gap-2">

        {/* ZONE 1: Geschäftsbereiche */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 }}
          className="relative bg-gray-50/80 border border-gray-200 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-[#000039]/40 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gray-200 uppercase tracking-wider">Geschäftsbereiche</span>
          <div className="flex gap-2">
            {bizUnits.map((bu, i) => (
              <div key={i} className="flex-1 rounded-lg px-3 py-2 text-center border bg-white" style={{ borderColor: bu.color + '30' }}>
                <div className="text-base font-bold" style={{ color: bu.color }}>{bu.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ZONE 2: Kanäle & Integration */}
        <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          className="relative bg-[#001777]/4 border border-[#001777]/10 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-[#001777]/50 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#001777]/15 uppercase tracking-wider">Kanäle & Integration</span>
          <div className="flex gap-2 mb-1.5">
            {channels.map((ch, i) => (
              <div key={i} className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 text-center text-sm font-semibold text-[#000039]/60">{ch}</div>
            ))}
          </div>
          <div className="bg-[#001777]/8 border border-[#001777]/12 rounded-lg py-1.5 text-center text-sm font-semibold text-[#001777]/60 flex justify-center gap-5">
            <span>API-Gateway</span><span className="text-[#17f0f0]">·</span>
            <span>Event-Streaming (Kafka)</span><span className="text-[#17f0f0]">·</span>
            <span>Microservices</span><span className="text-[#17f0f0]">·</span>
            <span>Entkoppelte Integration</span>
          </div>
        </motion.div>

        {/* ZONE 3: Applikationslandschaft – Satellites + 3 neue Systeme */}
        <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.15 }}
          className="relative bg-[#000039]/3 border border-[#000039]/10 rounded-xl px-4 pt-5 pb-3 flex-1 flex flex-col">
          <span className="absolute -top-2.5 left-4 bg-white text-[#000039]/50 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#000039]/15 uppercase tracking-wider">Applikationslandschaft · Modular</span>

          <div className="flex gap-3 flex-1 items-stretch">
            {/* Left satellites */}
            <div className="w-[175px] flex flex-col gap-2 shrink-0 justify-center">
              <div className="text-xs font-bold text-[#000039]/30 uppercase tracking-wider text-center">Satelliten</div>
              {satellitesLeft.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-white border rounded-xl px-3 py-2.5 text-center shadow-sm" style={{ borderColor: s.color + '30' }}>
                  <div className="text-sm font-bold text-[#000039]">{s.name}</div>
                  <div className="text-[13px]" style={{ color: s.color }}>{s.product}</div>
                </motion.div>
              ))}
            </div>

            {/* Three new systems */}
            <div className="flex-1 grid grid-cols-3 gap-2.5">
              {newSystems.map((sys, si) => (
                <motion.div key={si}
                  initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + si * 0.08, duration: 0.45 }}
                  className="relative rounded-xl px-3 pt-6 pb-2.5 shadow-lg border-2 cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col"
                  style={{ borderColor: sys.color, background: `linear-gradient(135deg, ${sys.color}06, ${sys.color}12)` }}
                  onClick={() => goToFrame(sys.frame)}
                >
                  <div className="absolute -top-3 left-3 z-10 text-white text-sm font-bold px-3 py-0.5 rounded-full tracking-wider uppercase"
                    style={{ backgroundColor: sys.color }}>
                    {sys.name}
                  </div>
                  <div className="absolute -top-3 right-3 z-10 text-[13px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 bg-white"
                    style={{ color: sys.color, border: `1px solid ${sys.color}40` }}>
                    Mapping →
                  </div>

                  <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                    {sys.modules.map((m, mi) => (
                      <div key={mi} className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-gray-100">
                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: sys.color + '15' }}>
                          <IconByKey icon={sys.icon} size={14} color={sys.color} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#000039] leading-tight">{m.label}</div>
                          <div className="text-[13px] text-[#000039]/40 leading-tight">{m.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right satellites */}
            <div className="w-[175px] flex flex-col gap-2 shrink-0 justify-center">
              <div className="text-xs font-bold text-[#000039]/30 uppercase tracking-wider text-center">Ergänzung</div>
              {satellitesRight.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={isActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-white border rounded-xl px-3 py-2.5 text-center shadow-sm" style={{ borderColor: s.color + '30' }}>
                  <div className="text-sm font-bold text-[#000039]">{s.name}</div>
                  <div className="text-[13px]" style={{ color: s.color }}>{s.product}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* KI-Migration Tools Banner inside the zone */}
          <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#000039] to-[#001777] rounded-lg py-2 px-4 flex items-center justify-center gap-4 mt-2">
            <IconByKey icon="gluehbirne" size={15} color="#17f0f0" />
            <span className="text-sm font-bold text-white/80">KI-generierte Migrationsskripte · Mapping-Tools · Recon-Tools</span>
            <span className="text-[#17f0f0] text-sm font-bold">verbinden Alt → Neu</span>
          </motion.div>
        </motion.div>

        {/* ZONE 4: Externe Schnittstellen */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          className="relative border border-red-200/30 bg-red-50/30 rounded-xl px-4 pt-5 pb-2.5">
          <span className="absolute -top-2.5 left-4 bg-white text-red-400/70 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200/40 uppercase tracking-wider">Externe Schnittstellen</span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Zahlungsnetzwerke', items: externalsPayment, color: '#0078FE' },
              { label: 'Wertschriften', items: externalsSecurities, color: '#059669' },
              { label: 'Regulatoren', items: externalsRegulators, color: '#DC2626' },
              { label: 'Daten & Rating', items: externalsData, color: '#e97316' },
            ].map((cat, ci) => (
              <div key={ci} className="bg-white border rounded-lg px-3 py-2" style={{ borderColor: cat.color + '20' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: cat.color }}>{cat.label}</div>
                <div className="text-sm text-[#000039]/50">{cat.items.join(' · ')}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function InfographicLayout({ slide, isActive = false }: InfographicLayoutProps) {
  // ── Custom architecture renderers for avaloq-migration ──
  if (slide.id === '02-heutige-systemlandschaft') {
    return <BankArchitectureIst isActive={isActive} />
  }
  if (slide.id === '05-modulare-zielarchitektur') {
    return <BankArchitectureSoll isActive={isActive} />
  }

  const data = slideData[slide.id]
  const title = data?.title || slide.displayTitle || slide.title
  const subtitle = data?.subtitle
  const kpis = data?.kpis || []
  const hardcodedPoints = data?.pressurePoints || []
  const contentAny = slide.content as Record<string, unknown> | undefined
  const parsedPoints = (!data && contentAny?.pressurePoints as Array<{ title: string; items: string[] }>) || []
  const pressurePoints = hardcodedPoints.length > 0 ? hardcodedPoints : []
  const calloutText = data?.callout || slide.content?.callout?.text

  // Use parsed key-fact cards when no hardcoded data
  // Separate notice/hint items (e.g., "Vertraulichkeit") from regular cards
  const noticeKeywords = ['vertraulichkeit', 'hinweis', 'datenschutz']
  const regularPoints = parsedPoints.filter((p: { title: string }) => !noticeKeywords.some(k => p.title.toLowerCase().includes(k)))
  const noticePoints = parsedPoints.filter((p: { title: string }) => noticeKeywords.some(k => p.title.toLowerCase().includes(k)))
  const useKeyFacts = !data && regularPoints.length > 0

  return (
    <div className="flex flex-col h-full w-full px-8 justify-center items-center">
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
          <p className="text-xl text-base-blue-dark/60 mt-1">{subtitle}</p>
        )}
      </motion.div>

      {/* Key-fact card grid (parsed data) */}
      {useKeyFacts && (
        <div className={`grid gap-5 max-w-[1100px] mx-auto w-full ${
          regularPoints.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
          regularPoints.length <= 4 ? 'grid-cols-1 md:grid-cols-2' :
          regularPoints.length <= 6 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {regularPoints.map((point: { title: string; items: string[] }, index: number) => {
            const cleanTitle = point.title.replace(/:$/, '')
            const extracted = extractHighlight(cleanTitle)
            const icon = getIconForTitle(cleanTitle)
            const accentColors = [
              'border-[#17f0f0]',
              'border-blue-400',
              'border-emerald-400',
              'border-amber-400',
              'border-violet-400',
              'border-rose-400',
              'border-sky-400',
            ]
            const accent = accentColors[index % accentColors.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${accent}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-base-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconByKey icon={icon} size={22} color="#001777" />
                  </div>
                  <div className="min-w-0">
                    {extracted ? (
                      <>
                        <span className="text-3xl font-extrabold text-base-blue-dark leading-tight block">
                          {extracted.highlight}
                        </span>
                        <span className="text-lg font-semibold text-base-blue-dark/80">
                          {extracted.rest}
                        </span>
                      </>
                    ) : (
                      <h4 className="text-lg font-bold text-base-blue-dark leading-snug">
                        {cleanTitle}
                      </h4>
                    )}
                  </div>
                </div>
                {point.items.length > 0 && (
                  <ul className="space-y-1 pl-1 mt-2">
                    {point.items.map((item, i) => (
                      <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-base-blue/40 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Notice banner (e.g., Vertraulichkeit) */}
      {noticePoints.length > 0 && noticePoints.map((notice: { title: string; items: string[] }, ni: number) => (
        <motion.div
          key={`notice-${ni}`}
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.7 + ni * 0.1 }}
          className="mt-4 max-w-[1100px] w-full mx-auto px-5 py-4 bg-[#001777]/5 border border-[#001777]/15 rounded-xl flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#001777]/10 flex items-center justify-center shrink-0 mt-0.5">
            <IconByKey icon="schloss" size={20} color="#001777" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#000039]/80">{notice.title.replace(/:$/, '')}</h4>
            {notice.items.map((item, i) => (
              <p key={i} className="text-base text-[#000039]/60 leading-relaxed mt-1">{item}</p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* KPI Comparison - only when KPIs exist */}
      {kpis.length >= 2 && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center items-center gap-6 mb-6"
          >
            <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl px-10 py-6 border-2 border-emerald-200 shadow-lg min-w-[220px]">
              <span className="text-6xl font-extrabold text-emerald-600">{kpis[0]?.value}</span>
              <p className="text-base text-emerald-700 mt-2 font-medium">{kpis[0]?.label}</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-red-500 text-3xl font-bold">↔</div>
              <div className="text-sm text-red-500 font-bold uppercase tracking-wide">Gap</div>
            </div>
            <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl px-10 py-6 border-2 border-red-200 shadow-lg min-w-[220px]">
              <span className="text-6xl font-extrabold text-red-500">{kpis[1]?.value}</span>
              <p className="text-base text-red-700 mt-2 font-medium">{kpis[1]?.label}</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center text-sm text-gray-500 mb-4 font-medium"
          >
            Quelle: {kpis[0]?.source}
          </motion.p>
        </>
      )}

      {/* Pressure Points with center KMU (hardcoded data only) */}
      {pressurePoints.length > 0 && (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col gap-4 w-[320px]">
            {pressurePoints.slice(0, 2).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 border-r-4 border-red-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <IconByKey icon={point.icon} size={22} color="#dc2626" />
                  </div>
                  <h4 className="font-bold text-base-blue-dark text-lg">{point.title}</h4>
                </div>
                <ul className="space-y-1 pl-1">
                  {point.items.map((item, i) => (
                    <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-base-blue to-base-blue-dark flex items-center justify-center shadow-2xl border-4 border-white"
            >
              <div className="text-center text-white flex flex-col items-center">
                <IconBuilding size={30} color="white" />
                <p className="text-sm font-bold mt-1">Ihr KMU</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </motion.div>
          </div>
          <div className="flex flex-col gap-4 w-[320px]">
            {pressurePoints.slice(2, 4).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <IconByKey icon={point.icon} size={22} color="#dc2626" />
                  </div>
                  <h4 className="font-bold text-base-blue-dark text-lg">{point.title}</h4>
                </div>
                <ul className="space-y-1 pl-1">
                  {point.items.map((item, i) => (
                    <li key={i} className="text-base text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Callout */}
      {calloutText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-4 p-4 bg-gradient-to-r from-base-blue to-base-blue-dark rounded-xl text-center shadow-lg"
        >
          <p className="text-white font-semibold text-lg flex items-center justify-center gap-2">
            <IconGlühbirne size={20} color="white" /> {calloutText}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default InfographicLayout
