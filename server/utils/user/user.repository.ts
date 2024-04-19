import { BaseRepository } from '../base.repository'
import type { SelectInput } from '../base.interface'
import { IUserRepository } from './user.interface'
import { User } from './user.model'
import { UserDTO } from './user.dto'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  dto = new UserDTO()
  constructor() {
    super({ loggerPrefix: 'UserRepository', Model: User })
  }

  async selectUserCards(input: SelectInput<{}>): Promise<User[]> {
    this.logger.info(`selectUserCards ${input.dto}`)

    this.logger.debug('selectUserCards input: ', input)
    const data = await this.selectMany<'user_profiles'>({
      tableName: 'user_profiles',
      selectStatement: this.dto.getSelect(input.dto),
      filterBy: input.filterBy,
      pagination: input.pagination
    })
    this.logger.debug('selectUserCards data: ', data.length)
    return data.map((card) => new User(card))
  }
}
