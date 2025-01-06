import { Iworkflows } from "./interfaces";
import { workflowsSchema } from "./schemas";

/**
 * Type guard for workflows
 * Ensures that an unknown value matches the expected structure
 */
export function isworkflows(value: unknown): value is Iworkflows {
  return workflowsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialworkflows(
  value: unknown,
): value is Partial<Iworkflows> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "name",
    "status",
    "metadata",
    "started_at",
    "completed_at",
    "created_at",
    "updated_at",
    "workflow_jobs",
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
    case "name":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "metadata":
      return true; // Complex type requiring deeper validation
    case "started_at":
      return true; // Complex type requiring deeper validation
    case "completed_at":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "workflow_jobs":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of workflows
 */
export function isworkflowsArray(value: unknown): value is Iworkflows[] {
  return Array.isArray(value) && value.every(isworkflows);
}

/**
 * Type guard for partial arrays of workflows
 */
export function isPartialworkflowsArray(
  value: unknown,
): value is Partial<Iworkflows>[] {
  return Array.isArray(value) && value.every(isPartialworkflows);
}
