import { getOpenAIClient } from './openaiClient'

type CallOpenAIConfig = {
  temperature?: number // Controls randomness: lower is more deterministic.
  max_tokens?: number // Maximum number of tokens to generate.
  top_p?: number // Nucleus sampling: higher allows more diversity.
}

// Asynchronous function to call the OpenAI API with specified parameters.

interface OpenAIInput {
  prompt: string
  systemMessage: string
  config?: CallOpenAIConfig
}

const createChatCompletion = async ({ prompt, systemMessage, config }: OpenAIInput) => {
  try {
    const openAiClient = getOpenAIClient() // Get the OpenAI client instance.

    if (!openAiClient) {
      throw new Error('OpenAI client is not initialized.')
    }

    // Make an API call to OpenAI's chat completion endpoint.
    const response = await openAiClient.chat.completions.create({
      model: 'gpt-3.5-turbo', // Specifies the model to use.
      messages: [
        // An array of messages that precedes the function call.
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: config?.temperature || 0.5,
      max_tokens: config?.max_tokens || 600,
      top_p: config?.top_p || 0.7,
    })

    return response
  } catch (error: any) {
    console.error('Error calling OpenAI API', error)
    throw createError({ message: error.message || 'Failed to call OpenAI API' })
  }
}

export const openAI = {
  createChatCompletion,
}
