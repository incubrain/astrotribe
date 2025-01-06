import { Ifeature_requests } from "./interfaces";
import { feature_requestsSchema } from "./schemas";

/**
 * Type guard for feature_requests
 * Ensures that an unknown value matches the expected structure
 */
export function isfeature_requests(value: unknown): value is Ifeature_requests {
  return feature_requestsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialfeature_requests(
  value: unknown,
): value is Partial<Ifeature_requests> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "title",
    "description",
    "status",
    "created_at",
    "updated_at",
    "downvotes",
    "engagement_score",
    "priority_score",
    "upvotes",
    "feature_votes",
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
    case "title":
      return true; // Complex type requiring deeper validation
    case "description":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "downvotes":
      return true; // Complex type requiring deeper validation
    case "engagement_score":
      return true; // Complex type requiring deeper validation
    case "priority_score":
      return true; // Complex type requiring deeper validation
    case "upvotes":
      return true; // Complex type requiring deeper validation
    case "feature_votes":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of feature_requests
 */
export function isfeature_requestsArray(
  value: unknown,
): value is Ifeature_requests[] {
  return Array.isArray(value) && value.every(isfeature_requests);
}

/**
 * Type guard for partial arrays of feature_requests
 */
export function isPartialfeature_requestsArray(
  value: unknown,
): value is Partial<Ifeature_requests>[] {
  return Array.isArray(value) && value.every(isPartialfeature_requests);
}
