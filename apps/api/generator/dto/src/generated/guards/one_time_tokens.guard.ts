import { Ione_time_tokens } from "./interfaces";
import { one_time_tokensSchema } from "./schemas";

/**
 * Type guard for one_time_tokens
 * Ensures that an unknown value matches the expected structure
 */
export function isone_time_tokens(value: unknown): value is Ione_time_tokens {
  return one_time_tokensSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialone_time_tokens(
  value: unknown,
): value is Partial<Ione_time_tokens> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "token_type",
    "token_hash",
    "relates_to",
    "created_at",
    "updated_at",
    "users",
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
    case "user_id":
      return typeof value === "string";
    case "token_type":
      return true; // Complex type requiring deeper validation
    case "token_hash":
      return typeof value === "string";
    case "relates_to":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "users":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of one_time_tokens
 */
export function isone_time_tokensArray(
  value: unknown,
): value is Ione_time_tokens[] {
  return Array.isArray(value) && value.every(isone_time_tokens);
}

/**
 * Type guard for partial arrays of one_time_tokens
 */
export function isPartialone_time_tokensArray(
  value: unknown,
): value is Partial<Ione_time_tokens>[] {
  return Array.isArray(value) && value.every(isPartialone_time_tokens);
}
