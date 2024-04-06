import { BaseRepository } from '../base.repository'
import { IUserRepository } from './user.interface'
import { User } from './user.model'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super('UserRepository')
  }

  findById(id: string): Promise<User | null> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Finding user by ID: ${id}`)
      const response = await client.from('users').select('*').eq('id', id).single()
      const data = this.handleErrors(response)
      // validate data

      // format data

      // return data
      return data
        ? new User(
          data.id,
          data.email,
          data.password,
          data.first_name,
          data.last_name,
          data.roles,
          data.cover_image,
          data.avatar,
          data.introduction,
          data.quote,
          data.role,
          data.last_seen
        )
        : null
    })
  }

  create(user: User): Promise<User> {
    return this.clientQuery(async (client) => {
      const response = await client.from('users').upsert([user])
      const data = this.handleErrors(response)
      return data
        ? new User(
          data.id,
          data.email,
          data.password,
          data.first_name,
          data.last_name,
          data.roles,
          data.cover_image,
          data.avatar,
          data.introduction,
          data.quote,
          data.role,
          data.last_seen
        )
        : null
    })
  }

  update(user: User): Promise<User> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Updating user with ID: ${user.id}`)
      const response = await client.from('users').update(user).eq('id', user.id)
      const data = this.handleErrors(response)

      // format data[0]? or data
      return data
        ? new User(
          data.id,
          data.email,
          data.password,
          data.first_name,
          data.last_name,
          data.roles,
          data.cover_image,
          data.avatar,
          data.introduction,
          data.quote,
          data.role,
          data.last_seen
        )
        : null
    })
  }

  delete(id: string): Promise<void> {
    return this.clientQuery(async (client) => {
      this.logger.info(`Deleting user with ID: ${id}`)
      const response = await client.from('users').delete().eq('id', id)
      this.handleErrors(response)
    })
  }
}
