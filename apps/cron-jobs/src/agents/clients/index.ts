import { OpenAIClient } from './openai.client';
import { GroqClientImpl } from './groq.client';
import { DatabaseClientImpl } from './database.client';
import type { OpenAIConfig, GroqConfig, DatabaseConfig } from '../types';

export const createClient = {
  openAI: (config?: Partial<OpenAIConfig>) => new OpenAIClient(config),
  groq: (config?: Partial<GroqConfig>) => new GroqClientImpl(config),
  database: (config?: Partial<DatabaseConfig>) =>
    new DatabaseClientImpl(config),
};
