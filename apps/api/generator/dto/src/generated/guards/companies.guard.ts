import { Icompanies } from "./interfaces";
import { companiesSchema } from "./schemas";

/**
 * Type guard for companies
 * Ensures that an unknown value matches the expected structure
 */
export function iscompanies(value: unknown): value is Icompanies {
  return companiesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcompanies(
  value: unknown,
): value is Partial<Icompanies> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "name",
    "description",
    "logo_url",
    "url",
    "social_media_id",
    "scrape_frequency",
    "category_id",
    "created_at",
    "updated_at",
    "founding_year",
    "is_government",
    "category",
    "failed_count",
    "is_english",
    "scrape_rating",
    "id",
    "scraped_at",
    "content_status",
    "keywords",
    "addresses",
    "ads",
    "blacklisted_urls",
    "social_media",
    "categories",
    "company_contacts",
    "company_extras",
    "company_urls",
    "contacts",
    "content_sources",
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
    case "name":
      return typeof value === "string";
    case "description":
      return typeof value === "string";
    case "logo_url":
      return typeof value === "string";
    case "url":
      return typeof value === "string";
    case "social_media_id":
      return typeof value === "number" && !isNaN(value);
    case "scrape_frequency":
      return true; // Complex type requiring deeper validation
    case "category_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "founding_year":
      return typeof value === "number" && !isNaN(value);
    case "is_government":
      return typeof value === "boolean";
    case "category":
      return typeof value === "string";
    case "failed_count":
      return typeof value === "number" && !isNaN(value);
    case "is_english":
      return typeof value === "boolean";
    case "scrape_rating":
      return typeof value === "number" && !isNaN(value);
    case "id":
      return typeof value === "string";
    case "scraped_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "content_status":
      return true; // Complex type requiring deeper validation
    case "keywords":
      return true; // Complex type requiring deeper validation
    case "addresses":
      return true; // Complex type requiring deeper validation
    case "ads":
      return true; // Complex type requiring deeper validation
    case "blacklisted_urls":
      return true; // Complex type requiring deeper validation
    case "social_media":
      return true; // Complex type requiring deeper validation
    case "categories":
      return true; // Complex type requiring deeper validation
    case "company_contacts":
      return true; // Complex type requiring deeper validation
    case "company_extras":
      return true; // Complex type requiring deeper validation
    case "company_urls":
      return true; // Complex type requiring deeper validation
    case "contacts":
      return true; // Complex type requiring deeper validation
    case "content_sources":
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
 * Type guard for arrays of companies
 */
export function iscompaniesArray(value: unknown): value is Icompanies[] {
  return Array.isArray(value) && value.every(iscompanies);
}

/**
 * Type guard for partial arrays of companies
 */
export function isPartialcompaniesArray(
  value: unknown,
): value is Partial<Icompanies>[] {
  return Array.isArray(value) && value.every(isPartialcompanies);
}
