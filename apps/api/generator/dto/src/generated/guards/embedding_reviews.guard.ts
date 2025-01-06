
import { Iembedding_reviews } from './interfaces'
import { embedding_reviewsSchema } from './schemas'

/**
 * Type guard for embedding_reviews
 * Ensures that an unknown value matches the expected structure
 */
export function isembedding_reviews(value: unknown): value is Iembedding_reviews {
  return embedding_reviewsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialembedding_reviews(value: unknown): value is Partial<Iembedding_reviews> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","created_at","updated_at","agent_review","human_review","notes","research_embeddings"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'id':
      return true; // Complex type requiring deeper validation
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'agent_review':
      return typeof value === "boolean";
    case 'human_review':
      return typeof value === "boolean";
    case 'notes':
      return typeof value === "string";
    case 'research_embeddings':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of embedding_reviews
 */
export function isembedding_reviewsArray(value: unknown): value is Iembedding_reviews[] {
  return Array.isArray(value) && value.every(isembedding_reviews)
}

/**
 * Type guard for partial arrays of embedding_reviews
 */
export function isPartialembedding_reviewsArray(value: unknown): value is Partial<Iembedding_reviews>[] {
  return Array.isArray(value) && value.every(isPartialembedding_reviews)
}

