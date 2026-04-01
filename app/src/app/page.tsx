'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import hubData from '../../content/hub.json'
import { exportToPptx } from '@/lib/exportPptx'
import type { DeckData } from '@/lib/content/schema'

import kiBeratungData from '../../content/decks/ki-beratung.json'
import triceptAgData from '../../content/decks/tricept-ag.json'
import angebotM1Data from '../../content/decks/angebotspraesentation-m1.json'
import steuerungskreisData from '../../content/decks/steuerungskreis-cos-ki.json'
import ergebnisM1Data from '../../content/decks/ergebnispraesentation-m1.json'
import m1KompaktData from '../../content/decks/m1-kompakt.json'
import kiChancenRisikenData from '../../content/decks/ki-chancen-risiken.json'

const deckDataRegistry: Record<string, DeckData> = {
  'ki-beratung': kiBeratungData as DeckData,
  'tricept-ag': triceptAgData as DeckData,
  'angebotspraesentation-m1': angebotM1Data as DeckData,
  'steuerungskreis-cos-ki': steuerungskreisData as DeckData,
  'ergebnispraesentation-m1': ergebnisM1Data as DeckData,
  'm1-kompakt': m1KompaktData as DeckData,
  'ki-chancen-risiken': kiChancenRisikenData as DeckData,
}

function PptxButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false)
  const data = deckDataRegistry[slug]
  if (!data) return null

  return (
    <button
      onClick={async (e) => {
        e.stopPropagation()
        if (loading) return
        setLoading(true)
        try {
          await exportToPptx(data)
        } catch (err) {
          console.error('PPTX export failed:', err)
        } finally {
          setLoading(false)
        }
      }}
      disabled={loading}
      className="p-1.5 text-base-blue-dark/40 hover:text-base-blue hover:bg-base-grey rounded-md transition-colors disabled:opacity-50"
      title="Als PowerPoint exportieren"
    >
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z"/><path d="M14 2v6h6"/><path d="M9 13h2v4H9z"/><path d="M13 11h2v6h-2z"/></svg>
      )}
    </button>
  )
}

interface DeckInfo {
  slug: string
  title: string
  description: string
  tags: string[]
  customer: string | null
  type: string
  cover: string | null
  order: number
  slideCount: number
  updatedAt: string
}

export default function DeckHub() {
  const router = useRouter()
  const decks: DeckInfo[] = hubData.decks

  return (
    <div className="min-h-screen bg-base-grey flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-base-grey-dark">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/Bildmarke.png"
              alt="Tricept Logo"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
            <div>
              <h1 className="text-xl font-bold text-base-blue-dark font-headline">
                Präsentationen
              </h1>
              <p className="text-sm text-base-blue-dark/60">
                IT Consulting by Tricept
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-base-blue-dark font-headline mb-4">
            Wählen Sie eine Präsentation
          </h2>
          <p className="text-lg text-base-blue-dark/60 max-w-2xl mx-auto">
            Alle verfügbaren Präsentationen auf einen Blick. Klicken Sie auf eine Karte, um zu starten.
          </p>
        </motion.div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, index) => (
            <motion.div
              key={deck.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-accent/30 hover:-translate-y-1 cursor-pointer group"
                onClick={() => router.push(`/deck/${deck.slug}`)}
              >
                {/* Cover Image or Gradient */}
                <div className="h-40 bg-gradient-to-br from-base-blue to-base-blue-dark relative overflow-hidden">
                  {deck.cover ? (
                    <Image
                      src={deck.cover}
                      alt={deck.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000039" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                    </div>
                  )}
                  {/* Customer badge */}
                  {deck.customer && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-base-blue-dark">
                      {deck.customer}
                    </div>
                  )}
                  {/* Slide count badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-base-blue-dark">
                    {deck.slideCount} Folien
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-base-blue-dark mb-2 line-clamp-2 group-hover:text-base-blue transition-colors">
                    {deck.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {deck.description}
                  </p>

                  {/* Tags */}
                  {deck.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {deck.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-base-grey rounded-md text-xs text-base-blue-dark/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <PptxButton slug={deck.slug} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/deck/${deck.slug}/export`)
                        }}
                        className="p-1.5 text-base-blue-dark/40 hover:text-base-blue hover:bg-base-grey rounded-md transition-colors"
                        title="Als PDF exportieren"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/deck/${deck.slug}/presenter`)
                        }}
                        className="p-1.5 text-base-blue-dark/40 hover:text-base-blue hover:bg-base-grey rounded-md transition-colors"
                        title="Presenter-Modus"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      </button>
                    </div>
                    <span className="px-4 py-1.5 bg-accent text-base-blue-dark text-xs font-bold rounded-lg group-hover:bg-accent/80 transition-colors">
                      Starten →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-base-blue-dark mb-2">
              Keine Präsentationen gefunden
            </h3>
            <p className="text-gray-600">
              Fügen Sie Präsentationen im <code className="bg-gray-100 px-2 py-1 rounded">/decks</code> Ordner hinzu.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-base-grey-dark bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} IT Consulting by Tricept
        </div>
      </footer>
    </div>
  )
}
