import { BaseRepository } from '../base.repository'
import type { SelectInput, UpsertInput } from '../base.interface'
import { INewsRepository } from './news.interface'
import { News } from './news.model'
import { NewsDTO } from './news.dto'

export class NewsRepository extends BaseRepository<News> implements INewsRepository {
  dto = new NewsDTO()
  constructor() {
    super({ loggerPrefix: 'NewsRepository', Model: News })
  }

  async selectNewsCards(input: SelectInput<{}, 'news'>): Promise<News[]> {
    this.logger.info('selectNewsCards')

    const news = await this.selectMany<'news'>(input)
    return news.map((news) => new News(news))
  }

  async upsertNewsCards(config: UpsertInput<News, 'news'>): Promise<News[]> {
    const formattedData = config.data.forEach((news) =>
      this.dto.validateAndFormatData({ data: new News(news), dto: config.dto })
    )
    this.logger.info('upsertNewsCards')
    const insertedData = await this.upsertMany({
      tableName: 'news',
      data: formattedData,
      conflict: {
        onConflict: ['id'],
        ignoreDuplicates: false
      }
    })

    return insertedData
  }
}
