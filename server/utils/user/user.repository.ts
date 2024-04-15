import { BaseRepository } from '../base.repository'
import type { FuncConfig, GenericReturn } from '../base.interface'
import { IUserRepository } from './user.interface'
import { User } from './user.model'
import { UserDTO } from './user.dto'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  dto = new UserDTO()
  constructor() {
    super({ loggerPrefix: 'UserRepository', tableName: 'user_profiles' })
  }

  async selectUserCards(config: FuncConfig<{}>): GenericReturn<User> {
    this.logger.info(`selectUserCards ${config.dto}`)

    this.logger.debug('selectUserCards config: ', config)
    const data = await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config.criteria
      }
    })
    this.logger.debug('selectUserCards data: ', data.length)
    const newCards = data.map((card) => new User(card))
    return this.dto.validateAndFormatData({ data: newCards, dto: config.dto })
  }

  async selectUserProfile(config: FuncConfig<{}>): GenericReturn<User> {
    this.logger.debug(`selectUserProfile ${config.dto}`)
    const data = await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config.criteria
      }
    })

    this.logger.debug(`selectUserProfile data: ${data.id}`)
    const newProfile = new User(data)
    this.logger.debug(`selectUserProfile newProfile: ${newProfile.id}`)
    return this.dto.validateAndFormatData({ data: newProfile, dto: config.dto })
  }

  async selectUserSettings(config: FuncConfig<{}>): GenericReturn<User> {
    this.logger.info('selectUserSettings', config.dto)
    return await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config.criteria
      }
    })
  }

  async updateUserProfile(config: FuncConfig<User>): GenericReturn<User> {
    this.logger.info('updateUserProfile')
    return await this.update({
      operation: 'update',
      data: config.data!,
      criteria: {
        ...config.criteria
      }
    })
  }
}
