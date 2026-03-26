'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slide } from '@/lib/content/schema'
import { usePreziStore } from '@/stores/preziStore'
import { LayoutRenderer } from '../layouts/LayoutRenderer'
import { PreziOverview } from './PreziOverview'
import { PreziProgress } from './PreziProgress'

interface PreziCanvasProps {
  slides: Slide[]
}

export function PreziCanvas({ slides }: PreziCanvasProps) {
  const {
    frames,
    topics,
    links,
    currentFrameIndex,
    isOverview,
    nextFrame,
    prevFrame,
    goToFrame,
    toggleOverview,
  } = usePreziStore()

  const [viewport, setViewport] = useState({ w: 1920, h: 1080 })
  const containerRef = useRef<HTMLDivElement>(null)

  // ─── Pan state: ref-based for lag-free dragging ───
  const panWrapperRef = useRef<HTMLDivElement>(null)
  const livePanRef = useRef({ x: 0, y: 0 })
  const [settledPan, setSettledPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const hasDraggedRef = useRef(false)
  const [overviewZoom, setOverviewZoom] = useState(1)

  // Update viewport size
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          nextFrame()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          prevFrame()
          break
        case 'Escape':
        case 'o':
          e.preventDefault()
          toggleOverview()
          break
        case 'Home':
          e.preventDefault()
          goToFrame(0)
          break
        case 'End':
          e.preventDefault()
          goToFrame(frames.length - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextFrame, prevFrame, toggleOverview, goToFrame, frames.length])

  // Touch/swipe navigation
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) > 50) {
      if (absDx > absDy) {
        dx < 0 ? nextFrame() : prevFrame()
      } else {
        dy < 0 ? nextFrame() : prevFrame()
      }
    }
    touchStartRef.current = null
  }, [nextFrame, prevFrame])

  // Reset pan when leaving overview
  useEffect(() => {
    if (!isOverview) {
      setSettledPan({ x: 0, y: 0 })
      livePanRef.current = { x: 0, y: 0 }
      setOverviewZoom(1)
      if (panWrapperRef.current) panWrapperRef.current.style.transform = ''
    }
  }, [isOverview])

  // ─── Drag handlers: direct DOM manipulation, no React re-renders ───
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isOverview) return
    setIsDragging(true)
    hasDraggedRef.current = false
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: livePanRef.current.x,
      panY: livePanRef.current.y,
    }
  }, [isOverview])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current || !panWrapperRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      hasDraggedRef.current = true
    }
    livePanRef.current = {
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    }
    // Direct DOM update — bypasses React entirely, zero lag
    panWrapperRef.current.style.transform =
      `translate(${livePanRef.current.x}px, ${livePanRef.current.y}px)`
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
    // Sync final position to React state
    setSettledPan({ ...livePanRef.current })
    // Clear direct DOM style so React takes over
    if (panWrapperRef.current) panWrapperRef.current.style.transform = ''
  }, [])

  // ─── Wheel zoom in overview mode ───
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isOverview) return
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.92 : 1.08
    setOverviewZoom(prev => Math.min(Math.max(prev * factor, 0.2), 4))
  }, [isOverview])

  // ─── Canvas transform ───
  const baseW = 1920
  const baseH = 1080
  const titleSpace = 160

  let targetX: number, targetY: number, targetScale: number

  if (isOverview) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const f of frames) {
      minX = Math.min(minX, f.x)
      minY = Math.min(minY, f.y)
      maxX = Math.max(maxX, f.x + baseW * f.scale)
      maxY = Math.max(maxY, f.y + baseH * f.scale + titleSpace * f.scale)
    }
    const padding = 300
    const canvasW = maxX - minX + padding * 2
    const canvasH = maxY - minY + padding * 2
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    targetScale = Math.min(viewport.w / canvasW, viewport.h / canvasH) * 0.92 * overviewZoom
    // Pan is handled by the wrapper div — NOT included here
    targetX = -centerX * targetScale + viewport.w / 2
    targetY = -centerY * targetScale + viewport.h / 2
  } else {
    const frame = frames[currentFrameIndex]
    if (!frame) return null

    const slideCenterX = frame.x + (baseW * frame.scale) / 2
    const slideCenterY = frame.y + (baseH * frame.scale) / 2

    const scaleX = viewport.w / (baseW * frame.scale)
    const scaleY = viewport.h / (baseH * frame.scale)
    targetScale = Math.min(scaleX, scaleY) * 0.92

    targetX = -slideCenterX * targetScale + viewport.w / 2
    targetY = -slideCenterY * targetScale + viewport.h / 2
  }

  // SVG bounds for connection lines
  const svgPad = 500
  const svgMinX = frames.length > 0 ? Math.min(...frames.map(f => f.x)) - svgPad : 0
  const svgMinY = frames.length > 0 ? Math.min(...frames.map(f => f.y)) - svgPad : 0
  const svgMaxX = frames.length > 0 ? Math.max(...frames.map(f => f.x + baseW * f.scale)) + svgPad : 1
  const svgMaxY = frames.length > 0 ? Math.max(...frames.map(f => f.y + baseH * f.scale)) + svgPad : 1

  return (
    <div
      ref={containerRef}
      className="prezi-viewport"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#000039',
        cursor: isOverview ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: isOverview ? 'none' : undefined,
      }}
    >
      {/* Pan wrapper — direct DOM transform during drag, React transform when settled */}
      <div
        ref={panWrapperRef}
        style={{
          position: 'absolute',
          inset: 0,
          transform: !isDragging ? `translate(${settledPan.x}px, ${settledPan.y}px)` : undefined,
        }}
      >
        {/* Zoom layer — Framer Motion handles zoom transitions */}
        <motion.div
          className="prezi-canvas"
          animate={{
            x: targetX,
            y: targetY,
            scale: targetScale,
          }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          {/* Connection lines between frames (behind cards) */}
          <svg
            style={{
              position: 'absolute',
              left: svgMinX,
              top: svgMinY,
              width: svgMaxX - svgMinX,
              height: svgMaxY - svgMinY,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {frames.map((frame, i) => {
              if (i === 0) return null
              const prev = frames[i - 1]
              const x1 = prev.x + (baseW * prev.scale) / 2 - svgMinX
              const y1 = prev.y + (baseH * prev.scale) / 2 - svgMinY
              const x2 = frame.x + (baseW * frame.scale) / 2 - svgMinX
              const y2 = frame.y + (baseH * frame.scale) / 2 - svgMinY
              const bothHidden = !!frame.hidden && !!prev.hidden
              const crossesBorder = frame.hidden !== prev.hidden
              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={crossesBorder ? 'rgba(255,255,255,0.15)' : bothHidden ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.5)'}
                  strokeWidth={crossesBorder ? 8 : 14}
                  strokeDasharray={crossesBorder ? '30,20' : bothHidden ? '30,20' : 'none'}
                  opacity={isOverview ? 1 : 0.15}
                  style={{ transition: 'opacity 0.5s ease' }}
                />
              )
            })}

            {/* Navigation links (e.g. from process-flow to module details) */}
            <defs>
              <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L12,4 L0,8 Z" fill="rgba(23,240,240,0.6)" />
              </marker>
            </defs>
            {links.map((link, i) => {
              const fromFrame = frames[link.from]
              const toFrame = frames[link.to]
              if (!fromFrame || !toFrame) return null
              const x1 = fromFrame.x + (baseW * fromFrame.scale) / 2 - svgMinX
              const y1 = fromFrame.y + (baseH * fromFrame.scale) / 2 - svgMinY
              const x2 = toFrame.x + (baseW * toFrame.scale) / 2 - svgMinX
              const y2 = toFrame.y + (baseH * toFrame.scale) / 2 - svgMinY
              // Curved path: quadratic bezier with control point offset perpendicular to the line
              const mx = (x1 + x2) / 2
              const my = (y1 + y2) / 2
              const dx = x2 - x1
              const dy = y2 - y1
              const len = Math.sqrt(dx * dx + dy * dy)
              // Offset perpendicular to line direction, alternating sides
              const curvature = 0.15 * (i % 2 === 0 ? 1 : -1)
              const cx = mx + (-dy / len) * len * curvature
              const cy = my + (dx / len) * len * curvature
              return (
                <path
                  key={`link-${i}`}
                  d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
                  stroke="rgba(23,240,240,0.4)"
                  strokeWidth={10}
                  strokeDasharray="40,20"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  opacity={isOverview ? 1 : 0.1}
                  style={{ transition: 'opacity 0.5s ease' }}
                />
              )
            })}
          </svg>

          {/* Slides on canvas */}
          {slides.map((slide, i) => {
            const frame = frames[i]
            if (!frame) return null
            const isCurrent = i === currentFrameIndex
            const topic = topics.find(t => t.id === frame.topic)
            const topicColor = topic?.color || '#001777'

            return (
              <div
                key={slide.id}
                style={{
                  position: 'absolute',
                  left: frame.x,
                  top: frame.y,
                  width: baseW * frame.scale,
                  height: baseH * frame.scale,
                  zIndex: isCurrent ? 10 : 1,
                  overflow: 'visible',
                }}
              >
                {/* Full slide content — hidden in overview via visibility for performance */}
                <div
                  style={{
                    width: baseW,
                    height: baseH,
                    transform: `scale(${frame.scale})`,
                    transformOrigin: '0 0',
                    pointerEvents: isOverview ? 'none' : 'auto',
                    visibility: isOverview ? 'hidden' : 'visible',
                  }}
                  className={`
                    ${slide.theme === 'dark' ? 'bg-[#000039] text-white' : 'bg-white text-[#000039]'}
                    rounded-xl overflow-hidden
                  `}
                >
                  <div className={`w-full h-full flex flex-col justify-center relative ${
                    slide.layout === 'process-flow' ? 'px-6 py-4' : 'px-16 py-12'
                  }`}>
                    {slide.layout !== 'hero' && slide.layout !== 'process-flow' && (
                      <div className="absolute bottom-6 right-8 opacity-40">
                        <img
                          src="/assets/TRICEPT-Bildmarke-Gradient.svg"
                          alt=""
                          className="h-8"
                        />
                      </div>
                    )}
                    <LayoutRenderer slide={slide} isActive={!isOverview && isCurrent} />
                  </div>
                </div>

                {/* Overview card */}
                {isOverview && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: baseW,
                      height: baseH,
                      transform: `scale(${frame.scale})`,
                      transformOrigin: '0 0',
                    }}
                  >
                    {/* Card body */}
                    <div
                      onPointerUp={(e) => { if (!hasDraggedRef.current) { e.stopPropagation(); goToFrame(i) } }}
                      style={{
                        width: baseW,
                        height: baseH,
                        borderRadius: 32,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isCurrent
                          ? '8px solid #17f0f0'
                          : frame.hidden
                            ? '4px dashed rgba(255,255,255,0.2)'
                            : '4px solid rgba(255,255,255,0.12)',
                        background: slide.theme === 'dark'
                          ? 'linear-gradient(160deg, #000039 0%, #001155 100%)'
                          : 'linear-gradient(160deg, #ffffff 0%, #f0f2f8 100%)',
                        boxShadow: isCurrent
                          ? '0 0 60px rgba(23,240,240,0.25), 0 20px 80px rgba(0,0,0,0.4)'
                          : '0 12px 50px rgba(0,0,0,0.35)',
                        position: 'relative',
                      }}
                    >
                      {/* Topic color bar */}
                      <div style={{
                        height: 100,
                        background: `linear-gradient(90deg, ${topicColor}, ${topicColor}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 50px',
                      }}>
                        <span style={{
                          fontSize: 44,
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.85)',
                          letterSpacing: '0.5px',
                        }}>
                          {topic?.title || ''}
                        </span>
                      </div>

                      {/* Card body with large slide number watermark */}
                      <div style={{
                        height: baseH - 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <span style={{
                          fontSize: 360,
                          fontWeight: 800,
                          fontFamily: "'TT Firs Neue', sans-serif",
                          color: slide.theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,57,0.03)',
                          lineHeight: 1,
                          userSelect: 'none',
                        }}>
                          {frame.slideIndex + 1}
                        </span>

                        {/* Layout type badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: 50,
                          right: 50,
                          padding: '10px 24px',
                          borderRadius: 14,
                          background: slide.theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,57,0.04)',
                          fontSize: 28,
                          fontWeight: 500,
                          color: slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,57,0.15)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          {slide.layout}
                        </div>

                        {/* Hidden frame badge */}
                        {frame.hidden && (
                          <div style={{
                            position: 'absolute',
                            top: 30,
                            right: 50,
                            padding: '8px 20px',
                            borderRadius: 10,
                            border: '3px dashed rgba(255,255,255,0.2)',
                            fontSize: 26,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.3)',
                          }}>
                            Detail
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title below card */}
                    <div style={{
                      textAlign: 'center',
                      marginTop: 40,
                      padding: '0 40px',
                    }}>
                      <div style={{
                        fontSize: 140,
                        fontWeight: 600,
                        fontFamily: "'TT Firs Neue', sans-serif",
                        color: isCurrent ? '#17f0f0' : 'rgba(255,255,255,0.75)',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {slide.displayTitle || slide.title}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* UI Overlays */}
      <PreziProgress />
      <PreziOverview />

      {/* Navigation hint */}
      <AnimatePresence>
        {currentFrameIndex === 0 && !isOverview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white/70 text-sm">
              <span className="opacity-60">Navigation:</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono">&#8592; &#8594;</kbd>
              <span className="opacity-40">|</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono">O</kbd>
              <span className="opacity-60">= Übersicht</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
