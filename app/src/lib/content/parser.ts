import { Slide, DeckData, LayoutType, generateSlideId } from './schema'

interface ParsedSection {
  title: string
  content: string
}

interface RawSlide {
  number: number
  title: string
  sections: Record<string, string>
  chapter?: string
}

// Detect layout type from slide content and layout hints
function detectLayout(slide: RawSlide): LayoutType {
  const { title, sections } = slide
  const content = sections['Inhalt'] || ''
  const layoutHint = sections['Layout'] || ''
  const graphicHint = sections['Grafik-Idee'] || sections['Grafik-Beschreibung'] || ''

  // Hero: Title slide, closing slide
  if (slide.number === 1 || slide.number === 16) {
    return 'hero'
  }

  // Dialog: Slides focused on conversation/questions
  if (
    title.toLowerCase().includes('dialog') ||
    title.toLowerCase().includes('fragen') ||
    content.includes('Leitfragen') ||
    layoutHint.includes('bewusst reduziert') ||
    layoutHint.includes('viel Leerraum')
  ) {
    return 'dialog'
  }

  // Timeline: Process/agenda slides with steps
  if (
    layoutHint.includes('horizontale') ||
    layoutHint.includes('Pfad') ||
    layoutHint.includes('Timeline') ||
    layoutHint.includes('Prozessfluss') ||
    graphicHint.includes('Stationen') ||
    graphicHint.includes('Chevron') ||
    title.includes('Agenda') ||
    title.includes('Vorgehensmodell') ||
    title.includes('Module')
  ) {
    return 'timeline'
  }

  // Matrix: 2x2 grid layouts
  if (
    layoutHint.includes('2×2') ||
    layoutHint.includes('2x2') ||
    layoutHint.includes('Quadrant') ||
    layoutHint.includes('4 Spalten') ||
    graphicHint.includes('Matrix')
  ) {
    return 'matrix'
  }

  // Comparison: vs/contrast layouts
  if (
    content.includes('❌') ||
    content.includes('✓') ||
    layoutHint.includes('Gegenüberstellung') ||
    graphicHint.includes('Gegenüberstellung') ||
    title.includes('unterscheid') ||
    title.includes('Fehlstarts')
  ) {
    return 'comparison'
  }

  // Infographic: Pressure/forces diagram
  if (
    graphicHint.includes('Pfeile') ||
    graphicHint.includes('einwirken') ||
    graphicHint.includes('Druck') ||
    title.includes('Wettbewerbsdruck')
  ) {
    return 'infographic'
  }

  // Iceberg: Above/below metaphor
  if (
    graphicHint.includes('Eisberg') ||
    graphicHint.includes('Oberfläche') ||
    title.includes('Realitätscheck')
  ) {
    return 'iceberg'
  }

  // Maturity: Matrix with levels
  if (
    content.includes('Stufe 1') ||
    content.includes('Dimension') ||
    title.includes('Einordnung') ||
    graphicHint.includes('Reifegradmatrix')
  ) {
    return 'maturity'
  }

  // Parallel paths: Two equal options
  if (
    content.includes('Pfad A') ||
    content.includes('Pfad B') ||
    graphicHint.includes('parallele Pfade') ||
    title.includes('Einstieg')
  ) {
    return 'parallel-paths'
  }

  // Default: bullets
  return 'bullets'
}

// Parse bullet points from content
function parseItems(content: string): Array<{ text: string; icon?: string; items?: string[] }> {
  const lines = content.split('\n')
  const items: Array<{ text: string; icon?: string; items?: string[] }> = []
  let currentItem: { text: string; icon?: string; items?: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) continue

    // Main bullet point
    if (trimmed.startsWith('- ')) {
      if (currentItem) {
        items.push(currentItem)
      }
      let text = trimmed.slice(2)
      let icon: string | undefined

      // Extract emoji icon if present
      const emojiMatch = text.match(/^([🎯💡🧭🚀⚡✓👥🏆❌📊🔍⚙️💬])\s*/)
      if (emojiMatch) {
        icon = emojiMatch[1]
        text = text.slice(emojiMatch[0].length)
      }

      currentItem = { text, icon }
    }
    // Sub-bullet point
    else if (trimmed.startsWith('  - ') || trimmed.startsWith('    - ')) {
      const subText = trimmed.replace(/^\s*-\s*/, '')
      if (currentItem) {
        if (!currentItem.items) {
          currentItem.items = []
        }
        currentItem.items.push(subText)
      }
    }
  }

  if (currentItem) {
    items.push(currentItem)
  }

  return items
}

