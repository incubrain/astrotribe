// utils/validation.helpers.ts

/**
 * Type guard for checking if a value is a Date
 */
export function isDate(value: unknown): boolean {
  if (value instanceof Date) return true
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }
  return false
}

/**
 * Type guard for checking if a value is not empty
 */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

/**
 * Type guard for checking if a value is a number
 */
export function isNumber(value: unknown): boolean {
  if (typeof value === 'number') return !isNaN(value)
  if (typeof value === 'string') {
    const num = parseFloat(value)
    return !isNaN(num)
  }
  return false
}

/**
 * Type guard for checking if a value is a string
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string'
}

/**
 * Type guard for checking if a value is a boolean
 */
export function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean'
}

/**
 * Validation function to check for UUID format
 */
export function isUUID(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

/**
 * Validation function to check for email format
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}
