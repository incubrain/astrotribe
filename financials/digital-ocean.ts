import { USD2INR } from './helpers'

type DOPlan = '1vcpu-1gb' | '2vcpu-2gb' | '4vcpu-8gb' | '8vcpu-16gb' | '16vcpu-32gb'

export const digitalOceanConfig = {
  plans: {
    '1vcpu-1gb': {
      monthlyCost: 12.0,
      ram: '1 GB',
      vCPU: 1,
      bandwidthGB: 150,
    },
    '2vcpu-2gb': {
      monthlyCost: 24.0,
      ram: '2 GB',
      vCPU: 2,
      bandwidthGB: 200,
    },
    '4vcpu-8gb': {
      monthlyCost: 48.0,
      ram: '8 GB',
      vCPU: 4,
      bandwidthGB: 300,
    },
    '8vcpu-16gb': {
      monthlyCost: 96.0,
      ram: '16 GB',
      vCPU: 8,
      bandwidthGB: 500,
    },
    '16vcpu-32gb': {
      monthlyCost: 192.0,
      ram: '32 GB',
      vCPU: 16,
      bandwidthGB: 1000,
    },
  },
}

type DigitalOceanCostParams = {
  bandwidthGB: number
}

export interface DigitalOceanResult {
  plan: DOPlan
  cost: number
  ram: string
  vCPU: number
  bandwidthGB: number
}

function calculatePlan(bandwidthGB: number): DOPlan {
  if (bandwidthGB <= 200) {
    return '2vcpu-2gb'
  } else if (bandwidthGB <= 300) {
    return '4vcpu-8gb'
  } else if (bandwidthGB <= 500) {
    return '8vcpu-16gb'
  } else {
    return '16vcpu-32gb'
  }
}

export function calculateDigitalOceanCost(params: DigitalOceanCostParams): DigitalOceanResult {
  const plan = calculatePlan(params.bandwidthGB || 150)
  console.log('digital ocean storage: ', params.bandwidthGB, plan)
  const planDetails = digitalOceanConfig.plans[plan]

  if (!planDetails) {
    throw new Error('Unsupported Digital Ocean plan')
  }

  return {
    plan,
    cost: USD2INR(planDetails.monthlyCost),
    ram: planDetails.ram,
    vCPU: planDetails.vCPU,
    bandwidthGB: planDetails.bandwidthGB,
  }
}
