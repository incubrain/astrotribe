import { Iflow_state } from "./interfaces";
import { flow_stateSchema } from "./schemas";

/**
 * Type guard for flow_state
 * Ensures that an unknown value matches the expected structure
 */
export function isflow_state(value: unknown): value is Iflow_state {
  return flow_stateSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialflow_state(
  value: unknown,
): value is Partial<Iflow_state> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "auth_code",
    "code_challenge_method",
    "code_challenge",
    "provider_type",
    "provider_access_token",
    "provider_refresh_token",
    "created_at",
    "updated_at",
    "authentication_method",
    "auth_code_issued_at",
    "saml_relay_states",
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
    case "auth_code":
      return typeof value === "string";
    case "code_challenge_method":
      return true; // Complex type requiring deeper validation
    case "code_challenge":
      return typeof value === "string";
    case "provider_type":
      return typeof value === "string";
    case "provider_access_token":
      return typeof value === "string";
    case "provider_refresh_token":
      return typeof value === "string";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "authentication_method":
      return typeof value === "string";
    case "auth_code_issued_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "saml_relay_states":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of flow_state
 */
export function isflow_stateArray(value: unknown): value is Iflow_state[] {
  return Array.isArray(value) && value.every(isflow_state);
}

/**
 * Type guard for partial arrays of flow_state
 */
export function isPartialflow_stateArray(
  value: unknown,
): value is Partial<Iflow_state>[] {
  return Array.isArray(value) && value.every(isPartialflow_state);
}
