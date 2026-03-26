'use client'

import { useDeckStore } from '@/stores/deckStore'

export function ProgressBar() {
  const { currentSlideIndex, slides, chapters, goToSlide } = useDeckStore()

  const progress = slides.length > 1
    ? (currentSlideIndex / (slides.length - 1)) * 100
    : 0

  // Group slides by chapter
  const chapterSegments = chapters.map((chapter, idx) => {
    const nextChapter = chapters[idx + 1]
    const endSlide = nextChapter ? nextChapter.startSlide - 1 : slides.length

    const startIndex = slides.findIndex(s => s.number >= chapter.startSlide)
    const endIndex = slides.findIndex(s => s.number > endSlide)
    const slideCount = (endIndex === -1 ? slides.length : endIndex) - startIndex

    return {
      ...chapter,
      startIndex,
      slideCount,
      widthPercent: (slideCount / slides.length) * 100
    }
  })

  return (
    <div className="progress-bar">
      {/* Background segments for chapters */}
      <div className="absolute inset-0 flex">
        {chapterSegments.map((segment, idx) => (
          <div
            key={segment.id}
            className="h-full border-r border-white/20 last:border-r-0"
            style={{ width: `${segment.widthPercent}%` }}
            title={segment.title}
          />
        ))}
      </div>

      {/* Progress fill */}
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />

      {/* Clickable slide dots */}
      <div className="absolute inset-0 flex items-center">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(idx)}
            className={`
              absolute w-2 h-2 rounded-full transition-all duration-200
              -translate-x-1/2 hover:scale-150
              ${idx === currentSlideIndex
                ? 'bg-accent scale-125'
                : idx < currentSlideIndex
                  ? 'bg-white/60'
                  : 'bg-white/30'
              }
            `}
            style={{
              left: `${(idx / (slides.length - 1)) * 100}%`
            }}
            aria-label={`Folie ${slide.number}: ${slide.title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
