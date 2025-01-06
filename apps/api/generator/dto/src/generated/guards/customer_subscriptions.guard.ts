
import { Icustomer_subscriptions } from './interfaces'
import { customer_subscriptionsSchema } from './schemas'

/**
 * Type guard for customer_subscriptions
 * Ensures that an unknown value matches the expected structure
 */
export function iscustomer_subscriptions(value: unknown): value is Icustomer_subscriptions {
  return customer_subscriptionsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcustomer_subscriptions(value: unknown): value is Partial<Icustomer_subscriptions> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","user_id","plan_id","payment_provider_id","external_subscription_id","status","quantity","current_start","current_end","ended_at","cancel_at_period_end","total_count","paid_count","remaining_count","auth_attempts","notes","created_at","updated_at","type","charge_at","start_at","end_at","customer_notify","expire_by","short_url","has_scheduled_changes","change_scheduled_at","source","offer_id","pause_initiated_by","cancel_initiated_by","customer_payments","payment_providers","customer_subscription_plans","user_profiles"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'id':
      return typeof value === "number" && !isNaN(value);
    case 'user_id':
      return typeof value === "string";
    case 'plan_id':
      return typeof value === "number" && !isNaN(value);
    case 'payment_provider_id':
      return typeof value === "number" && !isNaN(value);
    case 'external_subscription_id':
      return typeof value === "string";
    case 'status':
      return typeof value === "string";
    case 'quantity':
      return typeof value === "number" && !isNaN(value);
    case 'current_start':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'current_end':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'ended_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'cancel_at_period_end':
      return typeof value === "boolean";
    case 'total_count':
      return typeof value === "number" && !isNaN(value);
    case 'paid_count':
      return typeof value === "number" && !isNaN(value);
    case 'remaining_count':
      return typeof value === "number" && !isNaN(value);
    case 'auth_attempts':
      return typeof value === "number" && !isNaN(value);
    case 'notes':
      return true; // Complex type requiring deeper validation
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'type':
      return typeof value === "number" && !isNaN(value);
    case 'charge_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'start_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'end_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'customer_notify':
      return typeof value === "boolean";
    case 'expire_by':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'short_url':
      return typeof value === "string";
    case 'has_scheduled_changes':
      return typeof value === "boolean";
    case 'change_scheduled_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'source':
      return typeof value === "string";
    case 'offer_id':
      return typeof value === "string";
    case 'pause_initiated_by':
      return typeof value === "string";
    case 'cancel_initiated_by':
      return typeof value === "string";
    case 'customer_payments':
      return true; // Complex type requiring deeper validation
    case 'payment_providers':
      return true; // Complex type requiring deeper validation
    case 'customer_subscription_plans':
      return true; // Complex type requiring deeper validation
    case 'user_profiles':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of customer_subscriptions
 */
export function iscustomer_subscriptionsArray(value: unknown): value is Icustomer_subscriptions[] {
  return Array.isArray(value) && value.every(iscustomer_subscriptions)
}

/**
 * Type guard for partial arrays of customer_subscriptions
 */
export function isPartialcustomer_subscriptionsArray(value: unknown): value is Partial<Icustomer_subscriptions>[] {
  return Array.isArray(value) && value.every(isPartialcustomer_subscriptions)
}

