import { USD2INR, ROUND2 } from './helpers'
import { metricConfig } from './totals'

const DEVOPS = {
  HOURS_PER_MONTH: 730, // 24 hours * 30 days
  AWS_EC2_COST_PER_HOUR: 0.24, // $0.24 per hour per instance
  AWS_S3_COST_PER_GB: 0.021, // $0.021 per GB
  AWS_DATA_TRANSFER_COST_PER_GB: 0.07, // $0.07 per GB
  EKS_CLUSTER_COST_PER_HOUR: 0.2, // $0.20 per hour for EKS cluster
  PROMETHEUS_GRAFANA_COST_PER_MONTH: 7000, // $7,000 per month
  CLOUD_FLARE_COST_PER_GB: 0.015, // $0.015 per GB
}

function calculateEC2Cost(mau: number): number {
  const instancesNeeded = Math.ceil(mau / 5000) // More instances for redundancy
  return instancesNeeded * DEVOPS.AWS_EC2_COST_PER_HOUR * DEVOPS.HOURS_PER_MONTH
}

function calculateS3Cost(storageGB: number): number {
  return storageGB * DEVOPS.AWS_S3_COST_PER_GB
}

function calculateDataTransferCost(dataTransferGB: number): number {
  return dataTransferGB * DEVOPS.AWS_DATA_TRANSFER_COST_PER_GB
}

function calculateEKSCost(mau: number): number {
  const clustersNeeded = Math.ceil(mau / 25000) // More clusters for redundancy
  return clustersNeeded * DEVOPS.EKS_CLUSTER_COST_PER_HOUR * DEVOPS.HOURS_PER_MONTH
}

function calculateCloudflareCDNCost(dataTransferGB: number): number {
  return dataTransferGB * DEVOPS.CLOUD_FLARE_COST_PER_GB
}

interface DevopsInhouseResult {
  total: number
  efficiencyFactor: number
  ec2Cost: number
  s3Cost: number
  dataTransferCost: number
  eksCost: number
  prometheusGrafanaCost: number
  cloudflareCost: number
}

function calculateInHouseCosts(
  mau: number,
  storageGB: number,
  dataTransferGB: number,
): DevopsInhouseResult {
  const efficiencyFactor = calculateEfficiencyFactor(mau)

  const ec2Cost = calculateEC2Cost(mau)
  const s3Cost = calculateS3Cost(storageGB)
  const dataTransferCost = calculateDataTransferCost(dataTransferGB)
  const eksCost = calculateEKSCost(mau)
  const prometheusGrafanaCost = DEVOPS.PROMETHEUS_GRAFANA_COST_PER_MONTH
  const cloudflareCost = calculateCloudflareCDNCost(dataTransferGB)

  const total
    = ec2Cost
    + s3Cost
    + dataTransferCost
    + eksCost
    + prometheusGrafanaCost
    + cloudflareCost * efficiencyFactor

  return {
    total: USD2INR(total),
    efficiencyFactor: ROUND2(efficiencyFactor),
    ec2Cost: USD2INR(ec2Cost * efficiencyFactor),
    s3Cost: USD2INR(s3Cost * efficiencyFactor),
    dataTransferCost: USD2INR(dataTransferCost * efficiencyFactor),
    eksCost: USD2INR(eksCost * efficiencyFactor),
    prometheusGrafanaCost: USD2INR(prometheusGrafanaCost * efficiencyFactor),
    cloudflareCost: USD2INR(cloudflareCost * efficiencyFactor),
  }
}

// extract to main file
function calculateUsageByMAU(mau: number) {
  const avgUserMonthlyHours = calculateDailyUsagePerUser(mau) // Use the previously defined function
  const dataTransferGB = usageByHour.dataTransferGB * avgUserMonthlyHours * mau
  const storageGB = 0.1 * mau // Assume 100 MB per user
  return { avgUserMonthlyHours, dataTransferGB, storageGB }
}

