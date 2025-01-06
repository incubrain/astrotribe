import { Inews_tags } from "./interfaces";
import { news_tagsSchema } from "./schemas";

/**
 * Type guard for news_tags
 * Ensures that an unknown value matches the expected structure
 */
export function isnews_tags(value: unknown): value is Inews_tags {
  return news_tagsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialnews_tags(
  value: unknown,
): value is Partial<Inews_tags> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["id", "tag_id", "news_id", "tags"];
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
    case "tag_id":
      return typeof value === "number" && !isNaN(value);
    case "news_id":
      return typeof value === "string";
    case "tags":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of news_tags
 */
export function isnews_tagsArray(value: unknown): value is Inews_tags[] {
  return Array.isArray(value) && value.every(isnews_tags);
}

/**
 * Type guard for partial arrays of news_tags
 */
export function isPartialnews_tagsArray(
  value: unknown,
): value is Partial<Inews_tags>[] {
  return Array.isArray(value) && value.every(isPartialnews_tags);
}
