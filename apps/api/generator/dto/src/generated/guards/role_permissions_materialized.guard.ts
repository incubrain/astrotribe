
import { Irole_permissions_materialized } from './interfaces'
import { role_permissions_materializedSchema } from './schemas'

/**
 * Type guard for role_permissions_materialized
 * Ensures that an unknown value matches the expected structure
 */
export function isrole_permissions_materialized(value: unknown): value is Irole_permissions_materialized {
  return role_permissions_materializedSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialrole_permissions_materialized(value: unknown): value is Partial<Irole_permissions_materialized> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["role","permissions","last_updated"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'role':
      return true; // Complex type requiring deeper validation
    case 'permissions':
      return true; // Complex type requiring deeper validation
    case 'last_updated':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of role_permissions_materialized
 */
export function isrole_permissions_materializedArray(value: unknown): value is Irole_permissions_materialized[] {
  return Array.isArray(value) && value.every(isrole_permissions_materialized)
}

/**
 * Type guard for partial arrays of role_permissions_materialized
 */
export function isPartialrole_permissions_materializedArray(value: unknown): value is Partial<Irole_permissions_materialized>[] {
  return Array.isArray(value) && value.every(isPartialrole_permissions_materialized)
}

