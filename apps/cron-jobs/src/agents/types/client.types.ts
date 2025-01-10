// clients/types.ts
import type { Groq } from 'groq-sdk';
import type { Defu } from 'defu';

export interface OpenAIConfig {
    apiKey?: string;
    organization?: string;
    baseURL?: string;
    defaultModel?: string;
    timeout?: number;
    maxRetries?: number;
    temperature?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export type GroqConfig = {
  apiKey?: string;
  baseURL?: string;
  defaultModel?: string;
  timeout?: number;
  maxRetries?: number;
  defaultParams?: Partial<Groq.Chat.Completions['create']>;
};

export type DatabaseConfig = {
  connectionString?: string;
  pool?: {
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  };
  ssl?: boolean;
};

export type ClientConfig = {
    openAI?: Partial<OpenAIConfig>;
    groq?: Partial<GroqConfig>;
    database?: Partial<DatabaseConfig>;
  };

export type MergedConfig<T, D extends > = Defu<Partial<T>, [D]>;

export interface OpenAIClient {
  completePrompt(prompt: string, model?: string): Promise<string>;
}

export interface GroqClient {
  query<T = unknown>(queryStr: string): Promise<T>;
}

export interface NewsArticle {
    id: string;
    title: string;
    body: string;
    author: string;
    url: string;
    description?: string;
    featured_image?: string;
    published_at: Date | null;
    keywords?: Record<string, unknown>;
    content_status: string;
    category_id: number;
    created_at: Date;
    updated_at: Date;
  }

export interface DatabaseClient {
  getArticlesWithoutSummary(limit: number): Promise<NewsArticle[]>;
  insertSummary(newsId: string, summary: string): Promise<void>;

  markArticleHasSummary(newsId: string): Promise<void>;
}
