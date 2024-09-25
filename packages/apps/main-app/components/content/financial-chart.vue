<template>
  <div>
    <Chart
      v-if="chartDataKey"
      :chart="currentChartData"
    />
  </div>
</template>

<script setup lang="ts">
type ChartDataKey =
  | 'users'
  | 'revenue'
  | 'globalMarket'
  | 'indianMarket'
  | 'affiliateRevenue'
  | 'useOfFunds'
  | 'financialProgress'

const props = defineProps({
  chartDataKey: {
    type: String as PropType<ChartDataKey>,
    required: true,
  },
})

// Financial Data
const initialFreeUsers = 10000
const year2FreeUsers = 50000
const year3FreeUsers = 200000

const conversionRateYear1 = 0.03
const conversionRateYear2 = 0.06

const proPricePerMonth = 30
const expertPricePerMonth = 50

const advertisingCPM = 10
const affiliateCommissionYear1 = 0.1
const affiliateCommissionYear2 = 0.15
const affiliateCommissionYear3 = 0.2
const averageSale = 50
const conversionRateAffiliate = 0.05

// User Projections
function getFreeUsers(year: number): number {
  switch (year) {
    case 1:
      return initialFreeUsers
    case 2:
      return year2FreeUsers
    case 3:
      return year3FreeUsers
    default:
      throw new Error('Year must be 1, 2, or 3')
  }
}

function getConversionRate(year: number): number {
  switch (year) {
    case 1:
      return conversionRateYear1
    case 2:
      return conversionRateYear2
    case 3:
      return conversionRateYear2
    default:
      throw new Error('Year must be 1, 2, or 3')
  }
}

function getAffiliateCommission(year: number): number {
  switch (year) {
    case 1:
      return affiliateCommissionYear1
    case 2:
      return affiliateCommissionYear2
    case 3:
      return affiliateCommissionYear3
    default:
      throw new Error('Year must be 1, 2, or 3')
  }
}

// User Segmentation
function calculatePayingUsers(
  freeUsers: number,
  conversionRate: number,
): { proUsers: number, expertUsers: number } {
  const payingUsers = freeUsers * conversionRate
  const proUsers = payingUsers * 0.5
  const expertUsers = payingUsers * 0.5
  return { proUsers, expertUsers }
}

// Revenue Calculations
function calculateSubscriptionRevenue(users: number, pricePerMonth: number): number {
  return users * pricePerMonth * 12 // annual revenue
}

function calculateAdvertisingRevenue(impressionsPerMonth: number, cpm: number): number {
  return (impressionsPerMonth / 1000) * cpm * 12 // annual revenue
}

function calculateAffiliateRevenue(
  clicksPerMonth: number,
  conversionRate: number,
  averageSale: number,
  commissionRate: number,
): number {
  const sales = clicksPerMonth * conversionRate
  const revenue = sales * averageSale
  return revenue * commissionRate * 12 // annual revenue
}

// Yearly Projections
function getClicksPerMonth(year: number): number {
  switch (year) {
    case 1:
      return 10000
    case 2:
      return 50000
    case 3:
      return 200000
    default:
      throw new Error('Year must be 1, 2, or 3')
  }
}

function getImpressionsPerMonth(year: number): number {
  switch (year) {
    case 1:
      return 100000
    case 2:
      return 500000
    case 3:
      return 2000000
    default:
      throw new Error('Year must be 1, 2, or 3')
  }
}

function calculateYearlyRevenue(year: number): {
  proRevenue: number
  expertRevenue: number
  adRevenue: number
  affiliateRevenue: number
} {
  const freeUsers = getFreeUsers(year)
  const conversionRate = getConversionRate(year)
  const clicksPerMonth = getClicksPerMonth(year)
  const impressionsPerMonth = getImpressionsPerMonth(year)
  const affiliateCommission = getAffiliateCommission(year)

  const { proUsers, expertUsers } = calculatePayingUsers(freeUsers, conversionRate)

  const proRevenue = calculateSubscriptionRevenue(proUsers, proPricePerMonth)
  const expertRevenue = calculateSubscriptionRevenue(expertUsers, expertPricePerMonth)
  const adRevenue = calculateAdvertisingRevenue(impressionsPerMonth, advertisingCPM)
  const affiliateRevenue = calculateAffiliateRevenue(
    clicksPerMonth,
    conversionRateAffiliate,
    averageSale,
    affiliateCommission,
  )

  return { proRevenue, expertRevenue, adRevenue, affiliateRevenue }
}

// Example Usage
const year1Revenue = calculateYearlyRevenue(1)
const year2Revenue = calculateYearlyRevenue(2)
const year3Revenue = calculateYearlyRevenue(3)

