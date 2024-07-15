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
    category: 'Operations',
    id: 0,
    title: 'Balance Over Time',
    subtitle:
      "Shows the company's financial health and sustainability, indicating the ability to cover expenses.",
    type: 'bar',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[0]
      ).value,
      datasets: [
        {
          label: 'Runway',
          type: 'line',
          yAxisID: 'y-axis-2',
          data: filteredData(growth.capital.value.runway.values, chartRanges.value[0]).value,
          borderColor: rgba('lightOrange', 0.5),
          backgroundColor: rgba('lightOrange', 0.5)
        },
        {
          label: 'Burn Rate',
          data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[0]).value,
          borderColor: rgba('darkRed', 0.5),
          backgroundColor: rgba('darkRed', 0.5)
        },
        {
          label: 'Balance End',
          data: filteredData(growth.capital.value.balanceEnd.values, chartRanges.value[0]).value,
          borderColor: rgba('darkGreen', 0.5),
          backgroundColor: rgba('darkGreen', 0.5)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Burn & Balance'
          }
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Runway'
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
  {
    category: 'Operations',
    id: 1,
    title: 'Runway Over Time',
    subtitle:
      'Indicates how many months the company can continue to operate before needing additional funding, showcasing financial management.',
    type: 'line',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[1]
      ).value,
      datasets: [
        {
          label: 'Runway',
          data: filteredData(growth.capital.value.runway.values, chartRanges.value[1]).value,
          borderColor: rgba('lightOrange', 0.5),
          backgroundColor: rgba('lightOrange', 0.5)
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
    category: 'Operations',
    id: 2,
    title: 'Subscription Revenue by Plan',
    subtitle:
      'Breaks down subscription revenue by different plans, highlighting the most profitable segments.',
    type: 'bar',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[2]
      ).value,
      datasets: [
        // {
        //   label: growth.customers.value.totalCount.name,
        //   type: 'line',
        //   yAxisID: 'y-axis-2',
        //   data: filteredData(growth.customers.value.totalCount.values, chartRanges.value[2]).value,
        //   borderColor: rgba('lightPurple', 0.5)
        // },
        {
          label: growth.customers.value.totalConversion.name,
          type: 'line',
          yAxisID: 'y-axis-2',
          data: filteredData(growth.customers.value.totalConversion.values, chartRanges.value[2]).value,
          borderColor: rgba('lightPurple', 0.5)
        },
        {
          label: 'Pro Users Revenue',
          data: filteredData(growth.customers.value.proRevenue.values, chartRanges.value[2]).value,
          backgroundColor: rgba('lightGreen', 0.5)
        },
        {
          label: 'Expert Users Revenue',
          data: filteredData(growth.customers.value.expertRevenue.values, chartRanges.value[2])
            .value,
          backgroundColor: rgba('lightBlue', 0.5)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue'
          },
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Customers'
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
