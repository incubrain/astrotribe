import { z } from 'zod'
import { datetimeOffset } from '../formatter'

export const researchSchema = z.object({
  id: z.string().uuid(),
  created_at: datetimeOffset('research:created_at - invalid datetime string! Must be UTC.').optional,
  updated_at: datetimeOffset('research:updated_at - invalid datetime string! Must be UTC.').optional,
  published_at: datetimeOffset('research:published_at - invalid datetime string! Must be UTC.').optional,
  title: z.string(),
  url: z.string(),
  body: z.string().nullish(),
  author: z.string().nullish()
})

export class Research {
  id: string
  created_at: string
  updated_at: string
  published_at: string
  title: string
  url: string
  body: string | null
  author: string | null

  constructor(research: any) {
    this.id = research.id
    this.created_at = research.created_at
    this.updated_at = research.updated_at
    this.published_at = research.published_at
    this.title = research.title
    this.url = research.url
    this.body = research.body
    this.author = research.author
  }
}
