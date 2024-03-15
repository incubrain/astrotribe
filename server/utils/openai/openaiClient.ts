import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.openaiApiKey
})
const openaiClient = new OpenAIApi(configuration)

export default openaiClient
