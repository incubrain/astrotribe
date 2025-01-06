import { Irefresh_tokens } from "./interfaces";
import { refresh_tokensSchema } from "./schemas";

/**
 * Type guard for refresh_tokens
 * Ensures that an unknown value matches the expected structure
 */
export function isrefresh_tokens(value: unknown): value is Irefresh_tokens {
  return refresh_tokensSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialrefresh_tokens(
  value: unknown,
): value is Partial<Irefresh_tokens> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "instance_id",
    "id",
    "token",
    "user_id",
    "revoked",
    "created_at",
    "updated_at",
    "parent",
    "session_id",
    "sessions",
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
    case "instance_id":
      return true; // Complex type requiring deeper validation
    case "id":
      return true; // Complex type requiring deeper validation
    case "token":
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "revoked":
      return typeof value === "boolean";
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "parent":
      return true; // Complex type requiring deeper validation
    case "session_id":
      return true; // Complex type requiring deeper validation
    case "sessions":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of refresh_tokens
 */
export function isrefresh_tokensArray(
  value: unknown,
): value is Irefresh_tokens[] {
  return Array.isArray(value) && value.every(isrefresh_tokens);
}

/**
 * Type guard for partial arrays of refresh_tokens
 */
export function isPartialrefresh_tokensArray(
  value: unknown,
): value is Partial<Irefresh_tokens>[] {
  return Array.isArray(value) && value.every(isPartialrefresh_tokens);
}
