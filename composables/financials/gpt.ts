// import { storageConfig } from './supabase-cost';
import { request } from 'http'
import type { ProcessdContentConfig, StageConfig } from './totals'
import { USD2INR } from './helpers'

type EmbeddingModel = 'text-embedding-3-small' | 'text-embedding-3-large'

type ChatModel = 'gpt-4o' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo-instruct'

const PERCENTAGE_MAU_USING_CHAT = 0.5 // 50%
const AVG_FREE_REQUESTS_PER_USER = 50
const PRO_REQUESTS_CAP = 150
const EXPERT_REQUESTS_CAP = 300

interface CostConfig {
  embedding: Record<EmbeddingModel, Record<'live' | 'batch', number>>
  chat: Record<ChatModel, Record<'live' | 'batch', { input: number; output: number }>>
}

// groq for free
interface GroqModelConfig {
  id: string
  requestsPerMinute: number
  requestsPerDay: number
  tokensPerMinute: number
}

const GROQ_MODELS: Record<string, GroqModelConfig> = {
  gemma7b: {
    id: 'gemma-7b-it',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 15000
  },
  gemma29b: {
    id: 'gemma2-9b-it',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 15000
  },
  llama70b: {
    id: 'llama3-70b-8192',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 6000
  },
  llama8b: {
    id: 'llama3-8b-8192',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 30000
  },
  llama70bPreview: {
    id: 'llama3-groq-70b-8192-tool-use-preview',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 15000
  },
  llama8bPreview: {
    id: 'llama3-groq-8b-8192-tool-use-preview',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 15000
  },
  mixtral8x7b: {
    id: 'mixtral-8x7b-32768',
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 5000
  }
}

const FREE_MODEL = GROQ_MODELS.llama70b

function calculateHourlyRate(
  numItems: number,
  totalTokens: number
): { requestsPerHour: number[]; tokensPerHour: number[] } {
  const daysInMonth = 30.5
  const hoursPerDay = 24
  const quarters = [
    { hours: 6, distribution: 0.1 }, // First 6 hours: 10% of traffic
    { hours: 6, distribution: 0.2 }, // Next 6 hours: 20% of traffic
    { hours: 6, distribution: 0.3 }, // Next 6 hours: 30% of traffic
    { hours: 6, distribution: 0.4 } // Last 6 hours: 40% of traffic
  ]

  const requestsPerHour = new Array(hoursPerDay).fill(0)
  const tokensPerHour = new Array(hoursPerDay).fill(0)
  let currentHour = 0

  quarters.forEach((quarter) => {
    const requestsThisQuarter = (numItems / daysInMonth) * quarter.distribution // Requests for this quarter per day
    const tokensThisQuarter = (totalTokens / daysInMonth) * quarter.distribution // Tokens for this quarter per day
    const requestsPerHourThisQuarter = requestsThisQuarter / quarter.hours // Average per hour in this quarter
    const tokensPerHourThisQuarter = tokensThisQuarter / quarter.hours // Average per hour in this quarter

    for (let i = 0; i < quarter.hours; i++) {
      requestsPerHour[currentHour] = requestsPerHourThisQuarter
      tokensPerHour[currentHour] = tokensPerHourThisQuarter
      currentHour++
    }
  })

  return {
    requestsPerHour: requestsPerHour,
    tokensPerHour: tokensPerHour
  }
}

function determineGroqModel(
  hourlyRates: { requestsPerHour: number[]; tokensPerHour: number[] },
  currentModel: GroqModelConfig = GROQ_MODELS.llama70b
): GroqModelConfig {
  const models = Object.values(GROQ_MODELS) // Convert model object to array for easier processing

  // Find the peak rates for the entire day
  const peakRequestsPerHour = Math.max(...hourlyRates.requestsPerHour)
  const peakTokensPerHour = Math.max(...hourlyRates.tokensPerHour)

  console.log(
    'Peak hourly requests:',
    peakRequestsPerHour,
    'Peak hourly tokens:',
    peakTokensPerHour
  )
  // Find a model that can handle the peak hourly request and token rates
  const suitableModel = models.find(
    (model) =>
      model.requestsPerMinute * 60 >= peakRequestsPerHour &&
      model.tokensPerMinute * 60 >= peakTokensPerHour
  )

  return suitableModel || currentModel // Return the found model or default back to the current if none found
}

// END FREE

export const COST_CONFIG: CostConfig = {
  embedding: {
    'text-embedding-3-small': {
      live: 0.02,
      batch: 0.01
    },
    'text-embedding-3-large': {
      live: 0.13,
      batch: 0.07
    }
  },
  chat: {
    'gpt-4o': {
      live: {
        input: 5.0,
        output: 15.0
      },
      batch: {
        input: 2.5,
        output: 7.5
      }
    },
    'gpt-3.5-turbo-0125': {
      live: {
        input: 0.5,
        output: 1.5
      },
      batch: {
        input: 0.25,
        output: 0.75
      }
    },
    'gpt-3.5-turbo-instruct': {
      live: {
        input: 1.5,
        output: 2.0
      },
      batch: {
        input: 0.75,
        output: 1.0
      }
    }
  }
}

