// src/jobs/config/news/newsletter.config.ts
import { AgentConfig } from '../types'

export interface NewsletterPreferences {
  preferredTimezone: string
  preferredTemplate: string
  categories: string[]
  companies: string[]
  academicLevel: string
}

export interface NewsletterFilters {
  categories?: string[]
  companies?: string[]
  topics?: string[]
  minimumConfidence?: number
  excludeKeywords?: string[]
}

// Template configuration interface
export interface NewsletterTemplate {
  id: string
  name: string
  style: 'formal' | 'conversational' | 'technical'
  academicLevel: 'beginner' | 'intermediate' | 'expert'
  structure: {
    includeHeader: boolean
    includeTOC: boolean
    groupByCategory: boolean
    includeImages: boolean
    maxArticlesPerCategory?: number
  }
}

export interface NewsletterInput {
  timezone: (typeof TIMEZONE_CONFIGS)[number]
  articles: Array<{
    id: string
    title: string
    summary: string
    category: string
    published_at: Date
    url: string
  }>
  template: NewsletterTemplate
}

export interface NewsletterOutput {
  id: string
  content: string
  timezone: string
  published_at: Date
  metadata: {
    articleCount: number
    categories: string[]
    template: string
  }
}

// Newsletter Timezone Configurations
export const TIMEZONE_CONFIGS = [
  {
    name: 'Asia/Kolkata',
    label: 'India',
    sendTime: '07:00', // 7 AM IST
    offset: '+05:30',
  },
  {
    name: 'America/New_York',
    label: 'US East',
    sendTime: '07:00', // 7 AM EST
    offset: '-05:00',
  },
  {
    name: 'Europe/London',
    label: 'Europe',
    sendTime: '07:00', // 7 AM BST/GMT
    offset: '+00:00',
  },
] as const

// Default template
export const DEFAULT_TEMPLATE: NewsletterTemplate = {
  id: 'daily-space-news',
  name: 'Daily Space News Roundup',
  style: 'conversational',
  academicLevel: 'intermediate',
  structure: {
    includeHeader: true,
    includeTOC: true,
    groupByCategory: true,
    includeImages: true,
    maxArticlesPerCategory: 5,
  },
}

export const newsletterConfig: AgentConfig = {
  name: 'newsletter-generator',
  taskDescription: 'Generate space news newsletters for different timezones',

  systemPrompt: `You are a specialized AI assistant that creates engaging space and astronomy newsletters.
  Follow the provided template structure and style guidelines while ensuring:

  1. Maintain consistent tone and academic level throughout
  2. Create logical groupings and transitions between topics
  3. Highlight key discoveries and developments
  4. Include relevant context for technical concepts
  5. Create compelling section headlines
  6. Summarize complex topics clearly
  
  Format Requirements:
  - Use markdown for formatting
  - Create clear section breaks
  - Include article links
  - Add relevant emojis for visual interest
  `,

  userPrompt: `Please create a newsletter with the following parameters:

  Style: {{style}}
  Academic Level: {{academicLevel}}
  Structure:
  {{structure}}

  Articles:
  {{articles}}

  Return a markdown-formatted newsletter that follows the template structure.`,

  openAIModel: 'gpt-4o-mini',
  maxRetries: 2,
  timeout: 60000,
}

// Newsletter template management system for future extension
export class NewsletterTemplateManager {
  private templates: Map<string, NewsletterTemplate> = new Map()

  constructor() {
    this.templates.set(DEFAULT_TEMPLATE.id, DEFAULT_TEMPLATE)
  }

  addTemplate(template: NewsletterTemplate): void {
    this.templates.set(template.id, template)
  }

  getTemplate(id: string): NewsletterTemplate {
    return this.templates.get(id) || DEFAULT_TEMPLATE
  }

  updateTemplate(id: string, updates: Partial<NewsletterTemplate>): void {
    const existing = this.templates.get(id)
    if (existing) {
      this.templates.set(id, { ...existing, ...updates })
    }
  }
}
