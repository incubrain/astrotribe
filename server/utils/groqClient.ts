import { Groq } from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface AgentInput {
  message: string
  systemPrompt: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function getGroqChatCompletion(messages: Message[]) {
  return await groq.chat.completions.create({
    messages: messages,
    model: 'llama3-70b-8192',
    // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become
    // deterministic and repetitive.
    temperature: 0.3,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    max_tokens: 1500,
    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    top_p: 0.6,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    // stop: 'None',

    // If set, partial message deltas will be sent.
    // streaming is not supported in JSON mode
    stream: false,
    // Enable JSON mode by setting the response format
    // response_format: { type: 'json_object' }
  })
}
