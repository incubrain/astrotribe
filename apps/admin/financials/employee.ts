import { USD2INR, ROUND0 } from './helpers'

const BASE_EMPLOYEE_COUNT = {
  support: 0,
  core: 0,
  experts: 3,
  founders: 2,
}

export const EMPLOYEE_CONFIG = {
  start: {
    support: {
      salary: 10_000,
    },
    core: {
      salary: 10_000,
    },
    experts: {
      salary: 25_000,
    },
    founders: {
      salary: 25_000,
    },
  },
  growth: {
    support: {
      salary: 15_000,
    },
    core: {
      salary: 24_000,
    },
    experts: {
      salary: 40_000,
    },
    founders: {
      salary: 50_000,
    },
  },
  scaling: {
    support: {
      salary: 20_000,
    },
    core: {
      salary: 36_000,
    },
    experts: {
      salary: 50_000,
    },
    founders: {
      salary: 120_000,
    },
  },
  secure: {
    support: {
      salary: 30_000,
    },
    core: {
      salary: 50_000,
    },
    experts: {
      salary: 100_000,
    },
    founders: {
      salary: 400_000,
    },
  },
}

const EMPLOYEE_EXTRAS = {
  recruitment: 500,
  turnover: 1000,
  legal: 1000,
  technology: 1000,
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

interface EmployeeCostParams {
  mau: number
  stage: keyof typeof EMPLOYEE_CONFIG
  month: number
  bootstrapMonths: number
}

export function calculateEmployeeCost({
  mau,
  stage,
  month,
  bootstrapMonths,
}: EmployeeCostParams): EmployeeResult {
  const baseCount = BASE_EMPLOYEE_COUNT
  const stageConfig = EMPLOYEE_CONFIG[stage]

  if (month < bootstrapMonths) {
    // Return base employees and their expenses during bootstrap months
    const calculateBaseCost = (count: number, salary: number) => {
      const totalSalary = count * salary
      const legal = calculateLegalFees(count)
      const technology = EMPLOYEE_EXTRAS.technology * count
      const totalExtras = legal + technology

      return {
        employeeCount: count,
        total: totalSalary + totalExtras,
        totalSalary,
        totalExtras,
        salary,
        turnover: 0,
        legal: legal / count,
        benefits: 0,
        recruitment: 0,
        technology: technology / count,
        mauRatio: undefined,
      }
    }

    const experts = calculateBaseCost(baseCount.experts, stageConfig.experts.salary)
    const founders = calculateBaseCost(baseCount.founders, stageConfig.founders.salary)

    const totalCost = experts.total + founders.total
    const totalEmployees = baseCount.experts + baseCount.founders

    return {
      totalCost,
      efficiency: 0,
      totalCount: totalEmployees,
      support: calculateBaseCost(0, stageConfig.support.salary),
      core: calculateBaseCost(0, stageConfig.core.salary),
      experts,
      founders,
    }
  }

  const efficiency = (mau / 1000) * 0.01
  const supportRatio = 7000 + 2500 * efficiency
  const coreRatio = 8500 + 5000 * efficiency
  const expertsRatio = 15000 + 10000 * efficiency

  const supportCount = baseCount.support + Math.round(mau / supportRatio)
  const coreCount = baseCount.core + Math.round(mau / coreRatio)
  const expertsCount = baseCount.experts + Math.round(mau / expertsRatio)
  const totalEmployees = supportCount + coreCount + expertsCount + baseCount.founders

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
      mauRatio,
    }
  }

  const support = calculateCost(supportCount, stageConfig.support.salary, supportRatio)
  const core = calculateCost(coreCount, stageConfig.core.salary, coreRatio)
  const experts = calculateCost(expertsCount, stageConfig.experts.salary, expertsRatio)
  const founders = calculateCost(baseCount.founders, stageConfig.founders.salary)

  const totalCost = support.total + core.total + experts.total + founders.total

  return {
    totalCost,
    efficiency,
    totalCount: totalEmployees,
    support,
    core,
    experts,
    founders,
  }
}

export type EmployeeResult = {
  totalCost: number
  totalCount: number
  efficiency: number
  support: EmployeeConfig
  core: EmployeeConfig
  experts: EmployeeConfig
  founders: EmployeeConfig
}
