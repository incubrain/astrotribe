import { Configuration, ChatCompletionResponseMessage, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const summarySchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'array',
      items: { type: 'string' }
    }
  }
}

interface Prompt {
  name: string
  message: string
  returnType: string
  schema?: object
  config: {
    temperature?: number
    maxTokens?: number
    topP?: number
  }
}

const prompts: Prompt[] = [
  {
    name: 'beginnerSummary',
    message: "Explain the following article like I'm 10.",
    returnType: 'json',
    schema: summarySchema,
    config: {
      temperature: 0.7,
      maxTokens: 200,
      topP: 0.9
    }
  },
  {
    name: 'intermediateSummary',
    message: 'Explain the following article like I have a general understanding of astronomy.',
    returnType: 'json',
    schema: summarySchema,
    config: {
      temperature: 0.5,
      maxTokens: 200,
      topP: 0.8
    }
  },
  {
    name: 'expertSummary',
    message: "Explain the following article like I'm an expert astronomer.",
    returnType: 'json',
    schema: summarySchema,
    config: {
      temperature: 0.3,
      maxTokens: 200,
      topP: 0.7
    }
  }
]

const generateResponse = async (
  input: string,
  promptName: string
): Promise<string | ChatCompletionResponseMessage | undefined | string[]> => {
  const prompt = prompts.find((p) => p.name === promptName)
  console.log('using prompt:', prompt)

  if (!prompt) {
    throw new Error(`Prompt with name '${promptName}' not found.`)
  }

  const promptWithInput = `${prompt.message}\n\n${input}`
  const { temperature, maxTokens, topP } = prompt.config
  let response: string | ChatCompletionResponseMessage | undefined

  console.log('full prompt:', promptWithInput)
  if (prompt.returnType === 'json' && prompt.schema) {
    console.log('calling createChatCompletion')
    const { data } = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptWithInput }],
      function_call: {
        name: prompt.name
      },
      functions: [
        {
          name: prompt.name,
          parameters: prompt.schema
        }
      ],
      temperature,
      max_tokens: maxTokens,
      top_p: topP
    })
    const parsed = JSON.parse(data.choices[0].message?.function_call?.arguments || '')
    response = parsed.summary ? parsed.summary : undefined
  } else {
    console.log('calling createCompletion')
    const { data } = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: promptWithInput.trim(),
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: 0.0,
      presence_penalty: 0.5,
      stop: ['\n'] // Stop generation at the end of the summary
    })
    response = data.choices[0].text
  }

  if (!response) {
    throw new Error('No response received from OpenAI')
  }

  return response
}

export default generateResponse
