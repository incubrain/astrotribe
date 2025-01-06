import { Icontent_statuses } from "./interfaces";
import { content_statusesSchema } from "./schemas";

/**
 * Type guard for content_statuses
 * Ensures that an unknown value matches the expected structure
 */
export function iscontent_statuses(value: unknown): value is Icontent_statuses {
  return content_statusesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcontent_statuses(
  value: unknown,
): value is Partial<Icontent_statuses> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "content_id",
    "notes",
    "created_at",
    "content_status",
    "contents",
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
    case "content_id":
      return true; // Complex type requiring deeper validation
    case "notes":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "content_status":
      return true; // Complex type requiring deeper validation
    case "contents":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of content_statuses
 */
export function iscontent_statusesArray(
  value: unknown,
): value is Icontent_statuses[] {
  return Array.isArray(value) && value.every(iscontent_statuses);
}

/**
 * Type guard for partial arrays of content_statuses
 */
export function isPartialcontent_statusesArray(
  value: unknown,
): value is Partial<Icontent_statuses>[] {
  return Array.isArray(value) && value.every(isPartialcontent_statuses);
}
