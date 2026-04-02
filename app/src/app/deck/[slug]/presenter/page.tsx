'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useDeckStore } from '@/stores/deckStore'
import { usePresenterStore, formatTime } from '@/stores/presenterStore'
import { useNavigation } from '@/lib/hooks/useNavigation'
import { LayoutRenderer } from '@/components/layouts/LayoutRenderer'
import { DeckData } from '@/lib/content/schema'

// Import all available decks statically
import kiBeratungData from '../../../../../content/decks/ki-beratung.json'
import triceptAgData from '../../../../../content/decks/tricept-ag.json'

import angebotM1Data from '../../../../../content/decks/angebotspraesentation-m1.json'
import steuerungskreisData from '../../../../../content/decks/steuerungskreis-cos-ki.json'
import ergebnisM1Data from '../../../../../content/decks/ergebnispraesentation-m1.json'
import m1KompaktData from '../../../../../content/decks/m1-kompakt.json'
import kiChancenRisikenData from '../../../../../content/decks/ki-chancen-risiken.json'
import avaloqMigrationData from '../../../../../content/decks/avaloq-migration.json'

const deckRegistry: Record<string, DeckData> = {
  'ki-beratung': kiBeratungData as DeckData,
  'tricept-ag': triceptAgData as DeckData,
  'angebotspraesentation-m1': angebotM1Data as DeckData,
  'steuerungskreis-cos-ki': steuerungskreisData as DeckData,
  'ergebnispraesentation-m1': ergebnisM1Data as DeckData,
  'm1-kompakt': m1KompaktData as DeckData,
  'ki-chancen-risiken': kiChancenRisikenData as DeckData,
  'avaloq-migration': avaloqMigrationData as DeckData,
}

export default function PresenterPage() {
  const params = useParams()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    setDeckData,
    reset,
    slides,
    currentSlideIndex,
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
  } = useDeckStore()

  const {
    showNotes,
    showPreview,
    showTimer,
    toggleNotes,
    togglePreview,
    toggleTimer,
    elapsedTime,
    timerPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    updateElapsedTime,
  } = usePresenterStore()

  // Load deck data
  useEffect(() => {
    setLoading(true)
    setError(null)
    reset()

    const deckData = deckRegistry[slug]
    if (deckData) {
      setDeckData(deckData)
      setLoading(false)
    } else {
      setError(`Präsentation "${slug}" nicht gefunden.`)
      setLoading(false)
    }
  }, [slug, setDeckData, reset])

  // Timer update
  useEffect(() => {
    const interval = setInterval(updateElapsedTime, 1000)
    return () => clearInterval(interval)
  }, [updateElapsedTime])

  // Set up keyboard navigation
  useNavigation({
    enableKeyboard: true,
    enableSwipe: false,
    enableWheel: false,
  })

  const nextSlideData = slides[currentSlideIndex + 1]

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-blue-dark">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Presenter Mode wird geladen...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-blue-dark">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Nicht gefunden</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-base-blue-dark rounded-xl font-medium hover:brightness-90 transition-all"
          >
            ← Zurück zur Übersicht
          </Link>
        </div>
      </div>
    )
  }

  if (slides.length === 0 || !currentSlide) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-blue-dark">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Presenter Mode wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/Bildmarke.png"
            alt="Logo"
            width={28}
            height={28}
            className="opacity-80"
          />
          <span className="font-semibold text-lg">Presenter Mode</span>
          <span className="text-gray-400 text-sm ml-2">
            Folie {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`px-3 py-1.5 rounded text-sm ${
              showTimer ? 'bg-accent text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Timer
          </button>
          <button
            onClick={toggleNotes}
            className={`px-3 py-1.5 rounded text-sm ${
              showNotes ? 'bg-accent text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Notes
          </button>
          <button
            onClick={togglePreview}
            className={`px-3 py-1.5 rounded text-sm ${
              showPreview ? 'bg-accent text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Preview
          </button>
          <Link
            href={`/deck/${slug}`}
            className="ml-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Audience View
          </Link>
          <Link
            href="/"
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Hub
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Current slide preview */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">
            Current Slide
          </h3>
          <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-xl relative">
            <div
              className={`
                absolute inset-0 flex items-center justify-center p-8
                ${currentSlide.theme === 'dark' ? 'bg-base-blue-dark text-white' : 'bg-base-grey'}
              `}
            >
              <div className="w-full max-w-4xl transform scale-75 origin-center">
                <LayoutRenderer slide={currentSlide} isActive={true} />
              </div>
            </div>
          </div>

          {/* Slide title */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-accent font-mono text-sm">
                #{currentSlide.number}
              </span>
              <h2 className="text-xl font-semibold mt-1">{currentSlide.title}</h2>
              {currentSlide.chapter && (
                <span className="text-gray-500 text-sm">
                  {currentSlide.chapter}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-96 flex flex-col border-l border-gray-700">
          {/* Timer */}
          {showTimer && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">
                Timer
              </h3>
              <div className="text-4xl font-mono text-center mb-3">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={timerPaused ? startTimer : pauseTimer}
                  className="px-4 py-2 bg-accent text-gray-900 rounded font-medium hover:brightness-90"
                >
                  {timerPaused ? 'Start' : 'Pause'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-gray-700 rounded font-medium hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Next slide preview */}
          {showPreview && nextSlideData && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                Next Slide
              </h3>
              <div className="aspect-video bg-white rounded overflow-hidden relative">
                <div
                  className={`
                    absolute inset-0 flex items-center justify-center p-4
                    ${nextSlideData.theme === 'dark' ? 'bg-base-blue-dark text-white' : 'bg-base-grey'}
                  `}
                >
                  <div className="w-full transform scale-50 origin-center">
                    <LayoutRenderer slide={nextSlideData} isActive={false} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {nextSlideData.title}
              </p>
            </div>
          )}

          {/* Notes */}
          {showNotes && (
            <div className="flex-1 p-4 overflow-auto">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">
                Speaker Notes
              </h3>
              {currentSlide.notes ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {currentSlide.notes}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Keine Notizen für diese Folie.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex-shrink-0 h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-medium flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Previous
        </button>

        {/* Slide dots */}
        <div className="flex gap-1.5 items-center">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${idx === currentSlideIndex
                  ? 'bg-accent scale-125'
                  : 'bg-gray-600 hover:bg-gray-500'
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-6 py-3 bg-accent text-gray-900 hover:brightness-90 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-medium flex items-center gap-2"
        >
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