type CostParams = {
  numItems: number
  charsPerItem: number
  charsForPrompt?: number
  charsPerOutput?: number
  modelType: EmbeddingModel | ChatModel
  costType: 'live' | 'batch'
  taskType: 'embedding' | 'chat'
  isPremium: boolean
}

const CHARS_PER_TOKEN = 4
function calculateTokens(chars: number): number {
  return chars / CHARS_PER_TOKEN
}

function calculateCostPerMillionTokens(tokens: number, pricePerMillionTokens: number): number {
  return (tokens / 1_000_000) * pricePerMillionTokens
}

function calculateEmbeddingCost(params: CostParams): {
  total: number
  tokens: number
} {
  const { numItems, charsPerItem, modelType, costType } = params
  const totalTokens = numItems * calculateTokens(charsPerItem)
  const pricePerMillionTokens = COST_CONFIG.embedding[modelType as EmbeddingModel][costType]
  const totalCostUSD = calculateCostPerMillionTokens(totalTokens, pricePerMillionTokens)
  return {
    total: USD2INR(totalCostUSD),
    tokens: totalTokens
  }
}

function calculateTotalChatCost(params: CostParams): {
  cost: {
    total: number
    input: number
    output: number
  }
  tokens: {
    total: number
    input: number
    inputCPM: number
    output: number
    outputCPM: number
  }
} {
  const {
    numItems,
    charsPerItem,
    charsForPrompt = 0,
    charsPerOutput = 0,
    modelType,
    costType,
    isPremium
  } = params
  const totalInputTokens = numItems * calculateTokens(charsPerItem + charsForPrompt)
  const totalOutputTokens = numItems * calculateTokens(charsPerOutput)

  if (isPremium) {
    // Premium users use a different costing model potentially
    const pricePerMillionInputTokens = COST_CONFIG.chat[modelType as ChatModel][costType].input
    const pricePerMillionOutputTokens = COST_CONFIG.chat[modelType as ChatModel][costType].output

    const inputCost = calculateCostPerMillionTokens(totalInputTokens, pricePerMillionInputTokens)
    const outputCost = calculateCostPerMillionTokens(totalOutputTokens, pricePerMillionOutputTokens)

    return {
      cost: {
        total: USD2INR(inputCost + outputCost),
        input: USD2INR(inputCost),
        output: USD2INR(outputCost)
      },
      tokens: {
        total: totalInputTokens + totalOutputTokens,
        inputCPM: USD2INR(pricePerMillionInputTokens),
        input: totalInputTokens,
        outputCPM: USD2INR(pricePerMillionOutputTokens),
        output: totalOutputTokens
      }
    }
  } else {
    // Free users utilize Groq models
    // Implement logic to calculate the hourly request and token rate
    const hourlyRate = calculateHourlyRate(numItems, totalInputTokens + totalOutputTokens)
    const currentGroqModel = determineGroqModel(hourlyRate)

    // Mock calculation assuming free model has no cost in monetary terms but has other limits
    return {
      cost: {
        total: 0,
        input: 0,
        output: 0
      },
      tokens: {
        total: totalInputTokens + totalOutputTokens,
        inputCPM: 0,
        input: totalInputTokens,
        outputCPM: 0,
        output: totalOutputTokens
      }
    }
  }
}

function calculateTotalCost(params: CostParams): any {
  if (params.taskType === 'embedding') {
    return calculateEmbeddingCost(params)
  } else if (params.taskType === 'chat') {
    return calculateTotalChatCost(params)
  } else {
    throw new Error('Unsupported task type')
  }
}

export interface ChatGPTResult {
  totalCost: number
  free: {
    cost: {
      total: number
      input: number
      output: number
    }
    tokens: {
      total: number
      input: number
      inputCPM: number
      output: number
      outputCPM: number
    }
    model: ChatModel
    requests: number
  }
  pro: {
    cost: {
      total: number
      input: number
      output: number
    }
    tokens: {
      total: number
      input: number
      inputCPM: number
      output: number
      outputCPM: number
    }
    model: ChatModel
    requests: number
  }
  expert: {
    cost: {
      total: number
      input: number
      output: number
    }
    tokens: {
      total: number
      input: number
      inputCPM: number
      output: number
      outputCPM: number
    }
    model: ChatModel
    requests: number
  }
}

