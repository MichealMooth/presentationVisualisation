'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDeckStore } from '@/stores/deckStore'
import { usePresenterStore } from '@/stores/presenterStore'

interface UseNavigationOptions {
  enableKeyboard?: boolean
  enableSwipe?: boolean
  enableWheel?: boolean
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const {
    enableKeyboard = true,
    enableSwipe = true,
    enableWheel = false,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const { nextSlide, prevSlide, currentSlideIndex, slides } = useDeckStore()
  const { togglePresenterMode } = usePresenterStore()

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastWheelRef = useRef(0)

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if focused on input elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          nextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          prevSlide()
          break
        case 'Home':
          e.preventDefault()
          useDeckStore.getState().goToSlide(0)
          break
        case 'End':
          e.preventDefault()
          useDeckStore.getState().goToSlide(slides.length - 1)
          break
        case 'p':
        case 'P':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            togglePresenterMode()
            // Navigate to presenter mode or back to deck view
            // Handle new routing: /deck/[slug] <-> /deck/[slug]/presenter
            if (pathname.includes('/presenter')) {
              // Go back to deck view
              const deckPath = pathname.replace('/presenter', '')
              router.push(deckPath)
            } else if (pathname.startsWith('/deck/')) {
              // Go to presenter mode for this deck
              router.push(`${pathname}/presenter`)
            } else if (pathname === '/presenter') {
              // Legacy: old presenter route
              router.push('/')
            } else {
              // Legacy: old deck route
              router.push('/presenter')
            }
          }
          break
        case 'Escape':
          e.preventDefault()
          usePresenterStore.getState().setPresenterMode(false)
          // If in presenter mode, go back to deck view
          if (pathname.includes('/presenter')) {
            const deckPath = pathname.replace('/presenter', '')
            router.push(deckPath || '/')
          }
          break
      }
    },
    [nextSlide, prevSlide, slides.length, togglePresenterMode, router, pathname]
  )

  // Touch swipe navigation
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      // Minimum swipe distance
      const minSwipe = 50

      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipe) {
        if (deltaX > 0) {
          prevSlide()
        } else {
          nextSlide()
        }
      }

      touchStartRef.current = null
    },
    [nextSlide, prevSlide]
  )

  // Wheel navigation (debounced)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastWheelRef.current < 300) return
      lastWheelRef.current = now

      if (e.deltaY > 0) {
        nextSlide()
      } else if (e.deltaY < 0) {
        prevSlide()
      }
    },
    [nextSlide, prevSlide]
  )

  // Set up event listeners
  useEffect(() => {
    if (enableKeyboard) {
      window.addEventListener('keydown', handleKeyDown)
    }
    if (enableSwipe) {
      window.addEventListener('touchstart', handleTouchStart)
      window.addEventListener('touchend', handleTouchEnd)
    }
    if (enableWheel) {
      window.addEventListener('wheel', handleWheel, { passive: true })
    }

    return () => {
      if (enableKeyboard) {
        window.removeEventListener('keydown', handleKeyDown)
      }
      if (enableSwipe) {
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchend', handleTouchEnd)
      }
      if (enableWheel) {
        window.removeEventListener('wheel', handleWheel)
      }
    }
  }, [
    enableKeyboard,
    enableSwipe,
    enableWheel,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
  ])

  return {
    currentSlideIndex,
    totalSlides: slides.length,
    nextSlide,
    prevSlide,
  }
}

export default useNavigation
