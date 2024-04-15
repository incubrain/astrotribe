import type { FuncConfig, GenericReturn } from '../base.interface'
import { Research } from './research.model'

export interface IResearchRepository {
  selectResearchCards(config: FuncConfig<Research>): GenericReturn<Research>
  upsertResearchCards(config: FuncConfig<Research>): GenericReturn<Research>
}
