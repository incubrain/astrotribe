import { z } from 'zod'

const ChatCompletionSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  choices: z.array(
    z.object({
      index: z.number(),
      message: z.object({
        role: z.string(),
        content: z.string()
      }),
      finish_reason: z.string(),
      logprobs: z.null()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
    prompt_time: z.number(),
    completion_time: z.number(),
    total_time: z.number()
  }),
  x_groq: z.object({
    id: z.string()
  })
})

type Chat = z.infer<typeof ChatCompletionSchema>

export const useChatStore = defineStore('chatStore', () => {
  const { fetch } = useBaseFetch()
  const loading = useLoadingStore()
  const client = useSupabaseClient()
  const errors = useBaseError()

  const domainKey = 'chat'
  const logger = useLogger(domainKey)

  const chat = ref({} as Chat)
  const question = ref('' as string)

  function handleNavigation() {
    const route = useRoute()
    if (route.path === '/astrotribe/ask') {
      return
    }
    navigateTo('/astrotribe/ask')
  }

  async function insertSearchData(userId: string) {
    const response = await client
      .from('searches')
      .insert({
        input: question.value,
        created_at: new Date().toISOString(),
        user_id: userId
      })
      .select()

    return errors.server({
      response,
      devOnly: true,
      devMessage: 'error inserting search data',
      userMessage: 'something went wrong when inserting search data'
    })
  }

  async function insertResponseData(searchId: number, questionResponseData: Chat) {
    const response = await client.from('responses').insert({
      search_id: searchId,
      output: questionResponseData.choices[0]?.message?.content,
      created_at: new Date().toISOString()
    })
    return errors.server({
      response,
      devOnly: true,
      devMessage: 'error inserting response data',
      userMessage: 'something went wrong when inserting response data'
    })
  }

  async function submitQuestion(userId: string) {
    console.log('searchMessage', question.value, userId)

    if (loading.isLoading(domainKey)) {
      return null
    }

    loading.setLoading(domainKey, true)

    try {
      const questionResponse = await fetch('/api/ai/ask', {
        method: 'GET',
        params: { question: question.value, selectedAgent: 'summarizer' }
      })

      console.log('handling ask error', questionResponse)
      const questionResponseData: Chat = errors.server({
        response: questionResponse,
        devOnly: true,
        devMessage: 'error fetching question response',
        userMessage: 'something went wrong when fetching question response'
      })

      chat.value = questionResponseData
      const search = await insertSearchData(userId)
      console.log('search', search)
      insertResponseData(search[0].id, questionResponseData)
      handleNavigation()
    } catch (error) {
      console.error('Error submitting question and handling response:', error)
    } finally {
      await loading.setLoadingInterval(domainKey, false, 1000)
    }
  }

  return {
    isLoading: computed(() => loading.isLoading(domainKey)),
    chat,
    question,
    submitQuestion
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