// Last Updated 6th July 2024
export const vercelConfig = {
  basePrice: 20,
  dataTransfer: {
    includedGB: 1000, // 1 TB
    pricePerGB: 0.15,
  },
  originTransfer: {
    includedGB: 100,
    pricePerGB: 0.06,
  },
  edgeRequests: {
    includedRequests: 10_000_000,
    pricePerMillion: 2,
  },
  middlewareInvocations: {
    includedInvocations: 1_000_000,
    pricePerMillion: 0.65,
  },
  sourceImages: {
    includedImages: 5000,
    pricePerThousand: 5,
  },
  functionInvocations: {
    includedInvocations: 1_000_000,
    pricePerMillion: 0.6,
  },
  functionDuration: {
    includedGBHours: 1000,
    pricePerGBHour: 0.18,
  },
  edgeFunctionExecutions: {
    includedExecutions: 1_000_000,
    pricePerMillion: 2,
  },
  dataCacheReads: {
    includedReads: 10_000_000,
    pricePerMillion: 0.4,
  },
  dataCacheWrites: {
    includedWrites: 2_000_000,
    pricePerMillion: 4,
  },
  edgeConfigReads: {
    includedReads: 1_000_000,
    pricePerMillion: 3,
  },
  edgeConfigWrites: {
    includedWrites: 1000,
    pricePer500Writes: 5,
  },
  monitoring: {
    baseFee: 10,
    pricePerMillionEvents: 9,
  },
  speedInsights: {
    includedDataPoints: 10_000,
    pricePer10kEvents: 0.65,
  },
  webAnalytics: {
    includedEvents: 25_000,
    pricePer100kEvents: 14,
  },
}

/**
 * Calculate the cost for serverless function executions.
 *
 * @param {number} memoryInMB - The memory allocated to the function in MB.
 * @param {number} invocations - Number of times the function is invoked.
 * @param {number} durationInSeconds - Duration of each invocation in seconds.
 * @param {number} pricePerGBHour - Cost per GB-hour as specified by the provider.
 * @returns {number} - The cost of executions in USD.
 */
function calculateFunctionCost(
  memoryInMB: number,
  invocations: number,
  durationInSeconds: number,
  pricePerGBHour: number,
): number {
  // Convert memory from MB to GB
  const memoryInGB = memoryInMB / 1024

  // Calculate total seconds of execution
  const totalSeconds = invocations * durationInSeconds

  // Convert total execution time to GB-seconds
  const totalGBSeconds = memoryInGB * totalSeconds

  // Convert GB-seconds to GB-hours
  const totalGBHours = totalGBSeconds / 3600

  // Calculate the cost
  const cost = totalGBHours * pricePerGBHour

  return cost
}

const usageByHour = {
  dataTransferGB: 0.015, // 15 MB per hour per user
  originTransferGB: 0.001, // 1 MB per hour per user
  edgeRequests: 150, // 150 requests per hour per user
  middlewareInvocations: 75, // 75 middleware invocations per hour per user
  sourceImages: 0, // Assume no usage, handled by supabase
  functionInvocations: 75, // 75 function invocations per hour per user
  functionDurationGBHours: 0.025596, // Assuming 360 calls/hour of a 256MB Ram Function (1 every 10 seconds per user)
  edgeFunctionExecutions: 75, // 75 edge function executions per hour per user
  dataCacheReads: 800, // Adjusted to 800 data cache reads per hour per user
  dataCacheWrites: 75, // 75 data cache writes per hour per user
  edgeConfigReads: 50, // Adjusted to 50 edge config reads per hour per user
  edgeConfigWrites: 0.1, // Adjusted to 0.1 edge config writes per hour per user
  monitoringEvents: 0, // Use posthog instead
  speedInsightsDataPoints: 0, // Not using
  webAnalyticsEvents: 0, // Not using
}

type VercelUsageParams = {
  efficiencyFactor: number
  avgUserMonthlyHours: number
  dataTransferGB: number
  originTransferGB: number
  edgeRequests: number
  middlewareInvocations: number
  sourceImages: number
  functionInvocations: number
  functionDurationGBHours: number
  edgeFunctionExecutions: number
  dataCacheReads: number
  dataCacheWrites: number
  edgeConfigReads: number
  edgeConfigWrites: number
  monitoringEvents: number
  speedInsightsDataPoints: number
  webAnalyticsEvents: number
}

