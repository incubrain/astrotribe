
import { Iplan_permissions } from './interfaces'
import { plan_permissionsSchema } from './schemas'

/**
 * Type guard for plan_permissions
 * Ensures that an unknown value matches the expected structure
 */
export function isplan_permissions(value: unknown): value is Iplan_permissions {
  return plan_permissionsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialplan_permissions(value: unknown): value is Partial<Iplan_permissions> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","plan","feature"];
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
    case 'plan':
      return true; // Complex type requiring deeper validation
    case 'feature':
      return typeof value === "string";
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of plan_permissions
 */
export function isplan_permissionsArray(value: unknown): value is Iplan_permissions[] {
  return Array.isArray(value) && value.every(isplan_permissions)
}

/**
 * Type guard for partial arrays of plan_permissions
 */
export function isPartialplan_permissionsArray(value: unknown): value is Partial<Iplan_permissions>[] {
  return Array.isArray(value) && value.every(isPartialplan_permissions)
}

