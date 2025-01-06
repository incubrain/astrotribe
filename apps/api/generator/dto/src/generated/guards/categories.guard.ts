import { Icategories } from "./interfaces";
import { categoriesSchema } from "./schemas";

/**
 * Type guard for categories
 * Ensures that an unknown value matches the expected structure
 */
export function iscategories(value: unknown): value is Icategories {
  return categoriesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcategories(
  value: unknown,
): value is Partial<Icategories> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "created_at",
    "updated_at",
    "body",
    "name",
    "document_id",
    "locale",
    "published_at",
    "companies",
    "content_categories",
    "feed_categories",
    "news",
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
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "body":
      return true; // Complex type requiring deeper validation
    case "name":
      return true; // Complex type requiring deeper validation
    case "document_id":
      return true; // Complex type requiring deeper validation
    case "locale":
      return true; // Complex type requiring deeper validation
    case "published_at":
      return true; // Complex type requiring deeper validation
    case "companies":
      return true; // Complex type requiring deeper validation
    case "content_categories":
      return true; // Complex type requiring deeper validation
    case "feed_categories":
      return true; // Complex type requiring deeper validation
    case "news":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of categories
 */
export function iscategoriesArray(value: unknown): value is Icategories[] {
  return Array.isArray(value) && value.every(iscategories);
}

/**
 * Type guard for partial arrays of categories
 */
export function isPartialcategoriesArray(
  value: unknown,
): value is Partial<Icategories>[] {
  return Array.isArray(value) && value.every(isPartialcategories);
}
