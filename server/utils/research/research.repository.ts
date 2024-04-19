import { BaseRepository } from '../base.repository'
import type { UpsertInput, SelectInput, GenericReturn } from '../base.interface'
import { IResearchRepository } from './research.interface'
import { Research } from './research.model'
import { ResearchDTO } from './research.dto'

export class ResearchRepository extends BaseRepository<Research> implements IResearchRepository {
  dto = new ResearchDTO()
  constructor() {
    super({ loggerPrefix: 'ResearchRepository', Model: Research })
  }

  async selectResearchCards(config: SelectInput<{}>): GenericReturn<Research> {
    return await this.selectMany<'research'>({
      tableName: 'research',
      selectStatement: this.dto.getSelect(config.dto),
      pagination: config.pagination,
      filterBy: config.filterBy
    })
  }

  async upsertResearchCards(config: UpsertInput<Research>): GenericReturn<Research> {
    return await this.upsertMany({
      tableName: 'research',
      data: config.data!,
      onConflict: ['id'],
      ignoreDuplicates: false
    })
  }
}
