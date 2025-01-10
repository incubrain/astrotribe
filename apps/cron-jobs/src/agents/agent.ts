// agent.ts
import { AgentContext, AgentConfig } from './types'
import { AgentInput, AgentOutput } from './types'
import { logFile } from '@helpers'

type ContentItem = {
  type: 'text'
  text: string
}

type ChatMessageContent = ContentItem[]

interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant'
  content: ChatMessageContent
}

export class Agent {
  private context: AgentContext
  private config: AgentConfig

  constructor(context: AgentContext, config: AgentConfig) {
    this.context = context
    this.config = config
  }

  public async execute(input: AgentInput): Promise<AgentOutput> {
    try {
      const messages = this.formatMessages(input.data)

      const completion = await this.context.openAI.completePrompt(messages)

      logFile('agent_completion:', completion)

      return { result: completion }
    } catch (error) {
      console.error('Error in agent execution:', error)
      throw error
    }
  }

  private formatMessages(article: ArticleInput): ChatCompletionMessageParam[] {
    return [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: this.config.systemPrompt,
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Please summarize this article:
                Title: ${article.title}
                Author: ${article.author}
                Content: ${article.body}`,
          },
        ],
      },
    ]
  }
}
