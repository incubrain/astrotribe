import { Configuration, ChatCompletionResponseMessage, OpenAIApi } from 'openai'
import { z } from 'zod'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const summarySchema = {
  function: 'generateSummaries',
  schema: {
    type: 'object',
    properties: {
      beginner: {
        type: 'array',
        items: { type: 'string' }
      },
      intermediate: {
        type: 'array',
        items: { type: 'string' }
      },
      expert: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }
}

const summaryValidation = z.object({
  beginner: z.array(z.string()),
  intermediate: z.array(z.string()),
  expert: z.array(z.string())
})

type Summary = z.infer<typeof summaryValidation>

interface Prompt {
  name: string
  message: string
  type: string
}

const prompts: Prompt[] = [
  {
    name: 'beginnerSummary',
    message: "like I'm 10.",
    type: 'summaries'
  },
  {
    name: 'intermediateSummary',
    message: 'like I understand astronomy.',
    type: 'summaries'
  },
  {
    name: 'expertSummary',
    message: "like I'm an expert astronomer.",
    type: 'summaries'
  }
]

const generateSummary = async (
  input: string
): Promise<Summary | undefined> => {
  const messages = prompts
    .filter((p) => p.type === 'summaries')
    .map((prompt) => prompt.message)
    .join(', ')
  const prompt = `Provide 3 summaries for this article: ${messages}\n\n${input}`

  console.log('using prompt:', prompt)

  if (!prompt) {
    throw new Error('Prompt with name summaries not found.')
  }

  console.log('calling createChatCompletion')
  const { data } = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert Astronomer/Science Communicator.' },
      { role: 'user', content: prompt }
    ],
    function_call: {
      name: summarySchema.function
    },
    functions: [
      {
        name: summarySchema.function,
        parameters: summarySchema.schema
      }
    ],
    temperature: 0.5,
    max_tokens: 500,
    top_p: 0.7
  })
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response received from OpenAI')
  }

  const parsedResponse: ChatCompletionResponseMessage = JSON.parse(
    data.choices[0].message?.function_call?.arguments || '{}'
  )

  console.log('parsed', parsedResponse)
  const validatedResponse = summaryValidation.safeParse(parsedResponse)

  if (!validatedResponse.success) {
    console.error('Error validating data received from OpenAI', validatedResponse.error)
    return undefined
  }

  return validatedResponse.data
}

export default generateSummary
