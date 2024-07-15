<script setup lang="ts">
const {
  expenses,
  growth,
  metrics,
  info,
  months,
  stages,
  chartRanges,
  findLargestValue,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = computed(() => [
  {
    id: 0,
    title: 'Monthly Expenses Breakdown',
    subtitle:
      'Provides transparency on how funds are being allocated, reassuring investors about cost management and spending efficiency.',
    type: 'bar',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[0]
      ).value,
      datasets: [
        {
          label: expenses.employees.value.totalCost.name,
          data: filteredData(expenses.employees.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('lightGreen', 0.5)
        },
        {
          label: 'Office',
          data: filteredData(expenses.office.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('darkPurple', 0.5)
        },
        {
          label: 'Storage',
          data: filteredData(expenses.storage.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('darkBlue', 0.5)
        },
        {
          label: 'Digital Ocean',
          data: filteredData(expenses.digitalOcean.value.totalCost.values, chartRanges.value[0])
            .value,
          backgroundColor: rgba('lightOrange', 0.5)
        },
        {
          label: 'Posthog',
          data: filteredData(expenses.logging.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('darkGray', 0.5)
        },
        {
          label: 'DevOps',
          data: filteredData(expenses.devOps.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('darkRed', 0.5)
        },
        {
          label: 'OpenAI',
          data: filteredData(expenses.openAI.value.totalCost.values, chartRanges.value[0]).value,
          backgroundColor: rgba('darkOrange', 0.5)
        },
        {
          label: 'Loan',
          data: filteredData(expenses.totals.value.loanTotalCost.values, chartRanges.value[0])
            .value,
          backgroundColor: rgba('darkGreen', 0.5)
        }
      ]
    },
    options: {
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true,
          type: 'logarithmic'
        }
      }
    }
  },
  {
    id: 1,
    title: 'Employee Costs',
    subtitle: 'Shows the employee cost by type for the selected timeperiod',
    type: 'bar',
    data: {
      labels: [
        expenses.employees.value.coreTotalSalary.name,
        expenses.employees.value.coreTotalExtras.name,
        expenses.employees.value.supportTotalSalary.name,
        expenses.employees.value.supportTotalExtras.name,
        expenses.employees.value.expertsTotalSalary.name,
        expenses.employees.value.expertsTotalExtras.name,
        expenses.employees.value.foundersTotalSalary.name,
        expenses.employees.value.foundersTotalExtras.name,
        expenses.employees.value.softwareTotalCost.name
      ],
      datasets: [
        {
          label: 'Employee Expenses Breakdown',
          data: [
            filteredData(
              expenses.employees.value.coreTotalSalary.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.coreTotalExtras.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.supportTotalSalary.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.supportTotalExtras.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.expertsTotalSalary.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.expertsTotalExtras.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.foundersTotalSalary.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.foundersTotalExtras.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0),
            filteredData(
              expenses.employees.value.softwareTotalCost.values,
              chartRanges.value[1]
            ).value.reduce((a, b) => a + b, 0)
          ],
          backgroundColor: [
            rgba('lightGreen', 0.5),
            rgba('lightGreen', 0.5),
            rgba('lightBlue', 0.5),
            rgba('lightBlue', 0.5),
            rgba('darkRed', 0.5),
            rgba('darkRed', 0.5),
            rgba('lightOrange', 0.5),
            rgba('lightOrange', 0.5),
            rgba('darkGray', 0.5)
          ]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  },
  {
    id: 2,
    title: 'Employee Count',
    subtitle: 'Shows the MAX employee count for each type for the selected timeperiod',
    type: 'bar',
    data: {
      labels: [
        expenses.employees.value.foundersTotalCount.name,
        expenses.employees.value.supportTotalCount.name,
        expenses.employees.value.coreTotalCount.name,
        expenses.employees.value.expertsTotalCount.name
      ],
      datasets: [
        {
          label: 'Employee Counts',
          data: [
            findLargestValue(
              filteredData(expenses.employees.value.foundersTotalCount.values, chartRanges.value[2])
                .value
            ),
            findLargestValue(
              filteredData(expenses.employees.value.supportTotalCount.values, chartRanges.value[2])
                .value
            ),
            findLargestValue(
              filteredData(expenses.employees.value.coreTotalCount.values, chartRanges.value[2])
                .value
            ),
            findLargestValue(
              filteredData(expenses.employees.value.expertsTotalCount.values, chartRanges.value[2])
                .value
            )
          ],
          backgroundColor: [
            rgba('darkRed', 0.5),
            rgba('lightPurple', 0.5),
            rgba('lightOrange', 0.5),
            rgba('darkGray', 0.5)
          ]
        }
      ]
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
            @click="toggleChartRange(chart.id)"
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
