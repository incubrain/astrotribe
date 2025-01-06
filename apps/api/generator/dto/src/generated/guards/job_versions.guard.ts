import { Ijob_versions } from "./interfaces";
import { job_versionsSchema } from "./schemas";

/**
 * Type guard for job_versions
 * Ensures that an unknown value matches the expected structure
 */
export function isjob_versions(value: unknown): value is Ijob_versions {
  return job_versionsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialjob_versions(
  value: unknown,
): value is Partial<Ijob_versions> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "job_name",
    "version",
    "changes",
    "config",
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
    case "version":
      return true; // Complex type requiring deeper validation
    case "changes":
      return true; // Complex type requiring deeper validation
    case "config":
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
 * Type guard for arrays of job_versions
 */
export function isjob_versionsArray(value: unknown): value is Ijob_versions[] {
  return Array.isArray(value) && value.every(isjob_versions);
}

/**
 * Type guard for partial arrays of job_versions
 */
export function isPartialjob_versionsArray(
  value: unknown,
): value is Partial<Ijob_versions>[] {
  return Array.isArray(value) && value.every(isPartialjob_versions);
}
