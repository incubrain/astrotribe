
import { Ijob_configs } from './interfaces'
import { job_configsSchema } from './schemas'

/**
 * Type guard for job_configs
 * Ensures that an unknown value matches the expected structure
 */
export function isjob_configs(value: unknown): value is Ijob_configs {
  return job_configsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialjob_configs(value: unknown): value is Partial<Ijob_configs> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","name","schedule","priority","timeout_ms","retry_limit","circuit_breaker_enabled","circuit_breaker_threshold","circuit_breaker_timeout_ms","enabled","metadata","created_at","updated_at"];
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
    case 'name':
      return typeof value === "string";
    case 'schedule':
      return typeof value === "string";
    case 'priority':
      return true; // Complex type requiring deeper validation
    case 'timeout_ms':
      return typeof value === "number" && !isNaN(value);
    case 'retry_limit':
      return typeof value === "number" && !isNaN(value);
    case 'circuit_breaker_enabled':
      return typeof value === "boolean";
    case 'circuit_breaker_threshold':
      return typeof value === "number" && !isNaN(value);
    case 'circuit_breaker_timeout_ms':
      return typeof value === "number" && !isNaN(value);
    case 'enabled':
      return typeof value === "boolean";
    case 'metadata':
      return true; // Complex type requiring deeper validation
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of job_configs
 */
export function isjob_configsArray(value: unknown): value is Ijob_configs[] {
  return Array.isArray(value) && value.every(isjob_configs)
}

/**
 * Type guard for partial arrays of job_configs
 */
export function isPartialjob_configsArray(value: unknown): value is Partial<Ijob_configs>[] {
  return Array.isArray(value) && value.every(isPartialjob_configs)
}

