import { z } from 'zod'
import { generateSelectStatement } from '../generateSelectStatement'
import { researchSchema } from './research.model'

export type ResearchDTOKey = 'select:research:card'

const pickResearchCard = {
  id: true
} as const

const researchCardSchema = researchSchema.pick(pickResearchCard)
export type ResearchDTOSchema = z.infer<typeof researchCardSchema>

export class ResearchDTO extends BaseDTO<ResearchDTOSchema> {
  constructor() {
    super([
      {
        name: 'select:research:card',
        schema: researchCardSchema,
        select: generateSelectStatement(pickResearchCard)
      }
    ])
  }
}
