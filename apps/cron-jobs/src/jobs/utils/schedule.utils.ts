import { DayOfWeek, ScheduleConfig, ScheduleInterval, TimeUnit } from '../../types'

// utils/schedule.utils.ts
export class ScheduleParser {
  private static readonly timeUnitMap: Record<TimeUnit, number> = {
    minute: 1,
    hour: 60,
    day: 60 * 24,
    week: 60 * 24 * 7,
    month: 60 * 24 * 30,
  }

  private static readonly daysOfWeek: Record<DayOfWeek, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }

  static toCron(schedule: ScheduleConfig): string | false {
    if (!schedule.enabled) return false

    switch (schedule.type) {
      case 'interval':
        return this.intervalToCron(schedule.interval!)
      case 'daily':
        return this.dailyToCron(schedule.time!)
      case 'weekly':
        return this.weeklyToCron(schedule.dayOfWeek!, schedule.time!)
      case 'monthly':
        return this.monthlyToCron(schedule.dayOfMonth!, schedule.time!)
      case 'custom':
        return schedule.customCron!
      default:
        throw new Error(`Unsupported schedule type: ${schedule.type}`)
    }
  }

  private static intervalToCron({ value, unit }: ScheduleInterval): string {
    switch (unit) {
      case 'minute':
        return `*/${value} * * * *`
      case 'hour':
        return `0 */${value} * * *`
      case 'day':
        return `0 0 */${value} * *`
      case 'week':
        return `0 0 * * */${value}`
      case 'month':
        return `0 0 1 */${value} *`
      default:
        throw new Error(`Invalid interval unit: ${unit}`)
    }
  }

  private static dailyToCron(time: string): string {
    const [hours, minutes] = time.split(':')
    return `${minutes} ${hours} * * *`
  }

  private static weeklyToCron(day: DayOfWeek, time: string): string {
    const [hours, minutes] = time.split(':')
    return `${minutes} ${hours} * * ${this.daysOfWeek[day]}`
  }

  private static monthlyToCron(day: number | 'first' | 'last', time: string): string {
    const [hours, minutes] = time.split(':')
    const dayStr = day === 'last' ? 'L' : day === 'first' ? '1' : day
    return `${minutes} ${hours} ${dayStr} * *`
  }
}
