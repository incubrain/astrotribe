import { generateBusinessMetrics } from './totals'
import type { TransactionChunk } from './payments'

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

function formatStorage(sizeInBytes: number): string {
  const absSize = Math.abs(sizeInBytes)
  let formattedSize: string

  if (absSize >= 1_000_000_000_000) {
    // TB
    formattedSize = (absSize / 1_000_000_000_000).toFixed(2) + ' TB'
  } else if (absSize >= 1_000_000_000) {
    // GB
    formattedSize = (absSize / 1_000_000_000).toFixed(2) + ' GB'
  } else if (absSize >= 1_000_000) {
    // MB
    formattedSize = (absSize / 1_000_000).toFixed(2) + ' MB'
  } else if (absSize >= 1_000) {
    // KB
    formattedSize = (absSize / 1_000).toFixed(2) + ' KB'
  } else {
    // Bytes
    formattedSize = absSize + ' bytes'
  }

  return sizeInBytes < 0 ? '-' + formattedSize : formattedSize
}

function findLargestValue(values: number[]): number {
  return Math.max(...values)
}

const colorPalette = {
  darkBlue: [0, 102, 255],
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
  darkYellow: [255, 255, 0],
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

  if (!data) {
    return computed(() => [])
  }

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
  const data = reactive({
    mau: {},
    customers: {},
    capital: {},
    revenue: {},
    affiliate: {},
    advertising: {},
    promotion: {},
    totals: {},
    employees: {},
    office: {},
    storage: {},
    digitalOcean: {},
    logging: {},
    analytics: {},
    devOpsVercel: {},
    devOpsInhouse: {},
    payments: {},
    openAI: {},
    metrics: {},
    months: [],
    stages: [],
    info: {},
    cost: {}
  })

  async function refreshData() {
    try {
      const {
        cost,
        growth,
        metrics,
        capital,
        info: newInfo,
        months: newMonths,
        stages: newStages
      } = await generateBusinessMetrics()

      console.log('generateBusinessMetrics', newMonths)

      data.mau = {
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
      }

      data.customers = {
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
      }

      data.capital = {
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
      }

      data.revenue = {
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
      }

      data.affiliate = {
        total: {
          name: 'Affiliate Revenue',
          values: growth.map((month) => month.revenue.streams.affiliate.revenue)
        }
      }

      data.advertising = {
        total: {
          name: 'Advertising Revenue',
          values: growth.map((month) => month.revenue.streams.advertising.revenue)
        }
      }

      data.promotion = {
        total: {
          name: 'Promotion Revenue',
          values: growth.map((month) => month.revenue.streams.promotion.revenue)
        }
      }

      data.totals = {
        monthlyINR: {
          name: 'Monthly INR',
          values: cost.map((month) => month.totals.monthlyINR)
        },
        employeesTotal: {
          name: 'Employees Total Cost',
          values: cost.map((month) => month.totals.employees)
        },
        paymentsCost: {
          name: 'Payments Total Cost',
          values: cost.map((month) => {
            return month.payments.totalCost
          })
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
        },
        marketingCost: {
          name: 'Marketing Total Cost',
          values: cost.map((month) => month.totals.marketing)
        }
      }

      data.employees = {
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
          values: cost.map((month) => month.software.totalCost)
        },
        softwareServiceCosts: cost.flatMap((month) =>
          month.software.serviceCosts.map((cost) => ({
            name: cost.name,
            values: cost.cost * cost.seats
          }))
        )
      }

      data.office = {
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
      }

      data.storage = {
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
        },
        storageBaseCost: {
          name: 'Storage Base Cost',
          values: cost.map((month) => month.storage.storage.cost.base)
        },
        storageMauCost: {
          name: 'Storage MAU Cost',
          values: cost.map((month) => month.storage.storage.cost.mau)
        },
        storageDbCost: {
          name: 'Storage Database Cost',
          values: cost.map((month) => month.storage.storage.cost.db)
        },
        storageBandwidthCost: {
          name: 'Storage Bandwidth Cost',
          values: cost.map((month) => month.storage.storage.cost.bandwidth)
        },
        storageFileCost: {
          name: 'Storage File Cost',
          values: cost.map((month) => month.storage.storage.cost.fileStorage)
        },
        storageTotalData: {
          name: 'Storage Total Data',
          values: cost.map((month) => month.storage.storage.data.total)
        },
        storageDbData: {
          name: 'Storage Database Data',
          values: cost.map((month) => month.storage.storage.data.db)
        },
        storageVectorData: {
          name: 'Storage Vector Data',
          values: cost.map((month) => month.storage.storage.data.vector)
        },
        computeHourlyCost: {
          name: 'Compute Hourly Cost',
          values: cost.map((month) => month.storage.compute.cost.hourly)
        },
        computeMonthlyCost: {
          name: 'Compute Monthly Cost',
          values: cost.map((month) => month.storage.compute.cost.monthly)
        },
        contentDetails: {
          name: 'Content Details',
          values: cost.map((month) => month.storage.storage.data.details)
        }
      }

      data.digitalOcean = {
        plan: {
          name: 'Digital Ocean Plan',
          values: cost.map((month) => month.digitalOcean.plan)
        },
        totalCost: {
          name: 'Digital Ocean Cost',
          values: cost.map((month) => month.digitalOcean.cost)
        }
      }

      data.logging = {
        totalCost: {
          name: 'Logging Total Cost',
          values: cost.map((month) => month.logging.total)
        },
        ingestedCost: {
          name: 'Logging Ingested Cost',
          values: cost.map((month) => month.logging.ingested)
        },
        retentionCost: {
          name: 'Logging Retention Cost',
          values: cost.map((month) => month.logging.retention)
        },
        metricsCost: {
          name: 'Logging Metrics Cost',
          values: cost.map((month) => month.logging.metrics)
        },
        analyticsCost: {
          name: 'Logging Analytics Cost',
          values: cost.map((month) => month.logging.analytics)
        }
      }

      data.analytics = {
        totalCost: {
          name: 'Analytics Total Cost',
          values: cost.map((month) => month.analytics.total)
        },
        eventsUsage: {
          name: 'Events Usage',
          values: cost.map((month) => month.analytics.events.usage)
        },
        eventsCost: {
          name: 'Events Cost',
          values: cost.map((month) => month.analytics.events.cost)
        },
        recordingsUsage: {
          name: 'Recordings Usage',
          values: cost.map((month) => month.analytics.recordings.usage)
        },
        recordingsCost: {
          name: 'Recordings Cost',
          values: cost.map((month) => month.analytics.recordings.cost)
        },
        featureRequestsUsage: {
          name: 'Feature Requests Usage',
          values: cost.map((month) => month.analytics.featureRequests.usage)
        },
        featureRequestsCost: {
          name: 'Feature Requests Cost',
          values: cost.map((month) => month.analytics.featureRequests.cost)
        },
        surveyResponsesUsage: {
          name: 'Survey Responses Usage',
          values: cost.map((month) => month.analytics.surveyResponses.usage)
        },
        surveyResponsesCost: {
          name: 'Survey Responses Cost',
          values: cost.map((month) => month.analytics.surveyResponses.cost)
        }
      }

      data.devOpsVercel = {
        totalCost: {
          name: 'DevOps Total Cost',
          values: cost.map((month) => month.totals.devOps)
        },
        efficiencyFactor: {
          name: 'Vercel Efficiency Factor',
          values: cost.map((month) => month.devOps.vercel.cost.efficiencyFactor)
        },
        avgUserMonthlyHours: {
          name: 'Vercel Avg User Monthly Hours',
          values: cost.map((month) => month.devOps.vercel.cost.avgUserMonthlyHours)
        },
        dataTransferGB: {
          name: 'Vercel Data Transfer GB',
          values: cost.map((month) => month.devOps.vercel.usage.dataTransferGB)
        },
        originTransferGB: {
          name: 'Vercel Origin Transfer GB',
          values: cost.map((month) => month.devOps.vercel.usage.originTransferGB)
        },
        edgeRequests: {
          name: 'Vercel Edge Requests',
          values: cost.map((month) => month.devOps.vercel.usage.edgeRequests)
        },
        middlewareInvocations: {
          name: 'Vercel Middleware Invocations',
          values: cost.map((month) => month.devOps.vercel.usage.middlewareInvocations)
        },
        sourceImages: {
          name: 'Vercel Source Images',
          values: cost.map((month) => month.devOps.vercel.usage.sourceImages)
        },
        functionInvocations: {
          name: 'Vercel Function Invocations',
          values: cost.map((month) => month.devOps.vercel.usage.functionInvocations)
        },
        functionDurationGBHours: {
          name: 'Vercel Function Duration GB Hours',
          values: cost.map((month) => month.devOps.vercel.usage.functionDurationGBHours)
        },
        edgeFunctionExecutions: {
          name: 'Vercel Edge Function Executions',
          values: cost.map((month) => month.devOps.vercel.usage.edgeFunctionExecutions)
        },
        dataCacheReads: {
          name: 'Vercel Data Cache Reads',
          values: cost.map((month) => month.devOps.vercel.usage.dataCacheReads)
        },
        dataCacheWrites: {
          name: 'Vercel Data Cache Writes',
          values: cost.map((month) => month.devOps.vercel.usage.dataCacheWrites)
        },
        edgeConfigReads: {
          name: 'Vercel Edge Config Reads',
          values: cost.map((month) => month.devOps.vercel.usage.edgeConfigReads)
        },
        edgeConfigWrites: {
          name: 'Vercel Edge Config Writes',
          values: cost.map((month) => month.devOps.vercel.usage.edgeConfigWrites)
        },
        monitoringEvents: {
          name: 'Vercel Monitoring Events',
          values: cost.map((month) => month.devOps.vercel.usage.monitoringEvents)
        },
        speedInsightsDataPoints: {
          name: 'Vercel Speed Insights Data Points',
          values: cost.map((month) => month.devOps.vercel.usage.speedInsightsDataPoints)
        },
        webAnalyticsEvents: {
          name: 'Vercel Web Analytics Events',
          values: cost.map((month) => month.devOps.vercel.usage.webAnalyticsEvents)
        },
        baseCost: {
          name: 'Vercel Base Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.base)
        },
        dataTransferCost: {
          name: 'Vercel Data Transfer Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.dataTransfer)
        },
        originTransferCost: {
          name: 'Vercel Origin Transfer Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.originTransfer)
        },
        edgeRequestsCost: {
          name: 'Vercel Edge Requests Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.edgeRequests)
        },
        middlewareInvocationsCost: {
          name: 'Vercel Middleware Invocations Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.middlewareInvocations)
        },
        sourceImagesCost: {
          name: 'Vercel Source Images Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.sourceImages)
        },
        functionInvocationsCost: {
          name: 'Vercel Function Invocations Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.functionInvocations)
        },
        functionDurationCost: {
          name: 'Vercel Function Duration Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.functionDuration)
        },
        edgeFunctionExecutionsCost: {
          name: 'Vercel Edge Function Executions Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.edgeFunctionExecutions)
        },
        dataCacheReadsCost: {
          name: 'Vercel Data Cache Reads Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.dataCacheReads)
        },
        dataCacheWritesCost: {
          name: 'Vercel Data Cache Writes Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.dataCacheWrites)
        },
        edgeConfigReadsCost: {
          name: 'Vercel Edge Config Reads Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.edgeConfigReads)
        },
        edgeConfigWritesCost: {
          name: 'Vercel Edge Config Writes Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.edgeConfigWrites)
        },
        monitoringCost: {
          name: 'Vercel Monitoring Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.monitoring)
        },
        SpeedInsights: {
          name: 'Vercel Speed Insights Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.speedInsights)
        },
        WebAnalytics: {
          name: 'Vercel Web Analytics Cost',
          values: cost.map((month) => month.devOps.vercel.cost.breakdown.webAnalytics)
        }
      }

      data.devOpsInhouse = {
        inhouseCost: {
          name: 'DevOps Inhouse Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.total)
        },
        inhouseDataTransferGB: {
          name: 'DevOps Inhouse Data Transfer GB',
          values: cost.map((month) => month.devOps.inhouse.usage.dataTransferGB)
        },
        inhouseStorageGB: {
          name: 'DevOps Inhouse Storage GB',
          values: cost.map((month) => month.devOps.inhouse.usage.storageGB)
        },
        inhouseEc2Cost: {
          name: 'Inhouse EC2 Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.ec2Cost)
        },
        inhouseS3Cost: {
          name: 'Inhouse S3 Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.s3Cost)
        },
        inhouseDataTransferCost: {
          name: 'Inhouse Data Transfer Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.dataTransferCost)
        },
        inhouseEksCost: {
          name: 'Inhouse EKS Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.eksCost)
        },
        inhousePrometheusGrafanaCost: {
          name: 'Inhouse Prometheus Grafana Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.prometheusGrafanaCost)
        },
        inhouseCloudflareCost: {
          name: 'Inhouse Cloudflare Cost',
          values: cost.map((month) => month.devOps.inhouse.cost.cloudflareCost)
        }
      }

      data.openAI = {
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
        chatTotalCost: {
          name: 'OpenAI Chat Cost',
          values: cost.map((month) => month.openAI.cost.chat)
        },
        embeddingDetails: {
          name: 'OpenAI Embedding Details',
          values: cost.map((month) =>
            month.openAI.breakdown
              .filter((b) => b.type === 'embedding')
              .map((detail) => ({
                totalCost: detail.embedding.totalCost,
                tokenCost: detail.embedding.tokenCost,
                model: detail.embedding.model,
                batch: detail.embedding.batch
              }))
          )
        },
        summaryDetails: {
          name: 'OpenAI Summary Details',
          values: cost.map((month) =>
            month.openAI.breakdown
              .filter((b) => b.type === 'summary')
              .map((detail) => ({
                totalCost: detail.summary.totalCost,
                inputCost: detail.summary.inputCost,
                outputCost: detail.summary.outputCost,
                tokens: detail.summary.tokens,
                model: detail.summary.model,
                batch: detail.summary.batch
              }))
          )
        },
        chatFreeCost: {
          name: 'OpenAI Chat Free Cost',
          values: cost.map((month) => month.openAI.chat.free.cost.total)
        },
        chatFreeInputCost: {
          name: 'OpenAI Chat Free Input Cost',
          values: cost.map((month) => month.openAI.chat.free.cost.input)
        },
        chatFreeOutputCost: {
          name: 'OpenAI Chat Free Output Cost',
          values: cost.map((month) => month.openAI.chat.free.cost.output)
        },
        chatFreeTokens: {
          name: 'OpenAI Chat Free Tokens',
          values: cost.map((month) => month.openAI.chat.free.tokens.total)
        },
        chatFreeRequests: {
          name: 'OpenAI Chat Free Requests',
          values: cost.map((month) => month.openAI.chat.free.requests)
        },
        chatProCost: {
          name: 'OpenAI Chat Pro Cost',
          values: cost.map((month) => month.openAI.chat.pro.cost.total)
        },
        chatProInputCost: {
          name: 'OpenAI Chat Pro Input Cost',
          values: cost.map((month) => month.openAI.chat.pro.cost.input)
        },
        chatProOutputCost: {
          name: 'OpenAI Chat Pro Output Cost',
          values: cost.map((month) => month.openAI.chat.pro.cost.output)
        },
        chatProTokens: {
          name: 'OpenAI Chat Pro Tokens',
          values: cost.map((month) => month.openAI.chat.pro.tokens.total)
        },
        chatProRequests: {
          name: 'OpenAI Chat Expert Requests',
          values: cost.map((month) => month.openAI.chat.expert.requests)
        },
        chatExpertCost: {
          name: 'OpenAI Chat Expert Cost',
          values: cost.map((month) => month.openAI.chat.expert.cost.total)
        },
        chatExpertInputCost: {
          name: 'OpenAI Chat Expert Input Cost',
          values: cost.map((month) => month.openAI.chat.expert.cost.input)
        },
        chatExpertOutputCost: {
          name: 'OpenAI Chat Expert Output Cost',
          values: cost.map((month) => month.openAI.chat.expert.cost.output)
        },
        chatExpertTokens: {
          name: 'OpenAI Chat Expert Tokens',
          values: cost.map((month) => month.openAI.chat.expert.tokens.total)
        },
        chatExpertRequests: {
          name: 'OpenAI Chat Expert Requests',
          values: cost.map((month) => month.openAI.chat.expert.requests)
        }
      }

      data.metrics = {
        monthlyRecurringRevenue: {
          name: 'Monthly Recurring Revenue',
          values: metrics.map((month) => month.monthlyRecurringRevenue)
        },
        annualRecurringRevenue: {
          name: 'Annual Recurring Revenue',
          values: metrics.map((month) => month.annualRecurringRevenue)
        },
        averageRevenuePerUser: {
          name: 'Average Revenue Per User',
          values: metrics.map((month) => month.averageRevenuePerUser)
        },
        customerLifetimeValue: {
          name: 'Customer Lifetime Value',
          values: metrics.map((month) => month.customerLifetimeValue)
        },
        customerAcquisitionCost: {
          name: 'Customer Acquisition Cost',
          values: metrics.map((month) => month.customerAcquisitionCost)
        },
        mauLifespanMonths: {
          name: 'MAU Lifespan Months',
          values: metrics.map((month) => month.users.lifespanMonths)
        },
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
        },
        customerLifespan: {
          name: 'Customer Lifespan',
          values: metrics.map((month) => month.customerLifespan)
        },
        costPerFreeUser: {
          name: 'Cost Per Free User',
          values: metrics.map((month) => month.users.free.singleCost)
        },
        costPerProUser: {
          name: 'Cost Per Pro User',
          values: metrics.map((month) => month.users.pro.singleCost)
        },
        costPerExpertUser: {
          name: 'Cost Per Expert User',
          values: metrics.map((month) => month.users.expert.singleCost)
        },
        // CHURN
        mauChurnRate: {
          name: 'MAU Churn',
          values: metrics.map((month) => month.users.churnRate)
        },
        customerChurnCost: {
          name: 'Customer Churn Cost',
          values: growth.map((month) => month.revenue.customers.churn.cost)
        },
        customerChurnRate: {
          name: 'Customer Churn Rate',
          values: growth.map((month) => month.revenue.customers.churn.rate)
        },
        customerChurnCount: {
          name: 'Churned Customers',
          values: growth.map((month) => month.revenue.customers.churn.count)
        },
        // REFUND
        customerRefundCost: {
          name: 'Customer Refund Cost',
          values: growth.map((month) => month.revenue.customers.refund.cost)
        },
        customerRefundPro: {
          name: 'Refund Rate Pro',
          values: growth.map((month) => month.revenue.customers.refund.pro)
        },
        customerRefundExpert: {
          name: 'Refund Rate Expert',
          values: growth.map((month) => month.revenue.customers.refund.expert)
        },
        customerRefundCount: {
          name: 'Refunded Customers',
          values: growth.map((month) => month.revenue.customers.refund.count)
        }
      }

      data.payments = {
        razorpayTotalCost: {
          name: 'Razorpay Total Cost',
          values: cost.map((month) => {
            return month.payments.razorpay.totalCost
          })
        },
        razorpayAvgCost: {
          name: 'Razorpay Avg Cost',
          values: cost.map((month) => {
            return month.payments.razorpay.totalCost / month.payments.razorpay.totalCustomers
          })
        },
        razorpayTotalTransactions: {
          name: 'Razorpay Total Cost',
          values: cost.map((month) => {
            return month.payments.razorpay.totalCustomers
          })
        },
        stripeTotalCost: {
          name: 'Stripe Total Cost',
          values: cost.map((month) => {
            return month.payments.stripe.totalCost
          })
        },
        stripeAvgCost: {
          name: 'Stripe Avg Cost',
          values: cost.map((month) => {
            return month.payments.stripe.totalCost / month.payments.stripe.totalCustomers
          })
        },
        stripeTotalTransactions: {
          name: 'Stripe Total Transactions',
          values: cost.map((month) => {
            return month.payments.stripe.totalCustomers
          })
        },
        totalMonthlyCost: {
          name: 'Total Monthly Cost',
          values: cost.map((month) => {
            return month.payments.razorpay.totalCost + month.payments.stripe.totalCost
          })
        },
        domesticVisa: {
          name: 'Domestic Visa',
          values: cost.flatMap((month) =>
            month.payments.razorpay.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'Visa'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        },
        domesticMasterCard: {
          name: 'Domestic MasterCard',
          values: cost.flatMap((month) =>
            month.payments.razorpay.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'MasterCard'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        },
        domesticUPI: {
          name: 'Domestic UPI',
          values: cost.flatMap((month) =>
            month.payments.razorpay.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'UPI'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        },
        internationalCard: {
          name: 'International Card',
          values: cost.flatMap((month) =>
            month.payments.stripe.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'InternationalCard'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        },
        internationalAmericanExpress: {
          name: 'International AmericanExpress',
          values: cost.flatMap((month) =>
            month.payments.stripe.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'AmericanExpress'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        },
        internationalMasterCardVisa: {
          name: 'International MasterCard/Visa',
          values: cost.flatMap((month) =>
            month.payments.stripe.transactions.flatMap((transaction) =>
              transaction.paymentMethod === 'MasterCardVisa'
                ? {
                    totalCost: [transaction.pro.totalCost + transaction.expert.totalCost || 0],
                    totalTransactions: [
                      transaction.pro.numCustomers + transaction.expert.numCustomers || 0
                    ],
                    additionalFees: [
                      transaction.pro.fees.additionalFees +
                        transaction.expert.fees.additionalFees || 0
                    ],
                    gst: [transaction.pro.fees.gst + transaction.expert.fees.gst || 0],
                    subscription: [
                      transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
                    ],
                    base: [transaction.pro.fees.base + transaction.expert.fees.base || 0]
                  }
                : []
            )
          )
        }
      }

      data.info = newInfo
      data.stages.push(...newStages)
      data.months.push(...newMonths)
      data.cost = cost
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(async () => {
    if (!data.months.length) {
      await refreshData()
    }
  })

  return {
    formatINR,
    formatStorage,
    filteredData,
    toggleChartRange,
    findLargestValue,
    refreshData,
    rgba,
    chartRanges,
    ...toRefs(data)
  }
}
