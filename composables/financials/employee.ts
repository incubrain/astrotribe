import { USD2INR, ROUND0 } from './totals'

type Subscription = {
  name: string
  baseCost: number
  seatCost: number
  annualDiscount: number
  seatRatio: number
}

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

function calculateMonthlyCost(subscription: Subscription, seats: number): number {
  return USD2INR(subscription.baseCost + subscription.seatCost * seats)
}

function calculateAnnualCost(subscription: Subscription, seats: number): number {
  return (subscription.seatCost - subscription.annualDiscount) * seats
}

function calculateSubscriptionCosts(totalEmployees: number) {
  const serviceCosts = []
  let totalCost = 0
  for (const subscription of subscriptions) {
    const numberOfSeats = ROUND0(Math.ceil(totalEmployees * subscription.seatRatio))
    const cost = calculateMonthlyCost(subscription, numberOfSeats)
    totalCost += cost
    serviceCosts.push({ name: subscription.name, seats: numberOfSeats, cost: ROUND0(cost) })
    // const annualCost = calculateAnnualCost(subscription, numberOfSeats);
  }

  return { totalCost: ROUND0(totalCost), serviceCosts }
}

const BASE_EMPLOYEE_COUNT = {
  support: 2,
  core: 2,
  experts: 1,
  founders: 2
}

export const EMPLOYEE_CONFIG = {
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

// Function to calculate benefits as a percentage of salary
function calculateBenefits(salary: number, employeeCount: number): number {
  if (employeeCount <= 10) return 0
  return salary * 0.15 // Assuming 15% of salary as benefits
}

// Function to calculate legal fees based on number of employees
function calculateLegalFees(employeeCount: number): number {
  const baseLegalFee = EMPLOYEE_EXTRAS.legal
  return baseLegalFee * employeeCount
}

// Function to calculate turnover costs
function calculateTurnoverCosts(employeeCount: number): number {
  const baseTurnoverCost = EMPLOYEE_EXTRAS.turnover
  const industryAverageAttrition = 0.15 // 15% annual attrition rate
  return baseTurnoverCost * employeeCount * industryAverageAttrition
}

type EmployeeType = 'support' | 'core' | 'experts' | 'founders'

export type EmployeeConfig = {
  employeeCount: number
  total: number
  totalSalary: number
  totalExtras: number
  salary: number
  benefits: number
  turnover: number
  legal: number
  recruitment: number
  technology: number
  mauRatio?: number
}

export type EmployeeResult = {
  totalCost: number
  totalEmployees: number
  efficiency: number
  support: EmployeeConfig
  core: EmployeeConfig
  experts: EmployeeConfig
  founders: EmployeeConfig
  software: {
    totalCost: number
    serviceCosts: { name: string; seats: number; cost: number }[]
  }
}

export function calculateEmployeeCost(
  mau: number,
  stage: keyof typeof EMPLOYEE_CONFIG
): EmployeeResult {
  const baseCount = BASE_EMPLOYEE_COUNT
  const stageConfig = EMPLOYEE_CONFIG[stage]

  // EXTRACT IF POSSIBLE
  const efficiency = (mau / 1000) * 0.01
  const supportRatio = 7000 + 2500 * efficiency
  const coreRatio = 8500 + 5000 * efficiency
  const expertsRatio = 15000 + 10000 * efficiency

  const supportCount = baseCount.support + Math.round(mau / supportRatio)
  const coreCount = baseCount.core + Math.round(mau / coreRatio)
  const expertsCount = baseCount.experts + Math.round(mau / expertsRatio)
  const totalEmployees = supportCount + coreCount + expertsCount + baseCount.founders

  const software = calculateSubscriptionCosts(
    supportCount + coreCount + expertsCount + baseCount.founders
  )

  const calculateCost = (count: number, salary: number, mauRatio?: number) => {
    const totalSalary = count * salary
    const benefits = calculateBenefits(salary, totalEmployees)
    const legal = calculateLegalFees(count)
    const turnover = calculateTurnoverCosts(count)
    const recruitment = EMPLOYEE_EXTRAS.recruitment * count
    const technology = EMPLOYEE_EXTRAS.technology * count
    const totalExtras = turnover + legal + recruitment + technology + benefits * count

    return {
      employeeCount: count,
      total: totalSalary + totalExtras,
      totalSalary,
      totalExtras,
      salary,
      turnover: turnover / count,
      legal: legal / count,
      benefits: benefits,
      recruitment: recruitment / count,
      technology: technology / count,
      mauRatio
    }
  }

  const support = calculateCost(supportCount, stageConfig.support.salary, supportRatio)
  const core = calculateCost(coreCount, stageConfig.core.salary, coreRatio)
  const experts = calculateCost(expertsCount, stageConfig.experts.salary, expertsRatio)
  const founders = calculateCost(baseCount.founders, stageConfig.founders.salary)

  const totalCost = support.total + core.total + experts.total + founders.total + software.totalCost

  return {
    totalCost,
    efficiency,
    totalEmployees,
    support,
    core,
    experts,
    founders,
    software
  }
}
