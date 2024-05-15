import { BaseRepository } from '../base.repository'
import { ISocialRepository } from './social.interface'
import { Social } from './social.model'

export class SocialRepository extends BaseRepository<Social> implements ISocialRepository {
  constructor() {
    super({ loggerPrefix: 'SocialRepository', Model: Social })
  }
}
