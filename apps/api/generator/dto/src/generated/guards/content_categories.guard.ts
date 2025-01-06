
import { Icontent_categories } from './interfaces'
import { content_categoriesSchema } from './schemas'

/**
 * Type guard for content_categories
 * Ensures that an unknown value matches the expected structure
 */
export function iscontent_categories(value: unknown): value is Icontent_categories {
  return content_categoriesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcontent_categories(value: unknown): value is Partial<Icontent_categories> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["content_id","category_id","is_primary","categories","contents"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'content_id':
      return typeof value === "string";
    case 'category_id':
      return true; // Complex type requiring deeper validation
    case 'is_primary':
      return typeof value === "boolean";
    case 'categories':
      return true; // Complex type requiring deeper validation
    case 'contents':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of content_categories
 */
export function iscontent_categoriesArray(value: unknown): value is Icontent_categories[] {
  return Array.isArray(value) && value.every(iscontent_categories)
}

/**
 * Type guard for partial arrays of content_categories
 */
export function isPartialcontent_categoriesArray(value: unknown): value is Partial<Icontent_categories>[] {
  return Array.isArray(value) && value.every(isPartialcontent_categories)
}

