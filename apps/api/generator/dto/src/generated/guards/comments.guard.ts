
import { Icomments } from './interfaces'
import { commentsSchema } from './schemas'

/**
 * Type guard for comments
 * Ensures that an unknown value matches the expected structure
 */
export function iscomments(value: unknown): value is Icomments {
  return commentsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcomments(value: unknown): value is Partial<Icomments> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","content","user_id","content_id","content_type","parent_comment_id","created_at","updated_at","comments","other_comments","user_profiles"];
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
    case 'content':
      return typeof value === "string";
    case 'user_id':
      return typeof value === "string";
    case 'content_id':
      return typeof value === "string";
    case 'content_type':
      return true; // Complex type requiring deeper validation
    case 'parent_comment_id':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'comments':
      return true; // Complex type requiring deeper validation
    case 'other_comments':
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
 * Type guard for arrays of comments
 */
export function iscommentsArray(value: unknown): value is Icomments[] {
  return Array.isArray(value) && value.every(iscomments)
}

/**
 * Type guard for partial arrays of comments
 */
export function isPartialcommentsArray(value: unknown): value is Partial<Icomments>[] {
  return Array.isArray(value) && value.every(isPartialcomments)
}

