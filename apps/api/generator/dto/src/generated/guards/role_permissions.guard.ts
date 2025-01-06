import { Irole_permissions } from "./interfaces";
import { role_permissionsSchema } from "./schemas";

/**
 * Type guard for role_permissions
 * Ensures that an unknown value matches the expected structure
 */
export function isrole_permissions(value: unknown): value is Irole_permissions {
  return role_permissionsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialrole_permissions(
  value: unknown,
): value is Partial<Irole_permissions> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "role",
    "table_name",
    "conditions",
    "permissions",
    "cached_permissions",
    "inherit_from",
    "last_updated",
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
    case "role":
      return true; // Complex type requiring deeper validation
    case "table_name":
      return typeof value === "string";
    case "conditions":
      return true; // Complex type requiring deeper validation
    case "permissions":
      return true; // Complex type requiring deeper validation
    case "cached_permissions":
      return true; // Complex type requiring deeper validation
    case "inherit_from":
      return true; // Complex type requiring deeper validation
    case "last_updated":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of role_permissions
 */
export function isrole_permissionsArray(
  value: unknown,
): value is Irole_permissions[] {
  return Array.isArray(value) && value.every(isrole_permissions);
}

/**
 * Type guard for partial arrays of role_permissions
 */
export function isPartialrole_permissionsArray(
  value: unknown,
): value is Partial<Irole_permissions>[] {
  return Array.isArray(value) && value.every(isPartialrole_permissions);
}
