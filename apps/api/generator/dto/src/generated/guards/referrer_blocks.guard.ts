import { Ireferrer_blocks } from "./interfaces";
import { referrer_blocksSchema } from "./schemas";

/**
 * Type guard for referrer_blocks
 * Ensures that an unknown value matches the expected structure
 */
export function isreferrer_blocks(value: unknown): value is Ireferrer_blocks {
  return referrer_blocksSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialreferrer_blocks(
  value: unknown,
): value is Partial<Ireferrer_blocks> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "referrer_code",
    "blocked_at",
    "blocked_by",
    "reason",
    "is_permanent",
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
      return typeof value === "string";
    case "referrer_code":
      return typeof value === "string";
    case "blocked_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "blocked_by":
      return typeof value === "string";
    case "reason":
      return typeof value === "string";
    case "is_permanent":
      return typeof value === "boolean";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of referrer_blocks
 */
export function isreferrer_blocksArray(
  value: unknown,
): value is Ireferrer_blocks[] {
  return Array.isArray(value) && value.every(isreferrer_blocks);
}

/**
 * Type guard for partial arrays of referrer_blocks
 */
export function isPartialreferrer_blocksArray(
  value: unknown,
): value is Partial<Ireferrer_blocks>[] {
  return Array.isArray(value) && value.every(isPartialreferrer_blocks);
}
