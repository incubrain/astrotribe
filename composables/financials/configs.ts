// --- DEVOPS ---

const HOURS_PER_MONTH = 730 // 24 hours * 30 days
const AWS_EC2_COST_PER_HOUR = 0.24 // $0.24 per hour per instance
const AWS_S3_COST_PER_GB = 0.021 // $0.021 per GB
const AWS_DATA_TRANSFER_COST_PER_GB = 0.07 // $0.07 per GB
const EKS_CLUSTER_COST_PER_HOUR = 0.2 // $0.20 per hour for EKS cluster
const PROMETHEUS_GRAFANA_COST_PER_MONTH = 7000 // $7,000 per month
const CLOUD_FLARE_COST_PER_GB = 0.015 // $0.015 per GB

// Last Updated 6th July 2024
export const vercelConfig = {
  basePrice: 20,
  dataTransfer: {
    includedGB: 1000, // 1 TB
    pricePerGB: 0.15
  },
  originTransfer: {
    includedGB: 100,
    pricePerGB: 0.06
  },
  edgeRequests: {
    includedRequests: 10_000_000,
    pricePerMillion: 2
  },
  middlewareInvocations: {
    includedInvocations: 1_000_000,
    pricePerMillion: 0.65
  },
  sourceImages: {
    includedImages: 5000,
    pricePerThousand: 5
  },
  functionInvocations: {
    includedInvocations: 1_000_000,
    pricePerMillion: 0.6
  },
  functionDuration: {
    includedGBHours: 1000,
    pricePerGBHour: 0.18
  },
  edgeFunctionExecutions: {
    includedExecutions: 1_000_000,
    pricePerMillion: 2
  },
  dataCacheReads: {
    includedReads: 10_000_000,
    pricePerMillion: 0.4
  },
  dataCacheWrites: {
    includedWrites: 2_000_000,
    pricePerMillion: 4
  },
  edgeConfigReads: {
    includedReads: 1_000_000,
    pricePerMillion: 3
  },
  edgeConfigWrites: {
    includedWrites: 1000,
    pricePer500Writes: 5
  },
  monitoring: {
    baseFee: 10,
    pricePerMillionEvents: 9
  },
  speedInsights: {
    includedDataPoints: 10_000,
    pricePer10kEvents: 0.65
  },
  webAnalytics: {
    includedEvents: 25_000,
    pricePer100kEvents: 14
  }
}

const usageByHour = {
  dataTransferGB: 0.015, // 15 MB per hour per user
  originTransferGB: 0.001, // 1 MB per hour per user
  edgeRequests: 150, // 150 requests per hour per user
  middlewareInvocations: 75, // 75 middleware invocations per hour per user
  sourceImages: 0, // Assume no usage, handled by supabase
  functionInvocations: 75, // 75 function invocations per hour per user
  functionDurationGBHours: 0.08, // Adjusted to 0.08 GB-hours per hour per user
  edgeFunctionExecutions: 75, // 75 edge function executions per hour per user
  dataCacheReads: 800, // Adjusted to 800 data cache reads per hour per user
  dataCacheWrites: 75, // 75 data cache writes per hour per user
  edgeConfigReads: 50, // Adjusted to 50 edge config reads per hour per user
  edgeConfigWrites: 0.1, // Adjusted to 0.1 edge config writes per hour per user
  monitoringEvents: 0, // Use posthog instead
  speedInsightsDataPoints: 0, // Not using
  webAnalyticsEvents: 0 // Not using
}

const BASE_HOURS_PER_DAY = 0.1 // Base usage of 0.10 hours (6 minutes) per day per user
const BASE_HOURS_GROWTH_FACTOR = 0.01 // Daily usage increases by 0.010 hours (6 minutes) for every 5,000 MAU
const MAX_DAILY_HOUR_USAGE = 1.5 // Upper cap of 1:30 hours per day per user, IG/X avg ~2 per day

// ---- ANALYTICS ----

const FREE_TIER_MONTHS = 6

const POSTHOG_SURVEY_TIERS = [
  { limit: 250, price: 0 },
  { limit: 250, price: 0.2 },
  { limit: 500, price: 0.1 },
  { limit: 9000, price: 0.035 },
  { limit: 10000, price: 0.015 },
  { limit: Infinity, price: 0.01 }
]

