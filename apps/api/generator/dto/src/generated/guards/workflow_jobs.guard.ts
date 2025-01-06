
import { Iworkflow_jobs } from './interfaces'
import { workflow_jobsSchema } from './schemas'

/**
 * Type guard for workflow_jobs
 * Ensures that an unknown value matches the expected structure
 */
export function isworkflow_jobs(value: unknown): value is Iworkflow_jobs {
  return workflow_jobsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialworkflow_jobs(value: unknown): value is Partial<Iworkflow_jobs> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","workflow_id","job_id","job_name","status","sequence_number","depends_on","started_at","completed_at","created_at","updated_at","workflows"];
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
    case 'workflow_id':
      return typeof value === "string";
    case 'job_id':
      return typeof value === "string";
    case 'job_name':
      return typeof value === "string";
    case 'status':
      return true; // Complex type requiring deeper validation
    case 'sequence_number':
      return typeof value === "number" && !isNaN(value);
    case 'depends_on':
      return typeof value === "string";
    case 'started_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'completed_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'workflows':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of workflow_jobs
 */
export function isworkflow_jobsArray(value: unknown): value is Iworkflow_jobs[] {
  return Array.isArray(value) && value.every(isworkflow_jobs)
}

/**
 * Type guard for partial arrays of workflow_jobs
 */
export function isPartialworkflow_jobsArray(value: unknown): value is Partial<Iworkflow_jobs>[] {
  return Array.isArray(value) && value.every(isPartialworkflow_jobs)
}

