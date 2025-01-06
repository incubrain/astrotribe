import { Isessions } from "./interfaces";
import { sessionsSchema } from "./schemas";

/**
 * Type guard for sessions
 * Ensures that an unknown value matches the expected structure
 */
export function issessions(value: unknown): value is Isessions {
  return sessionsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialsessions(value: unknown): value is Partial<Isessions> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "created_at",
    "updated_at",
    "factor_id",
    "aal",
    "not_after",
    "refreshed_at",
    "user_agent",
    "ip",
    "tag",
    "mfa_amr_claims",
    "refresh_tokens",
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
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "factor_id":
      return true; // Complex type requiring deeper validation
    case "aal":
      return true; // Complex type requiring deeper validation
    case "not_after":
      return true; // Complex type requiring deeper validation
    case "refreshed_at":
      return true; // Complex type requiring deeper validation
    case "user_agent":
      return true; // Complex type requiring deeper validation
    case "ip":
      return true; // Complex type requiring deeper validation
    case "tag":
      return true; // Complex type requiring deeper validation
    case "mfa_amr_claims":
      return true; // Complex type requiring deeper validation
    case "refresh_tokens":
      return true; // Complex type requiring deeper validation
    case "users":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of sessions
 */
export function issessionsArray(value: unknown): value is Isessions[] {
  return Array.isArray(value) && value.every(issessions);
}

/**
 * Type guard for partial arrays of sessions
 */
export function isPartialsessionsArray(
  value: unknown,
): value is Partial<Isessions>[] {
  return Array.isArray(value) && value.every(isPartialsessions);
}
