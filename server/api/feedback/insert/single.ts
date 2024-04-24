import { feedbackInsertSchema } from '~/server/utils/feedback/feedback.model'
import { FeedbackRepository } from '~/server/utils/feedback/feedback.repository'

export default defineEventHandler(async (event) => {
  const validatedFeedback = await readValidatedBody(event, feedbackInsertSchema.safeParse)

  if (!validatedFeedback.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity: Feedback Format',
      message: JSON.stringify(validatedFeedback.error.errors)
    })
  }

  console.log('insert feedback', validatedFeedback)
  try {
    const feedbackRepository = new FeedbackRepository()
    const insertedFeedback = await feedbackRepository.insertOne({
      tableName: 'feedbacks',
      data: validatedFeedback.data
    })

    return {
      status: 200,
      message: 'Feedback added, thank you! ❤️',
      data: insertedFeedback
    }
  } catch (error: any) {
    console.error('insert-single-feedback error', error.message)
    return {
      status: 500,
      message: error.message,
      data: null
    }
  }
})
