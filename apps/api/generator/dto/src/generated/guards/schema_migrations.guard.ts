import { Ischema_migrations } from "./interfaces";
import { schema_migrationsSchema } from "./schemas";

/**
 * Type guard for schema_migrations
 * Ensures that an unknown value matches the expected structure
 */
export function isschema_migrations(
  value: unknown,
): value is Ischema_migrations {
  return schema_migrationsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialschema_migrations(
  value: unknown,
): value is Partial<Ischema_migrations> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["version"];
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
    case "version":
      return typeof value === "string";
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of schema_migrations
 */
export function isschema_migrationsArray(
  value: unknown,
): value is Ischema_migrations[] {
  return Array.isArray(value) && value.every(isschema_migrations);
}

/**
 * Type guard for partial arrays of schema_migrations
 */
export function isPartialschema_migrationsArray(
  value: unknown,
): value is Partial<Ischema_migrations>[] {
  return Array.isArray(value) && value.every(isPartialschema_migrations);
}
