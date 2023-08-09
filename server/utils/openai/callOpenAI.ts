import openAiClient from './openaiClient'

type CallOpenAIConfig = {
  temperature?: number
  max_tokens?: number
  top_p?: number
}

const callOpenAI = async (
  prompt: string,
  schema: any,
  systemMessage: string,
  config: CallOpenAIConfig = {}
) => {
  try {
    const { data } = await openAiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      function_call: {
        name: schema.function
      },
      functions: [
        {
          name: schema.function,
          parameters: schema.schema
        }
      ],
      temperature: config.temperature || 0.5,
      max_tokens: config.max_tokens || 600,
      top_p: config.top_p || 0.7
    })

    return data
  } catch (error) {
    console.error('Error calling OpenAI API', error)
    throw error
  }
}

export default callOpenAI
