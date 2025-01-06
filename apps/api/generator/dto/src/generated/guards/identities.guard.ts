
import { Iidentities } from './interfaces'
import { identitiesSchema } from './schemas'

/**
 * Type guard for identities
 * Ensures that an unknown value matches the expected structure
 */
export function isidentities(value: unknown): value is Iidentities {
  return identitiesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialidentities(value: unknown): value is Partial<Iidentities> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["provider_id","user_id","identity_data","provider","last_sign_in_at","created_at","updated_at","email","id","users"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'provider_id':
      return typeof value === "string";
    case 'user_id':
      return typeof value === "string";
    case 'identity_data':
      return true; // Complex type requiring deeper validation
    case 'provider':
      return typeof value === "string";
    case 'last_sign_in_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'email':
      return typeof value === "string";
    case 'id':
      return typeof value === "string";
    case 'users':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of identities
 */
export function isidentitiesArray(value: unknown): value is Iidentities[] {
  return Array.isArray(value) && value.every(isidentities)
}

/**
 * Type guard for partial arrays of identities
 */
export function isPartialidentitiesArray(value: unknown): value is Partial<Iidentities>[] {
  return Array.isArray(value) && value.every(isPartialidentities)
}

