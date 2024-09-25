import OpenAI from 'openai/index.mjs'

const openaiClient = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
})

export default openaiClient
