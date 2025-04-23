// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
// Check if environment variables are set
if (!openAiApiKey) {
  console.error('Error: OpenAI API key not set in environment variables')
  throw new Error('OpenAI API key not set in environment variables')
}
const openai = new OpenAI({
  apiKey: openAiApiKey,
})
export async function summarizeText(text, minWords = 50, maxWords = 300) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes texts.',
        },
        {
          role: 'user',
          content: `Please summarize the following text in between ${minWords} and ${maxWords} words:\n\n${text}`,
        },
      ],
      temperature: 0.5,
    })
    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error(`OPENAI Error ${JSON.stringify(error)}`)
    return null
  }
}