const POSTHOG_FEAT_FLAG_TIERS = [
  { limit: 1000000, price: 0 },
  { limit: 1000000, price: 0.0001 },
  { limit: 8000000, price: 0.000045 },
  { limit: 40000000, price: 0.000025 },
  { limit: Infinity, price: 0.00001 }
]

const POSTHOG_REPLAY_TIERS = [
  { limit: 5000, price: 0 },
  { limit: 10000, price: 0.04 },
  { limit: 35000, price: 0.003 },
  { limit: 100000, price: 0.0027 },
  { limit: 350000, price: 0.0025 },
  { limit: Infinity, price: 0.002 }
]

const POSTHOG_ANALYTICS_TIERS = [
  { limit: 1000000, price: 0 },
  { limit: 1000000, price: 0.00005 },
  { limit: 13000000, price: 0.0000343 },
  { limit: 35000000, price: 0.0000295 },
  { limit: 50000000, price: 0.0000218 },
  { limit: 150000000, price: 0.000015 },
  { limit: Infinity, price: 0.000009 }
]

// ---- DIGITAL OCEAN ----

export const digitalOceanConfig = {
  plans: {
    '1vcpu-1gb': {
      monthlyCost: 12.0,
      ram: '1 GB',
      vCPU: 1,
      bandwidthGB: 150
    },
    '2vcpu-2gb': {
      monthlyCost: 24.0,
      ram: '2 GB',
      vCPU: 2,
      bandwidthGB: 200
    },
    '4vcpu-8gb': {
      monthlyCost: 48.0,
      ram: '8 GB',
      vCPU: 4,
      bandwidthGB: 300
    },
    '8vcpu-16gb': {
      monthlyCost: 96.0,
      ram: '16 GB',
      vCPU: 8,
      bandwidthGB: 500
    },
    '16vcpu-32gb': {
      monthlyCost: 192.0,
      ram: '32 GB',
      vCPU: 16,
      bandwidthGB: 1000
    }
  }
}

// ---- SOFTWARES ----

const subscriptions: Subscription[] = [
  {
    name: 'ChatGPT',
    baseCost: 30,
    seatCost: 30,
    annualDiscount: 5,
    seatRatio: 1
  },
  {
    name: 'GitHub Teams',
    baseCost: 4,
    seatCost: 4,
    annualDiscount: 0,
    seatRatio: 0.65
  },
  {
    name: 'GitHub Copilot',
    baseCost: 19,
    seatCost: 19,
    annualDiscount: 0,
    seatRatio: 0.65
  },
  {
    name: 'Adobe',
    baseCost: 25,
    seatCost: 25,
    annualDiscount: 0,
    seatRatio: 0.15
  },
  {
    name: 'Google Business',
    baseCost: 7.2,
    seatCost: 7.2,
    annualDiscount: 0,
    seatRatio: 1
  },
  {
    name: 'Posthog',
    baseCost: 0,
    seatCost: 19,
    annualDiscount: 0,
    seatRatio: 0.15
  }
]

// ---- EMPLOYEES ----

const BASE_EMPLOYEE_COUNT = {
  support: 2,
  core: 2,
  experts: 1,
  founders: 2
}

const EMPLOYEE_CONFIG = {
  start: {
    support: {
      salary: 16_000
    },
    core: {
      salary: 20_000
    },
    experts: {
      salary: 30_000
    },
    founders: {
      salary: 30_000
    }
  },
  growth: {
    support: {
      salary: 18_000
    },
    core: {
      salary: 24_000
    },
    experts: {
      salary: 40_000
    },
    founders: {
      salary: 50_000
    }
  },
  scaling: {
    support: {
      salary: 23_000
    },
    core: {
      salary: 36_000
    },
    experts: {
      salary: 50_000
    },
    founders: {
      salary: 120_000
    }
  },
  secure: {
    support: {
      salary: 30_000
    },
    core: {
      salary: 50_000
    },
    experts: {
      salary: 100_000
    },
    founders: {
      salary: 400_000
    }
  }
}

