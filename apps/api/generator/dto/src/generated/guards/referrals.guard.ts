import { Ireferrals } from "./interfaces";
import { referralsSchema } from "./schemas";

/**
 * Type guard for referrals
 * Ensures that an unknown value matches the expected structure
 */
export function isreferrals(value: unknown): value is Ireferrals {
  return referralsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialreferrals(
  value: unknown,
): value is Partial<Ireferrals> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "referrer_code",
    "visitor_id",
    "created_at",
    "converted_at",
    "status",
    "conversion_value",
    "user_agent",
    "ip_address",
    "landing_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "device_type",
    "browser",
    "country_code",
    "region",
    "is_suspicious",
    "security_flags",
    "validation_attempts",
    "last_failed_attempt",
    "client_fingerprint",
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
    case "referrer_code":
      return true; // Complex type requiring deeper validation
    case "visitor_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "converted_at":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "conversion_value":
      return true; // Complex type requiring deeper validation
    case "user_agent":
      return true; // Complex type requiring deeper validation
    case "ip_address":
      return true; // Complex type requiring deeper validation
    case "landing_page":
      return true; // Complex type requiring deeper validation
    case "utm_source":
      return true; // Complex type requiring deeper validation
    case "utm_medium":
      return true; // Complex type requiring deeper validation
    case "utm_campaign":
      return true; // Complex type requiring deeper validation
    case "device_type":
      return true; // Complex type requiring deeper validation
    case "browser":
      return true; // Complex type requiring deeper validation
    case "country_code":
      return true; // Complex type requiring deeper validation
    case "region":
      return true; // Complex type requiring deeper validation
    case "is_suspicious":
      return typeof value === "boolean";
    case "security_flags":
      return true; // Complex type requiring deeper validation
    case "validation_attempts":
      return true; // Complex type requiring deeper validation
    case "last_failed_attempt":
      return true; // Complex type requiring deeper validation
    case "client_fingerprint":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of referrals
 */
export function isreferralsArray(value: unknown): value is Ireferrals[] {
  return Array.isArray(value) && value.every(isreferrals);
}

/**
 * Type guard for partial arrays of referrals
 */
export function isPartialreferralsArray(
  value: unknown,
): value is Partial<Ireferrals>[] {
  return Array.isArray(value) && value.every(isPartialreferrals);
}
