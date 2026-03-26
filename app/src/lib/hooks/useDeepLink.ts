'use client'

import { useEffect, useCallback } from 'react'
import { useDeckStore } from '@/stores/deckStore'

export function useDeepLink() {
  const { slides, goToSlideById, currentSlide, currentSlideIndex } = useDeckStore()

  // Handle initial hash on mount and hash changes
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.slice(1) // Remove #

    if (hash) {
      // Try to find slide by ID
      const slideIndex = slides.findIndex(
        (s) => s.id === hash || s.id.startsWith(hash)
      )

      if (slideIndex !== -1) {
        goToSlideById(slides[slideIndex].id)
      } else {
        // Try to parse as slide number
        const slideNum = parseInt(hash)
        if (!isNaN(slideNum)) {
          const index = slides.findIndex((s) => s.number === slideNum)
          if (index !== -1) {
            useDeckStore.getState().goToSlide(index)
          }
        }
      }
    }
  }, [slides, goToSlideById])

  // Update URL hash when slide changes
  useEffect(() => {
    if (currentSlide && typeof window !== 'undefined') {
      const newHash = `#${currentSlide.id}`
      if (window.location.hash !== newHash) {
        // Use replaceState to avoid polluting browser history
        window.history.replaceState(null, '', newHash)
      }
    }
  }, [currentSlide, currentSlideIndex])

  // Listen for hash changes (back/forward navigation)
  useEffect(() => {
    // Initial check
    if (slides.length > 0) {
      handleHashChange()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [handleHashChange, slides.length])

  return {
    currentHash: currentSlide?.id || '',
  }
}

export default useDeepLink