const EMPLOYEE_EXTRAS = {
  recruitment: 1500,
  turnover: 2000,
  legal: 2000,
  technology: 2000
}

// ---- CHAT GPT ----

const PERCENTAGE_MAU_USING_CHAT = 0.5 // 50%
const AVG_FREE_REQUESTS_PER_USER = 50
const PREMIUM_REQUESTS_CAP = 250

const COST_CONFIG = {
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

const CHARS_PER_TOKEN = 4

const EMBEDDING_MODEL: EmbeddingModel = 'text-embedding-3-small'
const SUMMARY_MODEL: ChatModel = 'gpt-3.5-turbo-0125'

// ---- LOGGING ----

const LOGS_CONFIG = {
  includedGB: 50,
  additionalGBPrice: 0.45,
  retentionIncludedDays: 30,
  retentionPricePerGBPerMonth: 0.1,
  minimumCharge: 34
}

const LOGS_METRIC_CONFIG = {
  includedDataPoints: 10_000_000,
  additionalDataPointsPrice: 10 // Price per additional 10M data points
}

const LOGS_ANALYTICS_CONFIG = {
  pricePerMember: 5 // Price per member per month
}

// ---- OFFICE ----

const OFFICE_SPACE = {
  sqMetersPerEmployee: 8,
  costPerSqMeter: 2360, // averaged from 40 offices in Pune
  maxEmployees: 35, // Maximum number of employees for full office
  costPerEmployee: (
    haveCoworking: boolean,
    haveOffice: boolean,
    employees: number
  ): number => {
    if (haveOffice) {
      const totalSqMeters =
        OFFICE_SPACE.maxEmployees * OFFICE_SPACE.sqMetersPerEmployee;
      return totalSqMeters * OFFICE_SPACE.costPerSqMeter;
    } else if (haveCoworking) {
      return 8000 * employees;
    } else {
      return 0;
    }
  },
  insurance: 50000,
  internet: 2000,
  cleaning: 5000,
  maintenance: 5000,
};

const OFFICE_EXPENSES = {
  supplies: 800,
  utilities: 400,
  snacks: 300,
  misc: 2000,
};

// --- STORAGE ---

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

// ---- TOTALS ----

const USD_TO_INR = 83.4 // 5TH JULY 2024


export type CompanyStage = 'start' | 'growth' | 'scaling' | 'secure'
export type Content = 'news' | 'researchAbstracts' | 'researchPapers' | 'jobs' | 'companies'
export type StageConfig = Record<Content, ContentConfig>

export const CHAR_CHUNK_SIZE = 1024
export const AVG_CHAR_PER_WORD = 4.7

const CONTENT_CONFIG: StageConfig = {
  news: {
    processed: 0,
    total: 120_000,
    sources: 15,
    perSourceAdditions: 30,
    processedMonthly: 2_000,
    words: {
      content: 1000,
      chunks: contentToNumberOfChunks(1000),
      prompt: 100,
      output: 240
    }
  },
  researchAbstracts: {
    processed: 0,
    total: 2_400_000,
    sources: 2,
    perSourceAdditions: 1_300,
    processedMonthly: 10_000,
    words: {
      content: 280,
      chunks: contentToNumberOfChunks(280),
      prompt: 50,
      output: 60
    }
  },
  researchPapers: {
    processed: 0,
    total: 1000,
    sources: 2,
    perSourceAdditions: 10_000,
    processedMonthly: 10_000,
    words: {
      content: 10_000,
      chunks: contentToNumberOfChunks(10_000),
      prompt: 100,
      output: 400
    }
  },
  companies: {
    processed: 0,
    total: 4_500,
    perSourceAdditions: 150,
    processedMonthly: 500,
    words: {
      content: 20_000,
      chunks: contentToNumberOfChunks(20_000),
      prompt: 200,
      output: 1_000
    }
  },
  jobs: {
    processed: 0,
    total: 3_000,
    sources: 5,
    perSourceAdditions: 30,
    processedMonthly: 2_000,
    words: {
      content: 1_000,
      chunks: contentToNumberOfChunks(1_000),
      prompt: 120,
      output: 100
    }
  }
}