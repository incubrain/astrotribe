import { BaseRepository } from '../base.repository'
import { IFeedbackRepository } from './feedback.interface'
import { Feedback } from './feedback.model'

export class FeedbackRepository extends BaseRepository<Feedback> implements IFeedbackRepository {
  constructor() {
    super({ loggerPrefix: 'FeedbackRepository', Model: Feedback })
  }
}
