const fs = require('fs')
const path = require('path')

// Multi-deck manifest paths
const DECKS_DIR = path.join(__dirname, '../../decks')
const MANIFEST_PATH = path.join(DECKS_DIR, 'decks.json')
const OUTPUT_DIR = path.join(__dirname, '../content/decks')
const HUB_MANIFEST_PATH = path.join(__dirname, '../content/hub.json')


// Generate slide ID from number and title
function generateSlideId(number, title) {
  const slug = title
    .toLowerCase()
    .replace(/[äöü]/g, (char) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[char] || char))
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${String(number).padStart(2, '0')}-${slug}`
}

// Detect layout type from slide content
function detectLayout(slide, totalSlides) {
  const { title, sections, number } = slide
  const content = sections['Inhalt'] || ''
  const layoutHint = sections['Layout'] || ''
  const graphicHint = sections['Grafik-Idee'] || sections['Grafik-Beschreibung'] || ''

  // Explicit layout hint from markdown (e.g. "- hero", "- matrix")
  const explicitLayout = layoutHint.match(/^\s*-?\s*(hero|dialog|bullets|timeline|matrix|infographic|iceberg|comparison|maturity|parallel-paths|module-detail|process-flow|gantt|severity-list|phased-plan|dual-column|findings|numbered-cards|company-profile|pricing|content-page)\s*$/im)
  if (explicitLayout) return explicitLayout[1]

  // First and last slides are hero
  if (number === 1 || number === totalSlides) return 'hero'

  // Content-based: Parallel paths
  if (content.includes('Pfad A') && content.includes('Pfad B')) return 'parallel-paths'

  // Content-based: Comparison with anti-patterns
  if (content.includes('❌') && (content.includes('→') || content.includes('Ergebnis:'))) return 'comparison'

  // Content-based: Erfolgsprinzipien (after Fehlstarts)
  if (title.includes('erfolgreiche') && content.includes('Erfolgsprinzip')) return 'comparison'

  if (title.toLowerCase().includes('dialog') || title.toLowerCase().includes('fragen') ||
      content.includes('Leitfragen') || layoutHint.includes('bewusst reduziert')) {
    return 'dialog'
  }

  if (layoutHint.includes('horizontale') || layoutHint.includes('Pfad') ||
      layoutHint.includes('Timeline') || layoutHint.includes('Prozessfluss') ||
      graphicHint.includes('Stationen') || graphicHint.includes('Chevron') ||
      title.includes('Agenda') || title.includes('Vorgehensmodell') || title.includes('Module')) {
    return 'timeline'
  }

  if (layoutHint.includes('2×2') || layoutHint.includes('2x2') ||
      layoutHint.includes('Quadrant') || layoutHint.includes('4 Spalten') ||
      content.includes('4 Nutzenkategorien') || content.includes('4 Differenzierungsmerkmale')) {
    return 'matrix'
  }

  if (graphicHint.includes('Pfeile') || graphicHint.includes('einwirken') ||
      graphicHint.includes('Druck') || title.includes('Wettbewerbsdruck')) {
    return 'infographic'
  }

  if (graphicHint.includes('Eisberg') || graphicHint.includes('Oberfläche') ||
      title.includes('Realitätscheck')) {
    return 'iceberg'
  }

  if (content.includes('Stufe 1') || content.includes('Dimension') ||
      title.includes('Einordnung') || graphicHint.includes('Reifegradmatrix')) {
    return 'maturity'
  }

  return 'bullets'
}

// Parse structured sections from rawMarkdown
function parseStructuredContent(rawMarkdown) {
  const sections = []

  // Find all **Title** sections followed by content
  const pattern = /\*\*([^*]+)\*\*\s*\n([\s\S]*?)(?=\*\*[^*]+\*\*|$)/g
  let match

  while ((match = pattern.exec(rawMarkdown)) !== null) {
    const title = match[1].trim()
    const content = match[2].trim()

    // Parse items (lines starting with - or →)
    const items = []
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        items.push(trimmed.slice(2))
      } else if (trimmed.startsWith('→ ')) {
        items.push(trimmed.slice(2))
      } else if (trimmed && !trimmed.startsWith('*')) {
        // Plain text line as description
        items.push(trimmed)
      }
    }

    sections.push({ title, content, items })
  }

  return sections
}

// Parse matrix cells (4 categories with items)
function parseMatrixCells(rawMarkdown) {
  const cells = []
  const sections = parseStructuredContent(rawMarkdown)

  for (const section of sections) {
    if (section.items.length > 0) {
      // Filter out meta-descriptions
      const filteredItems = section.items.filter(item =>
        !item.includes('Kernbotschaft') &&
        !item.includes('Überschrift') &&
        item.length > 0
      )
      if (filteredItems.length > 0) {
        cells.push({
          title: section.title,
          items: filteredItems
        })
      }
    }
  }

  return cells
}

// Parse comparison columns (❌ vs ✓ or positive principles)
function parseComparisonItems(rawMarkdown) {
  const items = []
  const sections = parseStructuredContent(rawMarkdown)

  for (const section of sections) {
    const isNegative = section.title.includes('❌')
    const isPositive = section.title.includes('✓') || section.title.includes('✔')

    // Clean up title
    let title = section.title.replace(/^[❌✓✔]\s*/, '').replace(/[„"]/g, '"')

    // Get description (text after → or first content line)
    let description = ''
    const contentLines = section.content.split('\n').filter(l => l.trim())
    for (const line of contentLines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('→')) {
        description = trimmed.slice(1).trim()
        break
      } else if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) {
        description = trimmed
        break
      }
    }

    items.push({
      title,
      description,
      type: isNegative ? 'negative' : (isPositive ? 'positive' : 'neutral'),
      items: section.items.filter(i => !i.startsWith('Ergebnis:'))
    })
  }

  return items
}

// Parse timeline/process steps from table or structured content
function parseTimelineSteps(rawMarkdown) {
  const steps = []

  // First try to parse from table format
  const tableLines = rawMarkdown.split('\n').filter(line => line.includes('|'))
  if (tableLines.length > 2) {
    // Skip header and separator
    for (let i = 2; i < tableLines.length; i++) {
      const cells = tableLines[i].split('|').map(c => c.trim()).filter(c => c)
      if (cells.length >= 2) {
        steps.push({
          id: cells[0] || '',
          title: cells[1] || '',
          description: cells[2] || '',
          result: cells[3] || ''
        })
      }
    }
    if (steps.length > 0) return steps
  }

  // Otherwise parse from numbered list
  const numberedPattern = /(\d+)\.\s+([^\n]+)/g
  let match
  while ((match = numberedPattern.exec(rawMarkdown)) !== null) {
    const fullText = match[2].trim()
    const parts = fullText.split(' -- ')
    steps.push({
      id: match[1],
      title: parts[0] || fullText,
      description: parts[1] || ''
    })
  }

  // Or from **Bold** sections
  if (steps.length === 0) {
    const sections = parseStructuredContent(rawMarkdown)
    for (const section of sections) {
      if (!section.title.includes('Überschrift') && !section.title.includes('Kernbotschaft')) {
        steps.push({
          title: section.title,
          description: section.items[0] || '',
          items: section.items.slice(1)
        })
      }
    }
  }

  return steps
}

// Parse parallel paths (Pfad A / Pfad B)
function parseParallelPaths(rawMarkdown) {
  const paths = []

  // Find Pfad A and Pfad B sections
  const pathPattern = /\*\*Pfad\s+([AB]):\s+([^*]+)\*\*\s*\n\s*\*([^*]+)\*\s*\n([\s\S]*?)(?=\*\*Pfad|$)/g
  let match

  while ((match = pathPattern.exec(rawMarkdown)) !== null) {
    const pathId = match[1]
    const title = match[2].trim()
    const subtitle = match[3].trim()
    const content = match[4]

    const items = []
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        items.push(trimmed.slice(2))
      }
    }

    paths.push({
      id: pathId,
      title: `Pfad ${pathId}: ${title}`,
      subtitle,
      items,
      icon: pathId === 'A' ? '📍' : '🔍'
    })
  }

  return paths
}

// Parse iceberg sections
function parseIcebergSections(rawMarkdown) {
  const sections = []
  const parsed = parseStructuredContent(rawMarkdown)

  for (const section of parsed) {
    const lowerTitle = section.title.toLowerCase()
    const isBelow = lowerTitle.includes('shadow') ||
                    lowerTitle.includes('insel') ||
                    lowerTitle.includes('gap')

    const filteredItems = section.items.filter(item =>
      !item.includes('Kernbotschaft')
    )

    if (filteredItems.length > 0) {
      sections.push({
        title: section.title,
        position: isBelow ? 'below' : 'above',
        items: filteredItems
      })
    }
  }

  return sections
}

// Parse Ergebnistypen (for slide 12)
function parseDeliverables(rawMarkdown) {
  const deliverables = []
  const sections = parseStructuredContent(rawMarkdown)

  for (const section of sections) {
    if (section.title.includes('Überschrift') || section.title.includes('Kernbotschaft')) continue

    // Get the description after →
    let description = ''
    for (const item of section.items) {
      if (!item.includes('Überschrift')) {
        description = item
        break
      }
    }

    // Also check content for → lines
    const lines = section.content.split('\n')
    for (const line of lines) {
      if (line.trim().startsWith('→')) {
        description = line.trim().slice(1).trim()
        break
      }
    }

    if (description) {
      deliverables.push({
        title: section.title,
        description
      })
    }
  }

  return deliverables
}

// Parse module detail (badge, bausteine, ergebnisse, aufwand)
function parseModuleDetail(rawMarkdown) {
  const detail = { badge: '', bausteine: [], ergebnisse: [], aufwand: '' }

  // Extract badge
  const badgeMatch = rawMarkdown.match(/\*\*Badge:\*\*\s*(.+)/i)
  if (badgeMatch) detail.badge = badgeMatch[1].trim()

  // Extract bausteine (lines after **Bausteine:**)
  const bausteinSection = rawMarkdown.match(/\*\*Bausteine:\*\*\n([\s\S]*?)(?=\*\*Ergebnisse:\*\*|\*\*Aufwand:\*\*|$)/i)
  if (bausteinSection) {
    const lines = bausteinSection[1].split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        // Parse: - **B1 Reifegrad** (Kern) | Description | ca. 2,5 BT
        const bausteinMatch = trimmed.match(/^-\s+\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*\|\s*([^|]+)\|\s*(.+)/)
        if (bausteinMatch) {
          detail.bausteine.push({
            name: bausteinMatch[1].trim(),
            role: bausteinMatch[2].trim(),
            description: bausteinMatch[3].trim(),
            effort: bausteinMatch[4].trim()
          })
        }
      }
    }
  }

  // Extract ergebnisse
  const ergebnisSection = rawMarkdown.match(/\*\*Ergebnisse:\*\*\n([\s\S]*?)(?=\*\*Aufwand:\*\*|$)/i)
  if (ergebnisSection) {
    const lines = ergebnisSection[1].split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        detail.ergebnisse.push(trimmed.slice(2))
      }
    }
  }

  // Extract aufwand
  const aufwandMatch = rawMarkdown.match(/\*\*Aufwand:\*\*\s*(.+)/i)
  if (aufwandMatch) detail.aufwand = aufwandMatch[1].trim()

  return detail
}

// Extract callout/Kernbotschaft
function extractCallout(rawMarkdown) {
  // Look for Kernbotschaft pattern
  const match = rawMarkdown.match(/Kernbotschaft[^:]*:\s*[„"]([^""]+)[""]/i)
  if (match) {
    return { text: match[1] }
  }

  // Also try to find it at the end
  const lines = rawMarkdown.split('\n')
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (line.includes('Kernbotschaft') || line.includes('Gemeinsame Botschaft')) {
      const textMatch = line.match(/[„"]([^""]+)[""]/i)
      if (textMatch) {
        return { text: textMatch[1] }
      }
    }
  }

  return undefined
}

// Extract header/Überschrift
function extractTitle(rawMarkdown) {
  const match = rawMarkdown.match(/Überschrift:\s*[„"]([^""]+)[""]/i)
  if (match) return match[1]
  return null
}

// Main parser
function parseMarkdownPresentation(markdown) {
  const slides = []
  let currentChapter

  // Find chapters with their positions
  const chapters = new Map()
  const chapterPositions = []
  const chapterRegex = /## Block (\d+) -- ([^\n]+)/g
  let chapterMatch
  while ((chapterMatch = chapterRegex.exec(markdown)) !== null) {
    chapters.set(parseInt(chapterMatch[1]), chapterMatch[2].trim())
    chapterPositions.push({
      blockNum: parseInt(chapterMatch[1]),
      name: chapterMatch[2].trim(),
      position: chapterMatch.index
    })
  }

  // Count total slides first for layout detection
  const slideCountMatch = markdown.match(/### Folie \d+ \|/g)
  const totalSlides = slideCountMatch ? slideCountMatch.length : 16

  // Find which slides belong to which chapter (dynamic mapping)
  const slideParts = markdown.split(/(?=### Folie \d+ \|)/)
  const slidePositions = []
  let pos = 0
  for (const part of slideParts) {
    const headerMatch = part.match(/### Folie (\d+) \| ([^\n]+)/)
    if (headerMatch) {
      slidePositions.push({
        number: parseInt(headerMatch[1]),
        position: markdown.indexOf(part, pos)
      })
    }
    pos += part.length
  }

  // Build dynamic block-to-startSlide mapping
  const blockStartSlides = {}
  for (const cp of chapterPositions) {
    // Find first slide after this chapter header
    let startSlide = 1
    for (const sp of slidePositions) {
      if (sp.position > cp.position) {
        startSlide = sp.number
        break
      }
    }
    blockStartSlides[cp.blockNum] = startSlide
  }

  // Parse slides
  for (const part of slideParts) {
    const headerMatch = part.match(/### Folie (\d+) \| ([^\n]+)/)
    if (!headerMatch) continue

    const slideNumber = parseInt(headerMatch[1])
    const slideTitle = headerMatch[2].trim()

    // Determine chapter dynamically
    for (const [blockNum, chapterName] of chapters) {
      const startSlide = blockStartSlides[blockNum] || 1
      if (slideNumber >= startSlide) {
        currentChapter = chapterName
      }
    }

    // Parse sections - only match known top-level section names
    const sections = {}
    const knownSectionNames = 'Inhalt|Layout|Grafik-Idee|Grafik-Beschreibung|Moderationshinweis[^*]*'
    const sectionPattern = new RegExp(
      `\\*\\*(${knownSectionNames}):\\*\\*\\n([\\s\\S]*?)(?=\\*\\*(?:${knownSectionNames}):\\*\\*|\\n---\\s*\\n|\\n---\\s*$)`,
      'g'
    )
    const sectionMatches = part.matchAll(sectionPattern)
    for (const match of sectionMatches) {
      sections[match[1].trim()] = match[2].trim()
    }

    const rawSlide = { number: slideNumber, title: slideTitle, sections, chapter: currentChapter }
    const layout = detectLayout(rawSlide, totalSlides)
    const rawMarkdown = sections['Inhalt'] || ''

    // Extract title from content
    const extractedTitle = extractTitle(rawMarkdown)

    const slide = {
      id: generateSlideId(slideNumber, slideTitle),
      number: slideNumber,
      title: slideTitle,
      displayTitle: extractedTitle || slideTitle,
      layout,
      theme: (slideNumber === 1 || slideNumber === totalSlides) ? 'dark' : 'light',
      chapter: currentChapter,
      content: {
        rawMarkdown,
        callout: extractCallout(rawMarkdown),
      },
      notes: sections['Moderationshinweis (nicht auf Folie, nur fuer Berater)'] ||
             sections['Moderationshinweis (nicht auf Folie, nur für Berater)'] ||
             sections['Moderationshinweis (nicht auf Folie)'] || undefined,
    }

    // Add layout-specific parsed content
    switch (layout) {
      case 'matrix':
        slide.content.matrix = parseMatrixCells(rawMarkdown)
        break
      case 'comparison':
      case 'pricing':
        slide.content.comparison = parseComparisonItems(rawMarkdown)
        break
      case 'timeline':
        slide.content.timeline = parseTimelineSteps(rawMarkdown)
        break
      case 'parallel-paths':
        slide.content.paths = parseParallelPaths(rawMarkdown)
        break
      case 'iceberg':
        slide.content.iceberg = parseIcebergSections(rawMarkdown)
        break
      case 'infographic':
        slide.content.pressurePoints = parseMatrixCells(rawMarkdown)
        break
      case 'module-detail':
        slide.content.moduleDetail = parseModuleDetail(rawMarkdown)
        break
      case 'bullets':
        slide.content.deliverables = parseDeliverables(rawMarkdown)
        break
    }

    slides.push(slide)
  }

  slides.sort((a, b) => a.number - b.number)

  // Extract title from first heading
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  const deckTitle = titleMatch ? titleMatch[1].trim() : 'Presentation'

  return {
    title: deckTitle,
    description: '',
    slides,
    chapters: Array.from(chapters.entries()).map(([blockNum, title]) => ({
      id: `block-${blockNum}`,
      title,
      startSlide: blockStartSlides[blockNum] || 1,
    })),
  }
}

// Print summary for a deck
function printDeckSummary(deckData) {
  console.log(`   Slides: ${deckData.slides.length}`)
  console.log(`   Chapters: ${deckData.chapters.length}`)

  const layoutCounts = new Map()
  for (const slide of deckData.slides) {
    layoutCounts.set(slide.layout, (layoutCounts.get(slide.layout) || 0) + 1)
  }
  console.log('   Layouts:')
  for (const [layout, count] of layoutCounts) {
    console.log(`     - ${layout}: ${count}`)
  }

  for (const slide of deckData.slides) {
    const contentKeys = Object.keys(slide.content).filter(k => k !== 'rawMarkdown' && k !== 'callout')
    const extra = contentKeys.map(k => {
      const val = slide.content[k]
      if (Array.isArray(val)) return `${k}:${val.length}`
      return k
    }).join(', ')
    console.log(`     ${slide.number}. [${slide.layout}] ${slide.title} ${extra ? `(${extra})` : ''}`)
  }
}

// Main execution - multi-deck manifest support
console.log('📄 Parsing all deck content...\n')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read decks manifest
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`❌ Decks manifest not found: ${MANIFEST_PATH}`)
  process.exit(1)
}

const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf-8')
const manifest = JSON.parse(manifestContent)

console.log(`📚 Found ${manifest.decks.length} deck(s) in manifest\n`)

const hubManifest = []

for (const deckEntry of manifest.decks) {
  console.log(`\n📖 Processing deck: ${deckEntry.slug}`)

  const contentPath = path.join(DECKS_DIR, deckEntry.slug, deckEntry.contentFile)

  if (!fs.existsSync(contentPath)) {
    console.error(`   ❌ Content file not found: ${contentPath}`)
    continue
  }

  const markdown = fs.readFileSync(contentPath, 'utf-8')
  console.log(`   Read ${markdown.length} characters`)

  const deckData = parseMarkdownPresentation(markdown)

  // Override title/description from manifest
  if (deckEntry.title) deckData.title = deckEntry.title
  if (deckEntry.description) deckData.description = deckEntry.description

  console.log(`   Parsed ${deckData.slides.length} slides`)
  printDeckSummary(deckData)

  // Write deck output
  const deckOutputPath = path.join(OUTPUT_DIR, `${deckEntry.slug}.json`)
  fs.writeFileSync(deckOutputPath, JSON.stringify(deckData, null, 2))
  console.log(`   ✅ Output: ${deckOutputPath}`)

  // Add to hub manifest
  hubManifest.push({
    slug: deckEntry.slug,
    title: deckData.title,
    description: deckEntry.description || '',
    tags: deckEntry.tags || [],
    customer: deckEntry.customer || null,
    type: deckEntry.type || 'sonstige',
    cover: deckEntry.cover || null,
    order: deckEntry.order || 999,
    slideCount: deckData.slides.length,
    updatedAt: deckEntry.updatedAt || new Date().toISOString().split('T')[0]
  })

}

// Sort hub manifest by order
hubManifest.sort((a, b) => a.order - b.order)

// Write hub manifest
fs.writeFileSync(HUB_MANIFEST_PATH, JSON.stringify({ decks: hubManifest }, null, 2))
console.log(`\n📋 Hub manifest: ${HUB_MANIFEST_PATH}`)

console.log('\n✅ All decks parsed successfully!')
console.log(`   Total decks: ${hubManifest.length}`)
console.log(`   Total slides: ${hubManifest.reduce((sum, d) => sum + d.slideCount, 0)}`)
