import { USD2INR } from './helpers'

export interface AnalyticsResult {
  total: number
  events: {
    usage: number
    cost: number
  }
  recordings: {
    usage: number
    cost: number
  }
  featureRequests: {
    usage: number
    cost: number
  }
  surveyResponses: {
    usage: number
    cost: number
  }
}

function calculateTieredCost(quantity: number, tiers: { limit: number; price: number }[]) {
  let cost = 0
  let remainingQuantity = quantity

  for (const tier of tiers) {
    const applicableQuantity = Math.min(remainingQuantity, tier.limit)
    cost += applicableQuantity * tier.price
    remainingQuantity -= applicableQuantity
    if (remainingQuantity <= 0) break
  }

  return cost
}

const POSTHOG_ANALYTICS_TIERS = [
  { limit: 1000000, price: 0 },
  { limit: 1000000, price: 0.00005 },
  { limit: 13000000, price: 0.0000343 },
  { limit: 35000000, price: 0.0000295 },
  { limit: 50000000, price: 0.0000218 },
  { limit: 150000000, price: 0.000015 },
  { limit: Infinity, price: 0.000009 },
]

function calculateProductAnalyticsCost(events: number) {
  return calculateTieredCost(events, POSTHOG_ANALYTICS_TIERS)
}

const POSTHOG_REPLAY_TIERS = [
  { limit: 5000, price: 0 },
  { limit: 10000, price: 0.04 },
  { limit: 35000, price: 0.003 },
  { limit: 100000, price: 0.0027 },
  { limit: 350000, price: 0.0025 },
  { limit: Infinity, price: 0.002 },
]

function calculateSessionReplayCost(recordings: number) {
  return calculateTieredCost(recordings, POSTHOG_REPLAY_TIERS)
}

const POSTHOG_FEAT_FLAG_TIERS = [
  { limit: 1000000, price: 0 },
  { limit: 1000000, price: 0.0001 },
  { limit: 8000000, price: 0.000045 },
  { limit: 40000000, price: 0.000025 },
  { limit: Infinity, price: 0.00001 },
]

function calculateFeatureFlagsCost(requests: number) {
  return calculateTieredCost(requests, POSTHOG_FEAT_FLAG_TIERS)
}

const POSTHOG_SURVEY_TIERS = [
  { limit: 250, price: 0 },
  { limit: 250, price: 0.2 },
  { limit: 500, price: 0.1 },
  { limit: 9000, price: 0.035 },
  { limit: 10000, price: 0.015 },
  { limit: Infinity, price: 0.01 },
]

function calculateSurveysCost(responses: number) {
  return calculateTieredCost(responses, POSTHOG_SURVEY_TIERS)
}

export function calculateAnalyticsCost({
  MAU,
  month,
  avgMauUsage,
}: UsageEstimationParams): AnalyticsResult {
  const { events, recordings, featureRequests, surveyResponses } = estimateUsage({
    MAU,
    month,
    avgMauUsage,
  })

  const eventsCost = calculateProductAnalyticsCost(events)
  const recordingsCost = calculateSessionReplayCost(recordings)
  const featureRequestsCost = calculateFeatureFlagsCost(featureRequests)
  const surveysCost = calculateSurveysCost(surveyResponses)

  console.log(
    'Calculate Analytics Cost:',
    MAU,
    eventsCost,
    recordingsCost,
    featureRequestsCost,
    surveysCost,
  )

  const totalCost = eventsCost + recordingsCost + featureRequestsCost + surveysCost
  console.log(
    'Calculate Analytics Cost:',
    MAU,
    eventsCost,
    recordingsCost,
    featureRequestsCost,
    surveysCost,
    totalCost,
    USD2INR(totalCost),
  )

  return {
    total: USD2INR(totalCost),
    events: {
      cost: USD2INR(eventsCost),
      usage: events,
    },
    recordings: {
      cost: USD2INR(recordingsCost),
      usage: recordings,
    },
    featureRequests: {
      cost: USD2INR(featureRequestsCost),
      usage: featureRequests,
    },
    surveyResponses: {
      cost: USD2INR(surveysCost),
      usage: surveyResponses,
    },
  }
}

type UsageEstimationParams = {
  MAU: number
  month: number
  avgMauUsage: number
}

const FREE_TIER_MONTHS = 4

function estimateUsage({ MAU, month, avgMauUsage }: UsageEstimationParams): EstimatedUsage {
  const isFreeTier = month < FREE_TIER_MONTHS
  const scaleFactor = isFreeTier ? 0.1 : 1

  const events = Math.min(MAU * avgMauUsage * scaleFactor, 1000000 * (month + 1)) || 0
  const recordings = Math.min(MAU * 0.1 * scaleFactor, 5000 * (month + 1)) || 0
  const featureRequests = Math.min(MAU * 0.05 * scaleFactor, 100000 * (month + 1)) || 0
  const surveyResponses = Math.min(MAU * 0.08 * scaleFactor, 1000 * (month + 1)) || 0

  console.log('Estimate Usage:', MAU, events, recordings, featureRequests, surveyResponses)
  return {
    total: Math.round(events + recordings + featureRequests + surveyResponses),
    events: Math.round(events),
    recordings: Math.round(recordings),
    featureRequests: Math.round(featureRequests),
    surveyResponses: Math.round(surveyResponses),
  }
}

type EstimatedUsage = {
  total: number
  events: number
  recordings: number
  featureRequests: number
  surveyResponses: number
}