// Extract callout/core message
function extractCallout(content: string): { text: string; icon?: string } | undefined {
  const match = content.match(/Kernbotschaft[^:]*:\s*[„"]([^""]+)[""]/i)
  if (match) {
    return { text: match[1] }
  }
  return undefined
}

// Extract KPIs from content
function extractKPIs(content: string): Array<{ value: string; label: string }> {
  const kpis: Array<{ value: string; label: string }> = []

  // Match patterns like "86%" or "57%"
  const percentMatches = content.matchAll(/\*\*(\d+%)\*\*\s*([^*\n]+)/g)
  for (const match of percentMatches) {
    kpis.push({ value: match[1], label: match[2].trim() })
  }

  return kpis
}

// Parse timeline/process steps
function parseTimelineSteps(content: string): Array<{ title: string; description?: string; items?: string[] }> {
  const steps: Array<{ title: string; description?: string; items?: string[] }> = []

  // Look for numbered list patterns
  const numberedPattern = /(\d+)\.\s+([^\n]+)/g
  let match
  while ((match = numberedPattern.exec(content)) !== null) {
    steps.push({ title: match[2].trim() })
  }

  // Look for table patterns
  const tableMatch = content.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g)
  if (tableMatch && tableMatch.length > 2) {
    // Skip header and separator rows
    for (let i = 2; i < tableMatch.length; i++) {
      const cells = tableMatch[i].split('|').filter(c => c.trim())
      if (cells.length >= 2) {
        steps.push({
          title: cells[1]?.trim() || '',
          description: cells[2]?.trim(),
        })
      }
    }
  }

  return steps
}

// Parse matrix cells
function parseMatrixCells(content: string): Array<{ title: string; icon?: string; items: string[] }> {
  const cells: Array<{ title: string; icon?: string; items: string[] }> = []

  // Look for bold headers followed by bullet points
  const sections = content.split(/\*\*([^*]+)\*\*/g)

  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].trim()
    const items: string[] = []

    if (sections[i + 1]) {
      const itemLines = sections[i + 1].split('\n')
      for (const line of itemLines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          items.push(trimmed.slice(2))
        }
      }
    }

    if (title && items.length > 0) {
      cells.push({ title, items })
    }
  }

  return cells
}

// Parse comparison columns
function parseComparisonColumns(content: string): Array<{ title: string; type?: 'negative' | 'positive'; items: string[] }> {
  const columns: Array<{ title: string; type?: 'negative' | 'positive'; items: string[] }> = []

  // Look for ❌ and ✓ sections
  const sections = content.split(/\*\*([❌✓][^*]*)\*\*/g)

  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].trim()
    const type = title.startsWith('❌') ? 'negative' : title.startsWith('✓') ? 'positive' : undefined
    const items: string[] = []

    if (sections[i + 1]) {
      const contentLines = sections[i + 1].split('\n')
      for (const line of contentLines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('→') || trimmed.startsWith('-')) {
          items.push(trimmed.replace(/^[→-]\s*/, ''))
        }
      }
    }

    if (title) {
      columns.push({
        title: title.replace(/^[❌✓]\s*/, ''),
        type,
        items
      })
    }
  }

  return columns
}

// Parse maturity matrix
function parseMaturityLevels(content: string): Array<{ level: number; title: string; items: string[] }> {
  const levels: Array<{ level: number; title: string; items: string[] }> = []

  // Look for Stufe patterns in table
  const rows = content.split('\n').filter(line => line.includes('|') && line.includes('Stufe'))

  for (const row of rows) {
    const cells = row.split('|').map(c => c.trim()).filter(c => c)
    for (let i = 0; i < cells.length; i++) {
      const levelMatch = cells[i].match(/Stufe\s*(\d+)/)
      if (levelMatch) {
        const level = parseInt(levelMatch[1])
        const title = cells[i].replace(/Stufe\s*\d+:\s*/, '')
        levels.push({ level, title, items: [] })
      }
    }
  }

  return levels
}

// Parse parallel paths
function parseParallelPaths(content: string): Array<{ title: string; subtitle?: string; items: string[] }> {
  const paths: Array<{ title: string; subtitle?: string; items: string[] }> = []

  // Look for Pfad patterns
  const pathMatches = content.matchAll(/\*\*Pfad\s+([AB]):\s+([^*]+)\*\*/g)

  for (const match of pathMatches) {
    const startIndex = match.index! + match[0].length
    const nextPathIndex = content.indexOf('**Pfad', startIndex)
    const sectionEnd = nextPathIndex === -1 ? content.length : nextPathIndex
    const section = content.slice(startIndex, sectionEnd)

    const items: string[] = []
    const itemLines = section.split('\n')
    let subtitle: string | undefined

    for (const line of itemLines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        subtitle = trimmed.replace(/^\*|\*$/g, '')
      } else if (trimmed.startsWith('- ')) {
        items.push(trimmed.slice(2))
      }
    }

    paths.push({
      title: `Pfad ${match[1]}: ${match[2].trim()}`,
      subtitle,
      items
    })
  }

  return paths
}

