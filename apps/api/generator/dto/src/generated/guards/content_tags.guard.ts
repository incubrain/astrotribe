import { Icontent_tags } from "./interfaces";
import { content_tagsSchema } from "./schemas";

/**
 * Type guard for content_tags
 * Ensures that an unknown value matches the expected structure
 */
export function iscontent_tags(value: unknown): value is Icontent_tags {
  return content_tagsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcontent_tags(
  value: unknown,
): value is Partial<Icontent_tags> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["content_id", "tag_id", "contents", "tags"];
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
    case "content_id":
      return true; // Complex type requiring deeper validation
    case "tag_id":
      return true; // Complex type requiring deeper validation
    case "contents":
      return true; // Complex type requiring deeper validation
    case "tags":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of content_tags
 */
export function iscontent_tagsArray(value: unknown): value is Icontent_tags[] {
  return Array.isArray(value) && value.every(iscontent_tags);
}

/**
 * Type guard for partial arrays of content_tags
 */
export function isPartialcontent_tagsArray(
  value: unknown,
): value is Partial<Icontent_tags>[] {
  return Array.isArray(value) && value.every(isPartialcontent_tags);
}
