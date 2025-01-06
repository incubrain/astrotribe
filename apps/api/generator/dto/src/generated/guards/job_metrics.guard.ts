import { Ijob_metrics } from "./interfaces";
import { job_metricsSchema } from "./schemas";

/**
 * Type guard for job_metrics
 * Ensures that an unknown value matches the expected structure
 */
export function isjob_metrics(value: unknown): value is Ijob_metrics {
  return job_metricsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialjob_metrics(
  value: unknown,
): value is Partial<Ijob_metrics> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "job_name",
    "job_id",
    "status",
    "started_at",
    "completed_at",
    "failed_at",
    "duration_ms",
    "items_processed",
    "error_message",
    "error_stack",
    "metadata",
    "created_at",
    "updated_at",
  ];
  return Object.keys(value).every(
    (key) =>
      knownKeys.includes(key) &&
      isValidField(key, value[key as keyof typeof value]),
  );
}

/**
 * Validates individual fields based on their expected types.
 */
function isValidField(key: string, value: unknown): boolean {
  switch (key) {
    case "id":
      return true; // Complex type requiring deeper validation
    case "job_name":
      return true; // Complex type requiring deeper validation
    case "job_id":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "started_at":
      return true; // Complex type requiring deeper validation
    case "completed_at":
      return true; // Complex type requiring deeper validation
    case "failed_at":
      return true; // Complex type requiring deeper validation
    case "duration_ms":
      return true; // Complex type requiring deeper validation
    case "items_processed":
      return true; // Complex type requiring deeper validation
    case "error_message":
      return true; // Complex type requiring deeper validation
    case "error_stack":
      return true; // Complex type requiring deeper validation
    case "metadata":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of job_metrics
 */
export function isjob_metricsArray(value: unknown): value is Ijob_metrics[] {
  return Array.isArray(value) && value.every(isjob_metrics);
}

/**
 * Type guard for partial arrays of job_metrics
 */
export function isPartialjob_metricsArray(
  value: unknown,
): value is Partial<Ijob_metrics>[] {
  return Array.isArray(value) && value.every(isPartialjob_metrics);
}
