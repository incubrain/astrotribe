import { Icompany_urls } from "./interfaces";
import { company_urlsSchema } from "./schemas";

/**
 * Type guard for company_urls
 * Ensures that an unknown value matches the expected structure
 */
export function iscompany_urls(value: unknown): value is Icompany_urls {
  return company_urlsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcompany_urls(
  value: unknown,
): value is Partial<Icompany_urls> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "updated_at",
    "created_at",
    "url",
    "success",
    "category",
    "company_id",
    "content",
    "distance",
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
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "url":
      return true; // Complex type requiring deeper validation
    case "success":
      return typeof value === "boolean";
    case "category":
      return true; // Complex type requiring deeper validation
    case "company_id":
      return true; // Complex type requiring deeper validation
    case "content":
      return true; // Complex type requiring deeper validation
    case "distance":
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
 * Type guard for arrays of company_urls
 */
export function iscompany_urlsArray(value: unknown): value is Icompany_urls[] {
  return Array.isArray(value) && value.every(iscompany_urls);
}

/**
 * Type guard for partial arrays of company_urls
 */
export function isPartialcompany_urlsArray(
  value: unknown,
): value is Partial<Icompany_urls>[] {
  return Array.isArray(value) && value.every(isPartialcompany_urls);
}
