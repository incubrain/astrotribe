import type { UpsertInput, GenericReturn, SelectInput } from '../base.interface'
import { Research } from './research.model'

export interface IResearchRepository {
  selectResearchCards(config: SelectInput<{}>): GenericReturn<Research>
  upsertResearchCards(config: UpsertInput<Research>): GenericReturn<Research>
}