// Parse iceberg sections
function parseIcebergSections(content: string): Array<{ title: string; position: 'above' | 'below'; items: string[] }> {
  const sections: Array<{ title: string; position: 'above' | 'below'; items: string[] }> = []

  // Look for bold section headers
  const sectionMatches = content.matchAll(/\*\*([^*]+)\*\*/g)

  for (const match of sectionMatches) {
    const title = match[1].trim()
    const position: 'above' | 'below' =
      title.toLowerCase().includes('shadow') ||
      title.toLowerCase().includes('insel') ||
      title.toLowerCase().includes('gap') ? 'below' : 'above'

    const startIndex = match.index! + match[0].length
    const nextSectionIndex = content.indexOf('**', startIndex)
    const sectionEnd = nextSectionIndex === -1 ? content.length : nextSectionIndex
    const sectionContent = content.slice(startIndex, sectionEnd)

    const items: string[] = []
    for (const line of sectionContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        items.push(trimmed.slice(2))
      }
    }

    if (items.length > 0) {
      sections.push({ title, position, items })
    }
  }

  return sections
}

// Main parser function
export function parseMarkdownPresentation(markdown: string): DeckData {
  const slides: Slide[] = []
  let currentChapter: string | undefined

  // Split by slide headers
  const slideRegex = /### Folie (\d+) \| ([^\n]+)/g
  const chapterRegex = /## Block (\d+) -- ([^\n]+)/g

  // Find all chapters
  const chapters: Map<number, string> = new Map()
  let chapterMatch
  while ((chapterMatch = chapterRegex.exec(markdown)) !== null) {
    const blockNum = parseInt(chapterMatch[1])
    chapters.set(blockNum, chapterMatch[2].trim())
  }

  // Find all slides
  const slideParts = markdown.split(/(?=### Folie \d+ \|)/)

  for (const part of slideParts) {
    const headerMatch = part.match(/### Folie (\d+) \| ([^\n]+)/)
    if (!headerMatch) continue

    const slideNumber = parseInt(headerMatch[1])
    const slideTitle = headerMatch[2].trim()

    // Determine chapter
    for (const [blockNum, chapterName] of chapters) {
      if (slideNumber >= getBlockStartSlide(blockNum)) {
        currentChapter = chapterName
      }
    }

    // Parse sections
    const sections: Record<string, string> = {}
    const sectionMatches = part.matchAll(/\*\*([^*]+):\*\*\n([\s\S]*?)(?=\*\*[^*]+:\*\*|---|\*\*Studienbasierte|$)/g)

    for (const match of sectionMatches) {
      const sectionName = match[1].trim()
      const sectionContent = match[2].trim()
      sections[sectionName] = sectionContent
    }

    const rawSlide: RawSlide = {
      number: slideNumber,
      title: slideTitle,
      sections,
      chapter: currentChapter
    }

    // Detect layout
    const layout = detectLayout(rawSlide)
    const content = sections['Inhalt'] || ''

    // Build slide object
    const slide: Slide = {
      id: generateSlideId(slideNumber, slideTitle),
      number: slideNumber,
      title: slideTitle,
      layout,
      theme: slideNumber === 1 || slideNumber === 16 ? 'dark' : 'light',
      chapter: currentChapter,
      content: {
        items: parseItems(content),
        callout: extractCallout(content),
        kpis: extractKPIs(content),
      },
      notes: sections['Moderationshinweis (nicht auf Folie, nur für Berater)'] ||
             sections['Moderationshinweis (nicht auf Folie)'] ||
             undefined
    }

    // Add layout-specific content
    switch (layout) {
      case 'timeline':
        slide.content!.timeline = parseTimelineSteps(content)
        break
      case 'matrix':
        slide.content!.matrix = parseMatrixCells(content)
        break
      case 'comparison':
        slide.content!.comparison = parseComparisonColumns(content)
        break
      case 'maturity':
        slide.content!.maturity = parseMaturityLevels(content)
        break
      case 'parallel-paths':
        slide.content!.paths = parseParallelPaths(content)
        break
      case 'iceberg':
        slide.content!.iceberg = parseIcebergSections(content)
        break
    }

    // Store raw markdown for complex rendering
    slide.content!.rawMarkdown = content

    slides.push(slide)
  }

  // Sort slides by number
  slides.sort((a, b) => a.number - b.number)

  return {
    title: 'Strukturierte KI-Einführung für den Mittelstand',
    description: 'Potenziale erkennen. Strukturiert umsetzen. Dauerhaft führen.',
    slides,
    chapters: Array.from(chapters.entries()).map(([blockNum, title]) => ({
      id: `block-${blockNum}`,
      title,
      startSlide: getBlockStartSlide(blockNum)
    }))
  }
}

// Helper to map block numbers to starting slide numbers
function getBlockStartSlide(blockNum: number): number {
  const mapping: Record<number, number> = {
    0: 1,   // Einstieg: 01-02
    1: 3,   // Ausgangslage: 03
    2: 4,   // KI-Chancen: 04-08
    3: 9,   // Unser Ansatz: 09-12
    4: 13   // Einstieg & Schritte: 13-16
  }
  return mapping[blockNum] || 1
}

export default parseMarkdownPresentation
