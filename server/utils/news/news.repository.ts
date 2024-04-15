import { BaseRepository } from '../base.repository'
import type { FuncConfig } from '../base.interface'
import { INewsRepository } from './news.interface'
import { News } from './news.model'
import { NewsDTO } from './news.dto'

export class NewsRepository extends BaseRepository<News> implements INewsRepository {
  dto = new NewsDTO()
  constructor() {
    super({ loggerPrefix: 'NewsRepository', tableName: 'news' })
  }

  async selectNewsCards(config: FuncConfig<{}>): Promise<News[] | News> {
    this.logger.info('selectNewsCards')

    return await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config
      }
    }).then((data) =>
      data.map((news) => this.dto.validateAndFormatData({ data: new News(news), dto: config.dto }))
    )
  }

  async upsertNewsCards(config: FuncConfig<News>): Promise<News | News[]> {
    const formattedData = config.data.forEach((news) =>
      this.dto.validateAndFormatData({ data: new News(news), dto: config.dto })
    )
    this.logger.info('upsertNewsCards')
    const insertedData = await this.upsert({
      operation: 'upsert',
      data: formattedData,
      criteria: {
        conflictFields: ['id'],
        ignoreDuplicates: false
      }
    })

    return insertedData
  }
}
