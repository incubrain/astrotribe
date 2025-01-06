
import { Icontents } from './interfaces'
import { contentsSchema } from './schemas'

/**
 * Type guard for contents
 * Ensures that an unknown value matches the expected structure
 */
export function iscontents(value: unknown): value is Icontents {
  return contentsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcontents(value: unknown): value is Partial<Icontents> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","content_type","title","created_at","updated_at","url","rss_url","hot_score","bookmarks","content_categories","content_source_visits","content_statuses","content_tags","news","newsletters","research"];
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
    case 'content_type':
      return true; // Complex type requiring deeper validation
    case 'title':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'url':
      return typeof value === "string";
    case 'rss_url':
      return typeof value === "string";
    case 'hot_score':
      return typeof value === "number" && !isNaN(value);
    case 'bookmarks':
      return true; // Complex type requiring deeper validation
    case 'content_categories':
      return true; // Complex type requiring deeper validation
    case 'content_source_visits':
      return true; // Complex type requiring deeper validation
    case 'content_statuses':
      return true; // Complex type requiring deeper validation
    case 'content_tags':
      return true; // Complex type requiring deeper validation
    case 'news':
      return true; // Complex type requiring deeper validation
    case 'newsletters':
      return true; // Complex type requiring deeper validation
    case 'research':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of contents
 */
export function iscontentsArray(value: unknown): value is Icontents[] {
  return Array.isArray(value) && value.every(iscontents)
}

/**
 * Type guard for partial arrays of contents
 */
export function isPartialcontentsArray(value: unknown): value is Partial<Icontents>[] {
  return Array.isArray(value) && value.every(isPartialcontents)
}

