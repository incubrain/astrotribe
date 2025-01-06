
import { Itags } from './interfaces'
import { tagsSchema } from './schemas'

/**
 * Type guard for tags
 * Ensures that an unknown value matches the expected structure
 */
export function istags(value: unknown): value is Itags {
  return tagsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialtags(value: unknown): value is Partial<Itags> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","body","name","document_id","locale","published_at","created_at","updated_at","content_tags","news_tags"];
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
      return typeof value === "number" && !isNaN(value);
    case 'body':
      return typeof value === "string";
    case 'name':
      return typeof value === "string";
    case 'document_id':
      return typeof value === "string";
    case 'locale':
      return typeof value === "string";
    case 'published_at':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'content_tags':
      return true; // Complex type requiring deeper validation
    case 'news_tags':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of tags
 */
export function istagsArray(value: unknown): value is Itags[] {
  return Array.isArray(value) && value.every(istags)
}

/**
 * Type guard for partial arrays of tags
 */
export function isPartialtagsArray(value: unknown): value is Partial<Itags>[] {
  return Array.isArray(value) && value.every(isPartialtags)
}

