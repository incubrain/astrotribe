import { Imfa_factors } from "./interfaces";
import { mfa_factorsSchema } from "./schemas";

/**
 * Type guard for mfa_factors
 * Ensures that an unknown value matches the expected structure
 */
export function ismfa_factors(value: unknown): value is Imfa_factors {
  return mfa_factorsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialmfa_factors(
  value: unknown,
): value is Partial<Imfa_factors> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "friendly_name",
    "factor_type",
    "status",
    "created_at",
    "updated_at",
    "secret",
    "phone",
    "last_challenged_at",
    "web_authn_credential",
    "web_authn_aaguid",
    "mfa_challenges",
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
    case "friendly_name":
      return typeof value === "string";
    case "factor_type":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "secret":
      return typeof value === "string";
    case "phone":
      return typeof value === "string";
    case "last_challenged_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "web_authn_credential":
      return true; // Complex type requiring deeper validation
    case "web_authn_aaguid":
      return typeof value === "string";
    case "mfa_challenges":
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
 * Type guard for arrays of mfa_factors
 */
export function ismfa_factorsArray(value: unknown): value is Imfa_factors[] {
  return Array.isArray(value) && value.every(ismfa_factors);
}

/**
 * Type guard for partial arrays of mfa_factors
 */
export function isPartialmfa_factorsArray(
  value: unknown,
): value is Partial<Imfa_factors>[] {
  return Array.isArray(value) && value.every(isPartialmfa_factors);
}
