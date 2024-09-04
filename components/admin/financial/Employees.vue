<script setup lang="ts">
const {
  totals,
  months,
  employees,
  software,
  office,
  storage,
  digitalOcean,
  devOps,
  logging,
  findLargestValue,
  rgba
} = useFinancials()

const charts = computed(() => {
  if (!months.value || !employees.value) {
    return []
  }

  return [
    {
      title: 'Monthly Expenses Breakdown',
      subtitle:
        'Provides transparency on how funds are being allocated, reassuring investors about cost management and spending efficiency.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Marketing',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.marketing),
            backgroundColor: rgba('darkBrown', 0.5)
          },
          {
            label: 'Employee Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.employees),
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'OpenAI Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.openAI),
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Office Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.office),
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Storage Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.storage),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Digital Ocean Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.digitalOcean),
            backgroundColor: rgba('lightOrange', 0.5)
          },
          {
            label: 'Logging Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.logging),
            backgroundColor: rgba('darkGray', 0.5)
          },
          {
            label: 'DevOps Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.devOps),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Loan Total Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: totals.value.flatMap((m) => m.loan),
            backgroundColor: rgba('darkGreen', 0.5)
          }
        ]
      }
    },
    {
      title: 'Employee Costs',
      subtitle: 'Shows the employee cost by type for the selected timeperiod',
      type: 'bar',
      data: {
        labels: [
          'Core Total Salary',
          'Core Total Extras',
          'Support Total Salary',
          'Support Total Extras',
          'Experts Total Salary',
          'Experts Total Extras',
          'Founders Total Salary',
          'Founders Total Extras',
          'Software Total Cost'
        ],
        datasets: [
          {
            label: 'Employee Expenses Breakdown',
            valueType: 'currency',
            data: [
              employees.value.flatMap((m) => m.core.totalSalary).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.core.totalExtras).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.support.totalSalary).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.support.totalExtras).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.experts.totalSalary).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.experts.totalExtras).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.founders.totalSalary).reduce((a, b) => a + b, 0),
              employees.value.flatMap((m) => m.founders.totalExtras).reduce((a, b) => a + b, 0),
              software.value.flatMap((m) => m.totalCost).reduce((a, b) => a + b, 0)
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
      }
    },
    {
      title: 'Employee Count',
      subtitle: 'Shows the MAX employee count for each type for the selected timeperiod',
      type: 'bar',
      data: {
        labels: [
          'Founders Total Count',
          'Support Total Count',
          'Core Total Count',
          'Experts Total Count'
        ],
        datasets: [
          {
            label: 'Employee Counts',
            valueType: 'employees',
            data: [
              findLargestValue(employees.value.flatMap((month) => month.founders.employeeCount)),
              findLargestValue(employees.value.flatMap((month) => month.support.employeeCount)),
              findLargestValue(employees.value.flatMap((month) => month.core.employeeCount)),
              findLargestValue(employees.value.flatMap((month) => month.experts.employeeCount))
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
