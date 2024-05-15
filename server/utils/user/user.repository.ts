import { BaseRepository } from '../base.repository'
import type { SelectInput } from '../base.interface'
import { IUserRepository } from './user.interface'
import { User } from './user.model'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super({ loggerPrefix: 'UserRepository', Model: User })
  }
}
