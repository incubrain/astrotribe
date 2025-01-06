
import { Itable_maintenance_log } from './interfaces'
import { table_maintenance_logSchema } from './schemas'

/**
 * Type guard for table_maintenance_log
 * Ensures that an unknown value matches the expected structure
 */
export function istable_maintenance_log(value: unknown): value is Itable_maintenance_log {
  return table_maintenance_logSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialtable_maintenance_log(value: unknown): value is Partial<Itable_maintenance_log> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","operation","detail","logged_at"];
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
    case 'operation':
      return typeof value === "string";
    case 'detail':
      return typeof value === "string";
    case 'logged_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of table_maintenance_log
 */
export function istable_maintenance_logArray(value: unknown): value is Itable_maintenance_log[] {
  return Array.isArray(value) && value.every(istable_maintenance_log)
}

/**
 * Type guard for partial arrays of table_maintenance_log
 */
export function isPartialtable_maintenance_logArray(value: unknown): value is Partial<Itable_maintenance_log>[] {
  return Array.isArray(value) && value.every(isPartialtable_maintenance_log)
}

