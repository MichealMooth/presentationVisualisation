'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePreziStore } from '@/stores/preziStore'

export function PreziOverview() {
  const {
    topics,
    frames,
    currentFrameIndex,
    isOverview,
    goToTopic,
    goToFrame,
    toggleOverview,
  } = usePreziStore()

  // Mini-map (bottom-right corner)
  const currentFrame = frames[currentFrameIndex]
  const currentTopicId = currentFrame?.topic

  return (
    <>
      {/* Topic navigation bar (top) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-1 mt-4 px-3 py-2 rounded-2xl bg-black/30 backdrop-blur-xl pointer-events-auto"
        >
          {topics.map((topic) => {
            const isActive = topic.id === currentTopicId
            const topicFrames = frames.filter((f) => f.topic === topic.id)
            const firstFrameIndex = frames.indexOf(topicFrames[0])

            return (
              <button
                key={topic.id}
                onClick={() => goToFrame(firstFrameIndex)}
                className={`
                  relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300
                  ${isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }
                `}
                title={topic.title}
              >
                <span className="relative z-10 whitespace-nowrap">{topic.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="topic-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#17f0f0]/20 to-[#0078FE]/20 border border-[#17f0f0]/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}

          {/* Overview toggle */}
          <button
            onClick={toggleOverview}
            className={`
              ml-2 p-1.5 rounded-lg transition-all duration-200
              ${isOverview
                ? 'bg-[#17f0f0]/20 text-[#17f0f0]'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }
            `}
            title="Übersicht (O)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Overview topic labels */}
      <AnimatePresence>
        {isOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-xl text-white/80 text-sm">
                <span>Klicke auf eine Folie um hinzuzoomen</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono">ESC</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
