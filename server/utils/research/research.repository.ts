import { BaseRepository } from '../base.repository'
import type { FuncConfig, GenericReturn } from '../base.interface'
import { IResearchRepository } from './research.interface'
import { Research } from './research.model'
import { ResearchDTO } from './research.dto'

export class ResearchRepository extends BaseRepository<Research> implements IResearchRepository {
  dto = new ResearchDTO()
  constructor() {
    super({ loggerPrefix: 'ResearchRepository', tableName: 'research' })
  }

  async selectResearchCards(config: FuncConfig<{}>): GenericReturn<Research> {
    return await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config
      }
    })
  }

  async upsertResearchCards(config: FuncConfig<Research>): GenericReturn<Research> {
    return await this.upsert({
      operation: 'upsert',
      data: config.data!,
      criteria: {
        conflictFields: ['id'],
        ignoreDuplicates: false
      }
    })
  }
}
