// clients/groq.client.ts
import { Groq } from 'groq-sdk';
import type { GroqClient, GroqConfig, MergedConfig } from '../types';
import { defu } from 'defu';

export const DEFAULT_GROQ_CONFIG: GroqConfig = {
  defaultModel: 'mixtral-8x7b-32768',
  maxRetries: 3,
  timeout: 30000,
  defaultParams: {
    temperature: 0.3,
    top_p: 0.95,
    stream: false,
  },
};

export class GroqClientImpl implements GroqClient {
  private client: Groq;
  private config: MergedConfig<GroqConfig, typeof DEFAULT_GROQ_CONFIG>;

  constructor(config: Partial<GroqConfig> = {}) {
    this.config = defu(config, DEFAULT_GROQ_CONFIG);

    if (!this.config.apiKey && !process.env.GROQ_API_KEY) {
      throw new Error('Groq API key is required');
    }

    this.client = new Groq({
      apiKey: this.config.apiKey || process.env.GROQ_API_KEY,
      baseURL: this.config.baseURL,
    });
  }

  async query<T = unknown>(
    queryStr: string,
    options: Partial<ChatCompletionCreateParamsBase> = {}
  ): Promise<T> {
    try {
      const completion = await this.client.chat.completions.create(
        defu(
          { messages: [{ role: 'user', content: queryStr }] },
          options,
          this.config.defaultParams,
          { model: this.config.defaultModel }
        )
      );

      return JSON.parse(completion.choices[0]?.message?.content || '{}') as T;
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to get completion from Groq');
    }
  }
}
