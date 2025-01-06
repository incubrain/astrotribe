import { Isaml_relay_states } from "./interfaces";
import { saml_relay_statesSchema } from "./schemas";

/**
 * Type guard for saml_relay_states
 * Ensures that an unknown value matches the expected structure
 */
export function issaml_relay_states(
  value: unknown,
): value is Isaml_relay_states {
  return saml_relay_statesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialsaml_relay_states(
  value: unknown,
): value is Partial<Isaml_relay_states> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "sso_provider_id",
    "request_id",
    "for_email",
    "redirect_to",
    "created_at",
    "updated_at",
    "flow_state_id",
    "flow_state",
    "sso_providers",
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
    case "sso_provider_id":
      return true; // Complex type requiring deeper validation
    case "request_id":
      return true; // Complex type requiring deeper validation
    case "for_email":
      return true; // Complex type requiring deeper validation
    case "redirect_to":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "flow_state_id":
      return true; // Complex type requiring deeper validation
    case "flow_state":
      return true; // Complex type requiring deeper validation
    case "sso_providers":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of saml_relay_states
 */
export function issaml_relay_statesArray(
  value: unknown,
): value is Isaml_relay_states[] {
  return Array.isArray(value) && value.every(issaml_relay_states);
}

/**
 * Type guard for partial arrays of saml_relay_states
 */
export function isPartialsaml_relay_statesArray(
  value: unknown,
): value is Partial<Isaml_relay_states>[] {
  return Array.isArray(value) && value.every(isPartialsaml_relay_states);
}
