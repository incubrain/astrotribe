import { BaseRepository } from '../base.repository'
import { INewsRepository } from './news.interface'
import { News } from './news.model'

export class NewsRepository extends BaseRepository<News> implements INewsRepository {
  constructor() {
    super('NewsRepository')
  }

  findById(id: number): Promise<News | null> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Finding news by ID: ${id}`)
      const response = await client.from('news').select('*').eq('id', id).single()
      const data = this.handleErrors(response)
      return data ? new News(data.id) : null
    })
  }

  create(news: News): Promise<News> {
    return this.clientQuery(async (client) => {
      const response = await client.from('news').insert([news])
      const data = this.handleErrors(response)
      return new News(data[0])
    })
  }

  update(news: News): Promise<News> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Updating news with ID: ${news.id}`)
      const response = await client.from('news').update(news).eq('id', news.id)
      const data = this.handleErrors(response)
      return new News(data[0])
    })
  }

  delete(id: number): Promise<void> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Deleting news with ID: ${id}`)
      const response = await client.from('news').delete().eq('id', id)
      this.handleErrors(response)
    })
  }

  findAllByCategoryId(categoryId: number): Promise<News[]> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Finding all news by category ID: ${categoryId}`)
      const response = await client.from('news').select('*').eq('category_id', categoryId)
      const data = this.handleErrors(response)
      return data.map((d) => new News(d))
    })
  }
}
