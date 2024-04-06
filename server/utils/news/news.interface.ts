import { News } from './news.model'

export interface INewsRepository {
  findById(id: number): Promise<News | null>
  create(news: News): Promise<News>
  update(news: News): Promise<News>
  delete(id: number): Promise<void>
  findAllByCategoryId(categoryId: number): Promise<News[]>
}
