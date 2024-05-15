import { Feedback } from './feedback.model'
import { FeedbackRepository } from './feedback.repository'

export class FeedbackService {
  private feedbackRepository = new FeedbackRepository()

  private validateFeedback(feedback: Feedback | Feedback[]) {
    if (Array.isArray(feedback)) {
      return feedback.map((c) => new Address(c))
    }
    return new Feedback(feedback)
  }

  async getFeedbackComments(feedbackId: number) {
    const employees = await this.feedbackRepository.selectOne<'feedback_comments'>({
      tableName: 'feedback_comments',
      selectStatement: '*, comment(*)',
      filterBy: {
        columnName: 'feedback_id',
        operator: 'eq',
        value: feedbackId
      }
    })
    return this.validateFeedback(employees)
  }
}
