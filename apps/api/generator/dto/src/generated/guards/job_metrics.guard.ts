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
      return typeof value === "string";
    case "job_name":
      return typeof value === "string";
    case "job_id":
      return typeof value === "string";
    case "status":
      return true; // Complex type requiring deeper validation
    case "started_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "completed_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "failed_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "duration_ms":
      return typeof value === "number" && !isNaN(value);
    case "items_processed":
      return typeof value === "number" && !isNaN(value);
    case "error_message":
      return typeof value === "string";
    case "error_stack":
      return typeof value === "string";
    case "metadata":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
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
