// utils/validation.ts
import { z } from 'zod';
import { OpenAIClient } from '../clients';

export async function validateOutputWithRetry(
  completion: string,
  schema: z.ZodType<any>,
  openAI: OpenAIClient,
  originalPrompt: string,
  maxRetries: number
): Promise<unknown> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const parsed = schema.parse(JSON.parse(completion));
      return parsed;
    } catch (err) {
      if (i === maxRetries)
        throw new Error('Failed to validate output after retries.');

      // Retry: ask LLM to reformat the output
      const reformatPrompt = `${originalPrompt}\n\nThe above response was not valid. Please return a strictly valid JSON matching the required schema. Don't add extra commentary.`;
      completion = await openAI.completePrompt(reformatPrompt);
    }
  }
  return completion; // fallback, though we never reach here due to throw
}
