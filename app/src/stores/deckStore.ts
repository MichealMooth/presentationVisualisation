import { create } from 'zustand'
import { Slide, DeckData } from '@/lib/content/schema'

interface DeckState {
  // Data
  deckData: DeckData | null
  slides: Slide[]
  chapters: { id: string; title: string; startSlide: number }[]

  // Navigation
  currentSlideIndex: number
  currentSlide: Slide | null

  // Actions
  setDeckData: (data: DeckData) => void
  reset: () => void
  goToSlide: (index: number) => void
  goToSlideById: (id: string) => void
  nextSlide: () => void
  prevSlide: () => void
  goToChapter: (chapterId: string) => void

  // Computed
  progress: number
  currentChapter: { id: string; title: string; startSlide: number } | null
  isFirstSlide: boolean
  isLastSlide: boolean
}

export const useDeckStore = create<DeckState>((set, get) => ({
  // Initial state
  deckData: null,
  slides: [],
  chapters: [],
  currentSlideIndex: 0,
  currentSlide: null,

  // Actions
  setDeckData: (data) => {
    set({
      deckData: data,
      slides: data.slides,
      chapters: data.chapters || [],
      currentSlideIndex: 0,
      currentSlide: data.slides[0] || null,
    })
  },

  reset: () => {
    set({
      deckData: null,
      slides: [],
      chapters: [],
      currentSlideIndex: 0,
      currentSlide: null,
    })
  },

  goToSlide: (index) => {
    const { slides } = get()
    if (index >= 0 && index < slides.length) {
      set({
        currentSlideIndex: index,
        currentSlide: slides[index],
      })
    }
  },

  goToSlideById: (id) => {
    const { slides } = get()
    const index = slides.findIndex((s) => s.id === id)
    if (index !== -1) {
      get().goToSlide(index)
    }
  },

  nextSlide: () => {
    const { currentSlideIndex, slides } = get()
    if (currentSlideIndex < slides.length - 1) {
      get().goToSlide(currentSlideIndex + 1)
    }
  },

  prevSlide: () => {
    const { currentSlideIndex } = get()
    if (currentSlideIndex > 0) {
      get().goToSlide(currentSlideIndex - 1)
    }
  },

  goToChapter: (chapterId) => {
    const { chapters, slides } = get()
    const chapter = chapters.find((c) => c.id === chapterId)
    if (chapter) {
      const index = slides.findIndex((s) => s.number >= chapter.startSlide)
      if (index !== -1) {
        get().goToSlide(index)
      }
    }
  },

  // Computed (getters via get())
  get progress() {
    const { currentSlideIndex, slides } = get()
    if (slides.length <= 1) return 0
    return (currentSlideIndex / (slides.length - 1)) * 100
  },

  get currentChapter() {
    const { currentSlide, chapters } = get()
    if (!currentSlide) return null
    return chapters
      .filter((c) => c.startSlide <= currentSlide.number)
      .sort((a, b) => b.startSlide - a.startSlide)[0] || null
  },

  get isFirstSlide() {
    return get().currentSlideIndex === 0
  },

  get isLastSlide() {
    const { currentSlideIndex, slides } = get()
    return currentSlideIndex === slides.length - 1
  },
}))

export default useDeckStore
