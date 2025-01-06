// tools/generators/dto/types/postgresql.types.ts

/**
 * Type definitions for PostgreSQL-specific types.
 * These interfaces match the structure of PostgreSQL's native types.
 */

// Geometric Types
export interface Point {
  x: number
  y: number
}

export interface Line {
  a: number // Line equation: ax + by + c = 0
  b: number
  c: number
}

export interface LineSegment {
  start: Point
  end: Point
}

export interface Box {
  high: Point // Upper right corner
  low: Point // Lower left corner
}

export interface Path {
  points: Point[]
  closed: boolean
}

export interface Polygon {
  points: Point[]
}

export interface Circle {
  center: Point
  radius: number
}

// Network Types
export type InetAddress = string // With runtime validation
export type CidrAddress = string // With runtime validation
export type MacAddress = string // With runtime validation
export type MacAddress8 = string // With runtime validation

// Range Types
export interface Range<T> {
  lower: T | null // null means unbounded
  upper: T | null // null means unbounded
  lowerInclusive: boolean
  upperInclusive: boolean
}

// JSON Types with validation
export interface JsonField<T = unknown> {
  value: T
  isValid(): boolean
  toString(): string
}
