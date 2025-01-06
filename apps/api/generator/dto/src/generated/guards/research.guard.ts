
import { Iresearch } from './interfaces'
import { researchSchema } from './schemas'

/**
 * Type guard for research
 * Ensures that an unknown value matches the expected structure
 */
export function isresearch(value: unknown): value is Iresearch {
  return researchSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialresearch(value: unknown): value is Partial<Iresearch> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["created_at","updated_at","published_at","title","version","id","abstract","keywords","month","year","abstract_url","category","doi_url","figure_count","has_embedding","page_count","pdf_url","published_in","table_count","comments","is_flagged","authors","summary","content_status","affiliations","contents","research_embeddings"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'published_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'title':
      return typeof value === "string";
    case 'version':
      return typeof value === "number" && !isNaN(value);
    case 'id':
      return typeof value === "string";
    case 'abstract':
      return typeof value === "string";
    case 'keywords':
      return typeof value === "string";
    case 'month':
      return typeof value === "string";
    case 'year':
      return typeof value === "string";
    case 'abstract_url':
      return typeof value === "string";
    case 'category':
      return typeof value === "string";
    case 'doi_url':
      return typeof value === "string";
    case 'figure_count':
      return typeof value === "number" && !isNaN(value);
    case 'has_embedding':
      return typeof value === "boolean";
    case 'page_count':
      return typeof value === "number" && !isNaN(value);
    case 'pdf_url':
      return typeof value === "string";
    case 'published_in':
      return typeof value === "string";
    case 'table_count':
      return typeof value === "number" && !isNaN(value);
    case 'comments':
      return typeof value === "string";
    case 'is_flagged':
      return typeof value === "boolean";
    case 'authors':
      return true; // Complex type requiring deeper validation
    case 'summary':
      return typeof value === "string";
    case 'content_status':
      return true; // Complex type requiring deeper validation
    case 'affiliations':
      return true; // Complex type requiring deeper validation
    case 'contents':
      return true; // Complex type requiring deeper validation
    case 'research_embeddings':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of research
 */
export function isresearchArray(value: unknown): value is Iresearch[] {
  return Array.isArray(value) && value.every(isresearch)
}

/**
 * Type guard for partial arrays of research
 */
export function isPartialresearchArray(value: unknown): value is Partial<Iresearch>[] {
  return Array.isArray(value) && value.every(isPartialresearch)
}

