import { Ibookmarks } from "./interfaces";
import { bookmarksSchema } from "./schemas";

/**
 * Type guard for bookmarks
 * Ensures that an unknown value matches the expected structure
 */
export function isbookmarks(value: unknown): value is Ibookmarks {
  return bookmarksSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialbookmarks(
  value: unknown,
): value is Partial<Ibookmarks> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "content_id",
    "content_type",
    "created_at",
    "folder_id",
    "metadata",
    "updated_at",
    "contents",
    "bookmark_folders",
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
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "content_id":
      return true; // Complex type requiring deeper validation
    case "content_type":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "folder_id":
      return true; // Complex type requiring deeper validation
    case "metadata":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "contents":
      return true; // Complex type requiring deeper validation
    case "bookmark_folders":
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
 * Type guard for arrays of bookmarks
 */
export function isbookmarksArray(value: unknown): value is Ibookmarks[] {
  return Array.isArray(value) && value.every(isbookmarks);
}

/**
 * Type guard for partial arrays of bookmarks
 */
export function isPartialbookmarksArray(
  value: unknown,
): value is Partial<Ibookmarks>[] {
  return Array.isArray(value) && value.every(isPartialbookmarks);
}
