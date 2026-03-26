// eslint-disable-next-line @typescript-eslint/no-require-imports
import PptxGenJS from 'pptxgenjs'
import type { DeckData, Slide } from './content/schema'

// ─── Corporate Design Tokens ─────────────────────────────────────
const C = {
  dark: '000039',
  blue: '001777',
  accent: '17f0f0',
  grey: 'F5F5F3',
  greyDark: 'E3E4E2',
  white: 'FFFFFF',
  muted: '64748B',
  green: '059669',
  greenBg: 'ECFDF5',
  red: 'DC2626',
  redBg: 'FEF2F2',
  amber: 'D97706',
  amberBg: 'FFFBEB',
}
const F = { h: 'TT Firs Neue', b: 'Work Sans' }

// ─── Helpers ─────────────────────────────────────────────────────
function clean(t: string): string {
  return t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/[`~]/g, '').replace(/^[-•✓❌★]\s*/g, '').trim()
}

function parseBoldSections(raw: string): Array<{ title: string; items: string[] }> {
  const result: Array<{ title: string; items: string[] }> = []
  const parts = raw.split(/\n*\*\*([^*]+)\*\*\s*/)
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim()
    const body = parts[i + 1] || ''
    const items = body.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
    result.push({ title, items })
  }
  return result
}

function richText(raw: string): PptxGenJS.TextProps[] {
  // Parse **bold** segments into rich text runs
  const parts: PptxGenJS.TextProps[] = []
  const regex = /\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(raw)) !== null) {
    if (m.index > last) {
      parts.push({ text: raw.slice(last, m.index), options: { bold: false } })
    }
    parts.push({ text: m[1], options: { bold: true } })
    last = m.index + m[0].length
  }
  if (last < raw.length) parts.push({ text: raw.slice(last), options: { bold: false } })
  return parts.length ? parts : [{ text: raw }]
}

// ─── Module-level state ──────────────────────────────────────────
let logoBase64: string | null = null
let _pptx: PptxGenJS
async function loadLogo(): Promise<void> {
  if (logoBase64) return
  try {
    const resp = await fetch('/assets/Bildmarke.png')
    const blob = await resp.blob()
    logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    logoBase64 = null
  }
}

// ─── Slide Master ────────────────────────────────────────────────
function addChrome(s: PptxGenJS.Slide, slide: Slide) {
  const title = slide.displayTitle || slide.title

  // Title
  s.addText(title, {
    x: 0.6, y: 0.3, w: 8.2, h: 0.65,
    fontSize: 24, fontFace: F.h, color: C.dark, bold: true, valign: 'middle',
  })

  // Accent underline
  s.addShape(_pptx.ShapeType.rect, {
    x: 0.6, y: 0.97, w: 1.2, h: 0.035, fill: { color: C.accent },
  })

  addFooter(s, slide)
}

function addFooter(s: PptxGenJS.Slide, slide: Slide) {
  // Bottom accent line
  s.addShape(_pptx.ShapeType.rect, {
    x: 0, y: 5.03, w: 10, h: 0.025, fill: { color: C.accent },
  })

  // Footer background
  s.addShape(_pptx.ShapeType.rect, {
    x: 0, y: 5.055, w: 10, h: 0.32, fill: { color: C.grey },
  })

  // Company name
  s.addText('IT Consulting by Tricept', {
    x: 0.6, y: 5.06, w: 3, h: 0.3,
    fontSize: 7, fontFace: F.b, color: C.muted, valign: 'middle',
  })

  // Slide number
  s.addText(`${slide.number}`, {
    x: 4.5, y: 5.06, w: 1.0, h: 0.3,
    fontSize: 7, fontFace: F.b, color: C.muted, align: 'center', valign: 'middle',
  })

  // Logo (right side)
  if (logoBase64) {
    s.addImage({
      data: logoBase64,
      x: 9.05, y: 5.07, w: 0.28, h: 0.28,
    })
  }
}

function addHeroFooter(s: PptxGenJS.Slide) {
  // Accent line
  s.addShape(_pptx.ShapeType.rect, {
    x: 0, y: 5.03, w: 10, h: 0.025, fill: { color: C.accent },
  })

  // Dark footer for hero slides
  s.addShape(_pptx.ShapeType.rect, {
    x: 0, y: 5.055, w: 10, h: 0.32, fill: { color: C.dark },
  })

  s.addText('IT Consulting by Tricept', {
    x: 0.6, y: 5.06, w: 3, h: 0.3,
    fontSize: 7, fontFace: F.b, color: C.accent, valign: 'middle',
  })

  if (logoBase64) {
    s.addImage({
      data: logoBase64,
      x: 9.05, y: 5.07, w: 0.28, h: 0.28,
    })
  }
}

// ─── HERO ────────────────────────────────────────────────────────
function renderHero(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  s.background = { fill: C.dark }

  const lines = (slide.content?.rawMarkdown || slide.title).split('\n').filter(Boolean)

  // Accent line above title
  s.addShape(pptx.ShapeType.rect, {
    x: 2.5, y: 1.6, w: 5.0, h: 0.04, fill: { color: C.accent },
  })

  // Title
  s.addText(lines[0] || slide.title, {
    x: 0.8, y: 1.8, w: 8.4, h: 1.2,
    fontSize: 30, fontFace: F.h, color: C.white, bold: true,
    align: 'center', valign: 'middle',
  })

  // Accent line below title
  s.addShape(pptx.ShapeType.rect, {
    x: 2.5, y: 3.05, w: 5.0, h: 0.04, fill: { color: C.accent },
  })

  // Subtitle lines
  if (lines.length > 1) {
    s.addText(lines.slice(1).join('\n'), {
      x: 1.5, y: 3.3, w: 7.0, h: 1.0,
      fontSize: 14, fontFace: F.b, color: C.accent,
      align: 'center', valign: 'top', lineSpacingMultiple: 1.4,
    })
  }

  addHeroFooter(s)
}

// ─── TIMELINE ────────────────────────────────────────────────────
function renderTimeline(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const content = slide.content as Record<string, unknown>
  const timeline = content?.timeline as Array<{ title: string; description?: string }> | undefined
  if (!timeline?.length) return

  const count = timeline.length
  const totalW = 8.4
  const gap = 0.2
  const colW = (totalW - gap * (count - 1)) / count
  const lineY = 2.0

  // Connecting line
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6 + colW / 2, y: lineY + 0.15, w: totalW - colW, h: 0.03, fill: { color: C.greyDark },
  })

  timeline.forEach((step, i) => {
    const x = 0.6 + i * (colW + gap)

    // Circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + colW / 2 - 0.18, y: lineY, w: 0.36, h: 0.36,
      fill: { color: C.blue },
    })
    s.addText(String(i + 1), {
      x: x + colW / 2 - 0.18, y: lineY, w: 0.36, h: 0.36,
      fontSize: 11, fontFace: F.h, color: C.white, bold: true,
      align: 'center', valign: 'middle',
    })

    // Title
    s.addText(step.title, {
      x, y: lineY + 0.5, w: colW, h: 0.9,
      fontSize: 10, fontFace: F.b, color: C.dark, bold: true,
      align: 'center', valign: 'top', wrap: true, lineSpacingMultiple: 1.2,
    })

    // Duration
    if (step.description) {
      s.addText(step.description, {
        x, y: lineY + 1.35, w: colW, h: 0.3,
        fontSize: 9, fontFace: F.b, color: C.muted,
        align: 'center', valign: 'top',
      })
    }
  })
}

// ─── BULLETS ─────────────────────────────────────────────────────
function renderBullets(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const content = slide.content as Record<string, unknown> | undefined
  const raw = (content?.rawMarkdown as string) || ''
  const callout = content?.callout as { text: string } | undefined

  // Check for Stufe-pattern (dimension profile)
  const hasStufe = /\(Stufe\s*\d/i.test(raw)
  // Check for Priorität-pattern (action fields)
  const hasPriority = /Priorität\s*\d/i.test(raw)

  const sections = parseBoldSections(raw)
  let yPos = 1.3

  if (sections.length > 0) {
    // Grid layout for many items (6+ sections)
    if (sections.length >= 6 && !hasPriority) {
      const cols = sections.length <= 6 ? 2 : 3
      const rows = Math.ceil(sections.length / cols)
      const cardW = (8.6 / cols) - 0.15
      const cardH = Math.min(3.2 / rows - 0.1, 1.3)

      sections.forEach((sec, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = 0.5 + col * (cardW + 0.15)
        const y = yPos + row * (cardH + 0.12)

        // Card background
        s.addShape(pptx.ShapeType.roundRect, {
          x, y, w: cardW, h: cardH,
          fill: { color: C.white },
          line: { color: C.greyDark, width: 0.75 },
          rectRadius: 0.06,
          shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.06 },
        })

        // Colored left border
        const borderColor = hasStufe ? C.blue : (i < 4 ? C.blue : C.muted)
        s.addShape(pptx.ShapeType.rect, {
          x, y: y + 0.06, w: 0.04, h: cardH - 0.12,
          fill: { color: borderColor },
        })

        // Title (with Stufe extracted)
        const titleText = clean(sec.title).replace(/:$/, '')
        s.addText(titleText, {
          x: x + 0.15, y: y + 0.08, w: cardW - 0.3, h: 0.28,
          fontSize: 10, fontFace: F.b, color: C.dark, bold: true, shrinkText: true,
        })

        // Items
        let iy = y + 0.38
        for (const item of sec.items) {
          if (iy > y + cardH - 0.08) break
          s.addText(clean(item), {
            x: x + 0.15, y: iy, w: cardW - 0.3, h: 0.2,
            fontSize: 8, fontFace: F.b, color: C.muted, wrap: true,
          })
          iy += 0.22
        }
      })
      yPos += Math.ceil(sections.length / cols) * (cardH + 0.12)
    }
    // Priority items (Handlungsfelder)
    else if (hasPriority) {
      for (const sec of sections) {
        if (yPos > 4.5) break
        const isPrio1 = /Priorität\s*1/i.test(sec.title)
        const bgColor = isPrio1 ? C.redBg : C.amberBg
        const dotColor = isPrio1 ? C.red : C.amber
        const label = isPrio1 ? 'P1' : 'P2'

        // Row background
        s.addShape(pptx.ShapeType.roundRect, {
          x: 0.5, y: yPos, w: 9.0, h: 0.55,
          fill: { color: bgColor },
          rectRadius: 0.05,
        })

        // Priority badge
        s.addShape(pptx.ShapeType.roundRect, {
          x: 0.6, y: yPos + 0.1, w: 0.4, h: 0.35,
          fill: { color: dotColor },
          rectRadius: 0.04,
        })
        s.addText(label, {
          x: 0.6, y: yPos + 0.1, w: 0.4, h: 0.35,
          fontSize: 9, fontFace: F.h, color: C.white, bold: true,
          align: 'center', valign: 'middle',
        })

        // Title
        const titleText = clean(sec.title).replace(/^Priorität\s*\d:\s*/i, '')
        s.addText(titleText, {
          x: 1.15, y: yPos + 0.03, w: 8.2, h: 0.25,
          fontSize: 10, fontFace: F.b, color: C.dark, bold: true, shrinkText: true,
        })

        // Description
        if (sec.items.length > 0) {
          s.addText(clean(sec.items[0]), {
            x: 1.15, y: yPos + 0.28, w: 8.2, h: 0.22,
            fontSize: 8, fontFace: F.b, color: C.muted, shrinkText: true,
          })
        }
        yPos += 0.62
      }
    }
    // Standard bold sections
    else {
      for (const sec of sections) {
        if (yPos > 4.4) break

        // Section title
        s.addText(richText('**' + sec.title + '**'), {
          x: 0.6, y: yPos, w: 8.8, h: 0.3,
          fontSize: 12, fontFace: F.b, color: C.dark,
        })
        yPos += 0.32

        for (const item of sec.items) {
          if (yPos > 4.7) break
          s.addText('  •  ' + clean(item), {
            x: 0.6, y: yPos, w: 8.8, h: 0.24,
            fontSize: 10, fontFace: F.b, color: C.muted, wrap: true,
          })
          yPos += 0.26
        }
        yPos += 0.08
      }
    }
  } else {
    // Plain bullets from rawMarkdown
    const lines = raw.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
    for (const line of lines) {
      if (yPos > 4.7) break
      // Check if line has bold prefix
      const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)/)
      if (boldMatch) {
        s.addText(richText(line), {
          x: 0.6, y: yPos, w: 8.8, h: 0.28,
          fontSize: 11, fontFace: F.b, color: C.dark,
        })
      } else {
        s.addText('  •  ' + clean(line), {
          x: 0.6, y: yPos, w: 8.8, h: 0.26,
          fontSize: 10, fontFace: F.b, color: C.dark,
        })
      }
      yPos += 0.3
    }
  }

  // Callout banner
  if (callout?.text) {
    const bannerY = Math.max(yPos + 0.1, 4.35)
    if (bannerY < 5.0) {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y: bannerY, w: 8.8, h: 0.5,
        fill: { color: C.dark },
        rectRadius: 0.08,
      })
      s.addText(clean(callout.text), {
        x: 0.6, y: bannerY, w: 8.8, h: 0.5,
        fontSize: 11, fontFace: F.b, color: C.white,
        align: 'center', valign: 'middle', bold: true,
      })
    }
  }
}

// ─── MATRIX ──────────────────────────────────────────────────────
function renderMatrix(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const matrix = (slide.content as Record<string, unknown>)?.matrix as Array<{ title: string; items: string[] }> | undefined
  if (!matrix?.length) return

  const cols = matrix.length <= 4 ? 2 : 3
  const cardW = (8.8 / cols) - 0.12
  const cardH = 1.25

  matrix.forEach((cell, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = 0.5 + col * (cardW + 0.12)
    const y = 1.3 + row * (cardH + 0.12)

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: cardW, h: cardH,
      fill: { color: C.white },
      line: { color: C.greyDark, width: 0.75 },
      rectRadius: 0.06,
    })

    // Blue top border
    s.addShape(pptx.ShapeType.rect, {
      x: x + 0.05, y, w: cardW - 0.1, h: 0.035,
      fill: { color: C.blue },
    })

    // Title
    s.addText(clean(cell.title).replace(/:$/, ''), {
      x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.28,
      fontSize: 11, fontFace: F.b, color: C.dark, bold: true,
    })

    // Items
    let iy = y + 0.42
    for (const item of cell.items) {
      if (iy > y + cardH - 0.05) break
      s.addText(clean(item), {
        x: x + 0.12, y: iy, w: cardW - 0.24, h: 0.65,
        fontSize: 9, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
      })
      iy += 0.3
    }
  })
}

// ─── COMPARISON ──────────────────────────────────────────────────
function renderComparison(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const comparison = (slide.content as Record<string, unknown>)?.comparison as Array<{
    title: string; description?: string; type?: string; items: string[]
  }> | undefined
  if (!comparison?.length) return

  // Gap-analysis mode (all negative) → table layout
  const allNeg = comparison.every(c => c.type === 'negative')

  if (allNeg && comparison.length > 3) {
    // Table rows
    const rows: PptxGenJS.TableRow[] = [[
      { text: 'Erwartung', options: { bold: true, fontSize: 9, color: C.white, fill: { color: C.dark }, align: 'center' as const } },
      { text: 'Realität', options: { bold: true, fontSize: 9, color: C.white, fill: { color: C.dark }, align: 'center' as const } },
      { text: 'Ergebnis', options: { bold: true, fontSize: 9, color: C.white, fill: { color: C.dark }, align: 'center' as const } },
    ]]

    for (const col of comparison) {
      rows.push([
        { text: clean(col.title).replace(/:$/, ''), options: { fontSize: 8, color: C.dark, bold: true } },
        { text: col.items.map(i => clean(i)).join('; '), options: { fontSize: 8, color: C.red } },
        { text: clean(col.description || '').replace(/^Ergebnis:\s*/i, ''), options: { fontSize: 8, color: C.muted, italic: true } },
      ])
    }

    s.addTable(rows, {
      x: 0.5, y: 1.3, w: 9.0,
      colW: [2.8, 3.5, 2.7],
      border: { type: 'solid', pt: 0.5, color: C.greyDark },
      fontFace: F.b,
      rowH: 0.42,
    })
  } else {
    // Column layout
    const count = Math.min(comparison.length, 3)
    const colW = (8.8 / count) - 0.1

    comparison.slice(0, 3).forEach((col, i) => {
      const x = 0.5 + i * (colW + 0.1)
      const isNeg = col.type === 'negative'

      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.3, w: colW, h: 3.5,
        fill: { color: C.white },
        line: { color: isNeg ? C.red : C.green, width: 1.5 },
        rectRadius: 0.08,
      })

      // Header
      s.addShape(pptx.ShapeType.rect, {
        x: x + 0.01, y: 1.31, w: colW - 0.02, h: 0.45,
        fill: { color: isNeg ? C.red : C.green },
      })
      s.addText((isNeg ? '❌  ' : '✓  ') + clean(col.title).replace(/:$/, ''), {
        x: x + 0.1, y: 1.31, w: colW - 0.2, h: 0.45,
        fontSize: 10, fontFace: F.b, color: C.white, bold: true,
        valign: 'middle', shrinkText: true,
      })

      let y = 1.9
      for (const item of col.items) {
        if (y > 4.3) break
        s.addText('•  ' + clean(item), {
          x: x + 0.1, y, w: colW - 0.2, h: 0.28,
          fontSize: 9, fontFace: F.b, color: C.dark, wrap: true,
        })
        y += 0.32
      }

      if (col.description) {
        s.addText('→ ' + clean(col.description).replace(/^Ergebnis:\s*/i, ''), {
          x: x + 0.1, y: 4.35, w: colW - 0.2, h: 0.35,
          fontSize: 8, fontFace: F.b, color: C.muted, italic: true, wrap: true,
        })
      }
    })
  }
}

// ─── INFOGRAPHIC ─────────────────────────────────────────────────
function renderInfographic(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const pp = (slide.content as Record<string, unknown>)?.pressurePoints as Array<{ title: string; items: string[] }> | undefined
  if (!pp?.length) return

  const cols = pp.length <= 4 ? 2 : 3
  const cardW = (8.8 / cols) - 0.12
  const rows = Math.ceil(pp.length / cols)
  const cardH = Math.min(3.0 / rows - 0.1, 1.3)

  pp.forEach((point, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = 0.5 + col * (cardW + 0.12)
    const y = 1.3 + row * (cardH + 0.12)

    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: cardW, h: cardH,
      fill: { color: C.grey },
      rectRadius: 0.06,
    })

    // Blue left accent
    s.addShape(pptx.ShapeType.rect, {
      x, y: y + 0.06, w: 0.04, h: cardH - 0.12,
      fill: { color: C.blue },
    })

    s.addText(clean(point.title).replace(/:$/, ''), {
      x: x + 0.15, y: y + 0.08, w: cardW - 0.3, h: 0.25,
      fontSize: 10, fontFace: F.b, color: C.dark, bold: true,
    })

    let iy = y + 0.38
    for (const item of point.items) {
      if (iy > y + cardH - 0.05) break
      s.addText(clean(item), {
        x: x + 0.15, y: iy, w: cardW - 0.3, h: 0.7,
        fontSize: 8, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
      })
      iy += 0.3
    }
  })
}

// ─── MATURITY ────────────────────────────────────────────────────
function renderMaturity(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const raw = (slide.content as Record<string, unknown>)?.rawMarkdown as string || ''
  const callout = (slide.content as Record<string, unknown>)?.callout as { text: string } | undefined

  const levels = [...raw.matchAll(/[-•]\s*(\*\*)?Stufe\s*(\d)\s*[–-]\s*([^*\n]+)\1?/g)]
  const activeLine = raw.match(/\*\*Stufe\s*(\d)/)
  const activeNum = activeLine ? parseInt(activeLine[1]) : 0

  const barH = 0.55
  const startY = 1.5
  const colors = ['9CA3AF', '6B7280', '4F46E5', '3730A3', C.dark]

  levels.forEach((m, i) => {
    const num = parseInt(m[2])
    const name = m[3].trim().replace(/←.*/, '').trim()
    const isActive = num === activeNum
    const y = startY + i * (barH + 0.08)
    const fillPct = num / 5

    // Background bar
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y, w: 8.8, h: barH,
      fill: { color: C.greyDark },
      rectRadius: 0.05,
    })

    // Fill
    const fillColor = isActive ? C.blue : C.greyDark
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y, w: 8.8 * fillPct, h: barH,
      fill: { color: fillColor },
      rectRadius: 0.05,
    })

    // Label
    s.addText(`Stufe ${num} – ${name}`, {
      x: 0.8, y, w: 8.4, h: barH,
      fontSize: 13, fontFace: F.b,
      color: isActive ? C.white : C.dark,
      bold: isActive, valign: 'middle',
    })

    // Active marker
    if (isActive) {
      s.addText('◀  Aktuelle Position', {
        x: 8.8 * fillPct + 0.7, y, w: 2.0, h: barH,
        fontSize: 9, fontFace: F.b, color: C.blue, bold: true, valign: 'middle',
      })
    }
  })

  if (callout?.text) {
    const bannerY = startY + levels.length * (barH + 0.08) + 0.2
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: bannerY, w: 8.8, h: 0.5,
      fill: { color: C.dark },
      rectRadius: 0.08,
    })
    s.addText(clean(callout.text), {
      x: 0.6, y: bannerY, w: 8.8, h: 0.5,
      fontSize: 12, fontFace: F.b, color: C.white,
      align: 'center', valign: 'middle', bold: true,
    })
  }
}

// ─── ICEBERG ─────────────────────────────────────────────────────
function renderIceberg(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const iceberg = (slide.content as Record<string, unknown>)?.iceberg as Array<{
    title: string; position: string; items: string[]
  }> | undefined
  if (!iceberg?.length) return

  const above = iceberg.find(x => x.position === 'above')
  const below = iceberg.find(x => x.position === 'below')
  const waterY = 2.65

  // Above section (light green bg)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.2, w: 9.0, h: waterY - 1.25,
    fill: { color: C.greenBg },
    rectRadius: 0.08,
  })

  if (above) {
    s.addText('▲  ' + clean(above.title).replace(/:$/, ''), {
      x: 0.7, y: 1.25, w: 8.6, h: 0.3,
      fontSize: 11, fontFace: F.b, color: C.green, bold: true,
    })
    let y = 1.6
    for (const item of above.items) {
      s.addText('•  ' + clean(item), {
        x: 0.9, y, w: 8.4, h: 0.25,
        fontSize: 10, fontFace: F.b, color: C.dark,
      })
      y += 0.28
    }
  }

  // Waterline
  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: waterY, w: 9.4, h: 0.03, fill: { color: C.accent },
  })
  s.addText('~  Oberfläche', {
    x: 0.5, y: waterY - 0.22, w: 2, h: 0.2,
    fontSize: 7, fontFace: F.b, color: C.accent, italic: true,
  })

  // Below section (light red bg)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: waterY + 0.08, w: 9.0, h: 2.3,
    fill: { color: C.redBg },
    rectRadius: 0.08,
  })

  if (below) {
    s.addText('▼  ' + clean(below.title).replace(/:$/, ''), {
      x: 0.7, y: waterY + 0.12, w: 8.6, h: 0.3,
      fontSize: 11, fontFace: F.b, color: C.red, bold: true,
    })
    let y = waterY + 0.45
    for (const item of below.items) {
      if (y > 4.8) break
      s.addText('•  ' + clean(item), {
        x: 0.9, y, w: 8.4, h: 0.25,
        fontSize: 10, fontFace: F.b, color: C.dark,
      })
      y += 0.27
    }
  }
}

// ─── MODULE DETAIL ───────────────────────────────────────────────
function renderModuleDetail(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const detail = (slide.content as Record<string, unknown>)?.moduleDetail as {
    badge: string; bausteine: Array<{ name: string; role: string; description: string; effort: string }>
    ergebnisse: string[]; aufwand: string
  } | undefined
  if (!detail) return

  // Badge
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 5, h: 0.32,
    fill: { color: C.blue }, rectRadius: 0.05,
  })
  s.addText(detail.badge, {
    x: 0.6, y: 1.2, w: 5, h: 0.32,
    fontSize: 9, fontFace: F.b, color: C.white, bold: true,
    align: 'center', valign: 'middle',
  })

  // Bausteine table
  const headerOpts = { bold: true, fontSize: 9, color: C.white, fill: { color: C.dark } }
  const rows: PptxGenJS.TableRow[] = [[
    { text: 'Baustein', options: headerOpts },
    { text: 'Rolle', options: headerOpts },
    { text: 'Beschreibung', options: headerOpts },
    { text: 'Aufwand', options: headerOpts },
  ]]

  for (const b of detail.bausteine) {
    rows.push([
      { text: b.name, options: { fontSize: 8, color: C.dark, bold: true } },
      { text: b.role, options: { fontSize: 8, color: C.muted } },
      { text: b.description, options: { fontSize: 8, color: C.dark } },
      { text: b.effort, options: { fontSize: 8, color: C.muted } },
    ])
  }

  s.addTable(rows, {
    x: 0.5, y: 1.65, w: 9.0,
    colW: [2.0, 0.9, 4.6, 1.5],
    border: { type: 'solid', pt: 0.5, color: C.greyDark },
    fontFace: F.b,
    rowH: 0.35,
  })

  const tableBottom = 1.65 + rows.length * 0.35 + 0.15

  // Results
  if (detail.ergebnisse.length > 0 && tableBottom < 4.3) {
    s.addText('Ergebnisse:', {
      x: 0.6, y: tableBottom, w: 4.5, h: 0.25,
      fontSize: 10, fontFace: F.b, color: C.dark, bold: true,
    })
    let ey = tableBottom + 0.28
    for (const e of detail.ergebnisse) {
      if (ey > 4.8) break
      s.addText('•  ' + clean(e), {
        x: 0.8, y: ey, w: 4.3, h: 0.22,
        fontSize: 8, fontFace: F.b, color: C.muted,
      })
      ey += 0.24
    }
  }

  // Aufwand box
  if (detail.aufwand) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 5.5, y: tableBottom, w: 4.0, h: 0.45,
      fill: { color: C.grey }, rectRadius: 0.06,
    })
    s.addText(detail.aufwand, {
      x: 5.5, y: tableBottom, w: 4.0, h: 0.45,
      fontSize: 9, fontFace: F.b, color: C.dark,
      align: 'center', valign: 'middle', bold: true, shrinkText: true,
    })
  }
}

// ─── PROCESS FLOW ────────────────────────────────────────────────
function renderProcessFlow(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const raw = (slide.content as Record<string, unknown>)?.rawMarkdown as string || ''
  const sections = parseBoldSections(raw)
  if (!sections.length) return

  const count = Math.min(sections.length, 6)
  const cardW = (9.0 / count) - 0.12
  const flowColors = [C.green, C.blue, C.blue, C.blue, C.blue, C.dark]

  sections.slice(0, count).forEach((sec, i) => {
    const x = 0.45 + i * (cardW + 0.12)
    const color = flowColors[i] || C.blue

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.3, w: cardW, h: 3.3,
      fill: { color: C.white },
      line: { color, width: 1.5 },
      rectRadius: 0.08,
    })

    // Header
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.02, y: 1.32, w: cardW - 0.04, h: 0.42,
      fill: { color }, rectRadius: 0.06,
    })
    s.addText(clean(sec.title).replace(/:$/, ''), {
      x: x + 0.05, y: 1.32, w: cardW - 0.1, h: 0.42,
      fontSize: 7, fontFace: F.b, color: C.white, bold: true,
      align: 'center', valign: 'middle', wrap: true, shrinkText: true,
    })

    // Items
    let y = 1.85
    for (const item of sec.items) {
      if (y > 4.4) break
      s.addText('•  ' + clean(item), {
        x: x + 0.08, y, w: cardW - 0.16, h: 0.2,
        fontSize: 7, fontFace: F.b, color: C.dark, wrap: true,
      })
      y += 0.22
    }

    // Arrow
    if (i < count - 1) {
      s.addText('›', {
        x: x + cardW + 0.01, y: 2.5, w: 0.12, h: 0.4,
        fontSize: 18, color: C.accent, align: 'center', valign: 'middle',
        fontFace: F.h, bold: true,
      })
    }
  })
}

// ─── PRICING ─────────────────────────────────────────────────────
function renderPricing(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const comparison = (slide.content as Record<string, unknown>)?.comparison as Array<{
    title: string; description?: string; items: string[]
  }> | undefined
  if (!comparison?.length) return

  const count = comparison.length
  const cardW = (9.0 / count) - 0.15
  const headerColors = [C.muted, C.blue, C.dark]

  comparison.forEach((pkg, i) => {
    const x = 0.45 + i * (cardW + 0.15)
    const hColor = headerColors[i] || C.blue
    const isLast = i === count - 1

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.25, w: cardW, h: 3.75,
      fill: { color: C.white },
      line: { color: isLast ? C.accent : C.greyDark, width: isLast ? 2 : 1 },
      rectRadius: 0.1,
    })

    // Empfohlen badge
    if (isLast) {
      s.addShape(pptx.ShapeType.roundRect, {
        x: x + cardW / 2 - 0.55, y: 1.15, w: 1.1, h: 0.25,
        fill: { color: C.accent }, rectRadius: 0.06,
      })
      s.addText('★ Empfohlen', {
        x: x + cardW / 2 - 0.55, y: 1.15, w: 1.1, h: 0.25,
        fontSize: 8, fontFace: F.b, color: C.dark, bold: true,
        align: 'center', valign: 'middle',
      })
    }

    // Header
    s.addShape(pptx.ShapeType.rect, {
      x: x + 0.01, y: 1.26, w: cardW - 0.02, h: 0.85,
      fill: { color: hColor },
    })

    // Parse name + price
    const match = pkg.title.match(/^(.+?)\s*[–-]\s*([\d.]+\s*€)/)
    const name = match ? clean(match[1]) : clean(pkg.title)
    const price = match ? match[2] : ''

    s.addText(name, {
      x: x + 0.1, y: 1.3, w: cardW - 0.2, h: 0.35,
      fontSize: 13, fontFace: F.h, color: C.white, bold: true,
      align: 'center', valign: 'middle',
    })
    if (price) {
      s.addText(price, {
        x: x + 0.1, y: 1.65, w: cardW - 0.2, h: 0.4,
        fontSize: 20, fontFace: F.h, color: C.white, bold: true,
        align: 'center', valign: 'middle',
      })
    }

    // Features
    let y = 2.25
    for (const item of pkg.items) {
      if (y > 4.5) break
      s.addText('✓  ' + clean(item), {
        x: x + 0.12, y, w: cardW - 0.24, h: 0.22,
        fontSize: 8, fontFace: F.b, color: C.dark, wrap: true,
      })
      y += 0.25
    }

    // Result
    if (pkg.description) {
      s.addText('→ ' + clean(pkg.description).replace(/^Ergebnis:\s*/i, ''), {
        x: x + 0.1, y: 4.6, w: cardW - 0.2, h: 0.3,
        fontSize: 8, fontFace: F.b, color: C.muted, italic: true,
        align: 'center', wrap: true,
      })
    }
  })
}

// ─── GENERIC FALLBACK ────────────────────────────────────────────
function renderGeneric(pptx: PptxGenJS, slide: Slide) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const raw = (slide.content as Record<string, unknown>)?.rawMarkdown as string || ''
  const sections = parseBoldSections(raw)

  let yPos = 1.3
  if (sections.length > 0) {
    for (const sec of sections) {
      if (yPos > 4.5) break
      s.addText(richText('**' + sec.title + '**'), {
        x: 0.6, y: yPos, w: 8.8, h: 0.3,
        fontSize: 12, fontFace: F.b, color: C.dark,
      })
      yPos += 0.32
      for (const item of sec.items) {
        if (yPos > 4.8) break
        s.addText('  •  ' + clean(item), {
          x: 0.6, y: yPos, w: 8.8, h: 0.25,
          fontSize: 10, fontFace: F.b, color: C.muted, wrap: true,
        })
        yPos += 0.27
      }
      yPos += 0.1
    }
  } else {
    const lines = raw.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
    for (const line of lines) {
      if (yPos > 4.8) break
      s.addText(richText(line), {
        x: 0.6, y: yPos, w: 8.8, h: 0.28,
        fontSize: 11, fontFace: F.b, color: C.dark,
      })
      yPos += 0.3
    }
  }
}

// ─── CONTENT PAGE ────────────────────────────────────────────────
interface CpSection {
  title: string
  type: 'paragraph' | 'bullets' | 'facts'
  text?: string
  items?: Array<{ title: string; description: string }>
  facts?: Array<{ label: string; value: string }>
  trailingText?: string
}

function cpParseSections(raw: string): CpSection[] {
  const sections: CpSection[] = []
  const lines = raw.split('\n')
  let curTitle = '', curBullets: string[] = [], curText: string[] = []

  function flush() {
    if (!curTitle) return
    const title = curTitle.replace(/:$/, '').trim()
    if (curBullets.length > 0) {
      const kvPat = /^\*\*([^*]+:)\*\*\s*(.+)/
      const isKV = curBullets.length > 0 && curBullets.every(l => kvPat.test(l))
      if (isKV) {
        const facts = curBullets.map(l => {
          const m = l.match(kvPat)
          return m ? { label: m[1].replace(/:$/, ''), value: m[2] } : { label: '', value: l }
        })
        sections.push({ title, type: 'facts', facts })
      } else {
        const items = curBullets.map(t => {
          const b = t.match(/^\*\*([^*]+)\*\*\s*(?:[–—\-|:])\s*(.+)/)
          if (b) return { title: b[1], description: b[2] }
          const b2 = t.match(/^\*\*([^*]+)\*\*\s*(.*)/)
          if (b2) return { title: b2[1], description: b2[2].replace(/^[–—\-|:]\s*/, '') }
          return { title: t, description: '' }
        })
        sections.push({ title, type: 'bullets', items, trailingText: curText.length > 0 ? curText.join(' ') : undefined })
      }
    } else if (curText.length > 0) {
      sections.push({ title, type: 'paragraph', text: curText.join(' ') })
    }
    curTitle = ''; curBullets = []; curText = []
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    const hdr = t.match(/^\*\*([^*]+)\*\*\s*$/)
    if (hdr && !t.startsWith('- ')) { flush(); curTitle = hdr[1]; continue }
    if (t.startsWith('- ')) { curBullets.push(t.slice(2).trim()); continue }
    curText.push(t)
  }
  flush()
  return sections
}

function cpGetIcon(text: string): string {
  const map: Array<[RegExp, string]> = [
    [/interview|gespräch/i, 'kommunikation'], [/umfrage/i, 'diagramm'],
    [/reifegrad|dimension/i, 'netz'], [/erhebung|unkontrolliert/i, 'lupe'],
    [/regulat|dsgvo|ai.?act/i, 'governance'], [/ergebnis|empfehlung/i, 'check'],
    [/klarheit|vermutung/i, 'glühbirne'], [/risik|sichtbar/i, 'schild'],
    [/orientierung/i, 'kompass'], [/entscheidung|basis/i, 'strategie'],
    [/dauer|wochen/i, 'uhr'], [/aufwand|stunden/i, 'team'],
    [/umfang|berater/i, 'bausteine'], [/festpreis|€/i, 'rakete'],
    [/nutzung|belegschaft/i, 'team'], [/fenster|pflicht/i, 'governance'],
    [/monat|steuerung/i, 'uhr'],
  ]
  for (const [re, icon] of map) if (re.test(text)) return icon
  return 'check'
}

function renderContentPage(pptx: PptxGenJS, slide: Slide) {
  const raw = (slide.content as Record<string, unknown>)?.rawMarkdown as string || ''
  const sections = cpParseSections(raw)
  const hasFacts = sections.some(s => s.type === 'facts')
  const hasBullets = sections.some(s => s.type === 'bullets')
  const hasParagraphs = sections.some(s => s.type === 'paragraph')
  const bulletCount = sections.filter(s => s.type === 'bullets').reduce((n, s) => n + (s.items?.length || 0), 0)

  if (hasFacts) {
    renderContentPagePricing(pptx, slide, sections)
  } else if (hasParagraphs && hasBullets && bulletCount >= 4) {
    renderContentPageBento(pptx, slide, sections)
  } else if (hasParagraphs && hasBullets) {
    renderContentPageBenefits(pptx, slide, sections)
  } else {
    renderContentPageFallback(pptx, slide, sections)
  }
}

// ── Bento: intro blocks + numbered journey cards ──
function renderContentPageBento(pptx: PptxGenJS, slide: Slide, sections: CpSection[]) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const bulletSec = sections.find(s => s.type === 'bullets')
  const items = bulletSec?.items || []

  // Dark intro block (left, wide)
  if (paragraphs[0]) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.2, w: 5.5, h: 1.2, fill: { color: C.dark }, rectRadius: 0.1,
    })
    s.addText(clean(paragraphs[0].title), {
      x: 0.7, y: 1.25, w: 5.1, h: 0.25,
      fontSize: 8, fontFace: F.b, color: C.accent, bold: true,
    })
    s.addText(paragraphs[0].text || '', {
      x: 0.7, y: 1.52, w: 5.1, h: 0.8,
      fontSize: 8, fontFace: F.b, color: C.white + '', wrap: true, valign: 'top',
    })
  }

  // Light intro block (right, narrow)
  if (paragraphs[1]) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.15, y: 1.2, w: 3.35, h: 1.2, fill: { color: C.grey }, rectRadius: 0.1,
    })
    s.addText(clean(paragraphs[1].title), {
      x: 6.3, y: 1.25, w: 3.05, h: 0.25,
      fontSize: 8, fontFace: F.b, color: C.blue, bold: true,
    })
    s.addText(paragraphs[1].text || '', {
      x: 6.3, y: 1.52, w: 3.05, h: 0.8,
      fontSize: 7, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
    })
  }

  // Section title
  if (bulletSec) {
    s.addShape(_pptx.ShapeType.rect, {
      x: 0.5, y: 2.58, w: 0.5, h: 0.03, fill: { color: C.accent },
    })
    s.addText(bulletSec.title, {
      x: 1.1, y: 2.5, w: 4, h: 0.2,
      fontSize: 9, fontFace: F.b, color: C.muted, bold: true,
    })
  }

  // Numbered cards 3x2
  const cardW = 2.87
  const cardH = 1.05
  items.forEach((item, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * (cardW + 0.15)
    const y = 2.85 + row * (cardH + 0.12)

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: cardW, h: cardH,
      fill: { color: C.white },
      line: { color: C.greyDark, width: 0.5 },
      rectRadius: 0.06,
    })

    // Number circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.1, y: y + 0.12, w: 0.3, h: 0.3,
      fill: { color: C.dark },
    })
    s.addText(String(i + 1), {
      x: x + 0.1, y: y + 0.12, w: 0.3, h: 0.3,
      fontSize: 9, fontFace: F.h, color: C.white, bold: true,
      align: 'center', valign: 'middle',
    })

    // Title + description
    s.addText(clean(item.title), {
      x: x + 0.5, y: y + 0.1, w: cardW - 0.65, h: 0.25,
      fontSize: 9, fontFace: F.b, color: C.dark, bold: true, shrinkText: true,
    })
    if (item.description) {
      s.addText(clean(item.description), {
        x: x + 0.5, y: y + 0.38, w: cardW - 0.65, h: 0.55,
        fontSize: 7, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
      })
    }
  })

  // Trailing text
  if (bulletSec?.trailingText) {
    s.addText(bulletSec.trailingText, {
      x: 0.5, y: 4.75, w: 9.0, h: 0.2,
      fontSize: 7, fontFace: F.b, color: C.muted, italic: true, align: 'center',
    })
  }
}

// ── Benefits: highlight box + 2x2 cards + urgency banner ──
function renderContentPageBenefits(pptx: PptxGenJS, slide: Slide, sections: CpSection[]) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const bulletSections = sections.filter(s => s.type === 'bullets')
  const benefitSec = bulletSections[0]
  const urgencySec = bulletSections[1]

  // Hero result box (dark gradient)
  if (paragraphs[0]) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.2, w: 9.0, h: 0.85, fill: { color: C.dark }, rectRadius: 0.1,
    })
    s.addText(clean(paragraphs[0].title), {
      x: 0.7, y: 1.22, w: 2, h: 0.25,
      fontSize: 8, fontFace: F.b, color: C.accent, bold: true,
    })
    s.addText(paragraphs[0].text || '', {
      x: 0.7, y: 1.48, w: 8.6, h: 0.5,
      fontSize: 8, fontFace: F.b, color: C.white, wrap: true, valign: 'top',
    })
  }

  // Benefits section title
  if (benefitSec) {
    s.addShape(_pptx.ShapeType.rect, {
      x: 0.5, y: 2.22, w: 0.5, h: 0.03, fill: { color: C.accent },
    })
    s.addText(benefitSec.title, {
      x: 1.1, y: 2.15, w: 5, h: 0.2,
      fontSize: 9, fontFace: F.b, color: C.muted, bold: true,
    })
  }

  // 2x2 benefit cards
  const benefitColors = [C.blue, '059669', '7c3aed', '0078FE']
  benefitSec?.items?.forEach((item, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.5 + col * 4.6
    const y = 2.45 + row * 0.8
    const color = benefitColors[i % benefitColors.length]

    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 4.4, h: 0.7,
      fill: { color: C.white },
      line: { color: C.greyDark, width: 0.5 },
      rectRadius: 0.06,
    })
    // Top border accent
    s.addShape(_pptx.ShapeType.rect, {
      x: x + 0.05, y, w: 4.3, h: 0.025, fill: { color },
    })

    s.addText(clean(item.title), {
      x: x + 0.15, y: y + 0.06, w: 4.1, h: 0.25,
      fontSize: 9, fontFace: F.b, color: C.dark, bold: true,
    })
    if (item.description) {
      s.addText(clean(item.description), {
        x: x + 0.15, y: y + 0.32, w: 4.1, h: 0.32,
        fontSize: 7, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
      })
    }
  })

  // Urgency banner
  if (urgencySec) {
    const bannerY = 4.15
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: bannerY, w: 9.0, h: 0.8, fill: { color: C.dark }, rectRadius: 0.1,
    })
    s.addText(urgencySec.title.toUpperCase(), {
      x: 0.7, y: bannerY + 0.05, w: 3, h: 0.2,
      fontSize: 7, fontFace: F.b, color: C.accent, bold: true,
    })

    urgencySec.items?.forEach((item, i) => {
      const ix = 0.7 + i * 2.95
      // Number circle
      s.addShape(pptx.ShapeType.ellipse, {
        x: ix, y: bannerY + 0.32, w: 0.2, h: 0.2, fill: { color: C.accent },
      })
      s.addText(String(i + 1), {
        x: ix, y: bannerY + 0.32, w: 0.2, h: 0.2,
        fontSize: 7, fontFace: F.h, color: C.dark, bold: true,
        align: 'center', valign: 'middle',
      })
      const txt = item.description ? `${clean(item.title)} – ${clean(item.description)}` : clean(item.title)
      s.addText(txt, {
        x: ix + 0.28, y: bannerY + 0.3, w: 2.55, h: 0.4,
        fontSize: 7, fontFace: F.b, color: C.white, wrap: true, valign: 'top',
      })
    })
  }
}

// ── Pricing: card left + paragraphs right ──
function renderContentPagePricing(pptx: PptxGenJS, slide: Slide, sections: CpSection[]) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  const factsSec = sections.find(s => s.type === 'facts')
  const paragraphs = sections.filter(s => s.type === 'paragraph')
  const facts = factsSec?.facts || []
  const priceFact = facts.find(f => /€/.test(f.value))
  const otherFacts = facts.filter(f => f !== priceFact)

  // Section title
  s.addShape(_pptx.ShapeType.rect, {
    x: 0.5, y: 1.18, w: 0.5, h: 0.03, fill: { color: C.accent },
  })
  s.addText(factsSec?.title || 'Auf einen Blick', {
    x: 1.1, y: 1.1, w: 4, h: 0.2,
    fontSize: 9, fontFace: F.b, color: C.muted, bold: true,
  })

  // Pricing card (left)
  const cardX = 0.5, cardY = 1.45, cardW = 3.5

  // Card header (dark)
  s.addShape(pptx.ShapeType.roundRect, {
    x: cardX, y: cardY, w: cardW, h: 1.0,
    fill: { color: C.dark }, rectRadius: 0.1,
  })
  s.addText('KI-Standortbestimmung', {
    x: cardX, y: cardY + 0.08, w: cardW, h: 0.2,
    fontSize: 7, fontFace: F.b, color: C.muted, align: 'center',
  })
  s.addText(priceFact?.value || '5.000 €', {
    x: cardX, y: cardY + 0.28, w: cardW, h: 0.45,
    fontSize: 24, fontFace: F.h, color: C.accent, bold: true, align: 'center', valign: 'middle',
  })
  s.addText('Festpreis · keine versteckten Kosten', {
    x: cardX, y: cardY + 0.72, w: cardW, h: 0.2,
    fontSize: 6, fontFace: F.b, color: C.muted, align: 'center',
  })

  // Card body (white with checklist)
  s.addShape(pptx.ShapeType.roundRect, {
    x: cardX, y: cardY + 1.05, w: cardW, h: otherFacts.length * 0.32 + 0.15,
    fill: { color: C.white },
    line: { color: C.greyDark, width: 0.5 },
    rectRadius: 0.08,
  })

  otherFacts.forEach((fact, i) => {
    const fy = cardY + 1.15 + i * 0.32
    s.addText('✓', {
      x: cardX + 0.15, y: fy, w: 0.2, h: 0.25,
      fontSize: 9, fontFace: F.b, color: C.accent, valign: 'middle',
    })
    s.addText(`${fact.label}: `, {
      x: cardX + 0.4, y: fy, w: 1.2, h: 0.25,
      fontSize: 8, fontFace: F.b, color: C.dark, bold: true, valign: 'middle',
    })
    s.addText(fact.value, {
      x: cardX + 1.6, y: fy, w: 1.7, h: 0.25,
      fontSize: 8, fontFace: F.b, color: C.muted, valign: 'middle',
    })
  })

  // Right side: paragraph cards
  const rightX = 4.2
  const rightW = 5.3
  let rightY = 1.45

  paragraphs.forEach((sec, i) => {
    const isLast = i === paragraphs.length - 1
    const isCTA = /gespräch|schritt|start|kontakt/i.test(sec.title)
    const h = 1.1

    if (isCTA || isLast) {
      // Dark CTA box
      s.addShape(pptx.ShapeType.roundRect, {
        x: rightX, y: rightY, w: rightW, h,
        fill: { color: C.dark }, rectRadius: 0.1,
      })
      s.addText(clean(sec.title), {
        x: rightX + 0.2, y: rightY + 0.1, w: rightW - 0.4, h: 0.2,
        fontSize: 9, fontFace: F.b, color: C.accent, bold: true,
      })
      s.addText(sec.text || '', {
        x: rightX + 0.2, y: rightY + 0.35, w: rightW - 0.4, h: 0.45,
        fontSize: 8, fontFace: F.b, color: C.white, wrap: true, valign: 'top',
      })

      // Trust badges
      const badges = ['1–2 Wochen', 'Festpreis', 'Unverbindlich']
      badges.forEach((badge, bi) => {
        s.addShape(pptx.ShapeType.roundRect, {
          x: rightX + 0.2 + bi * 1.4, y: rightY + h - 0.3, w: 1.2, h: 0.2,
          fill: { color: C.blue }, rectRadius: 0.06,
        })
        s.addText(badge, {
          x: rightX + 0.2 + bi * 1.4, y: rightY + h - 0.3, w: 1.2, h: 0.2,
          fontSize: 6, fontFace: F.b, color: C.white, align: 'center', valign: 'middle',
        })
      })
    } else {
      // Light info box
      s.addShape(pptx.ShapeType.roundRect, {
        x: rightX, y: rightY, w: rightW, h,
        fill: { color: C.grey }, rectRadius: 0.1,
      })
      s.addText(clean(sec.title), {
        x: rightX + 0.2, y: rightY + 0.1, w: rightW - 0.4, h: 0.2,
        fontSize: 9, fontFace: F.b, color: C.dark, bold: true,
      })
      s.addText(sec.text || '', {
        x: rightX + 0.2, y: rightY + 0.35, w: rightW - 0.4, h: 0.6,
        fontSize: 8, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
      })
    }

    rightY += h + 0.15
  })
}

// ── Fallback: paragraph cards ──
function renderContentPageFallback(pptx: PptxGenJS, slide: Slide, sections: CpSection[]) {
  const s = pptx.addSlide()
  addChrome(s, slide)

  let y = 1.3
  for (const sec of sections) {
    if (y > 4.5) break
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y, w: 9.0, h: 0.8,
      fill: { color: C.white },
      line: { color: C.greyDark, width: 0.5 },
      rectRadius: 0.06,
    })
    s.addShape(_pptx.ShapeType.rect, {
      x: 0.5, y: y + 0.06, w: 0.04, h: 0.68, fill: { color: C.blue },
    })
    s.addText(clean(sec.title), {
      x: 0.7, y: y + 0.08, w: 8.6, h: 0.22,
      fontSize: 10, fontFace: F.b, color: C.dark, bold: true,
    })
    s.addText(sec.text || '', {
      x: 0.7, y: y + 0.32, w: 8.6, h: 0.42,
      fontSize: 8, fontFace: F.b, color: C.muted, wrap: true, valign: 'top',
    })
    y += 0.95
  }
}

// ─── Layout Dispatcher ──────────────────────────────────────────
const renderers: Record<string, (pptx: PptxGenJS, slide: Slide) => void> = {
  hero: renderHero,
  timeline: renderTimeline,
  bullets: renderBullets,
  matrix: renderMatrix,
  comparison: renderComparison,
  infographic: renderInfographic,
  maturity: renderMaturity,
  iceberg: renderIceberg,
  'module-detail': renderModuleDetail,
  'process-flow': renderProcessFlow,
  pricing: renderPricing,
  'content-page': renderContentPage,
}

// ─── Main Export ─────────────────────────────────────────────────
export async function exportToPptx(deckData: DeckData): Promise<void> {
  // Load logo before generating slides
  await loadLogo()

  const pptx = new PptxGenJS()
  _pptx = pptx
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'IT Consulting by Tricept'
  pptx.title = deckData.title
  pptx.subject = deckData.description || ''

  for (const slide of deckData.slides) {
    const render = renderers[slide.layout] || renderGeneric
    render(pptx, slide)
  }

  const filename = deckData.title
    .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 60)

  await pptx.writeFile({ fileName: `${filename}.pptx` })
}
