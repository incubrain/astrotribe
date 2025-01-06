
import { Ijob_locks } from './interfaces'
import { job_locksSchema } from './schemas'

/**
 * Type guard for job_locks
 * Ensures that an unknown value matches the expected structure
 */
export function isjob_locks(value: unknown): value is Ijob_locks {
  return job_locksSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialjob_locks(value: unknown): value is Partial<Ijob_locks> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","job_name","lock_key","lock_value","acquired_at","expires_at","created_at"];
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
    case 'job_name':
      return typeof value === "string";
    case 'lock_key':
      return typeof value === "string";
    case 'lock_value':
      return typeof value === "string";
    case 'acquired_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'expires_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of job_locks
 */
export function isjob_locksArray(value: unknown): value is Ijob_locks[] {
  return Array.isArray(value) && value.every(isjob_locks)
}

/**
 * Type guard for partial arrays of job_locks
 */
export function isPartialjob_locksArray(value: unknown): value is Partial<Ijob_locks>[] {
  return Array.isArray(value) && value.every(isPartialjob_locks)
}

