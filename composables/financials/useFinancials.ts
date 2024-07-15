import { generateBusinessMetrics } from './totals'

function formatINR(amount: number): string {
  const absAmount = Math.abs(amount)
  let formattedAmount

  if (absAmount >= 1_00_00_00_000) {
    formattedAmount = (absAmount / 1_00_00_00_000).toFixed(2) + 'CR'
  } else if (absAmount >= 1_00_00_000) {
    formattedAmount = (absAmount / 1_00_00_000).toFixed(2) + 'CR'
  } else if (absAmount >= 1_00_000) {
    formattedAmount = (absAmount / 1_00_000).toFixed(2) + 'L'
  } else if (absAmount >= 1_000) {
    formattedAmount = (absAmount / 1_000).toFixed(2) + 'K'
  } else {
    formattedAmount = absAmount.toString()
  }

  return amount < 0 ? '-' + formattedAmount : formattedAmount
}

function findLargestValue(values: number[]): number {
  return Math.max(...values)
}

const colorPalette = {
  darkBlue: [46, 59, 78],
  mediumBlue: [83, 104, 120],
  lightBlue: [122, 138, 153],
  darkGray: [161, 176, 186],
  mediumGray: [182, 194, 207],
  lightGray: [199, 210, 221],
  veryLightGray: [216, 226, 235],
  extraLightGray: [233, 241, 245],
  darkRed: [139, 0, 0],
  mediumRed: [178, 34, 34],
  lightRed: [220, 20, 60],
  darkGreen: [0, 100, 0],
  mediumGreen: [34, 139, 34],
  lightGreen: [46, 139, 87],
  darkOrange: [255, 140, 0],
  mediumOrange: [255, 165, 0],
  lightOrange: [255, 215, 0],
  darkPurple: [75, 0, 130],
  mediumPurple: [138, 43, 226],
  lightPurple: [147, 112, 219],
  darkPink: [255, 20, 147],
  mediumPink: [255, 105, 180],
  lightPink: [255, 182, 193],
  darkYellow: [204, 204, 0],
  mediumYellow: [255, 255, 0],
  lightYellow: [255, 255, 153],
  darkCyan: [0, 139, 139],
  mediumCyan: [0, 255, 255],
  lightCyan: [224, 255, 255],
  darkBrown: [139, 69, 19],
  mediumBrown: [160, 82, 45],
  lightBrown: [210, 105, 30],
  black: [0, 0, 0]
}

type ColorName =
  | 'darkBlue'
  | 'mediumBlue'
  | 'lightBlue'
  | 'darkGray'
  | 'mediumGray'
  | 'lightGray'
  | 'veryLightGray'
  | 'extraLightGray'
  | 'darkRed'
  | 'mediumRed'
  | 'lightRed'
  | 'darkGreen'
  | 'mediumGreen'
  | 'lightGreen'
  | 'darkOrange'
  | 'mediumOrange'
  | 'lightOrange'
  | 'darkPurple'
  | 'mediumPurple'
  | 'lightPurple'
  | 'darkPink'
  | 'mediumPink'
  | 'lightPink'
  | 'darkYellow'
  | 'mediumYellow'
  | 'lightYellow'
  | 'darkCyan'
  | 'mediumCyan'
  | 'lightCyan'
  | 'darkBrown'
  | 'mediumBrown'
  | 'lightBrown'
  | 'black'

function toggleChartRange(chartId: number) {
  console.log('toggleRange', chartId)
  if (chartRanges.value[chartId].start === 0) {
    chartRanges.value[chartId] = { start: 12, end: 24 }
  } else {
    chartRanges.value[chartId] = { start: 0, end: 12 }
  }
}

const chartRanges = ref(Array.from({ length: 40 }, () => ({ start: 0, end: 12 })))

type Range = { start: number; end: number }
const filteredData = (data: any[] | any, range: Range = { start: 0, end: 12 }) => {
  const start = Number(range.start)
  const end = Number(range.end)

  if (data.length) {
    return computed(() => data.slice(start, end))
  } else {
    return computed(() => data)
  }
}

// Function to convert RGB to RGBA
function rgba(colorName: ColorName, opacity: number = 1): string {
  const color = colorPalette[colorName]
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
}

