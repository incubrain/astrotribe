import { Icontent_sources } from "./interfaces";
import { content_sourcesSchema } from "./schemas";

/**
 * Type guard for content_sources
 * Ensures that an unknown value matches the expected structure
 */
export function iscontent_sources(value: unknown): value is Icontent_sources {
  return content_sourcesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcontent_sources(
  value: unknown,
): value is Partial<Icontent_sources> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "url",
    "content_type",
    "scrape_frequency",
    "created_at",
    "updated_at",
    "refreshed_at",
    "has_failed",
    "failed_count",
    "priority",
    "hash",
    "scraped_at",
    "expected_count",
    "company_id",
    "rss_urls",
    "companies",
    "feed_sources",
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
    case "url":
      return typeof value === "string";
    case "content_type":
      return true; // Complex type requiring deeper validation
    case "scrape_frequency":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "refreshed_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "has_failed":
      return typeof value === "boolean";
    case "failed_count":
      return typeof value === "number" && !isNaN(value);
    case "priority":
      return true; // Complex type requiring deeper validation
    case "hash":
      return true; // Complex type requiring deeper validation
    case "scraped_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "expected_count":
      return typeof value === "number" && !isNaN(value);
    case "company_id":
      return typeof value === "string";
    case "rss_urls":
      return typeof value === "string";
    case "companies":
      return true; // Complex type requiring deeper validation
    case "feed_sources":
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
 * Type guard for arrays of content_sources
 */
export function iscontent_sourcesArray(
  value: unknown,
): value is Icontent_sources[] {
  return Array.isArray(value) && value.every(iscontent_sources);
}

/**
 * Type guard for partial arrays of content_sources
 */
export function isPartialcontent_sourcesArray(
  value: unknown,
): value is Partial<Icontent_sources>[] {
  return Array.isArray(value) && value.every(isPartialcontent_sources);
}
