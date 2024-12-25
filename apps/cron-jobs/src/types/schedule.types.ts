// types/schedule.types.ts
export type TimeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month'
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'

export interface ScheduleInterval {
  value: number
  unit: TimeUnit
}

export interface ScheduleConfig {
  type: 'interval' | 'daily' | 'weekly' | 'monthly' | 'custom'
  interval?: ScheduleInterval
  time?: string // HH:mm format
  dayOfWeek?: DayOfWeek
  dayOfMonth?: number | 'first' | 'last'
  customCron?: string
  enabled: boolean
}

