
import { Iusers } from './interfaces'
import { usersSchema } from './schemas'

/**
 * Type guard for users
 * Ensures that an unknown value matches the expected structure
 */
export function isusers(value: unknown): value is Iusers {
  return usersSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialusers(value: unknown): value is Partial<Iusers> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["instance_id","id","aud","role","email","encrypted_password","email_confirmed_at","invited_at","confirmation_token","confirmation_sent_at","recovery_token","recovery_sent_at","email_change_token_new","email_change","email_change_sent_at","last_sign_in_at","raw_app_meta_data","raw_user_meta_data","is_super_admin","created_at","updated_at","phone","phone_confirmed_at","phone_change","phone_change_token","phone_change_sent_at","confirmed_at","email_change_token_current","email_change_confirm_status","banned_until","reauthentication_token","reauthentication_sent_at","is_sso_user","deleted_at","is_anonymous","identities","mfa_factors","one_time_tokens","sessions","bookmark_folders","bookmarks","user_profiles","votes"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'instance_id':
      return typeof value === "string";
    case 'id':
      return typeof value === "string";
    case 'aud':
      return typeof value === "string";
    case 'role':
      return typeof value === "string";
    case 'email':
      return typeof value === "string";
    case 'encrypted_password':
      return typeof value === "string";
    case 'email_confirmed_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'invited_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'confirmation_token':
      return typeof value === "string";
    case 'confirmation_sent_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'recovery_token':
      return typeof value === "string";
    case 'recovery_sent_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'email_change_token_new':
      return typeof value === "string";
    case 'email_change':
      return typeof value === "string";
    case 'email_change_sent_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'last_sign_in_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'raw_app_meta_data':
      return true; // Complex type requiring deeper validation
    case 'raw_user_meta_data':
      return true; // Complex type requiring deeper validation
    case 'is_super_admin':
      return typeof value === "boolean";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'phone':
      return typeof value === "string";
    case 'phone_confirmed_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'phone_change':
      return typeof value === "string";
    case 'phone_change_token':
      return typeof value === "string";
    case 'phone_change_sent_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'confirmed_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'email_change_token_current':
      return typeof value === "string";
    case 'email_change_confirm_status':
      return typeof value === "number" && !isNaN(value);
    case 'banned_until':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'reauthentication_token':
      return typeof value === "string";
    case 'reauthentication_sent_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'is_sso_user':
      return typeof value === "boolean";
    case 'deleted_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'is_anonymous':
      return typeof value === "boolean";
    case 'identities':
      return true; // Complex type requiring deeper validation
    case 'mfa_factors':
      return true; // Complex type requiring deeper validation
    case 'one_time_tokens':
      return true; // Complex type requiring deeper validation
    case 'sessions':
      return true; // Complex type requiring deeper validation
    case 'bookmark_folders':
      return true; // Complex type requiring deeper validation
    case 'bookmarks':
      return true; // Complex type requiring deeper validation
    case 'user_profiles':
      return true; // Complex type requiring deeper validation
    case 'votes':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of users
 */
export function isusersArray(value: unknown): value is Iusers[] {
  return Array.isArray(value) && value.every(isusers)
}

/**
 * Type guard for partial arrays of users
 */
export function isPartialusersArray(value: unknown): value is Partial<Iusers>[] {
  return Array.isArray(value) && value.every(isPartialusers)
}

