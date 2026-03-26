'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useDeckStore } from '@/stores/deckStore'
import { useNavigation } from '@/lib/hooks/useNavigation'
import { useDeepLink } from '@/lib/hooks/useDeepLink'
import { SlideContainer } from '@/components/SlideContainer'
import { ProgressBar, NavigationControls } from '@/components/navigation'
import { PreziCanvas } from '@/components/prezi/PreziCanvas'
import { usePreziStore } from '@/stores/preziStore'
import { DeckData } from '@/lib/content/schema'

// ---------------------------------------------------------------------------
// Deck-Daten importieren
// Importiere hier die generierten JSON-Dateien und ggf. Prezi-Layouts:
//
//   import myDeckData from '../../../../content/decks/my-deck.json'
//   import myPreziLayout from '../../../../content/decks/my-deck-prezi.json'
// ---------------------------------------------------------------------------
import exampleData from '../../../../content/decks/_example.json'

interface DeckEntry {
  data: DeckData
  navigation?: 'scroll' | 'prezi'
  preziLayout?: { frames: { slideIndex: number; x: number; y: number; scale: number; topic: string; hidden?: boolean }[]; topics: { id: string; title: string; color: string; x: number; y: number }[]; overview: { x: number; y: number; scale: number }; links?: { from: number; to: number }[] }
}

// ---------------------------------------------------------------------------
// Deck-Registry
// Trage hier alle Decks ein. Scroll-Decks brauchen nur data + navigation.
// Prezi-Decks brauchen zusaetzlich ein preziLayout.
//
// Beispiel:
//   'my-deck': { data: myDeckData as DeckData, navigation: 'scroll' },
//   'my-prezi': { data: myPreziData as DeckData, navigation: 'prezi', preziLayout: myPreziLayout },
// ---------------------------------------------------------------------------
const deckRegistry: Record<string, DeckEntry> = {
  '_example': { data: exampleData as DeckData, navigation: 'scroll' },
}

export default function DeckPage() {
  const params = useParams()
  const slug = params.slug as string
  const { setDeckData, slides, reset, currentSlideIndex } = useDeckStore()
  const { setLayout: setPreziLayout } = usePreziStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [navMode, setNavMode] = useState<'scroll' | 'prezi'>('scroll')

  // Load deck data
  useEffect(() => {
    setLoading(true)
    setError(null)
    reset()

    const entry = deckRegistry[slug]
    if (entry) {
      setDeckData(entry.data)
      const mode = entry.navigation || 'scroll'
      setNavMode(mode)

      // Initialize Prezi layout if applicable
      if (mode === 'prezi' && entry.preziLayout) {
        const layout = entry.preziLayout
        const layoutAny = layout as typeof layout & { links?: { from: number; to: number }[] }
        setPreziLayout(
          layout.frames.map((f: { slideIndex: number; x: number; y: number; scale: number; topic: string; hidden?: boolean }) => ({
            slideIndex: f.slideIndex,
            x: f.x,
            y: f.y,
            scale: f.scale,
            topic: f.topic,
            hidden: f.hidden || false,
          })),
          layout.topics.map((t) => ({
            id: t.id,
            title: t.title,
            color: t.color,
            x: t.x,
            y: t.y,
          })),
          layout.overview,
          layoutAny.links || []
        )
      }

      setLoading(false)
    } else {
      setError(`Presentation "${slug}" not found.`)
      setLoading(false)
    }
  }, [slug, setDeckData, reset, setPreziLayout])

  // Set up navigation (keyboard, touch) - only for scroll mode
  useNavigation({
    enableKeyboard: navMode === 'scroll',
    enableSwipe: navMode === 'scroll',
    enableWheel: false,
  })

  // Set up deep linking - only for scroll mode
  useDeepLink()

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000039]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#17f0f0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading presentation...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-grey">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-blue-dark mb-2">
            Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-base-blue text-white rounded-xl font-medium hover:bg-base-blue-dark transition-colors"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    )
  }

  // No slides loaded
  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000039]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#17f0f0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading presentation...</p>
        </div>
      </div>
    )
  }

  // Prezi mode
  if (navMode === 'prezi') {
    return (
      <main className="relative">
        <PreziCanvas slides={slides} />
        {/* Back to Hub */}
        <Link
          href="/"
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-white/70 text-sm hover:bg-white/20 hover:text-white transition-all"
        >
          Overview
        </Link>
      </main>
    )
  }

  // Scroll mode (existing behavior)
  return (
    <main className="relative">
      <SlideContainer />
      <ProgressBar />
      <NavigationControls />

      {/* Back to Hub button - only on first and last slide */}
      {(currentSlideIndex === 0 || currentSlideIndex === slides.length - 1) && (
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-xl shadow-md text-sm font-medium text-base-blue-dark hover:bg-white hover:shadow-lg transition-all"
        >
          Overview
        </Link>
      )}
    </main>
  )
}
