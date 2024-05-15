import { z } from 'zod'
import { BaseDTO } from '../base.dto'
import { newsSchema } from './news.model'

export type NewsDTOKey = 'select:news:card'

const pickNewsCard = {
  id: true,
  title: true,
  body: true,
  description: true,
  featured_image: true,
  url: true,
  source: true,
  category_id: true,
  author: true,
  has_summary: true,
  created_at: true,
  published_at: true
} as const

const newsCardSchema = newsSchema.pick(pickNewsCard).extend({
  author: z.string().nullable()
})

type NewsDTOSchema = z.infer<typeof newsCardSchema>

export class NewsDTO extends BaseDTO<NewsDTOSchema> {
  constructor() {
    super([
      {
        name: 'select:news:card',
        schema: newsCardSchema,
        select: generateSelectStatement(pickNewsCard)
      }
    ])
  }
}
