'use client'

import { motion } from 'framer-motion'
import { usePreziStore } from '@/stores/preziStore'

export function PreziProgress() {
  const { frames, topics, currentFrameIndex, goToFrame, isOverview } = usePreziStore()

  if (isOverview) return null

  const currentFrame = frames[currentFrameIndex]
  const currentTopicId = currentFrame?.topic

  // Group frames by topic for segmented progress (exclude hidden frames)
  const currentIsHidden = currentFrame?.hidden
  const visibleFrames = frames.filter(f => !f.hidden)
  const visibleFrameCount = visibleFrames.length
  const visiblePosition = currentIsHidden ? 0 : visibleFrames.findIndex((_, i) => visibleFrames[i].slideIndex === currentFrame?.slideIndex) + 1
  const topicGroups = topics.map((topic) => {
    const topicFrames = frames
      .map((f, i) => ({ ...f, globalIndex: i }))
      .filter((f) => f.topic === topic.id && !f.hidden)
    return { topic, frames: topicFrames }
  }).filter(g => g.frames.length > 0)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress bar */}
      <div className="flex items-end justify-center gap-1 pb-4 px-8">
        {topicGroups.map(({ topic, frames: topicFrames }) => (
          <div key={topic.id} className="flex gap-0.5 pointer-events-auto">
            {topicFrames.map((frame) => {
              const isActive = frame.globalIndex === currentFrameIndex
              const isPast = frame.globalIndex < currentFrameIndex
              return (
                <button
                  key={frame.globalIndex}
                  onClick={() => goToFrame(frame.globalIndex)}
                  className="group relative"
                  title={`Folie ${frame.globalIndex + 1}`}
                >
                  <div
                    className={`
                      h-1 rounded-full transition-all duration-300
                      ${isActive
                        ? 'w-8 bg-[#17f0f0]'
                        : isPast
                          ? 'w-3 bg-white/40'
                          : 'w-3 bg-white/15 group-hover:bg-white/30'
                      }
                    `}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="progress-dot"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#17f0f0] shadow-[0_0_12px_rgba(23,240,240,0.5)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Slide counter - show hidden indicator when on a detail slide */}
      <div className="absolute bottom-4 right-6 text-white/30 text-xs font-mono pointer-events-none">
        {currentIsHidden ? 'Detailansicht' : `${visiblePosition} / ${visibleFrameCount}`}
      </div>
    </div>
  )
}