interface VercelResult {
  total: number
  efficiencyFactor: number
  avgUserMonthlyHours: number
  breakdown: {
    base: number
    dataTransfer: number
    originTransfer: number
    edgeRequests: number
    middlewareInvocations: number
    sourceImages: number
    functionInvocations: number
    functionDuration: number
    edgeFunctionExecutions: number
    dataCacheReads: number
    dataCacheWrites: number
    edgeConfigReads: number
    edgeConfigWrites: number
    monitoring: number
    speedInsights: number
    webAnalytics: number
  }
}

function calculateEfficiencyFactor(mau: number) {
  const baseMAU = 1000
  const logBase10 = Math.log(10)
  const efficiencyLog = Math.log(mau / baseMAU) / logBase10
  const efficiencyFactor = 1 - 0.1 * efficiencyLog // Adjust 0.1 to fine-tune efficiency improvement

  return efficiencyFactor
}

function calculateDailyUsagePerUser(mau: number) {
  const additionalHours = (mau / 5000) * metricConfig.PROJECTION.USAGE_GROWTH_FACTOR
  const dailyUsage = metricConfig.PROJECTION.USAGE_HOURS_PER_DAY + additionalHours
  return Math.min(dailyUsage, metricConfig.PROJECTION.MAX_DAILY_USAGE) * 30
}

function calculateVercelUsage(mau: number): VercelUsageParams {
  const efficiencyFactor = calculateEfficiencyFactor(mau)
  const avgUserMonthlyHours = calculateDailyUsagePerUser(mau)

  const calcTotal = (usage: number) => usage * avgUserMonthlyHours * mau * efficiencyFactor

  const invocationsPerMonthPerUser = (0.08 * avgUserMonthlyHours * 3600) / (0.256 * 1)
  console.log(
    `Estimated Function Invocations per Month per User: ${invocationsPerMonthPerUser} in Hours: ${avgUserMonthlyHours}`,
  )

  return {
    efficiencyFactor: ROUND2(efficiencyFactor),
    avgUserMonthlyHours,
    dataTransferGB: calcTotal(usageByHour.dataTransferGB),
    originTransferGB: calcTotal(usageByHour.originTransferGB),
    edgeRequests: calcTotal(usageByHour.edgeRequests),
    middlewareInvocations: calcTotal(usageByHour.middlewareInvocations),
    sourceImages: calcTotal(usageByHour.sourceImages),
    functionInvocations: calcTotal(usageByHour.functionInvocations),
    functionDurationGBHours: calcTotal(usageByHour.functionDurationGBHours),
    edgeFunctionExecutions: calcTotal(usageByHour.edgeFunctionExecutions),
    dataCacheReads: calcTotal(usageByHour.dataCacheReads),
    dataCacheWrites: calcTotal(usageByHour.dataCacheWrites),
    edgeConfigReads: calcTotal(usageByHour.edgeConfigReads),
    edgeConfigWrites: calcTotal(usageByHour.edgeConfigWrites),
    monitoringEvents: calcTotal(usageByHour.monitoringEvents),
    speedInsightsDataPoints: calcTotal(usageByHour.speedInsightsDataPoints),
    webAnalyticsEvents: calcTotal(usageByHour.webAnalyticsEvents),
  }
}

