import { Iresponses } from "./interfaces";
import { responsesSchema } from "./schemas";

/**
 * Type guard for responses
 * Ensures that an unknown value matches the expected structure
 */
export function isresponses(value: unknown): value is Iresponses {
  return responsesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialresponses(
  value: unknown,
): value is Partial<Iresponses> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "search_id",
    "output",
    "upvotes",
    "downvotes",
    "created_at",
    "searches",
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
    case "search_id":
      return true; // Complex type requiring deeper validation
    case "output":
      return true; // Complex type requiring deeper validation
    case "upvotes":
      return true; // Complex type requiring deeper validation
    case "downvotes":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "searches":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of responses
 */
export function isresponsesArray(value: unknown): value is Iresponses[] {
  return Array.isArray(value) && value.every(isresponses);
}

/**
 * Type guard for partial arrays of responses
 */
export function isPartialresponsesArray(
  value: unknown,
): value is Partial<Iresponses>[] {
  return Array.isArray(value) && value.every(isPartialresponses);
}
