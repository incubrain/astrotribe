<script setup lang="ts">
const {
  months,
  capital,
  revenue,
  totals,
  metrics,
  employees,
  advertising,
  affiliate,
  promotion,
  customers,
  filteredData,
  rgba,
} = useFinancials()

const charts = computed(() => {
  console.log('computed data', capital.value)
  if (!capital.value) {
    return []
  }

  return [
    {
      id: 0,
      title: 'Complete Costs Breakdown',
      subtitle: 'Shows the breakdown of OpenAI costs for the selected time period.',
      type: 'bar',
      data: {
        labels: [
          'Employees Total',
          'Software Cost',
          'Office Total Cost',
          'Loan Total Cost',
          'Marketing Cost',
          'Payments Cost',
          'Storage Cost',
          'DevOps Cost',
          'Digital Ocean Total Cost',
          'Logging Cost',
          'Analytics Cost',
          'OpenAI Total Cost',
        ],
        datasets: [
          {
            label: 'Expense Totals',
            valueType: 'currency',
            data: [
              totals.value.flatMap((month) => month.employees).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.software).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.office).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.loan).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.marketing).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.payments).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.storage).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.devOps).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.digitalOcean).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.logging).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.analytics).reduce((a, b) => a + b, 0),
              totals.value.flatMap((month) => month.openAI).reduce((a, b) => a + b, 0),
            ],
            backgroundColor: new Array(12).fill(rgba('darkBlue', 0.5)),
          },
        ],
      },
    },
    {
      id: 1,
      title: 'Revenue Growth Over Time',
      subtitle:
        'Shows the increase in revenue, highlighting the business\'s financial health and growth potential.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Burn Rate',
            type: 'line',
            valueType: 'currency',
            data: capital.value.flatMap((month) => month.burnRate),
            borderColor: rgba('darkOrange', 1),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Effective Revenue',
            valueType: 'currency',
            data: totals.value.flatMap((month) => month.income.effective),
            borderColor: rgba('lightGreen', 0.3),
            backgroundColor: rgba('darkGreen', 0.3),
          },
          {
            label: 'Expenses',
            valueType: 'currency',
            data: totals.value.flatMap((month) => month.expenses.total),
            borderColor: rgba('lightRed', 0.3),
            backgroundColor: rgba('darkRed', 0.3),
          },
        ],
      },
    },
    {
      id: 2,
      title: 'Monthly Revenue Breakdown by Stream',
      subtitle:
        'Shows the diversity of revenue sources, highlighting multiple income streams which reduce financial risk.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Advertising Revenue',
            valueType: 'currency',
            type: 'line',
            data: revenue.value.flatMap((month) => month.total.advertising),
            borderColor: rgba('darkCyan', 1),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Affiliate Revenue',
            valueType: 'currency',
            type: 'line',
            data: revenue.value.flatMap((month) => month.total.affiliate),
            borderColor: rgba('darkOrange', 0.8),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Promotion Revenue',
            valueType: 'currency',
            type: 'line',
            data: revenue.value.flatMap((month) => month.total.promotion),
            borderColor: rgba('darkYellow', 0.7),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Pro Subscription Revenue',
            valueType: 'currency',
            stack: 'stack1',
            data: customers.value.flatMap((month) => month.pro.revenue),
            backgroundColor: rgba('darkGreen', 0.5),
          },
          {
            label: 'Expert Subscription Revenue',
            valueType: 'currency',
            stack: 'stack1',
            data: customers.value.flatMap((month) => month.expert.revenue),
            backgroundColor: rgba('darkBlue', 0.3),
          },
        ],
      },
    },
    {
      id: 3,
      title: 'Capital Balance and Burn Rate',
      subtitle:
        'Offers a comprehensive view of financial health by showing cash reserves against spending rates.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Capital Balance',
            valueType: 'currency',
            data: capital.value.flatMap((month) => month.balance.end),
            borderColor: rgba('lightGreen', 1),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Burn Rate',
            valueType: 'currency',
            type: 'bar',
            data: capital.value.flatMap((month) => month.burnRate),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('darkRed', 0.3),
          },
        ],
      },
    },

    //
    {
      id: 4,
      title: 'Revenue and Expenses Forecast',
      subtitle:
        'Projects future financial performance, helping investors understand potential growth trajectories.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Effective Revenue',
            valueType: 'currency',
            data: totals.value.flatMap((month) => month.income.effective),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Total Revenue',
            valueType: 'currency',
            data: revenue.value.flatMap((month) => month.total.revenue),
            borderColor: rgba('lightPurple', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Total Expenses',
            valueType: 'currency',
            data: totals.value.flatMap((month) => month.expenses.total),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Capital Balance',
            valueType: 'currency',
            data: capital.value.flatMap((month) => month.balance.end),
            type: 'bar',
            backgroundColor: rgba('darkBlue', 0.3),
          },
        ],
      },
    },
    // GROWTH
    {
      title: 'MAU vs Customers',
      subtitle: 'Demonstrates monthly active user acquisition and employee count over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'MAU',
            valueType: 'users',
            data: metrics.value.flatMap((month) => month.mau.total),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
          },
          {
            label: 'Customers',
            type: 'bar',
            valueType: 'users',
            data: metrics.value.flatMap((month) => month.mau.customers),
            borderColor: rgba('lightCyan', 0.5),
            backgroundColor: rgba('darkCyan', 0.5),
          },
        ],
      },
    },
    {
      title: 'Monthly vs. Annual Subscription Growth',
      subtitle:
        'Differentiates between short-term and long-term revenue streams, showcasing subscription stability.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Monthly Subscription Revenue',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.monthlyRecurringRevenue.effective),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
          },
          {
            label: 'Annual Subscription Revenue',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.annualRecurringRevenue.effective),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5),
          },
        ],
      },
    },
    {
      title: 'User Acquisition / Churn vs Employees',
      subtitle:
        'Tracks new, existing, and churned monthly active users, offering insights into user retention and acquisition strategies.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'New Users',
            valueType: 'users',
            data: metrics.value.flatMap((month) => month.mau.new),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
          },
          {
            label: 'Total Users',
            valueType: 'users',
            data: metrics.value.flatMap((month) => month.mau.total),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Churned Users',
            valueType: 'users',
            data: metrics.value.flatMap((month) => month.mau.churned),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Employees',
            valueType: 'employees',
            type: 'bar',
            data: employees.value.flatMap((month) => month.totalCount),
            borderColor: rgba('darkPurple', 0.3),
            backgroundColor: rgba('darkPurple', 0.3),
          },
        ],
      },
    },
    // METRICS
    {
      title: 'Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) Trends',
      subtitle:
        'Highlights the predictability and stability of revenue, crucial for long-term financial planning.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'MRR',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.monthlyRecurringRevenue.effective),
            borderColor: rgba('darkGreen', 0.7),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'ARR',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.annualRecurringRevenue.effective),
            borderColor: rgba('darkBlue', 0.7),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Customers',
            valueType: 'users',
            type: 'bar',
            data: metrics.value.flatMap((month) => month.mau.customers),
            backgroundColor: rgba('darkOrange', 0.3),
          },
        ],
      },
    },
    {
      title: 'Gross Margin and Profit/Loss Margin',
      subtitle:
        'Demonstrates profitability and operational efficiency, key metrics for evaluating business viability.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Gross Margin',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.grossMargin),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.2),
          },
          {
            label: 'Profit/Loss Margin',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.profitLossMargin),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2),
          },
        ],
      },
    },
    {
      title: 'Cost Per User',
      subtitle:
        'Measures the effectiveness of marketing expenditures in driving revenue, essential for optimizing marketing strategies.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Cost Per Free User',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.userCost.free.singleCost),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Cost Per Pro User',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.userCost.pro.singleCost),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Cost Per Expert User',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.userCost.expert.singleCost),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
          },
        ],
      },
    },
    {
      title: 'Churn Rate and Retention Rate',
      subtitle:
        'Provides insights into customer loyalty and satisfaction, critical for long-term growth.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Churn Rate',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.churn.total.rate),
            backgroundColor: rgba('darkOrange', 0.5),
          },
          {
            label: 'Free Churn Rate',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.churn.free.rate),
            backgroundColor: rgba('darkOrange', 0.5),
          },
          {
            label: 'Pro Churn Rate',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.churn.pro.rate),
            backgroundColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Expert Churn Rate',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.churn.expert.rate),
            backgroundColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Free Retention Rate',
            type: 'line',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.retentionRate.free),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('darkOrange', 0.5),
          },
          {
            label: 'Pro Retention Rate',
            type: 'line',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.retentionRate.pro),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Expert Retention Rate',
            type: 'line',
            valueType: 'percentage',
            data: metrics.value.flatMap((month) => month.retentionRate.expert),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('darkRed', 0.5),
          },
        ],
      },
    },
    {
      title: 'Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)',
      subtitle:
        'Shows the return on investment in acquiring customers, indicating business sustainability.',
      type: 'bar',
      scaleType: 'logarithmic',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Customer Lifespan',

            valueType: 'months',
            type: 'line',
            data: metrics.value.flatMap((month) => month.customerLifespan.average),
            borderColor: rgba('lightPink', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'LTV',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.customerLifetimeValue.average),
            backgroundColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Free CAC',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.customerAcquisitionCost.free),
            backgroundColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Pro CAC',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.customerAcquisitionCost.pro),
            backgroundColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Expert CAC',
            valueType: 'currency',
            data: metrics.value.flatMap((month) => month.customerAcquisitionCost.expert),
            backgroundColor: rgba('lightRed', 0.5),
          },
        ],
      },
    },
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