function calculateVercelCost(params: VercelUsageParams): VercelResult {
  const {
    efficiencyFactor,
    avgUserMonthlyHours,
    dataTransferGB,
    originTransferGB,
    edgeRequests,
    middlewareInvocations,
    sourceImages,
    functionInvocations,
    functionDurationGBHours,
    edgeFunctionExecutions,
    dataCacheReads,
    dataCacheWrites,
    edgeConfigReads,
    edgeConfigWrites,
    monitoringEvents,
    speedInsightsDataPoints,
    webAnalyticsEvents,
  } = params

  const {
    basePrice,
    dataTransfer,
    originTransfer,
    edgeRequests: edgeReq,
    middlewareInvocations: midInvocations,
    sourceImages: srcImages,
    functionInvocations: funcInvocations,
    functionDuration: funcDuration,
    edgeFunctionExecutions: edgeExec,
    dataCacheReads: cacheReads,
    dataCacheWrites: cacheWrites,
    edgeConfigReads: configReads,
    edgeConfigWrites: configWrites,
    monitoring,
    speedInsights,
    webAnalytics,
  } = vercelConfig

  const dataTransferCost
    = dataTransferGB > dataTransfer.includedGB
      ? (dataTransferGB - dataTransfer.includedGB) * dataTransfer.pricePerGB
      : 0

  const originTransferCost
    = originTransferGB > originTransfer.includedGB
      ? (originTransferGB - originTransfer.includedGB) * originTransfer.pricePerGB
      : 0

  const edgeRequestsCost
    = edgeRequests > edgeReq.includedRequests
      ? ((edgeRequests - edgeReq.includedRequests) / 1_000_000) * edgeReq.pricePerMillion
      : 0

  const middlewareInvocationsCost
    = middlewareInvocations > midInvocations.includedInvocations
      ? ((middlewareInvocations - midInvocations.includedInvocations) / 1_000_000)
      * midInvocations.pricePerMillion
      : 0

  const sourceImagesCost
    = sourceImages > srcImages.includedImages
      ? ((sourceImages - srcImages.includedImages) / 1_000) * srcImages.pricePerThousand
      : 0

  const functionInvocationsCost
    = functionInvocations > funcInvocations.includedInvocations
      ? ((functionInvocations - funcInvocations.includedInvocations) / 1_000_000)
      * funcInvocations.pricePerMillion
      : 0

  const functionDurationCost
    = functionDurationGBHours > funcDuration.includedGBHours
      ? (functionDurationGBHours - funcDuration.includedGBHours) * funcDuration.pricePerGBHour
      : 0

  const edgeFunctionExecutionsCost
    = edgeFunctionExecutions > edgeExec.includedExecutions
      ? ((edgeFunctionExecutions - edgeExec.includedExecutions) / 1_000_000)
      * edgeExec.pricePerMillion
      : 0

  const dataCacheReadsCost
    = dataCacheReads > cacheReads.includedReads
      ? ((dataCacheReads - cacheReads.includedReads) / 1_000_000) * cacheReads.pricePerMillion
      : 0

  const dataCacheWritesCost
    = dataCacheWrites > cacheWrites.includedWrites
      ? ((dataCacheWrites - cacheWrites.includedWrites) / 1_000_000) * cacheWrites.pricePerMillion
      : 0

  const edgeConfigReadsCost
    = edgeConfigReads > configReads.includedReads
      ? ((edgeConfigReads - configReads.includedReads) / 1_000_000) * configReads.pricePerMillion
      : 0

  const edgeConfigWritesCost
    = edgeConfigWrites > configWrites.includedWrites
      ? ((edgeConfigWrites - configWrites.includedWrites) / 500) * configWrites.pricePer500Writes
      : 0

  const monitoringCost
    = monitoringEvents > 0
      ? monitoring.baseFee + (monitoringEvents / 1_000_000) * monitoring.pricePerMillionEvents
      : 0

  const speedInsightsCost
    = speedInsightsDataPoints > speedInsights.includedDataPoints
      ? ((speedInsightsDataPoints - speedInsights.includedDataPoints) / 10_000)
      * speedInsights.pricePer10kEvents
      : 0

  const webAnalyticsCost
    = webAnalyticsEvents > webAnalytics.includedEvents
      ? ((webAnalyticsEvents - webAnalytics.includedEvents) / 100_000)
      * webAnalytics.pricePer100kEvents
      : 0

  const totalCost
    = basePrice
    + dataTransferCost
    + originTransferCost
    + edgeRequestsCost
    + middlewareInvocationsCost
    + sourceImagesCost
    + functionInvocationsCost
    + functionDurationCost
    + edgeFunctionExecutionsCost
    + dataCacheReadsCost
    + dataCacheWritesCost
    + edgeConfigReadsCost
    + edgeConfigWritesCost
    + monitoringCost
    + speedInsightsCost
    + webAnalyticsCost

  return {
    total: USD2INR(totalCost),
    efficiencyFactor,
    avgUserMonthlyHours,
    breakdown: {
      base: USD2INR(basePrice),
      dataTransfer: USD2INR(dataTransferCost),
      originTransfer: USD2INR(originTransferCost),
      edgeRequests: USD2INR(edgeRequestsCost),
      middlewareInvocations: USD2INR(middlewareInvocationsCost),
      sourceImages: USD2INR(sourceImagesCost),
      functionInvocations: USD2INR(functionInvocationsCost),
      functionDuration: USD2INR(functionDurationCost),
      edgeFunctionExecutions: USD2INR(edgeFunctionExecutionsCost),
      dataCacheReads: USD2INR(dataCacheReadsCost),
      dataCacheWrites: USD2INR(dataCacheWritesCost),
      edgeConfigReads: USD2INR(edgeConfigReadsCost),
      edgeConfigWrites: USD2INR(edgeConfigWritesCost),
      monitoring: USD2INR(monitoringCost),
      speedInsights: USD2INR(speedInsightsCost),
      webAnalytics: USD2INR(webAnalyticsCost),
    },
  }
}

