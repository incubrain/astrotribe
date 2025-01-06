import { Iblacklisted_urls } from "./interfaces";
import { blacklisted_urlsSchema } from "./schemas";

/**
 * Type guard for blacklisted_urls
 * Ensures that an unknown value matches the expected structure
 */
export function isblacklisted_urls(value: unknown): value is Iblacklisted_urls {
  return blacklisted_urlsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialblacklisted_urls(
  value: unknown,
): value is Partial<Iblacklisted_urls> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "url",
    "reason",
    "created_at",
    "company_id",
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
      return true; // Complex type requiring deeper validation
    case "url":
      return true; // Complex type requiring deeper validation
    case "reason":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "company_id":
      return true; // Complex type requiring deeper validation
    case "companies":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of blacklisted_urls
 */
export function isblacklisted_urlsArray(
  value: unknown,
): value is Iblacklisted_urls[] {
  return Array.isArray(value) && value.every(isblacklisted_urls);
}

/**
 * Type guard for partial arrays of blacklisted_urls
 */
export function isPartialblacklisted_urlsArray(
  value: unknown,
): value is Partial<Iblacklisted_urls>[] {
  return Array.isArray(value) && value.every(isPartialblacklisted_urls);
}
