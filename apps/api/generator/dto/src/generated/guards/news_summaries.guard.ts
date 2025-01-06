import { Inews_summaries } from "./interfaces";
import { news_summariesSchema } from "./schemas";

/**
 * Type guard for news_summaries
 * Ensures that an unknown value matches the expected structure
 */
export function isnews_summaries(value: unknown): value is Inews_summaries {
  return news_summariesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialnews_summaries(
  value: unknown,
): value is Partial<Inews_summaries> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "news_id",
    "summary",
    "version",
    "is_current",
    "created_at",
    "updated_at",
    "complexity_level",
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
      return typeof value === "string";
    case "news_id":
      return typeof value === "string";
    case "summary":
      return typeof value === "string";
    case "version":
      return typeof value === "number" && !isNaN(value);
    case "is_current":
      return typeof value === "boolean";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "complexity_level":
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
 * Type guard for arrays of news_summaries
 */
export function isnews_summariesArray(
  value: unknown,
): value is Inews_summaries[] {
  return Array.isArray(value) && value.every(isnews_summaries);
}

/**
 * Type guard for partial arrays of news_summaries
 */
export function isPartialnews_summariesArray(
  value: unknown,
): value is Partial<Inews_summaries>[] {
  return Array.isArray(value) && value.every(isPartialnews_summaries);
}
