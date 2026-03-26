'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { LayoutRenderer } from '@/components/layouts/LayoutRenderer'
import { DeckData, Slide } from '@/lib/content/schema'
import { exportToPptx } from '@/lib/exportPptx'

// ---------------------------------------------------------------------------
// Import deck data for export.
// Add your own decks here:
//
//   import myDeckData from '../../../../../content/decks/my-deck.json'
// ---------------------------------------------------------------------------
import exampleData from '../../../../../content/decks/_example.json'

const deckRegistry: Record<string, DeckData> = {
  '_example': exampleData as DeckData,
}

const VIRTUAL_W = 1920
const VIRTUAL_H = 1080

function AutoScaleSlide({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!container || !wrapper || !canvas) return

    const applyScale = () => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      if (cw <= 0 || ch <= 0) return
      const s = Math.min(cw / VIRTUAL_W, ch / VIRTUAL_H)
      wrapper.style.width = `${VIRTUAL_W * s}px`
      wrapper.style.height = `${VIRTUAL_H * s}px`
      canvas.style.transform = `scale(${s})`
      canvas.style.opacity = '1'
    }

    // Screen: ResizeObserver
    const ro = new ResizeObserver(applyScale)
    ro.observe(container)

    // Print: recalculate when print styles change container dimensions
    window.addEventListener('beforeprint', applyScale)
    window.addEventListener('afterprint', applyScale)

    return () => {
      ro.disconnect()
      window.removeEventListener('beforeprint', applyScale)
      window.removeEventListener('afterprint', applyScale)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`export-slide ${slide.theme === 'dark' ? 'bg-[#000039] text-white' : 'bg-white'}`}
    >
      <div ref={wrapperRef} style={{ margin: 'auto' }}>
        <div
          ref={canvasRef}
          style={{
            width: VIRTUAL_W,
            height: VIRTUAL_H,
            transformOrigin: 'top left',
            opacity: 0,
          }}
        >
          <LayoutRenderer slide={slide} isActive={true} />
        </div>
      </div>
      <div className="print:hidden absolute bottom-3 right-4 text-xs opacity-30">
        {index + 1} / {total}
      </div>
    </div>
  )
}

export default function ExportPage() {
  const params = useParams()
  const slug = params.slug as string
  const [deckData, setDeckData] = useState<DeckData | null>(null)
  const [pptxLoading, setPptxLoading] = useState(false)

  useEffect(() => {
    const data = deckRegistry[slug]
    if (data) setDeckData(data)
  }, [slug])

  const handlePptxExport = async () => {
    if (!deckData || pptxLoading) return
    setPptxLoading(true)
    try {
      await exportToPptx(deckData)
    } catch (err) {
      console.error('PPTX export failed:', err)
    } finally {
      setPptxLoading(false)
    }
  }

  if (!deckData) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-grey">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-blue-dark mb-2">
            Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Presentation &quot;{slug}&quot; not found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-base-blue text-white rounded-xl font-medium hover:bg-base-blue-dark transition-colors"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Print toolbar */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href={`/deck/${slug}`}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Back
          </Link>
          <span className="text-white/40">|</span>
          <h1 className="text-sm font-medium">{deckData.title}</h1>
          <span className="text-white/40 text-sm">{deckData.slides.length} Slides</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs">Tip: Disable headers/footers in print dialog</span>
          <button
            onClick={handlePptxExport}
            disabled={pptxLoading}
            className="px-5 py-2 bg-white/15 text-white rounded-lg text-sm font-bold hover:bg-white/25 transition-all disabled:opacity-50"
          >
            {pptxLoading ? 'Creating...' : 'PPTX Export'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-accent text-gray-900 rounded-lg text-sm font-bold hover:brightness-90 transition-all"
          >
            Print as PDF (Ctrl+P)
          </button>
        </div>
      </div>

      {/* Spacer for toolbar */}
      <div className="print:hidden h-14" />

      {/* Slides */}
      <div className="export-slides">
        {deckData.slides.map((slide: Slide, index: number) => (
          <AutoScaleSlide
            key={slide.id}
            slide={slide}
            index={index}
            total={deckData.slides.length}
          />
        ))}
      </div>
    </>
  )
}
