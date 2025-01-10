import { OpenAIClient, GroqClient, DatabaseClient } from './client.types'

export interface AgentContext {
  openAI: OpenAIClient
  groq: GroqClient
  db: DatabaseClient
  config?: Record<string, unknown>
}

export interface ArticleInput {
  title: string
  author: string
  body: string
  published_at?: string
}

export interface AgentInput {
  data: ArticleInput
}

export interface AgentOutput {
  result: string
}

export interface Tool {
  name: string
  description?: string
  execute(input: unknown): Promise<unknown>
}
