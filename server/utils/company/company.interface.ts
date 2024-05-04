import type { SelectInput } from '../base.interface'
import { Company } from './company.model'

export interface ICompanyRepository {
  selectCompanyById(config: SelectInput<{}>): Promise<Company>
}