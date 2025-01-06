import { Inews } from "./interfaces";
import { newsSchema } from "./schemas";

/**
 * Type guard for news
 * Ensures that an unknown value matches the expected structure
 */
export function isnews(value: unknown): value is Inews {
  return newsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialnews(value: unknown): value is Partial<Inews> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "created_at",
    "updated_at",
    "title",
    "body",
    "category_id",
    "author",
    "description",
    "featured_image",
    "has_summary",
    "published_at",
    "url",
    "hash",
    "id",
    "company_id",
    "failed_count",
    "scrape_frequency",
    "scraped_at",
    "content_status",
    "keywords",
    "content_source_id",
    "content_sources",
    "categories",
    "companies",
    "contents",
    "news_summaries",
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
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "title":
      return typeof value === "string";
    case "body":
      return typeof value === "string";
    case "category_id":
      return true; // Complex type requiring deeper validation
    case "author":
      return typeof value === "string";
    case "description":
      return typeof value === "string";
    case "featured_image":
      return typeof value === "string";
    case "has_summary":
      return typeof value === "boolean";
    case "published_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "url":
      return typeof value === "string";
    case "hash":
      return true; // Complex type requiring deeper validation
    case "id":
      return typeof value === "string";
    case "company_id":
      return typeof value === "string";
    case "failed_count":
      return typeof value === "number" && !isNaN(value);
    case "scrape_frequency":
      return true; // Complex type requiring deeper validation
    case "scraped_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "content_status":
      return true; // Complex type requiring deeper validation
    case "keywords":
      return true; // Complex type requiring deeper validation
    case "content_source_id":
      return true; // Complex type requiring deeper validation
    case "content_sources":
      return true; // Complex type requiring deeper validation
    case "categories":
      return true; // Complex type requiring deeper validation
    case "companies":
      return true; // Complex type requiring deeper validation
    case "contents":
      return true; // Complex type requiring deeper validation
    case "news_summaries":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of news
 */
export function isnewsArray(value: unknown): value is Inews[] {
  return Array.isArray(value) && value.every(isnews);
}

/**
 * Type guard for partial arrays of news
 */
export function isPartialnewsArray(value: unknown): value is Partial<Inews>[] {
  return Array.isArray(value) && value.every(isPartialnews);
}
