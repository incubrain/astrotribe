import { openAI } from '~/server/utils/openai/callOpenAI'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler({
  onRequest: [rateLimiter],
  onBeforeResponse: [],
  handler: async (event) => {
    const log = useServerLogger('API:ASK')
    const { messages } = await readBody(event)

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        error: {
          message: 'messages must be a non-empty array',
        },
      }
    }

    const isValidMessage = (msg) =>
      msg &&
      typeof msg === 'object' &&
      ['system', 'user', 'assistant'].includes(msg.role) &&
      typeof msg.content === 'string'

    if (!messages.every(isValidMessage)) {
      return {
        statusCode: 400,
        error: {
          message: 'Invalid message format',
        },
      }
    }

    console.log('messages', messages)

    try {
      const user = await serverSupabaseUser(event)
      let chatCompletion

      const plan = user?.app_metadata?.plan

      if (plan === 'free') {
        // console.log('getGroqChatCompletion')
        // chatCompletion = await getGroqChatCompletion(messages)
      } else if (plan === 'pro' || plan === 'expert') {
        console.log('openAI.createChatCompletion')
        chatCompletion = openAI.createChatCompletion(messages)
      } else {
        log.warn('no user plan', plan)
      }

      return {
        error: null,
        statusCode: 200,
        data: chatCompletion || '',
      }
    } catch (error: any) {
      log.error('error', error)
      return {
        data: null,
        error,
        statusCode: 500,
      }
    }
  },
})
