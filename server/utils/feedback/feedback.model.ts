import { z } from 'zod'

const feedbackTypeEnum = z.enum([
  'bug_report',
  'feature_request',
  'user_interface_issue',
  'performance_issue',
  'documentation'
])

const feedbackStatusEnum = z.enum([
  'new',
  'under_review',
  'backlog',
  'working_on',
  'resolved',
  'rejected',
  'deferred'
])

const feedbackSchema = z.object({
  id: z.number().int(),
  user_id: z.string().uuid(),
  page_identifier: z.string().max(255),
  feedback_type: feedbackTypeEnum.optional(),
  message: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  device_info: z.string().optional(),
  status: feedbackStatusEnum.default('new'),
  resolution_comment: z.string().optional()
})

const feedbackInsertSchema = feedbackSchema
  .pick({
    user_id: true,
    page_identifier: true,
    feedback_type: true,
    message: true,
    device_info: true,
    status: true
  })
  .extend({
    feedback_type: z
      .object({
        name: z.string(),
        value: z.string()
      })
      .transform((item) => item.value)
  })

// Export the schemas if needed elsewhere in your application
export { feedbackTypeEnum, feedbackInsertSchema, feedbackStatusEnum, feedbackSchema }

// const feedbackInsertSchema = feedbackSchema.omit({ id: true }).partial()

type FeedbackTypeEnum = z.infer<typeof feedbackTypeEnum>
type FeedbackStatusType = z.infer<typeof feedbackStatusEnum>

export class Feedback {
  id?: number
  user_id?: string
  page_identifier: string
  feedback_type?: FeedbackTypeEnum
  message: string
  created_at?: Date
  updated_at?: Date
  device_info?: string
  status: FeedbackStatusType
  resolution_comment?: string

  constructor(data: Partial<Feedback>) {
    this.id = data.id ?? undefined
    this.user_id = data.user_id ?? undefined
    this.page_identifier = data.page_identifier!
    this.feedback_type = data.feedback_type ?? undefined
    this.message = data.message!
    this.created_at = data.created_at ?? undefined
    this.updated_at = data.updated_at ?? undefined
    this.device_info = data.device_info ?? undefined
    this.status = data.status!
    this.resolution_comment = data.resolution_comment ?? undefined
  }
}
