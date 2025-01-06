import { Ivotes } from "./interfaces";
import { votesSchema } from "./schemas";

/**
 * Type guard for votes
 * Ensures that an unknown value matches the expected structure
 */
export function isvotes(value: unknown): value is Ivotes {
  return votesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialvotes(value: unknown): value is Partial<Ivotes> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "content_type",
    "content_id",
    "user_id",
    "vote_type",
    "created_at",
    "users",
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
    case "content_type":
      return true; // Complex type requiring deeper validation
    case "content_id":
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "vote_type":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "users":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of votes
 */
export function isvotesArray(value: unknown): value is Ivotes[] {
  return Array.isArray(value) && value.every(isvotes);
}

/**
 * Type guard for partial arrays of votes
 */
export function isPartialvotesArray(
  value: unknown,
): value is Partial<Ivotes>[] {
  return Array.isArray(value) && value.every(isPartialvotes);
}
