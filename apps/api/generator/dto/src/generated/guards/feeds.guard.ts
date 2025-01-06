
import { Ifeeds } from './interfaces'
import { feedsSchema } from './schemas'

/**
 * Type guard for feeds
 * Ensures that an unknown value matches the expected structure
 */
export function isfeeds(value: unknown): value is Ifeeds {
  return feedsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialfeeds(value: unknown): value is Partial<Ifeeds> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","created_at","name","user_id","feed_categories","feed_sources","user_profiles"];
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
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'name':
      return typeof value === "string";
    case 'user_id':
      return typeof value === "string";
    case 'feed_categories':
      return true; // Complex type requiring deeper validation
    case 'feed_sources':
      return true; // Complex type requiring deeper validation
    case 'user_profiles':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of feeds
 */
export function isfeedsArray(value: unknown): value is Ifeeds[] {
  return Array.isArray(value) && value.every(isfeeds)
}

/**
 * Type guard for partial arrays of feeds
 */
export function isPartialfeedsArray(value: unknown): value is Partial<Ifeeds>[] {
  return Array.isArray(value) && value.every(isPartialfeeds)
}

