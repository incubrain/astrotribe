import type { Content } from './totals'
import { USD2INR } from './totals'

export const SUPABASE_CONFIG = {
  pro: {
    basePrice: 25,
    mauIncluded: 100000,
    mauPrice: 0.00325,
    dbIncludedGB: 8,
    dbPricePerGB: 0.125,
    bandwidthIncludedGB: 250,
    bandwidthPricePerGB: 0.09,
    storageIncludedGB: 100,
    storagePricePerGB: 0.021
  }
}

type SBPlan =
  | 'nano'
  | 'micro'
  | 'small'
  | 'medium'
  | 'large'
  | 'xl'
  | '2xl'
  | '4xl'
  | '8xl'
  | '12xl'
  | '16xl'

export const SUPABASE_COMPUTE_CONFIG = {
  plans: {
    nano: {
      hourly: 0,
      monthly: 0,
      cpu: 'Shared',
      memory: 'Up to 0.5 GB',
      directConnections: 60,
      poolerConnections: 200,
      maxDbSizeGB: 0.5
    },
    micro: {
      hourly: 0.01344,
      monthly: 10,
      cpu: '2-core ARM (shared)',
      memory: '1 GB',
      directConnections: 60,
      poolerConnections: 200,
      maxDbSizeGB: 10
    },
    small: {
      hourly: 0.0206,
      monthly: 15,
      cpu: '2-core ARM (shared)',
      memory: '2 GB',
      directConnections: 90,
      poolerConnections: 400,
      maxDbSizeGB: 50
    },
    medium: {
      hourly: 0.0822,
      monthly: 60,
      cpu: '2-core ARM (shared)',
      memory: '4 GB',
      directConnections: 120,
      poolerConnections: 600,
      maxDbSizeGB: 100
    },
    large: {
      hourly: 0.1517,
      monthly: 110,
      cpu: '2-core ARM (dedicated)',
      memory: '8 GB',
      directConnections: 160,
      poolerConnections: 800,
      maxDbSizeGB: 200
    },
    xl: {
      hourly: 0.2877,
      monthly: 210,
      cpu: '4-core ARM (dedicated)',
      memory: '16 GB',
      directConnections: 240,
      poolerConnections: 1000,
      maxDbSizeGB: 500
    },
    '2xl': {
      hourly: 0.562,
      monthly: 410,
      cpu: '8-core ARM (dedicated)',
      memory: '32 GB',
      directConnections: 380,
      poolerConnections: 1500,
      maxDbSizeGB: 1000
    },
    '4xl': {
      hourly: 1.32,
      monthly: 960,
      cpu: '16-core ARM (dedicated)',
      memory: '64 GB',
      directConnections: 480,
      poolerConnections: 3000,
      maxDbSizeGB: 2000
    },
    '8xl': {
      hourly: 2.562,
      monthly: 1870,
      cpu: '32-core ARM (dedicated)',
      memory: '128 GB',
      directConnections: 490,
      poolerConnections: 6000,
      maxDbSizeGB: 4000
    },
    '12xl': {
      hourly: 3.836,
      monthly: 2800,
      cpu: '48-core ARM (dedicated)',
      memory: '192 GB',
      directConnections: 500,
      poolerConnections: 9000,
      maxDbSizeGB: 6000
    },
    '16xl': {
      hourly: 5.12,
      monthly: 3730,
      cpu: '64-core ARM (dedicated)',
      memory: '256 GB',
      directConnections: 500,
      poolerConnections: 12000,
      maxDbSizeGB: 10000
    }
  }
}

const VECTOR_SIZES = {
  large: 1536,
  small: 724
}

const AVG_CHARS_PER_WORD = 4.7
const BYTES_PER_GB = 1024 ** 3

export function calculateVectorStorage(
  vectorSize: number,
  numItems: number,
  isBinary: boolean = false
): number {
  const bytesPerItem = isBinary ? Math.ceil(vectorSize / 8) : vectorSize * 4
  const totalBytes = bytesPerItem * numItems
  const totalGB = totalBytes / BYTES_PER_GB
  return parseFloat(totalGB.toFixed(3))
}


export function calculateContentStorage(numItems: number, contentWords: number): number {
  const contentChars = contentWords * AVG_CHARS_PER_WORD
  const bytesPerItem = contentChars
  const totalBytes = bytesPerItem * numItems
  const totalGB = totalBytes / BYTES_PER_GB
  return parseFloat(totalGB.toFixed(3))
}

type SupabaseCostParams = {
  monthlyActiveUsers: number
  dbStorageGB: number
  bandwidthGB: number
  fileStorageGB: number
}

type ComputeCostParams = {
  plan: SBPlan
  hoursUsed: number
}

function calculateComputeCost(params: ComputeCostParams): {
  total: number
  hourly: number
  monthly: number
} {
  const { plan, hoursUsed } = params
  const planDetails = SUPABASE_COMPUTE_CONFIG.plans[plan]

  if (!planDetails) {
    throw new Error('Unsupported compute plan')
  }

  const hourlyCost = planDetails.hourly * hoursUsed
  const monthlyCost = planDetails.monthly
  return {
    total: hourlyCost + monthlyCost,
    hourly: hourlyCost,
    monthly: monthlyCost
  }
}

interface SupabaseCostBreakdown {
  total: number
  base: number
  mau: number
  dbStorage: number
  bandwidth: number
  fileStorage: number
}

