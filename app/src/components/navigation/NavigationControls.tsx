'use client'

import { useDeckStore } from '@/stores/deckStore'

export function NavigationControls() {
  const { nextSlide, prevSlide, currentSlideIndex, slides } = useDeckStore()

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex === slides.length - 1

  return (
    <div className="nav-controls">
      <button
        onClick={prevSlide}
        disabled={isFirst}
        className="nav-button disabled:opacity-30 disabled:cursor-not-allowed focus-ring"
        aria-label="Vorherige Folie"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        disabled={isLast}
        className="nav-button disabled:opacity-30 disabled:cursor-not-allowed focus-ring"
        aria-label="Nächste Folie"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Slide counter */}
      <div className="ml-2 px-3 py-2 bg-white rounded-full border border-base-grey-dark text-sm font-medium text-base-blue-dark shadow-md">
        {currentSlideIndex + 1} / {slides.length}
      </div>
    </div>
  )
}

export default NavigationControls
