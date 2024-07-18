const CHAR_CHUNK_SIZE = 1024
const AVG_CHAR_PER_WORD = 4.7

export function USD2INR(usd: number, USD_TO_INR: number = 75.0) {
  return parseFloat((usd * USD_TO_INR).toFixed(2))
}

export function ROUND0(value: number) {
  return parseInt(value.toFixed(0))
}

export function ROUND2(value: number) {
  return parseFloat(value.toFixed(2))
}
export const CONTENT_TO_CHUNKS = (words: number) =>
  Math.ceil((words * AVG_CHAR_PER_WORD) / CHAR_CHUNK_SIZE)

interface RefundEfficiencyParams {
  currentMonth: number
  pessimistic: number
  optimistic: number
}

export function EFFICIENCY_FACTOR({
  currentMonth,
  pessimistic,
  optimistic
}: RefundEfficiencyParams): number {
  const midpoint = 6 // Midpoint of 12 months for gradual change
  const steepness = 0.1 // Steepness of the curve
  const factor = 1 / (1 + Math.exp(-steepness * (currentMonth - midpoint))) // S-curve scaling
  return pessimistic - factor * (pessimistic - optimistic)
}

export function CHURN_TO_LIFESPAN_MONTHS(monthlyChurnRate: number): number {
  const averageLifespanMonths = 1 / monthlyChurnRate
  return averageLifespanMonths
}