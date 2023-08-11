import { SMTPMessage, SMTPMessages, MessageRequest, MessageRequestSchema } from '@/types/smtp'

export default function useAdmin() {
  const smtpMessages = {
    auth: [
      {
        type: 'verify-email',
        subject: 'Welcome to AstronEra! Please Confirm Your Email Address',
        html: '<strong>It works!</strong>'
      }
    ]
  } as SMTPMessages

  const sendEmail = async (request: MessageRequest) => {
    const validatedRequest = MessageRequestSchema.safeParse(request)
    if (!validatedRequest.success) {
      throw createError(`Error With Input For sendEmail: ${validatedRequest.error}`)
    }

    const { email, logic, type } = validatedRequest.data

    const messages = smtpMessages[logic]
    if (!messages) {
      throw new Error('Invalid logic value')
    }

    const message = messages.find((message) => message.type === type)

    if (!message) {
      throw new Error('Message type not found')
    }

    const { data, error } = await useFetch('/api/smtp/send', {
      method: 'POST',
      body: JSON.stringify({ message: { ...message, email } as SMTPMessage })
    })

    if (error.value) {
      throw createError({
        statusCode: 401,
        message: error.value.message
      })
    }


    // const validatedUser = emailUnvalidatedUserSchema.safeParse(data.user)

    // if (!validatedUser.success) {
    //   throw createError(validatedUser.error)
    // }
  }

  return {
    sendEmail
  }
}