function calculateStorageCost(params: SupabaseCostParams): SupabaseCostBreakdown {
  const { monthlyActiveUsers, dbStorageGB, bandwidthGB, fileStorageGB } = params

  const {
    basePrice,
    mauIncluded,
    mauPrice,
    dbIncludedGB,
    dbPricePerGB,
    bandwidthIncludedGB,
    bandwidthPricePerGB,
    storageIncludedGB,
    storagePricePerGB
  } = SUPABASE_CONFIG.pro

  const additionalMauCost =
    monthlyActiveUsers > mauIncluded ? (monthlyActiveUsers - mauIncluded) * mauPrice : 0

  const additionalDbStorageCost =
    dbStorageGB > dbIncludedGB ? (dbStorageGB - dbIncludedGB) * dbPricePerGB : 0

  const additionalBandwidthCost =
    bandwidthGB > bandwidthIncludedGB
      ? (bandwidthGB - bandwidthIncludedGB) * bandwidthPricePerGB
      : 0

  const additionalFileStorageCost =
    fileStorageGB > storageIncludedGB ? (fileStorageGB - storageIncludedGB) * storagePricePerGB : 0

  const totalCost =
    basePrice +
    additionalMauCost +
    additionalDbStorageCost +
    additionalBandwidthCost +
    additionalFileStorageCost

  return {
    total: parseFloat(totalCost.toFixed(3)),
    base: parseFloat(basePrice.toFixed(3)),
    mau: parseFloat(additionalMauCost.toFixed(3)),
    dbStorage: parseFloat(additionalDbStorageCost.toFixed(3)),
    bandwidth: parseFloat(additionalBandwidthCost.toFixed(3)),
    fileStorage: parseFloat(additionalFileStorageCost.toFixed(3))
  }
}

function determineComputePlan(dbStorageGB: number): SBPlan {
  console.log('DB Storage:', dbStorageGB)
  const plans = Object.keys(SUPABASE_COMPUTE_CONFIG.plans) as SBPlan[]
  for (const plan of plans) {
    const maxDbSize = SUPABASE_COMPUTE_CONFIG.plans[plan].maxDbSizeGB
    if (dbStorageGB <= maxDbSize) {
      return plan
    }
  }
  return '16xl'
}

type ContentParams = {
  total: number
  words: {
    prompt: number
    content: number
    output: number
    chunks: number
  }
  contentType: string
}

interface StorageResult {
  total: number
  db: number
  vector: number
  details: {
    content: {
      type: string
      count: number
      avgWords: number
      totalWords: number
    }
    storage: {
      total: number
      db: number
      vector: number
    }
  }[]
}

function calculateStorageUsage(contentParams: ContentParams[]): StorageResult {
  let totalDbStorageGB = 0
  let totalVectorStorageGB = 0
  const details = []

  for (const { contentType, total, words } of contentParams) {
    const contentStorage = calculateContentStorage(total, words.content + words.output)

    const vectorStorage = calculateVectorStorage(VECTOR_SIZES.large, words.chunks * total)

    totalDbStorageGB += contentStorage
    totalVectorStorageGB += vectorStorage

    details.push({
      content: {
        type: contentType,
        count: total,
        avgWords: words.content,
        totalWords: words.content * total,
        totalChunks: words.chunks * total
      },
      storage: {
        total: contentStorage + vectorStorage,
        db: contentStorage,
        vector: vectorStorage
      }
    })
  }

  return {
    total: parseFloat((totalDbStorageGB + totalVectorStorageGB).toFixed(3)),
    db: parseFloat(totalDbStorageGB.toFixed(3)),
    vector: parseFloat(totalVectorStorageGB.toFixed(3)),
    details
  }
}

export interface StorageCostResult {
  totalCost: number
  storage: {
    cost: {
      total: number
      base: number
      mau: number
      db: number
      bandwidth: number
      fileStorage: number
    }
    data: StorageResult
  }
  compute: {
    plan: SBPlan
    cost: {
      total: number
      hourly: number
      monthly: number
    }
  }
}

export function calculateSupabaseCosts(
  mau: number,
  contentParams: ContentParams[]
): StorageCostResult {
  console.log('Content Params:', contentParams, mau)
  const storage = calculateStorageUsage(contentParams)
  const computePlan = determineComputePlan(storage.total)

  console.log('Compute Plan:', computePlan)

  const computeCost = calculateComputeCost({
    plan: computePlan,
    hoursUsed: 730 // Assuming 24/7 usage, can we make dynamic?
  })

  // Calculate bandwidth and file storage dynamically based on MAU
  // EXTRACT
  const bandwidthGB = Math.max(250, mau * 0.05)
  const fileStorageGB = Math.max(100, mau * 0.01)
  const storageCost = calculateStorageCost({
    monthlyActiveUsers: mau,
    dbStorageGB: storage.total,
    bandwidthGB,
    fileStorageGB
  })

  return {
    totalCost: USD2INR(computeCost.total + storageCost.total),
    storage: {
      cost: {
        total: USD2INR(storageCost.total),
        base: USD2INR(storageCost.base),
        mau: USD2INR(storageCost.mau),
        db: USD2INR(storageCost.dbStorage),
        bandwidth: USD2INR(storageCost.bandwidth),
        fileStorage: USD2INR(storageCost.fileStorage)
      },
      data: storage
    },
    compute: {
      plan: computePlan,
      cost: {
        total: USD2INR(computeCost.total),
        hourly: USD2INR(computeCost.hourly),
        monthly: USD2INR(computeCost.monthly)
      }
    }
  }
}
