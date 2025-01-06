
import { Ijob_queue_stats } from './interfaces'
import { job_queue_statsSchema } from './schemas'

/**
 * Type guard for job_queue_stats
 * Ensures that an unknown value matches the expected structure
 */
export function isjob_queue_stats(value: unknown): value is Ijob_queue_stats {
  return job_queue_statsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialjob_queue_stats(value: unknown): value is Partial<Ijob_queue_stats> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","queue_name","created_count","retry_count","active_count","completed_count","cancelled_count","failed_count","total_count","updated_at","created_at"];
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
    case 'queue_name':
      return typeof value === "string";
    case 'created_count':
      return typeof value === "number" && !isNaN(value);
    case 'retry_count':
      return typeof value === "number" && !isNaN(value);
    case 'active_count':
      return typeof value === "number" && !isNaN(value);
    case 'completed_count':
      return typeof value === "number" && !isNaN(value);
    case 'cancelled_count':
      return typeof value === "number" && !isNaN(value);
    case 'failed_count':
      return typeof value === "number" && !isNaN(value);
    case 'total_count':
      return typeof value === "number" && !isNaN(value);
    case 'updated_at':
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
 * Type guard for arrays of job_queue_stats
 */
export function isjob_queue_statsArray(value: unknown): value is Ijob_queue_stats[] {
  return Array.isArray(value) && value.every(isjob_queue_stats)
}

/**
 * Type guard for partial arrays of job_queue_stats
 */
export function isPartialjob_queue_statsArray(value: unknown): value is Partial<Ijob_queue_stats>[] {
  return Array.isArray(value) && value.every(isPartialjob_queue_stats)
}

