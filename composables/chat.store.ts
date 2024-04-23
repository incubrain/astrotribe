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
  const storeKey = 'chatStore'
  const logger = useLogger(storeKey)
  const loading = useLoadingStore()
  const chat = ref({} as Chat)
  const question = ref('' as string)
  const client = useSupabaseClient()

  function handleDBErrors(response: { data?: any; error?: any }) {
    if (response.error) {
      logger.error(`handleDBErrors - Supabase Error: ${response.error.message}`)
      throw createError({ message: response.error.message })
    } else if (response.data) {
      return response.data
    }
    return null
  }

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

    return handleDBErrors(response)
  }

  async function insertResponseData(searchId: number, questionResponseData: Chat) {
    const response = await client.from('responses').insert({
      search_id: searchId,
      output: questionResponseData.choices[0]?.message?.content,
      created_at: new Date().toISOString()
    })
    return handleDBErrors(response)
  }

  async function submitQuestion(userId: string) {
    console.log('searchMessage', question.value, userId)

    if (loading.isLoading(storeKey)) {
      return null
    }

    loading.setLoading(storeKey, true)

    try {
      const questionResponse = await $fetch('/api/groq', {
        method: 'GET',
        params: { question: question.value }
      })

      const questionResponseData: Chat = handleDBErrors(questionResponse)

      chat.value = questionResponseData
      const search = await insertSearchData(userId)
      console.log('search', search)
      insertResponseData(search[0].id, questionResponseData)
      handleNavigation()
    } catch (error) {
      console.error('Error submitting question and handling response:', error)
    } finally {
      await loading.setLoadingInterval(storeKey, false, 1000)
    }
  }

  return {
    isLoading: computed(() => loading.isLoading(storeKey)),
    chat,
    question,
    submitQuestion
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
