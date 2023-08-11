import { z } from 'zod'

export const MessageRequestSchema = z.object({
  type: z.string(),
  logic: z.literal('auth'),
  email: z.string().email()
})

export const MessageSchema = z.object({
  type: z.string(),
  subject: z.string(),
  html: z.string()
})

export const SMTPMessageSchema = MessageSchema.extend({
  email: z.string()
})

const SMTPMessagesSchema = z.object({
  auth: z.array(MessageSchema)
})

// Infer the types from the schemas
export type MessageRequest = z.infer<typeof MessageRequestSchema>
export type Message = z.infer<typeof MessageSchema>
export type SMTPMessage = z.infer<typeof SMTPMessageSchema>
export type SMTPMessages = z.infer<typeof SMTPMessagesSchema>
