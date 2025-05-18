/**
 * Job-related type definitions
 */

export interface Opportunity {
  id: string
  contents_id?: string
  title: string
  company_id?: string
  company?: string
  location?: string
  description?: string
  published_at?: string
  expires_at?: string
  scraped_at?: string
  updated_at?: string
  created_at?: string
  content_status?: string
  url: string
  hash?: number
  metadata?: any
  employment_type?: string
  source_id?: string
  salary?: number
  tags?: string[]
  hot_score?: number
  is_featured: boolean

  // Additional optional fields from joins or computed values
  companies?: {
    name: string
    logo_url?: string
    description?: string
    category?: string
    is_government?: boolean
  }
  expiresAt?: string // Formatted version
  publishedAt?: string // Formatted version
  employmentType?: string // Formatted version
}

export interface OpportunityFilter {
  location: {
    value: any
    options: any[]
  }
  company: {
    value: any
    options: any[]
  }
  type: {
    value: any
    options: any[]
  }
  tags?: string[]
  minSalary?: number
}

export interface OpportunitySortOption {
  value: string
  label: string
  icon: string
}
