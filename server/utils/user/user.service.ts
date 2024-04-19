import { User } from './user.model'
import { UserRepository } from './user.repository'

export class UserService {
  private userRepository = new UserRepository()

  private validateUser(user: User | User[]) {
    if (Array.isArray(user)) {
      return user.map((c) => new Address(c))
    }
    return new User(user)
  }

  async getCompanyEmployees(companyId: number) {
    // !design:med:easy:1 add a company_employees table to the database with a company_id and user_id column and other info
    const employees = await this.userRepository.selectOne<'company_employees'>({
      tableName: 'company_employees',
      selectStatement: '*, user(*)',
      filterBy: {
        columnName: 'company_id',
        operator: 'eq',
        value: companyId
      }
    })
    return this.validateUser(employees)
  }

  // update user socials
}
