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
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "subscription_id":
      return true; // Complex type requiring deeper validation
    case "payment_provider_id":
      return true; // Complex type requiring deeper validation
    case "external_payment_id":
      return true; // Complex type requiring deeper validation
    case "external_order_id":
      return true; // Complex type requiring deeper validation
    case "amount":
      return true; // Complex type requiring deeper validation
    case "currency":
      return true; // Complex type requiring deeper validation
    case "status":
      return true; // Complex type requiring deeper validation
    case "method":
      return true; // Complex type requiring deeper validation
    case "description":
      return true; // Complex type requiring deeper validation
    case "fee":
      return true; // Complex type requiring deeper validation
    case "tax":
      return true; // Complex type requiring deeper validation
    case "error_code":
      return true; // Complex type requiring deeper validation
    case "error_description":
      return true; // Complex type requiring deeper validation
    case "acquirer_data":
      return true; // Complex type requiring deeper validation
    case "notes":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "order_id":
      return true; // Complex type requiring deeper validation
    case "invoice_id":
      return true; // Complex type requiring deeper validation
    case "international":
      return typeof value === "boolean";
    case "amount_refunded":
      return true; // Complex type requiring deeper validation
    case "amount_transferred":
      return true; // Complex type requiring deeper validation
    case "refund_status":
      return true; // Complex type requiring deeper validation
    case "captured":
      return typeof value === "boolean";
    case "bank":
      return true; // Complex type requiring deeper validation
    case "wallet":
      return true; // Complex type requiring deeper validation
    case "vpa":
      return true; // Complex type requiring deeper validation
    case "error_source":
      return true; // Complex type requiring deeper validation
    case "error_step":
      return true; // Complex type requiring deeper validation
    case "error_reason":
      return true; // Complex type requiring deeper validation
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
