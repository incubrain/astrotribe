// import { storageConfig } from './supabase-cost';
import { request } from 'http'
import type { StageConfig } from './totals'
import { USD2INR, CONTENT_CONFIG } from './totals'

type EmbeddingModel = 'text-embedding-3-small' | 'text-embedding-3-large'

type ChatModel = 'gpt-4o' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo-instruct'

const PERCENTAGE_MAU_USING_CHAT = 0.5 // 50%
const AVG_FREE_REQUESTS_PER_USER = 50
const PREMIUM_REQUESTS_CAP = 250

interface CostConfig {
  embedding: Record<EmbeddingModel, Record<'live' | 'batch', number>>
  summarization: Record<ChatModel, Record<'live' | 'batch', { input: number; output: number }>>
}

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
  summarization: {
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
  taskType: 'embedding' | 'summarization'
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
    costType
  } = params
  const totalInputTokens = numItems * calculateTokens(charsPerItem + charsForPrompt)
  const totalOutputTokens = numItems * calculateTokens(charsPerOutput)

  const pricePerMillionInputTokens =
    COST_CONFIG.summarization[modelType as ChatModel][costType].input
  const pricePerMillionOutputTokens =
    COST_CONFIG.summarization[modelType as ChatModel][costType].output

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
}

function calculateTotalCost(params: CostParams): any {
  if (params.taskType === 'embedding') {
    return calculateEmbeddingCost(params)
  } else if (params.taskType === 'summarization') {
    return calculateTotalChatCost(params)
  } else {
    throw new Error('Unsupported task type')
  }
}

export interface ChatGPTResult {
  totalCost: number
  userCost: number
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
  premium: {
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

function calculateChatGPTUsageCost(mau: number, customers: number): ChatGPTResult {
  const users = mau - customers
  const totalMauUsingChatGPT = Math.floor(users * PERCENTAGE_MAU_USING_CHAT)
  const totalFreeRequests = totalMauUsingChatGPT * AVG_FREE_REQUESTS_PER_USER
  const totalPremiumRequests = customers * PREMIUM_REQUESTS_CAP

  const freeModel: ChatModel = 'gpt-3.5-turbo-0125'
  const premiumModel: ChatModel = 'gpt-4o'

  const freeCost = calculateTotalChatCost({
    numItems: totalFreeRequests,
    charsPerItem: 1000,
    charsForPrompt: 500,
    charsPerOutput: 500,
    modelType: freeModel,
    costType: 'live',
    taskType: 'summarization'
  })

  const premiumCost = calculateTotalChatCost({
    numItems: totalPremiumRequests,
    charsPerItem: 1000,
    charsForPrompt: 500,
    charsPerOutput: 500,
    modelType: premiumModel,
    costType: 'live',
    taskType: 'summarization'
  })

  const totalCost = freeCost.cost.total + premiumCost.cost.total

  return {
    totalCost: totalCost,
    userCost: totalCost / mau,
    free: {
      ...freeCost,
      model: freeModel,
      requests: totalFreeRequests
    },
    premium: {
      ...premiumCost,
      model: premiumModel,
      requests: totalPremiumRequests
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


export function calculateAiCost(mau: number, customers: number, isBatch = true): AiCostResult {
  const chat = calculateChatGPTUsageCost(mau, customers)

  const breakdown = [] as AiBreakdown[]
  let totalEmbeddingsCost = 0
  let totalSummaryCost = 0

  for (const contentType in CONTENT_CONFIG) {
    const content = CONTENT_CONFIG[contentType as keyof typeof CONTENT_CONFIG]

    // Calculate embedding cost
    const contentEmbeddingCost = calculateTotalCost({
      numItems: content.processedMonthly,
      charsPerItem: content.words.chunks,
      modelType: EMBEDDING_MODEL,
      costType: isBatch ? 'batch' : 'live',
      taskType: 'embedding'
    })

    const contentSummaryCost = calculateTotalCost({
      numItems: content.processedMonthly,
      charsPerItem: content.words.chunks,
      charsForPrompt: content.words.prompt,
      charsPerOutput: content.words.output,
      modelType: SUMMARY_MODEL,
      costType: isBatch ? 'batch' : 'live',
      taskType: 'summarization'
    })

    totalEmbeddingsCost += contentEmbeddingCost.total
    totalSummaryCost += contentSummaryCost.cost.total

    breakdown.push({
      type: contentType,
      embedding: {
        totalCost: USD2INR(contentEmbeddingCost.total),
        tokenCost: contentEmbeddingCost.tokens,
        model: EMBEDDING_MODEL,
        batch: isBatch ? 'batch' : 'live'
      },
      summary: {
        totalCost: USD2INR(contentSummaryCost.cost.total),
        inputCost: USD2INR(contentSummaryCost.cost.input),
        outputCost: USD2INR(contentSummaryCost.cost.output),
        tokens: contentSummaryCost.tokens,
        model: SUMMARY_MODEL,
        batch: isBatch ? 'batch' : 'live'
      }
    })
  }

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
