import type { SelectInput, SelectInput } from '../base.interface'
import { Company } from './company.model'

export interface ICompanyRepository {
  selectCompanyCards(config: SelectInput<{}>): Promise<Company[]>
  selectCompanyById(config: SelectInput<{}>): Promise<Company>
}