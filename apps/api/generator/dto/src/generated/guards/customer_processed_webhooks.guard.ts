import { Icustomer_processed_webhooks } from "./interfaces";
import { customer_processed_webhooksSchema } from "./schemas";

/**
 * Type guard for customer_processed_webhooks
 * Ensures that an unknown value matches the expected structure
 */
export function iscustomer_processed_webhooks(
  value: unknown,
): value is Icustomer_processed_webhooks {
  return customer_processed_webhooksSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcustomer_processed_webhooks(
  value: unknown,
): value is Partial<Icustomer_processed_webhooks> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = ["id", "event_id", "event_type", "processed_at"];
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
      return typeof value === "number" && !isNaN(value);
    case "event_id":
      return typeof value === "string";
    case "event_type":
      return typeof value === "string";
    case "processed_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of customer_processed_webhooks
 */
export function iscustomer_processed_webhooksArray(
  value: unknown,
): value is Icustomer_processed_webhooks[] {
  return Array.isArray(value) && value.every(iscustomer_processed_webhooks);
}

/**
 * Type guard for partial arrays of customer_processed_webhooks
 */
export function isPartialcustomer_processed_webhooksArray(
  value: unknown,
): value is Partial<Icustomer_processed_webhooks>[] {
  return (
    Array.isArray(value) && value.every(isPartialcustomer_processed_webhooks)
  );
}
