
import { Isearches } from './interfaces'
import { searchesSchema } from './schemas'

/**
 * Type guard for searches
 * Ensures that an unknown value matches the expected structure
 */
export function issearches(value: unknown): value is Isearches {
  return searchesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialsearches(value: unknown): value is Partial<Isearches> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","input","created_at","tokens_used","user_ids","responses"];
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
    case 'input':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'tokens_used':
      return typeof value === "number" && !isNaN(value);
    case 'user_ids':
      return typeof value === "string";
    case 'responses':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of searches
 */
export function issearchesArray(value: unknown): value is Isearches[] {
  return Array.isArray(value) && value.every(issearches)
}

/**
 * Type guard for partial arrays of searches
 */
export function isPartialsearchesArray(value: unknown): value is Partial<Isearches>[] {
  return Array.isArray(value) && value.every(isPartialsearches)
}