function calculateChatGPTUsageCost(
  freeUsers: number,
  customers: { pro: number; expert: number }
): ChatGPTResult {
  const totalMauUsingChatGPT = Math.floor(freeUsers * PERCENTAGE_MAU_USING_CHAT)
  const totalFreeRequests = totalMauUsingChatGPT * AVG_FREE_REQUESTS_PER_USER
  const totalExpertRequests = customers.expert * EXPERT_REQUESTS_CAP
  const totalProRequests = customers.pro * PRO_REQUESTS_CAP

  const freeModel: ChatModel = 'gpt-3.5-turbo-0125'
  const premiumModel: ChatModel = 'gpt-4o'

  const freeCost = calculateTotalChatCost({
    numItems: totalFreeRequests,
    charsPerItem: 1000,
    charsForPrompt: 500,
    charsPerOutput: 500,
    modelType: freeModel,
    costType: 'live',
    taskType: 'chat',
    isPremium: false
  })

  const proCost = calculateTotalChatCost({
    numItems: totalProRequests,
    charsPerItem: 1000,
    charsForPrompt: 500,
    charsPerOutput: 500,
    modelType: premiumModel,
    costType: 'live',
    taskType: 'chat',
    isPremium: true
  })

  const expertCost = calculateTotalChatCost({
    numItems: totalExpertRequests,
    charsPerItem: 1000,
    charsForPrompt: 500,
    charsPerOutput: 500,
    modelType: premiumModel,
    costType: 'live',
    taskType: 'chat',
    isPremium: true
  })

  const totalCost = freeCost.cost.total + proCost.cost.total + expertCost.cost.total

  return {
    totalCost: totalCost,
    free: {
      ...freeCost,
      model: freeModel,
      requests: totalFreeRequests
    },
    pro: {
      ...proCost,
      model: premiumModel,
      requests: totalProRequests
    },
    expert: {
      ...expertCost,
      model: premiumModel,
      requests: totalExpertRequests
    }
  }
}

interface AiBreakdown {
  type: string
  embedding: {
    totalCost: number
    tokenCost: number
    model: EmbeddingModel
    batch: 'batch' | 'live'
  }
  summary: {
    totalCost: number
    inputCost: number
    outputCost: number
    tokens: number
    model: ChatModel
    batch: 'batch' | 'live'
  }
}

export interface AiCostResult {
  cost: {
    total: number
    embedding: number
    summary: number
    chat: number
  }
  breakdown: AiBreakdown[]
  chat: ChatGPTResult
}

const EMBEDDING_MODEL: EmbeddingModel = 'text-embedding-3-small'
const SUMMARY_MODEL: ChatModel = 'gpt-3.5-turbo-0125'

interface CalculateAiCostParams {
  mau: number
  customers: {
    pro: number
    expert: number
  }
  isBatch?: boolean
  CONTENT_CONFIG: StageConfig
}

export function calculateAiCost({
  mau,
  customers,
  isBatch = true,
  CONTENT_CONFIG
}: CalculateAiCostParams): AiCostResult {
  const freeUsers = mau - (customers.expert + customers.pro)
  const chat = calculateChatGPTUsageCost(freeUsers, customers)

  const breakdown = [] as AiBreakdown[]
  let totalEmbeddingsCost = 0
  let totalSummaryCost = 0

  for (const contentType in CONTENT_CONFIG) {
    const content = CONTENT_CONFIG[contentType as keyof typeof CONTENT_CONFIG]

    // Calculate embedding cost
    const contentEmbeddingCost = calculateTotalCost({
      numItems: content.PROCESSED_MONTHLY,
      charsPerItem: content.WORDS.CHUNKS,
      modelType: EMBEDDING_MODEL,
      costType: isBatch ? 'batch' : 'live',
      taskType: 'embedding',
      isPremium: true
    })

    const contentSummaryCost = calculateTotalCost({
      numItems: content.PER_SOURCE_ADDITIONS * content.SOURCES,
      charsPerItem: content.WORDS.CHUNKS,
      charsForPrompt: content.WORDS.PROMPT,
      charsPerOutput: content.WORDS.OUTPUT,
      modelType: SUMMARY_MODEL,
      costType: isBatch ? 'batch' : 'live',
      taskType: 'chat',
      isPremium: true
    })

    totalEmbeddingsCost += contentEmbeddingCost.total
    totalSummaryCost += contentSummaryCost.cost.total

    breakdown.push({
      type: contentType,
      embedding: {
        totalCost: contentEmbeddingCost.total,
        tokenCost: contentEmbeddingCost.tokens,
        model: EMBEDDING_MODEL,
        batch: isBatch ? 'batch' : 'live'
      },
      summary: {
        totalCost: contentSummaryCost.cost.total,
        inputCost: contentSummaryCost.cost.input,
        outputCost: contentSummaryCost.cost.output,
        tokens: contentSummaryCost.tokens,
        model: SUMMARY_MODEL,
        batch: isBatch ? 'batch' : 'live'
      }
    })
  }
  console.log('GPT-COST', totalEmbeddingsCost, totalSummaryCost)

  return {
    cost: {
      total: totalEmbeddingsCost + totalSummaryCost + chat.totalCost,
      embedding: totalEmbeddingsCost,
      summary: totalSummaryCost,
      chat: chat.totalCost
    },
    breakdown,
    chat
  }
}
