import { Iinstances } from "./interfaces";
import { instancesSchema } from "./schemas";

/**
 * Type guard for instances
 * Ensures that an unknown value matches the expected structure
 */
export function isinstances(value: unknown): value is Iinstances {
  return instancesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialinstances(
  value: unknown,
): value is Partial<Iinstances> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "uuid",
    "raw_base_config",
    "created_at",
    "updated_at",
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
    case "uuid":
      return true; // Complex type requiring deeper validation
    case "raw_base_config":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of instances
 */
export function isinstancesArray(value: unknown): value is Iinstances[] {
  return Array.isArray(value) && value.every(isinstances);
}

/**
 * Type guard for partial arrays of instances
 */
export function isPartialinstancesArray(
  value: unknown,
): value is Partial<Iinstances>[] {
  return Array.isArray(value) && value.every(isPartialinstances);
}
