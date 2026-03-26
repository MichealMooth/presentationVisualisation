'use client'

import { Slide } from '@/lib/content/schema'
import { HeroLayout } from './HeroLayout'
import { DialogLayout } from './DialogLayout'
import { BulletsLayout } from './BulletsLayout'
import { TimelineLayout } from './TimelineLayout'
import { MatrixLayout } from './MatrixLayout'
import { ComparisonLayout } from './ComparisonLayout'
import { InfographicLayout } from './InfographicLayout'
import { IcebergLayout } from './IcebergLayout'
import { MaturityLayout } from './MaturityLayout'
import { ParallelPathsLayout } from './ParallelPathsLayout'
import { ModuleDetailLayout } from './ModuleDetailLayout'
import { ProcessFlowLayout } from './ProcessFlowLayout'
import { GanttLayout } from './GanttLayout'
import { SeverityListLayout } from './SeverityListLayout'
import { PhasedPlanLayout } from './PhasedPlanLayout'
import { DualColumnLayout } from './DualColumnLayout'
import { FindingsLayout } from './FindingsLayout'
import { NumberedCardsLayout } from './NumberedCardsLayout'
import { CompanyProfileLayout } from './CompanyProfileLayout'
import { PricingLayout } from './PricingLayout'
import { ContentPageLayout } from './ContentPageLayout'

interface LayoutRendererProps {
  slide: Slide
  isActive?: boolean
}

export function LayoutRenderer({ slide, isActive = false }: LayoutRendererProps) {
  const layoutProps = { slide, isActive }

  switch (slide.layout) {
    case 'hero':
      return <HeroLayout {...layoutProps} />
    case 'dialog':
      return <DialogLayout {...layoutProps} />
    case 'timeline':
      return <TimelineLayout {...layoutProps} />
    case 'matrix':
      return <MatrixLayout {...layoutProps} />
    case 'comparison':
      return <ComparisonLayout {...layoutProps} />
    case 'infographic':
      return <InfographicLayout {...layoutProps} />
    case 'iceberg':
      return <IcebergLayout {...layoutProps} />
    case 'maturity':
      return <MaturityLayout {...layoutProps} />
    case 'parallel-paths':
      return <ParallelPathsLayout {...layoutProps} />
    case 'module-detail':
      return <ModuleDetailLayout {...layoutProps} />
    case 'process-flow':
      return <ProcessFlowLayout {...layoutProps} />
    case 'gantt':
      return <GanttLayout {...layoutProps} />
    case 'severity-list':
      return <SeverityListLayout {...layoutProps} />
    case 'phased-plan':
      return <PhasedPlanLayout {...layoutProps} />
    case 'dual-column':
      return <DualColumnLayout {...layoutProps} />
    case 'findings':
      return <FindingsLayout {...layoutProps} />
    case 'numbered-cards':
      return <NumberedCardsLayout {...layoutProps} />
    case 'company-profile':
      return <CompanyProfileLayout {...layoutProps} />
    case 'pricing':
      return <PricingLayout {...layoutProps} />
    case 'content-page':
      return <ContentPageLayout {...layoutProps} />
    case 'bullets':
    default:
      return <BulletsLayout {...layoutProps} />
  }
}

export default LayoutRenderer
