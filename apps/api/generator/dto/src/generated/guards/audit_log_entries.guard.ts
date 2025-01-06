import { Iaudit_log_entries } from "./interfaces";
import { audit_log_entriesSchema } from "./schemas";

/**
 * Type guard for audit_log_entries
 * Ensures that an unknown value matches the expected structure
 */
export function isaudit_log_entries(
  value: unknown,
): value is Iaudit_log_entries {
  return audit_log_entriesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialaudit_log_entries(
  value: unknown,
): value is Partial<Iaudit_log_entries> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "instance_id",
    "id",
    "payload",
    "created_at",
    "ip_address",
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
    case "instance_id":
      return true; // Complex type requiring deeper validation
    case "id":
      return true; // Complex type requiring deeper validation
    case "payload":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "ip_address":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of audit_log_entries
 */
export function isaudit_log_entriesArray(
  value: unknown,
): value is Iaudit_log_entries[] {
  return Array.isArray(value) && value.every(isaudit_log_entries);
}

/**
 * Type guard for partial arrays of audit_log_entries
 */
export function isPartialaudit_log_entriesArray(
  value: unknown,
): value is Partial<Iaudit_log_entries>[] {
  return Array.isArray(value) && value.every(isPartialaudit_log_entries);
}
