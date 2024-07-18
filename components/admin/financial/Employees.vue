<script setup lang="ts">
const {
  totals,
  months,
  employees,
  openAI,
  office,
  storage,
  digitalOcean,
  devOpsVercel,
  logging,
  chartRanges,
  findLargestValue,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!totals.value.marketingCost || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Monthly Expenses Breakdown',
      subtitle:
        'Provides transparency on how funds are being allocated, reassuring investors about cost management and spending efficiency.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Marketing',
            data: filteredData(totals.value.marketingCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkBrown', 0.5)
          },
          {
            label: employees.value.totalCost.name,
            data: filteredData(employees.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'OpenAI',
            data: filteredData(openAI.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Office',
            data: filteredData(office.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Storage',
            data: filteredData(storage.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Digital Ocean',
            data: filteredData(digitalOcean.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('lightOrange', 0.5)
          },
          {
            label: 'Posthog',
            data: filteredData(logging.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkGray', 0.5)
          },
          {
            label: 'DevOps',
            data: filteredData(devOpsVercel.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Loan',
            data: filteredData(totals.value.loanTotalCost.values, chartRanges.value[0]).value,
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
            type: 'linear'
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
          employees.value.coreTotalSalary.name,
          employees.value.coreTotalExtras.name,
          employees.value.supportTotalSalary.name,
          employees.value.supportTotalExtras.name,
          employees.value.expertsTotalSalary.name,
          employees.value.expertsTotalExtras.name,
          employees.value.foundersTotalSalary.name,
          employees.value.foundersTotalExtras.name,
          employees.value.softwareTotalCost.name
        ],
        datasets: [
          {
            label: 'Employee Expenses Breakdown',
            data: [
              filteredData(
                employees.value.coreTotalSalary.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.coreTotalExtras.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.supportTotalSalary.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.supportTotalExtras.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.expertsTotalSalary.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.expertsTotalExtras.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.foundersTotalSalary.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.foundersTotalExtras.values,
                chartRanges.value[1]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                employees.value.softwareTotalCost.values,
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
          employees.value.foundersTotalCount.name,
          employees.value.supportTotalCount.name,
          employees.value.coreTotalCount.name,
          employees.value.expertsTotalCount.name
        ],
        datasets: [
          {
            label: 'Employee Counts',
            data: [
              findLargestValue(
                filteredData(employees.value.foundersTotalCount.values, chartRanges.value[2]).value
              ),
              findLargestValue(
                filteredData(employees.value.supportTotalCount.values, chartRanges.value[2]).value
              ),
              findLargestValue(
                filteredData(employees.value.coreTotalCount.values, chartRanges.value[2]).value
              ),
              findLargestValue(
                filteredData(employees.value.expertsTotalCount.values, chartRanges.value[2]).value
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
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