const labels = {
  years: ['Year 1', 'Year 2', 'Year 3'],
}

const chartStyle = {
  backgroundColor: [
    'rgba(249, 115, 22, 0.2)',
    'rgba(6, 182, 212, 0.2)',
    'rgb(107, 114, 128, 0.2)',
    'rgba(139, 92, 246 0.2)',
  ],
  borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
  borderWidth: 1,
}

const chartStyleFreeUsers = {
  backgroundColor: 'rgba(249, 115, 22, 0.2)',
  borderColor: 'rgb(249, 115, 22)',
  borderWidth: 1,
}

const chartStyleProUsers = {
  backgroundColor: 'rgba(6, 182, 212, 0.2)',
  borderColor: 'rgb(6, 182, 212)',
  borderWidth: 1,
}

const chartStyleExpertUsers = {
  backgroundColor: 'rgba(107, 114, 128, 0.2)',
  borderColor: 'rgb(107, 114, 128)',
  borderWidth: 1,
}

const financialProgressChart = {
  id: 2,
  title: 'Financial and User Growth Over 12 Months',
  subtitle: 'Revenue, Expenses, User Base, and Capital',
  scaleType: 'logarithmic',
  type: 'bar',
  data: {
    labels: [
      'Month 1',
      'Month 2',
      'Month 3',
      'Month 4',
      'Month 5',
      'Month 6',
      'Month 7',
      'Month 8',
      'Month 9',
      'Month 10',
      'Month 11',
      'Month 12',
    ],
    datasets: [
      {
        label: 'Basic Plan Revenue',
        data: [0, 0, 24000, 46200, 79200, 124800, 189000, 241800, 288000, 326700, 367200, 420000],
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        stack: 'stack1',
        valueType: 'currency' as const,
      },
      {
        label: 'Medium Plan Revenue',
        data: [0, 0, 48000, 92400, 158400, 249600, 378000, 483600, 576000, 653400, 734400, 840000],
        backgroundColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 1,
        valueType: 'currency' as const,
        stack: 'stack1',
      },
      {
        label: 'Pro Plan Revenue',
        data: [0, 0, 0, 0, 0, 249600, 378000, 483600, 576000, 653400, 734400, 840000],
        backgroundColor: 'rgba(107, 114, 128, 0.6)',
        borderColor: 'rgb(107, 114, 128)',
        borderWidth: 1,
        valueType: 'currency' as const,
        stack: 'stack1',
      },
      {
        label: 'B2B Plan Revenue',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 50000, 100000, 150000, 200000],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        valueType: 'currency' as const,
        stack: 'stack1',
      },
      {
        label: 'Ad Revenue',
        data: [
          0, 10000, 20000, 35000, 55000, 80000, 105000, 130000, 150000, 165000, 180000, 200000,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        valueType: 'currency' as const,
        stack: 'stack1',
      },
      {
        label: 'Expenses',
        data: [
          200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000,
          200000,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        valueType: 'currency' as const,
      },
      {
        label: 'Total Users',
        data: [500, 2000, 4000, 7000, 11000, 16000, 21000, 26000, 30000, 33000, 36000, 40000],
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        valueType: 'number' as const,
        type: 'line',
      },
      {
        label: 'Paid Users',
        data: [0, 0, 80, 154, 264, 416, 630, 806, 960, 1089, 1224, 1400],
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
        valueType: 'number' as const,
        type: 'line',
      },
      {
        label: 'Capital',
        data: [
          790000, 610000, 502000, 475600, 568200, 1072200, 1922200, 3061200, 4501200, 6199700,
          8165700, 10365700,
        ],
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 2,
        valueType: 'currency' as const,
      },
    ],
  },
  info: [
    { name: 'Final Month Revenue', value: '₹24,00,000' },
    { name: 'User Growth', value: '5,000 to 40,000' },
    { name: 'Capital Growth', value: '₹7,90,000 to ₹1,03,65,700' },
    { name: 'Conversion Rate Growth', value: '2.0% to 3.5%' },
  ],
}

const currentChartData = computed(() => chartData[props.chartDataKey])

const useOfFundsChart = {
  id: 1,
  scaleType: 'linear' as const,
  title: 'Use of Funds Breakdown',
  subtitle: 'Allocation of 10,00,000 INR initial investment',
  type: 'pie',
  data: {
    labels: [
      'Product Development',
      'Marketing and User Acquisition',
      'Team Expansion',
      'Operational Costs',
    ],
    datasets: [
      {
        label: 'Cost',
        data: [400000, 300000, 200000, 100000],
        backgroundColor: [
          'rgba(249, 115, 22, 0.6)',
          'rgba(6, 182, 212, 0.6)',
          'rgba(107, 114, 128, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderColor: [
          'rgb(249, 115, 22)',
          'rgb(6, 182, 212)',
          'rgb(107, 114, 128)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
        valueType: 'currency' as const,
      },
    ],
  },
  info: [
    { name: 'Total Investment', value: '₹10,00,000' },
    { name: 'Largest Allocation', value: 'Product Development (₹4,00,000)' },
    { name: 'Smallest Allocation', value: 'Operational Costs (₹1,00,000)' },
  ],
}

const chartData = {
  financialProgress: financialProgressChart,
  useOfFunds: useOfFundsChart,
  users: {
    labels: labels.years,
    datasets: [
      {
        type: 'line',
        label: 'Free Users',
        data: [initialFreeUsers, year2FreeUsers, year3FreeUsers],
        ...chartStyleFreeUsers,
      },
      {
        type: 'line',
        label: 'Pro Users',
        data: [
          calculatePayingUsers(initialFreeUsers, conversionRateYear1).proUsers,
          calculatePayingUsers(year2FreeUsers, conversionRateYear2).proUsers,
          calculatePayingUsers(year3FreeUsers, conversionRateYear2).proUsers,
        ],
        ...chartStyleProUsers,
      },
      {
        type: 'line',
        label: 'Expert Users',
        data: [
          calculatePayingUsers(initialFreeUsers, conversionRateYear1).expertUsers,
          calculatePayingUsers(year2FreeUsers, conversionRateYear2).expertUsers,
          calculatePayingUsers(year3FreeUsers, conversionRateYear2).expertUsers,
        ],
        ...chartStyleExpertUsers,
      },
    ],
  },
  revenue: {
    labels: labels.years,
    datasets: [
      {
        label: 'Advertising Revenue',
        data: [year1Revenue.adRevenue, year2Revenue.adRevenue, year3Revenue.adRevenue],
        ...chartStyle,
      },
      {
        label: 'Pro Revenue',
        data: [year1Revenue.proRevenue, year2Revenue.proRevenue, year3Revenue.proRevenue],
        ...chartStyle,
      },
      {
        label: 'Expert Revenue',
        data: [year1Revenue.expertRevenue, year2Revenue.expertRevenue, year3Revenue.expertRevenue],
        ...chartStyle,
      },
    ],
  },
  globalMarket: {
    labels: [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035],
    datasets: [
      {
        label: '7.5% YOY Growth',
        data: [
          535.0, 575.125, 618.259375, 664.6288281249999, 714.4759902343749, 768.061689501953,
          825.6663162145994, 887.5912899306943, 954.1606366754963, 1025.7226844261586,
          1102.6518857581204, 1185.3507771899795, 1274.2520854792278,
        ],
      },
      {
        label: '9% YOY Growth',
        data: [
          535.0, 583.1500000000001, 635.6335000000001, 692.8405150000002, 755.1961613500002,
          823.1638158715003, 897.2485592999354, 978.0009296369298, 1066.0210133042535,
          1161.9629045016363, 1266.5395659067838, 1380.5281268383944, 1504.77565825385,
        ],
      },
      {
        label: '16% YOY Growth',
        data: [
          535.0, 620.5999999999999, 719.8959999999998, 835.0793599999997, 968.6920575999997,
          1123.6827868159996, 1303.4720327065595, 1512.0275579396089, 1753.9519672099461,
          2034.5842819635375, 2360.1177670777033, 2737.7366098101356, 3175.774467379757,
        ],
      },
    ],
  },

  indianMarket: {
    labels: [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035],
    datasets: [
      {
        label: '7.5% YOY Growth',
        data: [
          8.4, 9.03, 9.71, 10.44, 11.23, 12.06, 12.97, 13.95, 15.01, 16.14, 17.35, 18.66, 20.06,
        ],
      },
      {
        label: '9% YOY Growth',
        data: [8.4, 9.16, 9.99, 10.89, 11.87, 12.93, 14.08, 15.33, 16.69, 18.2, 19.84, 21.63, 23.58],
      },
      {
        label: '16% YOY Growth',
        data: [8.4, 9.74, 11.3, 13.1, 15.2, 17.63, 20.45, 23.72, 27.51, 31.91, 37.01, 42.93, 49.8],
      },
    ],
  },

  affiliateRevenue: {
    labels: labels.years,
    datasets: [
      {
        label: 'Affiliate Revenue',
        data: [
          year1Revenue.affiliateRevenue,
          year2Revenue.affiliateRevenue,
          year3Revenue.affiliateRevenue,
        ],
        ...chartStyle,
      },
    ],
  },
}
</script>

<style scoped></style>
