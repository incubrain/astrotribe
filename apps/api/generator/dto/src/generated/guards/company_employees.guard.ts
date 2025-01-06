import { Icompany_employees } from "./interfaces";
import { company_employeesSchema } from "./schemas";

/**
 * Type guard for company_employees
 * Ensures that an unknown value matches the expected structure
 */
export function iscompany_employees(
  value: unknown,
): value is Icompany_employees {
  return company_employeesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcompany_employees(
  value: unknown,
): value is Partial<Icompany_employees> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "role",
    "job_description",
    "start_date",
    "end_date",
    "status",
    "access_level",
    "created_at",
    "updated_at",
    "company_id",
    "user_id",
    "id",
    "user_profiles",
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
    case "role":
      return typeof value === "string";
    case "job_description":
      return typeof value === "string";
    case "start_date":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "end_date":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "status":
      return typeof value === "boolean";
    case "access_level":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "company_id":
      return typeof value === "string";
    case "user_id":
      return typeof value === "string";
    case "id":
      return typeof value === "string";
    case "user_profiles":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of company_employees
 */
export function iscompany_employeesArray(
  value: unknown,
): value is Icompany_employees[] {
  return Array.isArray(value) && value.every(iscompany_employees);
}

/**
 * Type guard for partial arrays of company_employees
 */
export function isPartialcompany_employeesArray(
  value: unknown,
): value is Partial<Icompany_employees>[] {
  return Array.isArray(value) && value.every(isPartialcompany_employees);
}
