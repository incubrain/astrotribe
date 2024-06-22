import { agents } from '~/server/utils/agents'
import { openAI } from '~/server/utils/openai/callOpenAI'
import { serverSupabaseUser } from '#supabase/server'

const log = useServerLogger('API:ASK')

export default defineEventHandler({
  onRequest: [rateLimiter],
  onBeforeResponse: [],
  handler: async (event) => {
    const { question, selectedAgent } = getQuery(event)

    const user = await serverSupabaseUser(event)

    if (!question) {
      return {
        statusCode: 400,
        error: {
          message: 'question is required'
        }
      }
    }

    try {
      let chatCompletion

      const plan = user?.app_metadata?.plan

      if (plan === 'free') {
        chatCompletion = await getGroqChatCompletion(String(question))
      } else if (plan === 'pro' || plan === 'expert') {
        chatCompletion = openAI.createChatCompletion({
          prompt: String(question),
          systemMessage: agents[0].systemMessage
        })
      } else {
        log.warn('no user plan', plan)
      }

      return {
        error: null,
        statusCode: 200,
        data: chatCompletion || ''
      }
    } catch (error) {
      log.error('error', error)
      return {
        data: null,
        error,
        statusCode: 500
      }
    }
  }
})
