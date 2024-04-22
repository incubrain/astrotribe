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
    if (route.path === '/astrotribe/galactic-guide') {
      return
    }
    navigateTo('/astrotribe/galactic-guide')
  }

  async function submitQuestion(newQuestion: string) {
    console.log('searchMessage', question.value)
    question.value = newQuestion

    if (loading.isLoading(storeKey)) {
      return null
    }

    loading.setLoading(storeKey, true)

    const response = await $fetch('/api/groq', {
      method: 'GET',
      params: {
        question: newQuestion
      }
    })

    logger.debug('response', response)
    const data = handleDBErrors(response)
    chat.value = data
    // redirect to answer page if required
    handleNavigation()
    loading.setLoading(storeKey, false)
  }

  return {
    chat,
    question,
    submitQuestion
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
