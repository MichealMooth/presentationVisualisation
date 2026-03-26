import { z } from 'zod'

// Layout Types
export const LayoutType = z.enum([
  'hero',
  'dialog',
  'bullets',
  'timeline',
  'matrix',
  'comparison',
  'infographic',
  'iceberg',
  'maturity',
  'parallel-paths',
  'module-detail',
  'process-flow',
  'gantt',
  'severity-list',
  'phased-plan',
  'dual-column',
  'findings',
  'numbered-cards',
  'company-profile',
  'pricing',
  'content-page',
])

export type LayoutType = z.infer<typeof LayoutType>

// Theme Types
export const ThemeType = z.enum(['light', 'dark'])
export type ThemeType = z.infer<typeof ThemeType>

// Content Item (list item with optional icon)
export const ContentItemSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
  highlight: z.boolean().optional(),
  items: z.array(z.string()).optional(),
})

export type ContentItem = z.infer<typeof ContentItemSchema>

// Timeline Step
export const TimelineStepSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.string()).optional(),
  icon: z.string().optional(),
})

export type TimelineStep = z.infer<typeof TimelineStepSchema>

// Matrix Cell
export const MatrixCellSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
  items: z.array(z.string()),
})

export type MatrixCell = z.infer<typeof MatrixCellSchema>

// Comparison Column
export const ComparisonColumnSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
  type: z.enum(['negative', 'positive']).optional(),
  items: z.array(z.string()),
})

export type ComparisonColumn = z.infer<typeof ComparisonColumnSchema>

// KPI Badge
export const KPISchema = z.object({
  value: z.string(),
  label: z.string(),
  source: z.string().optional(),
})

export type KPI = z.infer<typeof KPISchema>

// Callout
export const CalloutSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
  type: z.enum(['info', 'warning', 'success', 'quote']).optional(),
})

export type Callout = z.infer<typeof CalloutSchema>

// Maturity Level
export const MaturityLevelSchema = z.object({
  level: z.number(),
  title: z.string(),
  items: z.array(z.string()),
})

export type MaturityLevel = z.infer<typeof MaturityLevelSchema>

// Parallel Path
export const ParallelPathSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  items: z.array(z.string()),
})

export type ParallelPath = z.infer<typeof ParallelPathSchema>

// Iceberg Section
export const IcebergSectionSchema = z.object({
  title: z.string(),
  position: z.enum(['above', 'below']),
  items: z.array(z.string()),
})

export type IcebergSection = z.infer<typeof IcebergSectionSchema>

// Slide Schema
export const SlideSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  displayTitle: z.string().optional(),
  subtitle: z.string().optional(),
  layout: LayoutType,
  theme: ThemeType.default('light'),

  // Content - flexible structure based on layout
  content: z.object({
    items: z.array(ContentItemSchema).optional(),
    kpis: z.array(KPISchema).optional(),
    callout: CalloutSchema.optional(),
    timeline: z.array(TimelineStepSchema).optional(),
    matrix: z.array(MatrixCellSchema).optional(),
    comparison: z.array(ComparisonColumnSchema).optional(),
    maturity: z.array(MaturityLevelSchema).optional(),
    paths: z.array(ParallelPathSchema).optional(),
    iceberg: z.array(IcebergSectionSchema).optional(),
    rawMarkdown: z.string().optional(),
    moduleDetail: z.object({
      badge: z.string(),
      bausteine: z.array(z.object({
        name: z.string(),
        role: z.string(),
        description: z.string(),
        effort: z.string(),
      })),
      ergebnisse: z.array(z.string()),
      aufwand: z.string(),
    }).optional(),
  }).optional(),

  // Speaker Notes (not shown to audience)
  notes: z.string().optional(),

  // Background
  bg: z.string().optional(),

  // Chapter grouping
  chapter: z.string().optional(),
})

export type Slide = z.infer<typeof SlideSchema>

// Deck Data Schema
export const DeckDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  slides: z.array(SlideSchema),
  chapters: z.array(z.object({
    id: z.string(),
    title: z.string(),
    startSlide: z.number(),
  })).optional(),
})

export type DeckData = z.infer<typeof DeckDataSchema>

// Helper to generate slide ID from number and title
export function generateSlideId(number: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[äöü]/g, (char) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[char] || char))
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${String(number).padStart(2, '0')}-${slug}`
}
