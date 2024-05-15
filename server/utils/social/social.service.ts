import { Social } from './social.model'
import { SocialRepository } from './social.repository'

export class SocialService {
  private socialRepository = new SocialRepository()

  private validateSocial(social: Social) {
    return new Social(social)
  }

  async getCompanySocials(id: number) {
    const socials = await this.socialRepository.selectOne<'social_media'>(id)
    return this.validateSocial(socials)
  }

  async getUserSocials(id: number) {
    const socials = await this.socialRepository.selectOne<'social_media'>(id)
    return this.validateSocial(socials)
  }
}
