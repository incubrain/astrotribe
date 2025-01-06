
import { Icompany_extras } from './interfaces'
import { company_extrasSchema } from './schemas'

/**
 * Type guard for company_extras
 * Ensures that an unknown value matches the expected structure
 */
export function iscompany_extras(value: unknown): value is Icompany_extras {
  return company_extrasSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcompany_extras(value: unknown): value is Partial<Icompany_extras> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","updated_at","created_at","url","success","category","level","company_id","body","found_count","review","companies"];
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
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'url':
      return typeof value === "string";
    case 'success':
      return typeof value === "boolean";
    case 'category':
      return typeof value === "string";
    case 'level':
      return typeof value === "number" && !isNaN(value);
    case 'company_id':
      return typeof value === "string";
    case 'body':
      return typeof value === "string";
    case 'found_count':
      return typeof value === "number" && !isNaN(value);
    case 'review':
      return true; // Complex type requiring deeper validation
    case 'companies':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of company_extras
 */
export function iscompany_extrasArray(value: unknown): value is Icompany_extras[] {
  return Array.isArray(value) && value.every(iscompany_extras)
}

/**
 * Type guard for partial arrays of company_extras
 */
export function isPartialcompany_extrasArray(value: unknown): value is Partial<Icompany_extras>[] {
  return Array.isArray(value) && value.every(isPartialcompany_extras)
}

