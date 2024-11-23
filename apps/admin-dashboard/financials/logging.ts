import { USD2INR } from './helpers'

// Updated configuration to include metrics and analytics pricing
export const LOGS_CONFIG = {
  includedGB: 50,
  additionalGBPrice: 0.45,
  retentionIncludedDays: 30,
  retentionPricePerGBPerMonth: 0.1,
  minimumCharge: 34,
}

export const LOGS_METRIC_CONFIG = {
  includedDataPoints: 10_000_000,
  additionalDataPointsPrice: 10, // Price per additional 10M data points
}

export const LOGS_ANALYTICS_CONFIG = {
  pricePerMember: 5, // Price per member per month
}

type LogsCostParams = {
  MAU: number
  month: number
  avgMauUsage: number
  teamMembers: number
}

export interface LoggingResult {
  total: number
  ingested: number
  retention: number
  metrics: number
  analytics: number
}

type UsageParams = {
  MAU: number
  month: number
  avgMauUsage: number
  teamMembers: number
  ingestedGB: number
  additionalIngestedGB: number
  retentionGB: number
  metricsIngestedDataPoints: number
  additionalMetricsDataPoints: number
}

function estimateUsage(params: LogsCostParams): UsageParams {
  const { MAU, month, avgMauUsage, teamMembers } = params

  const ingestedGB = MAU * avgMauUsage
  const additionalIngestedGB =
    ingestedGB > LOGS_CONFIG.includedGB ? ingestedGB - LOGS_CONFIG.includedGB : 0

  const retentionGB = ingestedGB * (month > 6 ? 1 : 0) // Retention is applied only after the first 6 months

  const metricsIngestedDataPoints = MAU * 300 // Assuming 300 data points per MAU, 30 per day
  const additionalMetricsDataPoints =
    metricsIngestedDataPoints > LOGS_METRIC_CONFIG.includedDataPoints ?
      metricsIngestedDataPoints - LOGS_METRIC_CONFIG.includedDataPoints :
      0

  return {
    MAU,
    month,
    avgMauUsage,
    teamMembers,
    ingestedGB,
    additionalIngestedGB,
    retentionGB,
    metricsIngestedDataPoints,
    additionalMetricsDataPoints,
  }
}

export function calculateLogsCost(params: LogsCostParams): LoggingResult {
  const usage = estimateUsage(params)

  const {
    month,
    ingestedGB,
    additionalIngestedGB,
    retentionGB,
    metricsIngestedDataPoints,
    additionalMetricsDataPoints,
    teamMembers,
  } = usage

  if (month <= 6) {
    // Free tier conditions
    const freeIncludedGB = 3
    const freeRetentionDays = 3
    const retentionCost = 0
    const metricsCost = 0
    const analyticsCost = 0

    const additionalIngestedGB = ingestedGB > freeIncludedGB ? ingestedGB - freeIncludedGB : 0
    const ingestedCost = 0 // Free tier so ingested cost is $0

    return {
      total: USD2INR(0), // Free tier so total cost is $0
      ingested: USD2INR(ingestedCost),
      retention: USD2INR(retentionCost),
      metrics: USD2INR(metricsCost),
      analytics: USD2INR(analyticsCost),
    }
  } else {
    const { includedGB, additionalGBPrice, retentionPricePerGBPerMonth, minimumCharge } =
      LOGS_CONFIG

    // Calculate ingested cost
    const ingestedCost = additionalIngestedGB * additionalGBPrice

    // Calculate retention cost
    const retentionCost = retentionGB * retentionPricePerGBPerMonth

    // Calculate metrics cost
    const metricsCost =
      (additionalMetricsDataPoints / 10_000_000) * LOGS_METRIC_CONFIG.additionalDataPointsPrice

    // Calculate analytics cost
    const analyticsCost = teamMembers * LOGS_ANALYTICS_CONFIG.pricePerMember

    // Calculate total cost
    const totalCost = ingestedCost + retentionCost + metricsCost + analyticsCost

    // Ensure the cost is not below the minimum charge
    const costMinusMinimum = totalCost > minimumCharge ? totalCost : minimumCharge

    return {
      total: USD2INR(costMinusMinimum),
      ingested: USD2INR(ingestedCost),
      retention: USD2INR(retentionCost),
      metrics: USD2INR(metricsCost),
      analytics: USD2INR(analyticsCost),
    }
  }
}
