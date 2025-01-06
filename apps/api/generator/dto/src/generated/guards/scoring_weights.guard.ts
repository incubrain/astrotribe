import { Iscoring_weights } from "./interfaces";
import { scoring_weightsSchema } from "./schemas";

/**
 * Type guard for scoring_weights
 * Ensures that an unknown value matches the expected structure
 */
export function isscoring_weights(value: unknown): value is Iscoring_weights {
  return scoring_weightsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialscoring_weights(
  value: unknown,
): value is Partial<Iscoring_weights> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["id", "name", "weight", "description", "updated_at"];
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
    case "name":
      return typeof value === "string";
    case "weight":
      return typeof value === "number" && !isNaN(value);
    case "description":
      return typeof value === "string";
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of scoring_weights
 */
export function isscoring_weightsArray(
  value: unknown,
): value is Iscoring_weights[] {
  return Array.isArray(value) && value.every(isscoring_weights);
}

/**
 * Type guard for partial arrays of scoring_weights
 */
export function isPartialscoring_weightsArray(
  value: unknown,
): value is Partial<Iscoring_weights>[] {
  return Array.isArray(value) && value.every(isPartialscoring_weights);
}
