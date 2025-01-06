
import { Iads } from './interfaces'
import { adsSchema } from './schemas'

/**
 * Type guard for ads
 * Ensures that an unknown value matches the expected structure
 */
export function isads(value: unknown): value is Iads {
  return adsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialads(value: unknown): value is Partial<Iads> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","company_id","package_id","start_date","end_date","active","created_at","updated_at","ad_variants","companies","ad_packages"];
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
    case 'company_id':
      return typeof value === "string";
    case 'package_id':
      return typeof value === "string";
    case 'start_date':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'end_date':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'active':
      return typeof value === "boolean";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'ad_variants':
      return true; // Complex type requiring deeper validation
    case 'companies':
      return true; // Complex type requiring deeper validation
    case 'ad_packages':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of ads
 */
export function isadsArray(value: unknown): value is Iads[] {
  return Array.isArray(value) && value.every(isads)
}

/**
 * Type guard for partial arrays of ads
 */
export function isPartialadsArray(value: unknown): value is Partial<Iads>[] {
  return Array.isArray(value) && value.every(isPartialads)
}

