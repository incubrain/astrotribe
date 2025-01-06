
import { Ifollows } from './interfaces'
import { followsSchema } from './schemas'

/**
 * Type guard for follows
 * Ensures that an unknown value matches the expected structure
 */
export function isfollows(value: unknown): value is Ifollows {
  return followsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialfollows(value: unknown): value is Partial<Ifollows> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","followed_id","followed_entity","created_at","user_id","user_profiles"];
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
      return typeof value === "string";
    case 'followed_id':
      return typeof value === "string";
    case 'followed_entity':
      return true; // Complex type requiring deeper validation
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'user_id':
      return typeof value === "string";
    case 'user_profiles':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of follows
 */
export function isfollowsArray(value: unknown): value is Ifollows[] {
  return Array.isArray(value) && value.every(isfollows)
}

/**
 * Type guard for partial arrays of follows
 */
export function isPartialfollowsArray(value: unknown): value is Partial<Ifollows>[] {
  return Array.isArray(value) && value.every(isPartialfollows)
}

