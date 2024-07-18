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
  freeUsers: number
  proCustomers: number
  expertCustomers: number
}

function allocateCostsToTiers({
  totalCosts,
  freeUsers,
  proCustomers,
  expertCustomers
}: AllocateCostParams): UserTierCost {
  console.log('allocateCostsToTiers', freeUsers, proCustomers, expertCustomers)
  const totalUsers = freeUsers + proCustomers + expertCustomers

  const costs: UserTierCost = {
    free: { total: 0, singleCost: 0 },
    pro: { total: 0, singleCost: 0 },
    expert: { total: 0, singleCost: 0 }
  }

  // Allocate infrastructure costs
  const costPerFreeUser = totalCosts.free / totalUsers
  const costPerProUser = totalCosts.pro / totalUsers
  const costPerExpertUser = totalCosts.expert / totalUsers

  costs.free.total = costPerFreeUser * freeUsers
  costs.pro.total = costPerProUser * proCustomers
  costs.expert.total = costPerExpertUser * expertCustomers

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
  totalIncome: number
}

export function calculateCostPerUser({ users, totalCosts, totalIncome }: CalculateCostParams) {
  const freeUsers = users.free

  const costs = allocateCostsToTiers({
    totalCosts,
    freeUsers,
    proCustomers: users.pro,
    expertCustomers: users.expert
  })

  return {
    free: {
      count: freeUsers,
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
