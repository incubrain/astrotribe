// types/ads.ts
export interface AdVariant {
  id: string
  is_control: boolean
  content: {
    title: string
    description: string
    background_image?: string
    featured_image?: string
    cta_text: string
    cta_url: string
    tagline?: string
  }
  performance_metrics: {
    avgEngagementTime: number | null
    bounceRate: number | null
    ctr: number | null
  }
  active: boolean
}

export interface AdPackage {
  id: string
  position: string
  name: string
  description: string
  price: number
  features: string[]
  expected_ctr: number
  avg_roi: number
  view_frequency: number
  active: boolean
}

export interface Ad {
  id: string
  package_id: string
  company_id: string
  company: {
    name: string
    logo_url: string
  }
  variants: AdVariant[]
  start_date: string
  end_date: string
  active: boolean
}

// Additional type for the UI-enhanced package
export interface FormattedPackage extends AdPackage {
  badge?: string
}
