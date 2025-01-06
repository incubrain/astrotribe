import { Iresearch } from "./interfaces";
import { researchSchema } from "./schemas";

/**
 * Type guard for research
 * Ensures that an unknown value matches the expected structure
 */
export function isresearch(value: unknown): value is Iresearch {
  return researchSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialresearch(value: unknown): value is Partial<Iresearch> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "created_at",
    "updated_at",
    "published_at",
    "title",
    "version",
    "id",
    "abstract",
    "keywords",
    "month",
    "year",
    "abstract_url",
    "category",
    "doi_url",
    "figure_count",
    "has_embedding",
    "page_count",
    "pdf_url",
    "published_in",
    "table_count",
    "comments",
    "is_flagged",
    "authors",
    "summary",
    "content_status",
    "affiliations",
    "contents",
    "research_embeddings",
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
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "published_at":
      return true; // Complex type requiring deeper validation
    case "title":
      return true; // Complex type requiring deeper validation
    case "version":
      return true; // Complex type requiring deeper validation
    case "id":
      return true; // Complex type requiring deeper validation
    case "abstract":
      return true; // Complex type requiring deeper validation
    case "keywords":
      return true; // Complex type requiring deeper validation
    case "month":
      return true; // Complex type requiring deeper validation
    case "year":
      return true; // Complex type requiring deeper validation
    case "abstract_url":
      return true; // Complex type requiring deeper validation
    case "category":
      return true; // Complex type requiring deeper validation
    case "doi_url":
      return true; // Complex type requiring deeper validation
    case "figure_count":
      return true; // Complex type requiring deeper validation
    case "has_embedding":
      return typeof value === "boolean";
    case "page_count":
      return true; // Complex type requiring deeper validation
    case "pdf_url":
      return true; // Complex type requiring deeper validation
    case "published_in":
      return true; // Complex type requiring deeper validation
    case "table_count":
      return true; // Complex type requiring deeper validation
    case "comments":
      return true; // Complex type requiring deeper validation
    case "is_flagged":
      return typeof value === "boolean";
    case "authors":
      return true; // Complex type requiring deeper validation
    case "summary":
      return true; // Complex type requiring deeper validation
    case "content_status":
      return true; // Complex type requiring deeper validation
    case "affiliations":
      return true; // Complex type requiring deeper validation
    case "contents":
      return true; // Complex type requiring deeper validation
    case "research_embeddings":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of research
 */
export function isresearchArray(value: unknown): value is Iresearch[] {
  return Array.isArray(value) && value.every(isresearch);
}

/**
 * Type guard for partial arrays of research
 */
export function isPartialresearchArray(
  value: unknown,
): value is Partial<Iresearch>[] {
  return Array.isArray(value) && value.every(isPartialresearch);
}
