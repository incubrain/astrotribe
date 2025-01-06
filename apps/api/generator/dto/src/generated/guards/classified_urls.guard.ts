import { Iclassified_urls } from "./interfaces";
import { classified_urlsSchema } from "./schemas";

/**
 * Type guard for classified_urls
 * Ensures that an unknown value matches the expected structure
 */
export function isclassified_urls(value: unknown): value is Iclassified_urls {
  return classified_urlsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialclassified_urls(
  value: unknown,
): value is Partial<Iclassified_urls> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "url",
    "predicted_category",
    "actual_category",
    "is_reviewed",
    "added_to_training",
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
      return typeof value === "number" && !isNaN(value);
    case "url":
      return typeof value === "string";
    case "predicted_category":
      return true; // Complex type requiring deeper validation
    case "actual_category":
      return true; // Complex type requiring deeper validation
    case "is_reviewed":
      return typeof value === "boolean";
    case "added_to_training":
      return typeof value === "boolean";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of classified_urls
 */
export function isclassified_urlsArray(
  value: unknown,
): value is Iclassified_urls[] {
  return Array.isArray(value) && value.every(isclassified_urls);
}

/**
 * Type guard for partial arrays of classified_urls
 */
export function isPartialclassified_urlsArray(
  value: unknown,
): value is Partial<Iclassified_urls>[] {
  return Array.isArray(value) && value.every(isPartialclassified_urls);
}
