import { Ibookmark_folders } from "./interfaces";
import { bookmark_foldersSchema } from "./schemas";

/**
 * Type guard for bookmark_folders
 * Ensures that an unknown value matches the expected structure
 */
export function isbookmark_folders(value: unknown): value is Ibookmark_folders {
  return bookmark_foldersSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialbookmark_folders(
  value: unknown,
): value is Partial<Ibookmark_folders> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "name",
    "color",
    "parent_id",
    "is_default",
    "is_favorite",
    "position",
    "created_at",
    "updated_at",
    "bookmark_folders",
    "other_bookmark_folders",
    "users",
    "bookmarks",
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
    case "name":
      return true; // Complex type requiring deeper validation
    case "color":
      return true; // Complex type requiring deeper validation
    case "parent_id":
      return true; // Complex type requiring deeper validation
    case "is_default":
      return typeof value === "boolean";
    case "is_favorite":
      return typeof value === "boolean";
    case "position":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "bookmark_folders":
      return true; // Complex type requiring deeper validation
    case "other_bookmark_folders":
      return true; // Complex type requiring deeper validation
    case "users":
      return true; // Complex type requiring deeper validation
    case "bookmarks":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of bookmark_folders
 */
export function isbookmark_foldersArray(
  value: unknown,
): value is Ibookmark_folders[] {
  return Array.isArray(value) && value.every(isbookmark_folders);
}

/**
 * Type guard for partial arrays of bookmark_folders
 */
export function isPartialbookmark_foldersArray(
  value: unknown,
): value is Partial<Ibookmark_folders>[] {
  return Array.isArray(value) && value.every(isPartialbookmark_folders);
}
