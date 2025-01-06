import { Istrapi_migrations } from "./interfaces";
import { strapi_migrationsSchema } from "./schemas";

/**
 * Type guard for strapi_migrations
 * Ensures that an unknown value matches the expected structure
 */
export function isstrapi_migrations(
  value: unknown,
): value is Istrapi_migrations {
  return strapi_migrationsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialstrapi_migrations(
  value: unknown,
): value is Partial<Istrapi_migrations> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["id", "name", "time"];
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
    case "name":
      return true; // Complex type requiring deeper validation
    case "time":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of strapi_migrations
 */
export function isstrapi_migrationsArray(
  value: unknown,
): value is Istrapi_migrations[] {
  return Array.isArray(value) && value.every(isstrapi_migrations);
}

/**
 * Type guard for partial arrays of strapi_migrations
 */
export function isPartialstrapi_migrationsArray(
  value: unknown,
): value is Partial<Istrapi_migrations>[] {
  return Array.isArray(value) && value.every(isPartialstrapi_migrations);
}
