<script setup lang="ts">
const {
  expenses,
  growth,
  metrics,
  info,
  months,
  stages,
  chartRanges,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = computed(() => [
  {
    category: 'Metrics',
    id: 0,
    title: 'Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) Trends',
    subtitle:
      'Highlights the predictability and stability of revenue, crucial for long-term financial planning.',
    type: 'line',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[0]
      ).value,
      datasets: [
        {
          label: 'MRR',
          data: filteredData(metrics.value.MRR.values, chartRanges.value[0]).value,
          borderColor: rgba('lightGreen', 0.5),
          backgroundColor: rgba('darkGreen', 0.5)
        },
        {
          label: 'ARR',
          data: filteredData(metrics.value.ARR.values, chartRanges.value[0]).value,
          borderColor: rgba('lightBlue', 0.5),
          backgroundColor: rgba('darkBlue', 0.5)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  },
  {
    category: 'Metrics',
    id: 1,
    title: 'Gross Margin and Profit/Loss Margin',
    subtitle:
      'Demonstrates profitability and operational efficiency, key metrics for evaluating business viability.',
    type: 'line',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[1]
      ).value,
      datasets: [
        {
          label: 'Gross Margin',
          yAxisID: 'y-axis-2',
          data: filteredData(metrics.value.grossMargin.values, chartRanges.value[1]).value,
          borderColor: rgba('lightGreen', 0.5),
          backgroundColor: rgba('darkGreen', 0.2)
        },
        {
          label: 'Profit/Loss Margin',
          data: filteredData(metrics.value.profitLossMargin.values, chartRanges.value[1]).value,
          borderColor: rgba('darkRed', 0.5),
          backgroundColor: rgba('darkRed', 0.2)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Profit/Loss Margin'
          }
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Gross Margin'
          },
          ticks: {
            callback: function (value) {
              return formatINR(value)
            }
          },
          grid: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }
        }
      }
    }
  },
  // {
  //   category: 'Metrics',
  //   id: 2,
  //   title: 'Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)',
  //   subtitle:
  //     'Shows the return on investment in acquiring customers, indicating business sustainability.',
  //   type: 'bar',
  //   data: {
  //     labels: filteredData(
  //       months.map((month) => `M${month}`),
  //       chartRanges.value[2]
  //     ).value,
  //     datasets: [
  //       {
  //         label: 'LTV',
  //         data: filteredData(metrics.value.LTV.values, chartRanges.value[2]).value,
  //         backgroundColor: rgba('lightGreen', 0.5)
  //       },
  //       {
  //         label: 'CAC',
  //         data: filteredData(metrics.value.CAC.values, chartRanges.value[2]).value,
  //         backgroundColor: rgba('lightBlue', 0.5)
  //       }
  //     ]
  //   },
  //   options: {
  //     scales: {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }
  //   }
  // },
  // {
  //   category: 'Metrics',
  //   id: 3,
  //   title: 'Marketing Spend Efficiency',
  //   subtitle:
  //     'Measures the effectiveness of marketing expenditures in driving revenue, essential for optimizing marketing strategies.',
  //   type: 'line',
  //   data: {
  //     labels: filteredData(
  //       months.map((month) => `M${month}`),
  //       chartRanges.value[3]
  //     ).value,
  //     datasets: [
  //       {
  //         label: 'Marketing Spend Efficiency',
  //         data: filteredData(metrics.value.marketingSpendEfficiency.values, chartRanges.value[3])
  //           .value,
  //         borderColor: rgba('lightRed', 0.5),
  //         backgroundColor: rgba('darkRed', 0.5)
  //       }
  //     ]
  //   },
  //   options: {
  //     scales: {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }
  //   }
  // },
  {
    category: 'Metrics',
    id: 4,
    title: 'Churn Rate and Retention Rate',
    subtitle:
      'Provides insights into customer loyalty and satisfaction, critical for long-term growth.',
    type: 'line',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[4]
      ).value,
      datasets: [
        {
          label: 'Churn Rate Pro',
          data: filteredData(growth.churn.value.churnRatePro.values, chartRanges.value[4]).value,
          borderColor: rgba('lightRed', 0.5),
          backgroundColor: rgba('darkRed', 0.5)
        },
        {
          label: 'Churn Rate Expert',
          data: filteredData(growth.churn.value.churnRateExpert.values, chartRanges.value[4]).value,
          borderColor: rgba('lightPurple', 0.5),
          backgroundColor: rgba('darkPurple', 0.5)
        },
        // {
        //   label: 'Retention Rate',
        //   data: filteredData(metrics.value.retentionRate.values, chartRanges.value[4]).value,
        //   borderColor: rgba('lightBlue', 0.5),
        //   backgroundColor: rgba('darkBlue', 0.5)
        // }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
])
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 p-4 xl:gap-12">
    <div
      v-for="(chart, index) in charts"
      :key="`financial-chart-${index}`"
      class="flex flex-col gap-4 lg:flex-row xl:gap-12"
    >
      <div class="border-color w-full min-w-[260px] max-w-[360px] space-y-4 rounded-lg border p-4">
        <h3 class="text-2xl font-semibold text-primary-900">{{ chart.title }}</h3>
        <p class="text-lg">{{ chart.subtitle }}</p>
        <div class="flex items-center gap-4">
          <PrimeButton
            @click="toggleChartRange(index)"
            outlined
          >
            Toggle Range
          </PrimeButton>
          <p class="font-semibold text-primary-700"
            >Months: {{ chartRanges[index].start }} - {{ chartRanges[index].end }}</p
          >
        </div>
      </div>
      <Chart
        class="flex h-full w-full items-center justify-center py-8"
        :chart="chart"
        @update:chart-range="toggleChartRange"
      />
    </div>
  </div>
</template>

<style scoped></style>
