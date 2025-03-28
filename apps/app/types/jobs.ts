/**
 * Job-related type definitions
 */

export interface Job {
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
  content_source_id?: string
  salary?: number
  tags?: string[]
  hot_score?: number

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

export interface JobFilter {
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

export interface JobSortOption {
  value: string
  label: string
  icon: string
}

export const DEFAULT_JOB_SORT_OPTIONS: JobSortOption[] = [
  { value: 'published_at', label: 'Publication Date', icon: 'mdi:calendar' },
  { value: 'title', label: 'Title', icon: 'mdi:sort-alphabetical-ascending' },
  { value: 'hot_score', label: 'Relevance', icon: 'mdi:fire' },
  { value: 'salary', label: 'Salary', icon: 'mdi:currency-usd' },
  { value: 'expires_at', label: 'Deadline', icon: 'mdi:clock-outline' },
]

export type JobViewMode = 'grid' | 'list'
