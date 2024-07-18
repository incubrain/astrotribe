<script setup lang="ts">
const { months, storage, chartRanges, formatINR, formatStorage, filteredData, toggleChartRange, rgba } =
  useFinancials()

function getFirstNumber(...values: any[]): number {
  for (const value of values) {
    if (typeof value === 'number' && !isNaN(value)) {
      return value
    }
  }
  return 0 // Default value if no number is found
}

const charts = ref([] as any[])

watchEffect(() => {
  if (!storage.value.storageMauCost || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Storage Costs Breakdown',
      subtitle: 'Shows the breakdown of storage costs for the selected timeperiod.',
      type: 'bar',
      data: {
        labels: [
          storage.value.storageBaseCost.name,
          storage.value.storageMauCost.name,
          storage.value.storageDbCost.name,
          storage.value.storageBandwidthCost.name,
          storage.value.storageFileCost.name,
          storage.value.computeCost.name
        ],
        datasets: [
          {
            label: 'Total Storage Costs',
            data: [
              filteredData(storage.value.storageBaseCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(storage.value.storageMauCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(storage.value.storageDbCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(
                storage.value.storageBandwidthCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(storage.value.storageFileCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(storage.value.computeCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              )
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('lightBlue', 0.5),
              rgba('darkRed', 0.5),
              rgba('lightRed', 0.5),
              rgba('darkCyan', 0.5)
            ]
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost'
            }
          }
        }
      }
    },
    {
      category: 'Storage Data',
      id: 1,
      title: 'Storage Data Breakdown',
      subtitle: 'Shows the breakdown of storage data over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Database Data',
            data: filteredData(storage.value.storageDbData.values, chartRanges.value[1]).value,
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2)
          },
          {
            label: 'Vector Data',
            data: filteredData(storage.value.storageVectorData.values, chartRanges.value[1]).value,
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
              text: 'Data (GB)'
            }
          }
        }
      }
    },
    {
      category: 'Compute Costs',
      id: 2,
      title: 'Compute Costs',
      subtitle: 'Shows the compute costs over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Hourly Cost',
            data: filteredData(storage.value.computeHourlyCost.values, chartRanges.value[2]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Monthly Cost',
            data: filteredData(storage.value.computeMonthlyCost.values, chartRanges.value[2]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          }
        }
      }
    },
    {
      category: 'Storage Costs',
      id: 3,
      title: 'Storage Requirements by Content Type',
      subtitle: 'Shows the requirements of storage in GB by content type over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'News',
            data: filteredData(
              storage.value.contentDetails.values.map((content) =>
                content
                  .filter((detail) => detail.content.type === 'NEWS')
                  .reduce((acc, curr) => acc + curr.storage.total, 0)
              ),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Research Abstracts',
            data: filteredData(
              storage.value.contentDetails.values.map((content) =>
                content
                  .filter((detail) => detail.content.type === 'RESEARCH_ABSTRACTS')
                  .reduce((acc, curr) => acc + curr.storage.total, 0)
              ),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Research Papers',
            data: filteredData(
              storage.value.contentDetails.values.map((content) =>
                content
                  .filter((detail) => detail.content.type === 'RESEARCH_PAPERS')
                  .reduce((acc, curr) => acc + curr.storage.total, 0)
              ),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Jobs',
            data: filteredData(
              storage.value.contentDetails.values.map((content) =>
                content
                  .filter((detail) => detail.content.type === 'JOBS')
                  .reduce((acc, curr) => acc + curr.storage.total, 0)
              ),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Companies',
            data: filteredData(
              storage.value.contentDetails.values.map((content) =>
                content
                  .filter((detail) => detail.content.type === 'COMPANIES')
                  .reduce((acc, curr) => acc + curr.storage.total, 0)
              ),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('lightRed', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Data (GB)'
            }
          }
        }
      }
    },
    {
      id: 3,
      title: 'Stored Content Count By Type',
      subtitle: 'Shows the number of each content type stored in our database over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[4]
        ).value,
        datasets: [
          {
            label: 'News',
            data: filteredData(
              storage.value.contentDetails.values.flatMap((content) =>
                content.flatMap((detail) => {
                  if (detail.content.type === 'NEWS') {
                    return detail.content.count
                  }
                  return []
                })
              ),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Research Abstracts',
            data: filteredData(
              storage.value.contentDetails.values.flatMap((content) =>
                content.flatMap((detail) => {
                  if (detail.content.type === 'RESEARCH_ABSTRACTS') {
                    return detail.content.count
                  }
                  return []
                })
              ),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Research Papers',
            data: filteredData(
              storage.value.contentDetails.values.flatMap((content) =>
                content.flatMap((detail) => {
                  if (detail.content.type === 'RESEARCH_PAPERS') {
                    return detail.content.count
                  }
                  return []
                })
              ),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Jobs',
            data: filteredData(
              storage.value.contentDetails.values.flatMap((content) =>
                content.flatMap((detail) => {
                  if (detail.content.type === 'JOBS') {
                    return detail.content.count
                  }
                  return []
                })
              ),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Companies',
            data: filteredData(
              storage.value.contentDetails.values.flatMap((content) =>
                content.flatMap((detail) => {
                  if (detail.content.type === 'COMPANIES') {
                    return detail.content.count
                  }
                  return []
                })
              ),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('lightRed', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          }
        }
      }
    },
    // {
    //   category: 'Content Storage',
    //   id: 3,
    //   title: 'Detailed Content Storage',
    //   subtitle: 'Shows the distribution of storage across different content types.',
    //   type: 'pie',
    //   data: {
    //     labels: storage.value.contentDetails.values.map((detail) => {
    //       console.log('testDetail', detail)
    //       return detail
    //     }),
    //     datasets: [
    //       {
    //         label: 'Total Storage',
    //         data: storage.value.contentDetails.values.map((detail) => detail.storage.total),
    //         backgroundColor: storage.value.contentDetails.values.map((_, index) =>
    //           rgba(`color${index}`, 0.5)
    //         )
    //       },
    //       {
    //         label: 'DB Storage',
    //         data: storage.value.contentDetails.values.map((detail) => detail.storage.db),
    //         backgroundColor: storage.value.contentDetails.values.map((_, index) =>
    //           rgba(`color${index}`, 0.5)
    //         )
    //       },
    //       {
    //         label: 'Vector Storage',
    //         data: storage.value.contentDetails.values.map((detail) => detail.storage.vector),
    //         backgroundColor: storage.value.contentDetails.values.map((_, index) =>
    //           rgba(`color${index}`, 0.5)
    //         )
    //       }
    //     ]
    //   }
    // },
    {
      category: 'Storage Correlation',
      id: 4,
      title: 'Storage Costs vs. Data Usage',
      subtitle: 'Shows the correlation between storage costs and data usage over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[4]
        ).value,
        datasets: [
          {
            label: 'Total Cost',
            type: 'line',
            data: filteredData(storage.value.totalCost.values, chartRanges.value[4]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Compute Cost',
            type: 'line',
            data: filteredData(storage.value.computeMonthlyCost.values, chartRanges.value[2]).value,
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('lightOrange', 0.2)
          },
          {
            label: 'Storage Cost',
            type: 'line',
            data: filteredData(storage.value.storageCost.values, chartRanges.value[2]).value,
            borderColor: rgba('lightYellow', 0.5),
            backgroundColor: rgba('lightYellow', 0.2)
          },
          {
            label: 'Total Data',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(storage.value.storageTotalData.values, chartRanges.value[4]).value,
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
              text: 'Cost'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Data'
            }
          }
        }
      }
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
