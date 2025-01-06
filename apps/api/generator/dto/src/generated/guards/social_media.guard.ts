import { Isocial_media } from "./interfaces";
import { social_mediaSchema } from "./schemas";

/**
 * Type guard for social_media
 * Ensures that an unknown value matches the expected structure
 */
export function issocial_media(value: unknown): value is Isocial_media {
  return social_mediaSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialsocial_media(
  value: unknown,
): value is Partial<Isocial_media> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "facebook_url",
    "twitter_url",
    "linkedin_url",
    "instagram_url",
    "youtube_url",
    "created_at",
    "updated_at",
    "companies",
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
      return typeof value === "number" && !isNaN(value);
    case "facebook_url":
      return typeof value === "string";
    case "twitter_url":
      return typeof value === "string";
    case "linkedin_url":
      return typeof value === "string";
    case "instagram_url":
      return typeof value === "string";
    case "youtube_url":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "companies":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of social_media
 */
export function issocial_mediaArray(value: unknown): value is Isocial_media[] {
  return Array.isArray(value) && value.every(issocial_media);
}

/**
 * Type guard for partial arrays of social_media
 */
export function isPartialsocial_mediaArray(
  value: unknown,
): value is Partial<Isocial_media>[] {
  return Array.isArray(value) && value.every(isPartialsocial_media);
}
