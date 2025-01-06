import { Ierror_logs } from "./interfaces";
import { error_logsSchema } from "./schemas";

/**
 * Type guard for error_logs
 * Ensures that an unknown value matches the expected structure
 */
export function iserror_logs(value: unknown): value is Ierror_logs {
  return error_logsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialerror_logs(
  value: unknown,
): value is Partial<Ierror_logs> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "service_name",
    "error_type",
    "severity",
    "message",
    "stack_trace",
    "metadata",
    "context",
    "user_id",
    "request_id",
    "correlation_id",
    "environment",
    "created_at",
    "error_hash",
    "error_pattern",
    "is_new_pattern",
    "github_repo",
    "related_errors",
    "frequency_data",
    "domain",
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
    case "service_name":
      return true; // Complex type requiring deeper validation
    case "error_type":
      return true; // Complex type requiring deeper validation
    case "severity":
      return true; // Complex type requiring deeper validation
    case "message":
      return true; // Complex type requiring deeper validation
    case "stack_trace":
      return true; // Complex type requiring deeper validation
    case "metadata":
      return true; // Complex type requiring deeper validation
    case "context":
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "request_id":
      return true; // Complex type requiring deeper validation
    case "correlation_id":
      return true; // Complex type requiring deeper validation
    case "environment":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "error_hash":
      return true; // Complex type requiring deeper validation
    case "error_pattern":
      return true; // Complex type requiring deeper validation
    case "is_new_pattern":
      return typeof value === "boolean";
    case "github_repo":
      return true; // Complex type requiring deeper validation
    case "related_errors":
      return true; // Complex type requiring deeper validation
    case "frequency_data":
      return true; // Complex type requiring deeper validation
    case "domain":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of error_logs
 */
export function iserror_logsArray(value: unknown): value is Ierror_logs[] {
  return Array.isArray(value) && value.every(iserror_logs);
}

/**
 * Type guard for partial arrays of error_logs
 */
export function isPartialerror_logsArray(
  value: unknown,
): value is Partial<Ierror_logs>[] {
  return Array.isArray(value) && value.every(isPartialerror_logs);
}
