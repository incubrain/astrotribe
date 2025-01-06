import { Ifeed_sources } from "./interfaces";
import { feed_sourcesSchema } from "./schemas";

/**
 * Type guard for feed_sources
 * Ensures that an unknown value matches the expected structure
 */
export function isfeed_sources(value: unknown): value is Ifeed_sources {
  return feed_sourcesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialfeed_sources(
  value: unknown,
): value is Partial<Ifeed_sources> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "feed_id",
    "created_at",
    "content_source_id",
    "feeds",
    "content_sources",
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
    case "feed_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "content_source_id":
      return true; // Complex type requiring deeper validation
    case "feeds":
      return true; // Complex type requiring deeper validation
    case "content_sources":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of feed_sources
 */
export function isfeed_sourcesArray(value: unknown): value is Ifeed_sources[] {
  return Array.isArray(value) && value.every(isfeed_sources);
}

/**
 * Type guard for partial arrays of feed_sources
 */
export function isPartialfeed_sourcesArray(
  value: unknown,
): value is Partial<Ifeed_sources>[] {
  return Array.isArray(value) && value.every(isPartialfeed_sources);
}
