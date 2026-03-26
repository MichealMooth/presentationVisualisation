'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDeckStore } from '@/stores/deckStore'
import { Slide } from './Slide'
import { LayoutRenderer } from './layouts/LayoutRenderer'

export function SlideContainer() {
  const { slides, currentSlideIndex, goToSlide } = useDeckStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const isScrollingRef = useRef(false)

  // Scroll to current slide when index changes
  useEffect(() => {
    const slideElement = slideRefs.current.get(currentSlideIndex)
    if (slideElement && !isScrollingRef.current) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentSlideIndex])

  // Handle scroll snap detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const viewportHeight = container.clientHeight

    // Find which slide is most visible
    let closestIndex = 0
    let closestDistance = Infinity

    slideRefs.current.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const relativeTop = rect.top - containerRect.top

      // Calculate distance from being perfectly aligned at top
      const distance = Math.abs(relativeTop)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    // Update state if different slide is now active
    if (closestIndex !== currentSlideIndex && closestDistance < viewportHeight / 2) {
      isScrollingRef.current = true
      goToSlide(closestIndex)
      setTimeout(() => {
        isScrollingRef.current = false
      }, 100)
    }
  }, [currentSlideIndex, goToSlide])

  // Debounced scroll handler
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 50)
    }

    container.addEventListener('scroll', debouncedScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', debouncedScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleScroll])

  const setSlideRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      slideRefs.current.set(index, el)
    } else {
      slideRefs.current.delete(index)
    }
  }, [])

  return (
    <div ref={containerRef} className="slide-container">
      {slides.map((slide, index) => (
        <Slide
          key={slide.id}
          ref={setSlideRef(index)}
          slide={slide}
          isActive={index === currentSlideIndex}
        >
          <LayoutRenderer slide={slide} isActive={index === currentSlideIndex} />
        </Slide>
      ))}
    </div>
  )
}

export default SlideContainer
