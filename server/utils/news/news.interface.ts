import type { FuncConfig } from '../base.interface'
import { News } from './news.model'

export interface INewsRepository {
  selectNewsCards(config: FuncConfig<{}>): Promise<News[] | News>
  upsertNewsCards(config: FuncConfig<News>): Promise<News | News[]>
}
