import { Iresearch_embeddings } from "./interfaces";
import { research_embeddingsSchema } from "./schemas";

/**
 * Type guard for research_embeddings
 * Ensures that an unknown value matches the expected structure
 */
export function isresearch_embeddings(
  value: unknown,
): value is Iresearch_embeddings {
  return research_embeddingsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialresearch_embeddings(
  value: unknown,
): value is Partial<Iresearch_embeddings> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "research_id",
    "chunk",
    "url",
    "created_at",
    "is_flagged",
    "updated_at",
    "embedding_review_id",
    "embedding_reviews",
    "research",
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
    case "research_id":
      return true; // Complex type requiring deeper validation
    case "chunk":
      return true; // Complex type requiring deeper validation
    case "url":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "is_flagged":
      return typeof value === "boolean";
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "embedding_review_id":
      return true; // Complex type requiring deeper validation
    case "embedding_reviews":
      return true; // Complex type requiring deeper validation
    case "research":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of research_embeddings
 */
export function isresearch_embeddingsArray(
  value: unknown,
): value is Iresearch_embeddings[] {
  return Array.isArray(value) && value.every(isresearch_embeddings);
}

/**
 * Type guard for partial arrays of research_embeddings
 */
export function isPartialresearch_embeddingsArray(
  value: unknown,
): value is Partial<Iresearch_embeddings>[] {
  return Array.isArray(value) && value.every(isPartialresearch_embeddings);
}
