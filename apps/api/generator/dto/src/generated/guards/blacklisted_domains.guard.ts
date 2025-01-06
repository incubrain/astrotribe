
import { Iblacklisted_domains } from './interfaces'
import { blacklisted_domainsSchema } from './schemas'

/**
 * Type guard for blacklisted_domains
 * Ensures that an unknown value matches the expected structure
 */
export function isblacklisted_domains(value: unknown): value is Iblacklisted_domains {
  return blacklisted_domainsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialblacklisted_domains(value: unknown): value is Partial<Iblacklisted_domains> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","created_at","url","reason"];
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
    case 'url':
      return typeof value === "string";
    case 'reason':
      return typeof value === "string";
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of blacklisted_domains
 */
export function isblacklisted_domainsArray(value: unknown): value is Iblacklisted_domains[] {
  return Array.isArray(value) && value.every(isblacklisted_domains)
}

/**
 * Type guard for partial arrays of blacklisted_domains
 */
export function isPartialblacklisted_domainsArray(value: unknown): value is Partial<Iblacklisted_domains>[] {
  return Array.isArray(value) && value.every(isPartialblacklisted_domains)
}

