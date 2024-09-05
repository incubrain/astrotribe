function roundToNDecimalPlaces(value: number, n: number): number {
  return Number(value.toFixed(n))
}

function calculateMedian(arr: number[]): number {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function calculateStandardDeviation(valuesArray: number[]): number {
  const mean = valuesArray.reduce((a, b) => a + b) / valuesArray.length
  return Math.sqrt(
    valuesArray.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / valuesArray.length
  )
}

function calculateMean(arr: number[]): number {
  return arr.reduce((a, b) => a + b) / arr.length
}

function calculateVariance(arr: number[]): number {
  const mean = calculateMean(arr)
  return arr.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / arr.length
}

function calculateRange(arr: number[]): number {
  return Math.max(...arr) - Math.min(...arr)
}

function calculateSum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

function calculateMode(arr: number[]): number | number[] {
  const frequency: { [key: number]: number } = {}
  let maxFreq = 0
  let modes: number[] = []

  arr.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value]
      modes = [value]
    } else if (frequency[value] === maxFreq) {
      modes.push(value)
    }
  })

  return modes.length === 1 ? modes[0] : modes
}

function calculateMin(arr: number[]): number {
  return Math.min(...arr)
}

function calculateMax(arr: number[]): number {
  return Math.max(...arr)
}

function calculatePercentile(arr: number[], percentile: number): number {
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100')
  }
  const sorted = arr.slice().sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = lower + 1
  const weight = index % 1

  if (upper >= sorted.length) {
    return sorted[lower]
  }

  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

export function useBaseMetrics() {
  return {
    format: {
      roundToN: roundToNDecimalPlaces
    },
    calculate: {
      median: calculateMedian,
      standardDeviation: calculateStandardDeviation,
      mean: calculateMean,
      variance: calculateVariance,
      range: calculateRange,
      sum: calculateSum,
      mode: calculateMode,
      min: calculateMin,
      max: calculateMax,
      percentile: calculatePercentile
    }
  }
}
