// agents/configs/config.ts
import { z } from 'zod';
import { Tool } from '../types';

export interface FewShotExample {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AgentConfig {
  name: string;
  taskDescription: string;

  // Prompting
  systemPrompt?: string;
  userPrompt?: string;
  assistantPrompt?: string;
  fewShotExamples?: FewShotExample[];
  openAIModel?: string;

  // Data fetching (e.g. GROQ)
  groqQuery?: string;

  // Template placeholders for dynamic replacement in userPrompt/assistantPrompt.
  placeholders?: Record<string, unknown>;

  // Tools dynamically selected by the LLM
  tools?: Tool[];

  // Structured output validation
  outputSchema?: z.ZodType<any>;

  // Validation and retry configuration
  maxRetries?: number;
}
