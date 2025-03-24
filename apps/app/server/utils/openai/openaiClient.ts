import OpenAI from 'openai'

const env = useRuntimeConfig()

let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (openaiClient) return openaiClient

  if (!env.openaiApiKey) {
    console.warn('No OpenAI API key provided.')
    throw new Error('No OpenAI API key provided.')
  }

  openaiClient = new OpenAI({
    apiKey: env.openaiApiKey,
    organization: env.openaiOrg,
  })

  return openaiClient
}
