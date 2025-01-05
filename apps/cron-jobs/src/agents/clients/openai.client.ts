// clients/openai.client.ts
import OpenAI from 'openai';
import { defu } from 'defu';
import { env } from '../../../../config';
import type { OpenAIConfig } from '../types';
import { getLogger } from '@base';
import type {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

const DEFAULT_CONFIG: OpenAIConfig = {
  apiKey: env.openaiApiKey,
  organization: env.openaiOrgId,
  defaultModel: 'gpt-4o-mini',
  maxRetries: 3,
  timeout: 30000,
  temperature: 0.3,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
};

export type CompletePromptOptions = Omit<
  ChatCompletionCreateParamsBase,
  'messages' | 'model' | 'stream'
>;

export const testOpenAI = async () => {
  const client = new OpenAIClient({
    apiKey: env.openaiApiKey,
    organization: env.openaiOrgId,
    defaultModel: 'gpt-4o-mini',
  });

  try {
    const response = await client.completePrompt([
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Say hello!',
      },
    ]);

    console.log('Response:', response);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

export class OpenAIClient {
  private client: OpenAI;
  private config: OpenAIConfig;
  private log = getLogger('openai-client');

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = defu(config, DEFAULT_CONFIG);

    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.log.info('Creating OpenAI client with config:', {
      model: this.config.defaultModel,
      organization: this.config.organization,
    });

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organization,
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
    });
  }

  async completePrompt(
    prompt: string | ChatCompletionMessageParam[],
    options: Partial<CompletePromptOptions> = {}
  ): Promise<string> {
    try {
      // Ensure messages are properly formatted
      const messages = Array.isArray(prompt)
        ? prompt.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
        : [
            {
              role: 'user',
              content: prompt,
            },
          ];

      const requestPayload = {
        model: this.config.defaultModel!,
        messages,
        temperature: this.config.temperature,
        frequency_penalty: this.config.frequencyPenalty,
        presence_penalty: this.config.presencePenalty,
        ...options,
      };

      this.log.info('Sending request to OpenAI:', {
        model: requestPayload.model,
        messages: requestPayload.messages,
      });

      const completion =
        await this.client.chat.completions.create(requestPayload);

      this.log.info('Received response from OpenAI');
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        this.log.error('OpenAI API error:', {
          status: error.status,
          message: error.message,
          code: error.code,
          type: error.type,
          requestId: error.request_id,
        });
        throw error;
      } else {
        this.log.error('Unexpected error:', error);
        throw new Error('Failed to get completion from OpenAI');
      }
    }
  }
}

export const createOpenAIClient = (config?: Partial<OpenAIConfig>) =>
  new OpenAIClient(config);
