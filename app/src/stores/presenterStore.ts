import { create } from 'zustand'

interface PresenterState {
  // Mode
  isPresenterMode: boolean
  showNotes: boolean
  showPreview: boolean
  showTimer: boolean

  // Timer
  timerStarted: number | null
  timerPaused: boolean
  elapsedTime: number

  // Actions
  togglePresenterMode: () => void
  setPresenterMode: (enabled: boolean) => void
  toggleNotes: () => void
  togglePreview: () => void
  toggleTimer: () => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  updateElapsedTime: () => void
}

export const usePresenterStore = create<PresenterState>((set, get) => ({
  // Initial state
  isPresenterMode: false,
  showNotes: true,
  showPreview: true,
  showTimer: true,
  timerStarted: null,
  timerPaused: true,
  elapsedTime: 0,

  // Actions
  togglePresenterMode: () => {
    set((state) => ({ isPresenterMode: !state.isPresenterMode }))
  },

  setPresenterMode: (enabled) => {
    set({ isPresenterMode: enabled })
  },

  toggleNotes: () => {
    set((state) => ({ showNotes: !state.showNotes }))
  },

  togglePreview: () => {
    set((state) => ({ showPreview: !state.showPreview }))
  },

  toggleTimer: () => {
    set((state) => ({ showTimer: !state.showTimer }))
  },

  startTimer: () => {
    const { timerStarted, elapsedTime, timerPaused } = get()
    if (timerPaused) {
      set({
        timerStarted: Date.now() - elapsedTime,
        timerPaused: false,
      })
    }
  },

  pauseTimer: () => {
    const { timerStarted, timerPaused } = get()
    if (!timerPaused && timerStarted) {
      set({
        elapsedTime: Date.now() - timerStarted,
        timerPaused: true,
      })
    }
  },

  resetTimer: () => {
    set({
      timerStarted: null,
      timerPaused: true,
      elapsedTime: 0,
    })
  },

  updateElapsedTime: () => {
    const { timerStarted, timerPaused } = get()
    if (!timerPaused && timerStarted) {
      set({ elapsedTime: Date.now() - timerStarted })
    }
  },
}))

// Format elapsed time as MM:SS
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default usePresenterStore
