import { create } from 'zustand'

export interface PreziFrame {
  slideIndex: number
  x: number
  y: number
  scale: number
  topic: string
  hidden?: boolean  // hidden frames are skipped by arrow keys but accessible via goToFrame
}

export interface PreziTopic {
  id: string
  title: string
  color: string
  x: number
  y: number
}

export interface PreziLink {
  from: number  // frame index
  to: number    // frame index
}

interface PreziState {
  frames: PreziFrame[]
  topics: PreziTopic[]
  links: PreziLink[]
  currentFrameIndex: number
  isOverview: boolean
  overviewConfig: { x: number; y: number; scale: number }

  setLayout: (frames: PreziFrame[], topics: PreziTopic[], overview: { x: number; y: number; scale: number }, links?: PreziLink[]) => void
  goToFrame: (index: number) => void
  nextFrame: () => void
  prevFrame: () => void
  toggleOverview: () => void
  setOverview: (show: boolean) => void
  goToTopic: (topicId: string) => void

  get currentFrame(): PreziFrame | null
  get progress(): number
  get currentTopic(): PreziTopic | null
}

export const usePreziStore = create<PreziState>((set, get) => ({
  frames: [],
  topics: [],
  links: [],
  currentFrameIndex: 0,
  isOverview: false,
  overviewConfig: { x: 0, y: 0, scale: 8 },

  setLayout: (frames, topics, overview, links) => {
    set({ frames, topics, links: links || [], overviewConfig: overview, currentFrameIndex: 0, isOverview: false })
  },

  goToFrame: (index) => {
    const { frames } = get()
    if (index >= 0 && index < frames.length) {
      set({ currentFrameIndex: index, isOverview: false })
    }
  },

  nextFrame: () => {
    const { currentFrameIndex, frames, isOverview } = get()
    if (isOverview) {
      set({ isOverview: false })
      return
    }
    // Skip hidden frames when navigating forward
    let next = currentFrameIndex + 1
    while (next < frames.length && frames[next].hidden) {
      next++
    }
    if (next < frames.length) {
      set({ currentFrameIndex: next })
    }
  },

  prevFrame: () => {
    const { currentFrameIndex, frames, isOverview } = get()
    if (isOverview) {
      set({ isOverview: false })
      return
    }
    // Skip hidden frames when navigating backward
    let prev = currentFrameIndex - 1
    while (prev >= 0 && frames[prev].hidden) {
      prev--
    }
    if (prev >= 0) {
      set({ currentFrameIndex: prev })
    }
  },

  toggleOverview: () => {
    set((state) => ({ isOverview: !state.isOverview }))
  },

  setOverview: (show) => {
    set({ isOverview: show })
  },

  goToTopic: (topicId) => {
    const { frames } = get()
    const firstFrame = frames.find((f) => f.topic === topicId)
    if (firstFrame) {
      const index = frames.indexOf(firstFrame)
      set({ currentFrameIndex: index, isOverview: false })
    }
  },

  get currentFrame() {
    const { frames, currentFrameIndex } = get()
    return frames[currentFrameIndex] || null
  },

  get progress() {
    const { currentFrameIndex, frames } = get()
    const visibleFrames = frames.filter(f => !f.hidden)
    if (visibleFrames.length <= 1) return 0
    // Find position of current frame among visible frames
    const visibleIndex = visibleFrames.findIndex((_, vi) => {
      const realIndex = frames.indexOf(visibleFrames[vi])
      return realIndex >= currentFrameIndex
    })
    const idx = visibleIndex >= 0 ? visibleIndex : visibleFrames.length - 1
    return (idx / (visibleFrames.length - 1)) * 100
  },

  get currentTopic() {
    const { frames, topics, currentFrameIndex } = get()
    const frame = frames[currentFrameIndex]
    if (!frame) return null
    return topics.find((t) => t.id === frame.topic) || null
  },
}))
