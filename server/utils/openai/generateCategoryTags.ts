import { ChatCompletionResponseMessage } from 'openai'
import { z } from 'zod'
import categories from './categories.json'
import tags from './tags.json'
import callOpenAI from './callOpenAI' // Import your new function

// Schema and validation for category and tags
const categoryTagsSchema = {
  function: 'generateCategoryTags',
  schema: {
    type: 'object',
    properties: {
      category: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      },
      tags: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        }
      }
    }
  }
}

const categoryTagsValidation = z.object({
  category: z.object({
    id: z.number(),
    name: z.string()
  }),
  tags: z
    .array(
      z.object({
        id: z.number(),
        name: z.string()
      })
    )
    .max(3)
})

type CategoryTags = z.infer<typeof categoryTagsValidation>

type CallOpenAIConfig = {
  temperature?: number
  max_tokens?: number
  top_p?: number
}

const openaiConfig = {
  temperature: 0.2, // lower is more deterministic
  max_tokens: 100,
  top_p: 0.2 // similar to temperature
} as CallOpenAIConfig

const generateCategoryTags = async (input: string): Promise<CategoryTags | undefined> => {
  if (!input || input.length < 10) {
    console.error('Input string is null or too short')
    return undefined
  }

  const prompt = `Based on the following article, please select the most suitable category by ID and Name and up to three pertinent tags also by ID and Name.
    The category and tags must exactly match the ones provided in the given list.\n\n${input}`
  const systemMessage = `You are an expert Astronomer/Science Communicator with mastery in SEO. Consider the following lists when suggesting categories and tags:
    Categories:
    ${categories.map((category) => `${category.id}: ${category.name}`).join('\n')}
    Tags:
    ${tags.map((tag) => `${tag.id}: ${tag.name}`).join('\n')}
    `

  const data = await callOpenAI(prompt, categoryTagsSchema, systemMessage, openaiConfig)

  const parsedResponse: ChatCompletionResponseMessage = JSON.parse(
    data.choices[0].message?.function_call?.arguments || '{}'
  )

  console.log('parsed', parsedResponse)
  const validatedResponse = categoryTagsValidation.safeParse(parsedResponse)

  if (!validatedResponse.success) {
    console.error('Error validating data received from OpenAI', validatedResponse.error)
    return undefined
  }

  return validatedResponse.data
}

export default generateCategoryTags
