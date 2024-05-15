import type { SelectInput, UpsertInput } from '../base.interface'
import { News } from './news.model'

export interface INewsRepository {
  selectNewsCards(config: SelectInput<{}>): Promise<News[]>
  upsertNewsCards(config: UpsertInput<News>): Promise<News | News[]>
}
