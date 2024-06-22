// import { ChatCompletionResponseMessage } from 'openai'
// import { z } from 'zod'
// import callOpenAI from './callOpenAI'

// const summarySchema = {
//   function: 'generateSummary',
//   schema: {
//     type: 'object',
//     properties: {
//       beginner: {
//         type: 'array',
//         items: { type: 'string' }
//       },
//       intermediate: {
//         type: 'array',
//         items: { type: 'string' }
//       },
//       expert: {
//         type: 'array',
//         items: { type: 'string' }
//       }
//     }
//   }
// }

// const summaryValidation = z.object({
//   beginner: z.array(z.string()),
//   intermediate: z.array(z.string()),
//   expert: z.array(z.string())
// })

// type Summary = z.infer<typeof summaryValidation>

// const generateSummary = async (input: string): Promise<Summary | undefined> => {
//   if (!input || input.length < 10) {
//     console.error('Input string is null or too short')
//     return undefined
//   }

//   const systemMessage = 'You are an expert Astronomer/Science Communicator and master of SEO.'
//   const prompt = `Please generate three distinct summaries for the following article, each tailored to a specific level of understanding:
//     1. Craft a summary as if you're explaining it to a 10-year-old.
//     2. Write a summary intended for a reader with a general understanding of astronomy.
//     3. Provide a summary designed for an expert astronomer.\n\n${input}`

//   const data = await callOpenAI(prompt, summarySchema, systemMessage)

//   const parsedResponse: ChatCompletionResponseMessage = JSON.parse(
//     data.choices[0].message?.function_call?.arguments || '{}'
//   )

//   console.log('parsed', parsedResponse)
//   const validatedResponse = summaryValidation.safeParse(parsedResponse)

//   if (!validatedResponse.success) {
//     console.error('Error validating data received from OpenAI', validatedResponse.error)
//     return undefined
//   }

//   return validatedResponse.data
// }

// export default generateSummary
