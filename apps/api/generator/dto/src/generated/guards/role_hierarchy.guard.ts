
import { Irole_hierarchy } from './interfaces'
import { role_hierarchySchema } from './schemas'

/**
 * Type guard for role_hierarchy
 * Ensures that an unknown value matches the expected structure
 */
export function isrole_hierarchy(value: unknown): value is Irole_hierarchy {
  return role_hierarchySchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialrole_hierarchy(value: unknown): value is Partial<Irole_hierarchy> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["parent_role","child_role"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'parent_role':
      return true; // Complex type requiring deeper validation
    case 'child_role':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of role_hierarchy
 */
export function isrole_hierarchyArray(value: unknown): value is Irole_hierarchy[] {
  return Array.isArray(value) && value.every(isrole_hierarchy)
}

/**
 * Type guard for partial arrays of role_hierarchy
 */
export function isPartialrole_hierarchyArray(value: unknown): value is Partial<Irole_hierarchy>[] {
  return Array.isArray(value) && value.every(isPartialrole_hierarchy)
}

