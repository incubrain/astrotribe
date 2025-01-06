import { Imfa_challenges } from "./interfaces";
import { mfa_challengesSchema } from "./schemas";

/**
 * Type guard for mfa_challenges
 * Ensures that an unknown value matches the expected structure
 */
export function ismfa_challenges(value: unknown): value is Imfa_challenges {
  return mfa_challengesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialmfa_challenges(
  value: unknown,
): value is Partial<Imfa_challenges> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "factor_id",
    "created_at",
    "verified_at",
    "ip_address",
    "otp_code",
    "web_authn_session_data",
    "mfa_factors",
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
    case "factor_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "verified_at":
      return true; // Complex type requiring deeper validation
    case "ip_address":
      return true; // Complex type requiring deeper validation
    case "otp_code":
      return true; // Complex type requiring deeper validation
    case "web_authn_session_data":
      return true; // Complex type requiring deeper validation
    case "mfa_factors":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of mfa_challenges
 */
export function ismfa_challengesArray(
  value: unknown,
): value is Imfa_challenges[] {
  return Array.isArray(value) && value.every(ismfa_challenges);
}

/**
 * Type guard for partial arrays of mfa_challenges
 */
export function isPartialmfa_challengesArray(
  value: unknown,
): value is Partial<Imfa_challenges>[] {
  return Array.isArray(value) && value.every(isPartialmfa_challenges);
}
