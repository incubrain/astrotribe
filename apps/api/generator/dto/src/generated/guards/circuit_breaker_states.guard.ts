import { Icircuit_breaker_states } from "./interfaces";
import { circuit_breaker_statesSchema } from "./schemas";

/**
 * Type guard for circuit_breaker_states
 * Ensures that an unknown value matches the expected structure
 */
export function iscircuit_breaker_states(
  value: unknown,
): value is Icircuit_breaker_states {
  return circuit_breaker_statesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcircuit_breaker_states(
  value: unknown,
): value is Partial<Icircuit_breaker_states> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "job_name",
    "state",
    "failure_count",
    "last_failure",
    "last_success",
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
    case "job_name":
      return typeof value === "string";
    case "state":
      return typeof value === "string";
    case "failure_count":
      return typeof value === "number" && !isNaN(value);
    case "last_failure":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "last_success":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
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
 * Type guard for arrays of circuit_breaker_states
 */
export function iscircuit_breaker_statesArray(
  value: unknown,
): value is Icircuit_breaker_states[] {
  return Array.isArray(value) && value.every(iscircuit_breaker_states);
}

/**
 * Type guard for partial arrays of circuit_breaker_states
 */
export function isPartialcircuit_breaker_statesArray(
  value: unknown,
): value is Partial<Icircuit_breaker_states>[] {
  return Array.isArray(value) && value.every(isPartialcircuit_breaker_states);
}
