import { Imfa_amr_claims } from "./interfaces";
import { mfa_amr_claimsSchema } from "./schemas";

/**
 * Type guard for mfa_amr_claims
 * Ensures that an unknown value matches the expected structure
 */
export function ismfa_amr_claims(value: unknown): value is Imfa_amr_claims {
  return mfa_amr_claimsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialmfa_amr_claims(
  value: unknown,
): value is Partial<Imfa_amr_claims> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "session_id",
    "created_at",
    "updated_at",
    "authentication_method",
    "id",
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
    case "session_id":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "authentication_method":
      return typeof value === "string";
    case "id":
      return typeof value === "string";
    case "sessions":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of mfa_amr_claims
 */
export function ismfa_amr_claimsArray(
  value: unknown,
): value is Imfa_amr_claims[] {
  return Array.isArray(value) && value.every(ismfa_amr_claims);
}

/**
 * Type guard for partial arrays of mfa_amr_claims
 */
export function isPartialmfa_amr_claimsArray(
  value: unknown,
): value is Partial<Imfa_amr_claims>[] {
  return Array.isArray(value) && value.every(isPartialmfa_amr_claims);
}
