import { BaseRepository } from '../base.repository'
import type { UpsertInput, SelectInput, GenericReturn } from '../base.interface'
import { IResearchRepository } from './research.interface'
import { Research } from './research.model'
import { ResearchDTO } from './research.dto'

export class ResearchRepository extends BaseRepository<Research> implements IResearchRepository {
  constructor() {
    super({ loggerPrefix: 'ResearchRepository', Model: Research })
  }
}
