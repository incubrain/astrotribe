import single from '~/server/api/feedback/insert/single'

export type CostCategory =
  | 'infrastructure'
  | 'thirdPartyServices'
  | 'support'
  | 'development'
  | 'marketing'

interface CostDetails {
  total: number
  singleCost: number
}

interface UserTierCost {
  free: CostDetails
  pro: CostDetails
  expert: CostDetails
}

interface AllocateCostParams {
  totalCosts: {
    free: number
    pro: number
    expert: number
  }
  users: {
    free: number
    pro: number
    expert: number
  }
}

function allocateCostsToTiers({ totalCosts, users }: AllocateCostParams): UserTierCost {
  const totalUsers = users.free + users.pro + users.expert

  const costs: UserTierCost = {
    free: { total: 0, singleCost: 0 },
    pro: { total: 0, singleCost: 0 },
    expert: { total: 0, singleCost: 0 }
  }

  // Allocate infrastructure costs
  const costPerFreeUser = totalCosts.free / totalUsers
  const costPerProUser = totalCosts.pro / totalUsers
  const costPerExpertUser = totalCosts.expert / totalUsers

  costs.free.total = costPerFreeUser * users.free
  costs.pro.total = costPerProUser * users.pro
  costs.expert.total = costPerExpertUser * users.expert

  costs.free.singleCost = costPerFreeUser
  costs.pro.singleCost = costPerProUser
  costs.expert.singleCost = costPerExpertUser

  return costs
}

export interface CalculateCostParams {
  users: {
    free: number
    pro: number
    expert: number
  }
  totalCosts: {
    free: number
    pro: number
    expert: number
  }
}

export function calculateCostPerUser({ users, totalCosts }: CalculateCostParams): CostPerUser {
  const costs = allocateCostsToTiers({
    totalCosts,
    users
  })

  return {
    total: totalCosts.free + totalCosts.pro + totalCosts.expert,
    totalCount: users.free + users.pro + users.expert,
    customerCount: users.pro + users.expert,
    free: {
      count: users.free,
      totalCost: costs.free.total,
      singleCost: costs.free.singleCost
    },
    pro: {
      count: users.pro,
      totalCost: costs.pro.total,
      singleCost: costs.pro.singleCost
    },
    expert: {
      count: users.expert,
      totalCost: costs.expert.total,
      singleCost: costs.expert.singleCost
    }
  }
}

export interface CostPerUser {
  total: number
  totalCount: number
  customerCount: number
  free: {
    count: number
    totalCost: number
    singleCost: number
  }
  pro: {
    count: number
    totalCost: number
    singleCost: number
  }
  expert: {
    count: number
    totalCost: number
    singleCost: number
  }
}
