import { Ifeed_categories } from "./interfaces";
import { feed_categoriesSchema } from "./schemas";

/**
 * Type guard for feed_categories
 * Ensures that an unknown value matches the expected structure
 */
export function isfeed_categories(value: unknown): value is Ifeed_categories {
  return feed_categoriesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialfeed_categories(
  value: unknown,
): value is Partial<Ifeed_categories> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "created_at",
    "feed_id",
    "category_id",
    "categories",
    "feeds",
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
    case "feed_id":
      return true; // Complex type requiring deeper validation
    case "category_id":
      return true; // Complex type requiring deeper validation
    case "categories":
      return true; // Complex type requiring deeper validation
    case "feeds":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of feed_categories
 */
export function isfeed_categoriesArray(
  value: unknown,
): value is Ifeed_categories[] {
  return Array.isArray(value) && value.every(isfeed_categories);
}

/**
 * Type guard for partial arrays of feed_categories
 */
export function isPartialfeed_categoriesArray(
  value: unknown,
): value is Partial<Ifeed_categories>[] {
  return Array.isArray(value) && value.every(isPartialfeed_categories);
}