export interface DevopsResult {
  vercel: {
    cost: VercelResult
    usage: VercelUsageParams
  }
  inhouse: {
    cost: DevopsInhouseResult
    usage: {
      dataTransferGB: number
      storageGB: number
    }
  }
}

export function calculateDevopsCosts(mau: number): DevopsResult {
  const { dataTransferGB, storageGB } = calculateUsageByMAU(mau)
  const vercelUsage = calculateVercelUsage(mau)
  return {
    vercel: {
      cost: calculateVercelCost(vercelUsage),
      usage: vercelUsage,
    },
    inhouse: {
      cost: calculateInHouseCosts(mau, storageGB, dataTransferGB),
      usage: { dataTransferGB, storageGB },
    },
  }
}

type Summary = {
  name: string
  value: number | string
}

export interface DevOpsSummaries {
  vercel: Summary[]
  vercelPricing: Summary[]
  inhouse: Summary[]
}

export function generateDevOpsSummaries() {
  const configSummaries = {
    vercel: [] as Summary[],
    vercelPricing: [] as Summary[],
    inhouse: [] as Summary[],
  }

  const addConfigSummary = (config: any, group: 'vercel' | 'vercelPricing' | 'inhouse') => {
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'object' && value !== null) {
        configSummaries[group].push({ name: key, value: JSON.stringify(value) })
      } else {
        configSummaries[group].push({ name: key, value: Number(value) })
      }
    }
  }

  addConfigSummary(vercelConfig, 'vercelPricing')
  addConfigSummary(usageByHour, 'vercel')

  const {
    AWS_DATA_TRANSFER_COST_PER_GB,
    AWS_EC2_COST_PER_HOUR,
    AWS_S3_COST_PER_GB,
    CLOUD_FLARE_COST_PER_GB,
    EKS_CLUSTER_COST_PER_HOUR,
    HOURS_PER_MONTH,
    PROMETHEUS_GRAFANA_COST_PER_MONTH,
  } = DEVOPS

  addConfigSummary(
    {
      HOURS_PER_MONTH,
      AWS_EC2_COST_PER_HOUR,
      AWS_S3_COST_PER_GB,
      AWS_DATA_TRANSFER_COST_PER_GB,
      EKS_CLUSTER_COST_PER_HOUR,
      PROMETHEUS_GRAFANA_COST_PER_MONTH,
      CLOUD_FLARE_COST_PER_GB,
    },
    'inhouse',
  )

  return configSummaries
}
