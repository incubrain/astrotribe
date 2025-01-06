import { Icustomer_refunds } from "./interfaces";
import { customer_refundsSchema } from "./schemas";

/**
 * Type guard for customer_refunds
 * Ensures that an unknown value matches the expected structure
 */
export function iscustomer_refunds(value: unknown): value is Icustomer_refunds {
  return customer_refundsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcustomer_refunds(
  value: unknown,
): value is Partial<Icustomer_refunds> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "payment_id",
    "external_refund_id",
    "amount",
    "status",
    "speed_processed",
    "speed_requested",
    "notes",
    "created_at",
    "currency",
    "receipt",
    "acquirer_data",
    "batch_id",
    "customer_payments",
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
      return typeof value === "number" && !isNaN(value);
    case "payment_id":
      return typeof value === "number" && !isNaN(value);
    case "external_refund_id":
      return typeof value === "string";
    case "amount":
      return typeof value === "number" && !isNaN(value);
    case "status":
      return typeof value === "string";
    case "speed_processed":
      return typeof value === "string";
    case "speed_requested":
      return typeof value === "string";
    case "notes":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "currency":
      return typeof value === "string";
    case "receipt":
      return typeof value === "string";
    case "acquirer_data":
      return true; // Complex type requiring deeper validation
    case "batch_id":
      return typeof value === "string";
    case "customer_payments":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of customer_refunds
 */
export function iscustomer_refundsArray(
  value: unknown,
): value is Icustomer_refunds[] {
  return Array.isArray(value) && value.every(iscustomer_refunds);
}

/**
 * Type guard for partial arrays of customer_refunds
 */
export function isPartialcustomer_refundsArray(
  value: unknown,
): value is Partial<Icustomer_refunds>[] {
  return Array.isArray(value) && value.every(isPartialcustomer_refunds);
}
