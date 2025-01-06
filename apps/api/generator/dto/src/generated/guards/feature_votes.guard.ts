import { Ifeature_votes } from "./interfaces";
import { feature_votesSchema } from "./schemas";

/**
 * Type guard for feature_votes
 * Ensures that an unknown value matches the expected structure
 */
export function isfeature_votes(value: unknown): value is Ifeature_votes {
  return feature_votesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialfeature_votes(
  value: unknown,
): value is Partial<Ifeature_votes> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "feature_id",
    "user_id",
    "vote_type",
    "feedback",
    "created_at",
    "updated_at",
    "feature_requests",
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
    case "feature_id":
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "vote_type":
      return true; // Complex type requiring deeper validation
    case "feedback":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "feature_requests":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of feature_votes
 */
export function isfeature_votesArray(
  value: unknown,
): value is Ifeature_votes[] {
  return Array.isArray(value) && value.every(isfeature_votes);
}

/**
 * Type guard for partial arrays of feature_votes
 */
export function isPartialfeature_votesArray(
  value: unknown,
): value is Partial<Ifeature_votes>[] {
  return Array.isArray(value) && value.every(isPartialfeature_votes);
}