export default function useFinancials() {
  const { cost, growth, metrics, capital, info, months, stages } = generateBusinessMetrics()

  const mauDatasets = ref({
    total: { name: 'MAU', values: growth.map((month) => month.mau.total) },
    new: { name: 'New MAU', values: growth.map((month) => month.mau.new) },
    existing: {
      name: 'Existing MAU',
      values: growth.map((month) => month.mau.existing)
    },
    churned: {
      name: 'Churned MAU',
      values: growth.map((month) => month.mau.churned)
    }
  })

  const customersDatasets = ref({
    totalRevenue: {
      name: 'Total Customer Revenue',
      values: growth.map((month) => month.revenue.customers.totalRevenue)
    },
    totalCount: {
      name: 'Total Customer Count',
      values: growth.map((month) => month.revenue.customers.totalCount)
    },
    totalConversion: {
      name: 'Total Conversion Rate',
      values: growth.map((month) => month.revenue.customers.totalConversion)
    },
    proRevenue: {
      name: 'Pro Customer Revenue',
      values: growth.map((month) => month.revenue.customers.pro.revenue)
    },
    proCount: {
      name: 'Pro Customer Count',
      values: growth.map((month) => month.revenue.customers.pro.count)
    },
    expertRevenue: {
      name: 'Expert Customer Revenue',
      values: growth.map((month) => month.revenue.customers.expert.revenue)
    },
    expertCount: {
      name: 'Expert Customer Count',
      values: growth.map((month) => month.revenue.customers.expert.count)
    }
  })

  const capitalDatasets = ref({
    balanceStart: {
      name: 'Capital Balance Start',
      values: capital.map((month) => month.balance.start)
    },
    balanceEnd: {
      name: 'Capital Balance End',
      values: capital.map((month) => month.balance.end)
    },
    runway: {
      name: 'Capital Runway',
      values: capital.map((month) => month.runway)
    },
    burnRate: { name: 'Burn Rate', values: capital.map((month) => month.burnRate) }
  })

  const revenueDatasets = ref({
    total: {
      name: 'Total Revenue',
      values: growth.map((month) => month.revenue.total.revenue)
    },
    effective: {
      name: 'Effective Revenue',
      values: growth.map((month) => month.revenue.total.effective)
    },
    refund: {
      name: 'Refund Loss',
      values: growth.map((month) => month.revenue.customers.refund.cost)
    },
    churn: {
      name: 'Churn Loss',
      values: growth.map((month) => month.revenue.customers.churn.cost)
    }
  })

  const affiliateDatasets = ref({
    total: {
      name: 'Affiliate Revenue',
      values: growth.map((month) => month.revenue.streams.affiliate.revenue)
    }
  })

  const advertisingDatasets = ref({
    total: {
      name: 'Advertising Revenue',
      values: growth.map((month) => month.revenue.streams.advertising.revenue)
    }
  })

  const promotionDatasets = ref({
    total: {
      name: 'Promotion Revenue',
      values: growth.map((month) => month.revenue.streams.promotion.revenue)
    }
  })

  const churnDatasets = ref({
    churnAmount: {
      name: 'Churn Amount',
      values: growth.map((month) => month.revenue.customers.churn.cost)
    },
    churnRatePro: {
      name: 'Churn Rate Pro',
      values: growth.map((month) => month.revenue.customers.churn.pro)
    },
    churnRateExpert: {
      name: 'Churn Rate Expert',
      values: growth.map((month) => month.revenue.customers.churn.expert)
    },
    churnCustomers: {
      name: 'Churn Customers',
      values: growth.map((month) => month.revenue.customers.churn.count)
    },
    refundAmount: {
      name: 'Total Refund Cost',
      values: growth.map((month) => month.revenue.customers.refund.cost)
    },
    refundRatePro: {
      name: 'Refund Rate Pro',
      values: growth.map((month) => month.revenue.customers.refund.pro)
    },
    refundRateExpert: {
      name: 'Refund Rate Expert',
      values: growth.map((month) => month.revenue.customers.refund.expert)
    },
    refundUsers: {
      name: 'Refunded Customers',
      values: growth.map((month) => month.revenue.customers.refund.count)
    }
  })

  const totalExpensesDatasets = ref({
    monthlyINR: {
      name: 'Monthly INR',
      values: cost.map((month) => month.totals.monthlyINR)
    },
    employeesTotal: {
      name: 'Employees Total Cost',
      values: cost.map((month) => month.totals.employees)
    },
    officeTotalCost: {
      name: 'Office Total Cost',
      values: cost.map((month) => month.totals.office)
    },
    storageTotalCost: {
      name: 'Storage Total Cost',
      values: cost.map((month) => month.totals.storage)
    },
    digitalOceanTotalCost: {
      name: 'Digital Ocean Total Cost',
      values: cost.map((month) => month.totals.digitalOcean)
    },
    loanTotalCost: {
      name: 'Loan Total Cost',
      values: cost.map((month) => month.totals.loan)
    }
  })

  const employeesDatasets = ref({
    totalCount: {
      name: 'Total Employees',
      values: cost.map((month) => month.employees.totalEmployees)
    },
    totalCost: {
      name: 'Employee Cost',
      values: cost.map((month) => month.totals.employees)
    },
    supportTotalCost: {
      name: 'Support Total Cost',
      values: cost.map((month) => month.employees.support.total)
    },
    supportTotalSalary: {
      name: 'Support Total Salary',
      values: cost.map((month) => month.employees.support.totalSalary)
    },
    supportTotalExtras: {
      name: 'Support Total Extras',
      values: cost.map((month) => month.employees.support.totalExtras)
    },
    supportTotalCount: {
      name: 'Support Employee Count',
      values: cost.map((month) => month.employees.support.employeeCount)
    },
    coreTotalCost: {
      name: 'Core Total Cost',
      values: cost.map((month) => month.employees.core.total)
    },
    coreTotalSalary: {
      name: 'Core Total Salary',
      values: cost.map((month) => month.employees.core.totalSalary)
    },
    coreTotalExtras: {
      name: 'Core Total Extras',
      values: cost.map((month) => month.employees.core.totalExtras)
    },
    coreTotalCount: {
      name: 'Core Employee Count',
      values: cost.map((month) => month.employees.core.employeeCount)
    },
    expertsTotalCost: {
      name: 'Experts Total Cost',
      values: cost.map((month) => month.employees.experts.total)
    },
    expertsTotalSalary: {
      name: 'Experts Total Salary',
      values: cost.map((month) => month.employees.experts.totalSalary)
    },
    expertsTotalExtras: {
      name: 'Experts Total Extras',
      values: cost.map((month) => month.employees.experts.totalExtras)
    },
    expertsTotalCount: {
      name: 'Experts Employee Count',
      values: cost.map((month) => month.employees.experts.employeeCount)
    },
    foundersTotalCost: {
      name: 'Founders Total Cost',
      values: cost.map((month) => month.employees.founders.total)
    },
    foundersTotalSalary: {
      name: 'Founders Total Salary',
      values: cost.map((month) => month.employees.founders.totalSalary)
    },
    foundersTotalExtras: {
      name: 'Founders Total Extras',
      values: cost.map((month) => month.employees.founders.totalExtras)
    },
    foundersTotalCount: {
      name: 'Founders Total Count',
      values: cost.map((month) => month.employees.founders.employeeCount)
    },
    softwareTotalCost: {
      name: 'Software Total Cost',
      values: cost.map((month) => month.employees.software.totalCost)
    },
    softwareServiceCosts: cost.flatMap((month) =>
      month.employees.software.serviceCosts.map((cost) => ({
        name: cost.name,
        values: cost.cost * cost.seats
      }))
    )
  })

  const officeDatasets = ref({
    totalCost: {
      name: 'Office Total Cost',
      values: cost.map((month) => month.totals.office)
    },
    space: {
      name: 'Office Space',
      values: cost.map((month) => month.office.officeSpace)
    },
    supplies: {
      name: 'Office Supplies',
      values: cost.map((month) => month.office.supplies)
    },
    utilities: {
      name: 'Office Utilities',
      values: cost.map((month) => month.office.utilities)
    },
    snacks: {
      name: 'Office Snacks',
      values: cost.map((month) => month.office.snacks)
    },
    miscellaneous: {
      name: 'Office Miscellaneous',
      values: cost.map((month) => month.office.miscellaneous)
    }
  })

  const storageDatasets = ref({
    totalCost: {
      name: 'Storage Total Cost',
      values: cost.map((month) => month.totals.storage)
    },
    storageCost: {
      name: 'Storage Storage Cost',
      values: cost.map((month) => month.storage.storage.cost.total)
    },
    computeCost: {
      name: 'Storage Compute Cost',
      values: cost.map((month) => month.storage.compute.cost.total)
    }
  })

  const digitalOceanDatasets = ref({
    plan: {
      name: 'Digital Ocean Plan',
      values: cost.map((month) => month.digitalOcean.plan)
    },
    totalCost: {
      name: 'Digital Ocean Cost',
      values: cost.map((month) => month.digitalOcean.cost)
    }
  })

  const loggingDatasets = ref({
    totalCost: {
      name: 'Logging Total Cost',
      values: cost.map((month) => month.logging.total)
    }
  })

  const devOpsDatasets = ref({
    totalCost: {
      name: 'DevOps Total Cost',
      values: cost.map((month) => month.totals.devOps)
    },
    efficiencyFactor: {
      name: 'DevOps Efficiency Factor',
      values: cost.map((month) => month.devOps.vercel.usage.efficiencyFactor)
    },
    avgUserMonthlyHours: {
      name: 'DevOps Avg User Monthly Hours',
      values: cost.map((month) => month.devOps.vercel.usage.avgUserMonthlyHours)
    }
  })

  const openAIDatasets = ref({
    totalCost: {
      name: 'OpenAI Total Cost',
      values: cost.map((month) => month.openAI.cost.total)
    },
    embedding: {
      name: 'OpenAI Embedding Cost',
      values: cost.map((month) => month.openAI.cost.embedding)
    },
    summary: {
      name: 'OpenAI Summary Cost',
      values: cost.map((month) => month.openAI.cost.summary)
    },
    chat: {
      name: 'OpenAI Chat Cost',
      values: cost.map((month) => month.openAI.cost.chat)
    }
  })

  const metricsDatasets = ref({
    MRR: { name: 'MRR', values: metrics.map((month) => month.MRR) },
    ARR: { name: 'ARR', values: metrics.map((month) => month.ARR) },
    ARPU: { name: 'ARPU', values: metrics.map((month) => month.ARPU) },
    LTV: { name: 'LTV', values: metrics.map((month) => month.LTV) },
    CAC: { name: 'CAC', values: metrics.map((month) => month.CAC) },
    retentionRate: {
      name: 'Retention Rate',
      values: metrics.map((month) => month.retentionRate)
    },
    totalConversionRate: {
      name: 'Total Conversion Rate',
      values: metrics.map((month) => month.totalConversionRate)
    },
    grossMargin: {
      name: 'Gross Margin',
      values: metrics.map((month) => month.grossMargin)
    },
    marketingSpendEfficiency: {
      name: 'Marketing Spend Efficiency',
      values: metrics.map((month) => month.marketingSpendEfficiency)
    },
    profitLossMargin: {
      name: 'Profit Loss Margin',
      values: metrics.map((month) => month.profitLossMargin)
    }
  })

  return {
    formatINR,
    filteredData,
    toggleChartRange,
    findLargestValue,
    rgba,
    chartRanges,
    months,
    stages,
    expenses: {
      employees: employeesDatasets,
      totals: totalExpensesDatasets,
      office: officeDatasets,
      openAI: openAIDatasets,
      devOps: devOpsDatasets,
      storage: storageDatasets,
      logging: loggingDatasets,
      digitalOcean: digitalOceanDatasets
    },
    growth: {
      mau: mauDatasets,
      revenue: revenueDatasets,
      capital: capitalDatasets,
      customers: customersDatasets,
      affiliate: affiliateDatasets,
      advertising: advertisingDatasets,
      promotion: promotionDatasets,
      churn: churnDatasets
    },
    info: ref(info),
    metrics: metricsDatasets
  }
}
