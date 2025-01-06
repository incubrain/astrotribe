import { Inewsletters } from "./interfaces";
import { newslettersSchema } from "./schemas";

/**
 * Type guard for newsletters
 * Ensures that an unknown value matches the expected structure
 */
export function isnewsletters(value: unknown): value is Inewsletters {
  return newslettersSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialnewsletters(
  value: unknown,
): value is Partial<Inewsletters> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "title",
    "frequency",
    "start_date",
    "end_date",
    "generated_content",
    "created_at",
    "updated_at",
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
      return typeof value === "string";
    case "title":
      return typeof value === "string";
    case "frequency":
      return typeof value === "string";
    case "start_date":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "end_date":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "generated_content":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
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
 * Type guard for arrays of newsletters
 */
export function isnewslettersArray(value: unknown): value is Inewsletters[] {
  return Array.isArray(value) && value.every(isnewsletters);
}

/**
 * Type guard for partial arrays of newsletters
 */
export function isPartialnewslettersArray(
  value: unknown,
): value is Partial<Inewsletters>[] {
  return Array.isArray(value) && value.every(isPartialnewsletters);
}
