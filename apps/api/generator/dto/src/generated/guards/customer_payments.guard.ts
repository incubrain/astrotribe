import { Icustomer_payments } from "./interfaces";
import { customer_paymentsSchema } from "./schemas";

/**
 * Type guard for customer_payments
 * Ensures that an unknown value matches the expected structure
 */
export function iscustomer_payments(
  value: unknown,
): value is Icustomer_payments {
  return customer_paymentsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcustomer_payments(
  value: unknown,
): value is Partial<Icustomer_payments> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "subscription_id",
    "payment_provider_id",
    "external_payment_id",
    "external_order_id",
    "amount",
    "currency",
    "status",
    "method",
    "description",
    "fee",
    "tax",
    "error_code",
    "error_description",
    "acquirer_data",
    "notes",
    "created_at",
    "order_id",
    "invoice_id",
    "international",
    "amount_refunded",
    "amount_transferred",
    "refund_status",
    "captured",
    "bank",
    "wallet",
    "vpa",
    "error_source",
    "error_step",
    "error_reason",
    "payment_providers",
    "customer_subscriptions",
    "user_profiles",
    "customer_refunds",
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
    case "user_id":
      return typeof value === "string";
    case "subscription_id":
      return typeof value === "number" && !isNaN(value);
    case "payment_provider_id":
      return typeof value === "number" && !isNaN(value);
    case "external_payment_id":
      return typeof value === "string";
    case "external_order_id":
      return typeof value === "string";
    case "amount":
      return typeof value === "number" && !isNaN(value);
    case "currency":
      return typeof value === "string";
    case "status":
      return typeof value === "string";
    case "method":
      return typeof value === "string";
    case "description":
      return typeof value === "string";
    case "fee":
      return typeof value === "number" && !isNaN(value);
    case "tax":
      return typeof value === "number" && !isNaN(value);
    case "error_code":
      return typeof value === "string";
    case "error_description":
      return typeof value === "string";
    case "acquirer_data":
      return true; // Complex type requiring deeper validation
    case "notes":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "order_id":
      return typeof value === "string";
    case "invoice_id":
      return typeof value === "string";
    case "international":
      return typeof value === "boolean";
    case "amount_refunded":
      return typeof value === "number" && !isNaN(value);
    case "amount_transferred":
      return typeof value === "number" && !isNaN(value);
    case "refund_status":
      return typeof value === "string";
    case "captured":
      return typeof value === "boolean";
    case "bank":
      return typeof value === "string";
    case "wallet":
      return typeof value === "string";
    case "vpa":
      return typeof value === "string";
    case "error_source":
      return typeof value === "string";
    case "error_step":
      return typeof value === "string";
    case "error_reason":
      return typeof value === "string";
    case "payment_providers":
      return true; // Complex type requiring deeper validation
    case "customer_subscriptions":
      return true; // Complex type requiring deeper validation
    case "user_profiles":
      return true; // Complex type requiring deeper validation
    case "customer_refunds":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of customer_payments
 */
export function iscustomer_paymentsArray(
  value: unknown,
): value is Icustomer_payments[] {
  return Array.isArray(value) && value.every(iscustomer_payments);
}

/**
 * Type guard for partial arrays of customer_payments
 */
export function isPartialcustomer_paymentsArray(
  value: unknown,
): value is Partial<Icustomer_payments>[] {
  return Array.isArray(value) && value.every(isPartialcustomer_payments);
}
