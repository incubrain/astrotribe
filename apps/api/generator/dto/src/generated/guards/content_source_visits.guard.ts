import { Icontent_source_visits } from "./interfaces";
import { content_source_visitsSchema } from "./schemas";

/**
 * Type guard for content_source_visits
 * Ensures that an unknown value matches the expected structure
 */
export function iscontent_source_visits(
  value: unknown,
): value is Icontent_source_visits {
  return content_source_visitsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcontent_source_visits(
  value: unknown,
): value is Partial<Icontent_source_visits> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "content_id",
    "user_id",
    "created_at",
    "contents",
    "user_profiles",
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
    case "content_id":
      return typeof value === "string";
    case "user_id":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "contents":
      return true; // Complex type requiring deeper validation
    case "user_profiles":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of content_source_visits
 */
export function iscontent_source_visitsArray(
  value: unknown,
): value is Icontent_source_visits[] {
  return Array.isArray(value) && value.every(iscontent_source_visits);
}

/**
 * Type guard for partial arrays of content_source_visits
 */
export function isPartialcontent_source_visitsArray(
  value: unknown,
): value is Partial<Icontent_source_visits>[] {
  return Array.isArray(value) && value.every(isPartialcontent_source_visits);
}
