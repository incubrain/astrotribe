<script setup lang="ts">
const { months, openAI, chartRanges, filteredData, rgba } = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!openAI.value.totalCost || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Logging Costs Breakdown',
      subtitle: 'Shows the breakdown of logging costs for the selected timeperiod.',
      type: 'bar',
      data: {
        labels: [
          openAI.value.embedding.name,
          openAI.value.summary.name,
          openAI.value.chatFreeCost.name,
          openAI.value.chatProCost.name,
          openAI.value.chatExpertCost.name
        ],
        datasets: [
          {
            label: 'Total Logging Costs',
            data: [
              filteredData(openAI.value.embedding.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(
                openAI.value.summary.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                openAI.value.chatFreeCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                openAI.value.chatProCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                openAI.value.chatExpertCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5)
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
      category: 'OpenAI Costs',
      id: 0,
      title: 'OpenAI Cost Breakdown',
      subtitle: 'Shows the total cost breakdown for OpenAI services over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Total Cost',
            type: 'line',
            data: filteredData(openAI.value.totalCost.values, chartRanges.value[0]).value,
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Embedding Cost',
            data: filteredData(openAI.value.embedding.values, chartRanges.value[0]).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Summary Cost',
            data: filteredData(openAI.value.summary.values, chartRanges.value[0]).value,
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Free Chat Cost',
            data: filteredData(openAI.value.chatFreeCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Pro Chat Cost',
            data: filteredData(openAI.value.chatProCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Expert Chat Cost',
            data: filteredData(openAI.value.chatExpertCost.values, chartRanges.value[0]).value,
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
              text: 'Cost (INR)'
            }
          }
        }
      }
    },
    {
      category: 'OpenAI Embedding',
      id: 1,
      title: 'Embedding Details',
      subtitle: 'Shows detailed embedding costs and usage over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Embedding Total Cost',
            data: filteredData(
              openAI.value.embeddingDetails.values.map((d) => d.totalCost),
              chartRanges.value[1]
            ).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Token Cost',
            data: filteredData(
              openAI.value.embeddingDetails.values.map((d) => d.tokenCost),
              chartRanges.value[1]
            ).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
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
      category: 'OpenAI Summary',
      id: 2,
      title: 'Summary Details',
      subtitle: 'Shows detailed summary costs and usage over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Summary Total Cost',
            data: filteredData(
              openAI.value.summaryDetails.values.map((d) => d.totalCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Input Cost',
            data: filteredData(
              openAI.value.summaryDetails.values.map((d) => d.inputCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Output Cost',
            data: filteredData(
              openAI.value.summaryDetails.values.map((d) => d.outputCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2)
          },
          {
            label: 'Tokens Used',
            data: filteredData(
              openAI.value.summaryDetails.values.map((d) => d.tokens),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2)
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
      category: 'OpenAI Chat Costs',
      id: 3,
      title: 'Chat Cost Breakdown',
      subtitle: 'Shows the breakdown of chat costs for free, pro, and expert users over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'Free Chat Total Cost',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(openAI.value.chatFreeCost.values, chartRanges.value[3]).value,
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Pro Chat Total Cost',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(openAI.value.chatProCost.values, chartRanges.value[3]).value,
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Expert Chat Total Cost',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(openAI.value.chatExpertCost.values, chartRanges.value[3]).value,
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Pro Chat Input Cost',
            data: filteredData(openAI.value.chatProInputCost.values, chartRanges.value[3]).value,
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Pro Chat Output Cost',
            data: filteredData(openAI.value.chatProOutputCost.values, chartRanges.value[3]).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Expert Chat Input Cost',
            data: filteredData(openAI.value.chatExpertInputCost.values, chartRanges.value[3]).value,
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Expert Chat Output Cost',
            data: filteredData(openAI.value.chatExpertOutputCost.values, chartRanges.value[3])
              .value,
            backgroundColor: rgba('darkBlue', 0.5)
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
      category: 'OpenAI Chat Usage',
      id: 4,
      title: 'Chat Usage',
      subtitle:
        'Shows the token usage and request counts for free, pro, and expert chat users over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[4]
        ).value,
        datasets: [
          {
            label: 'Free Chat Tokens',
            data: filteredData(openAI.value.chatFreeTokens.values, chartRanges.value[4]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Free Chat Requests',
            data: filteredData(openAI.value.chatFreeRequests.values, chartRanges.value[4]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Pro Chat Tokens',
            data: filteredData(openAI.value.chatProTokens.values, chartRanges.value[4]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Pro Chat Requests',
            data: filteredData(openAI.value.chatProRequests.values, chartRanges.value[4]).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Expert Chat Tokens',
            data: filteredData(openAI.value.chatExpertTokens.values, chartRanges.value[4]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Expert Chat Requests',
            data: filteredData(openAI.value.chatExpertRequests.values, chartRanges.value[4]).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Usage'
            }
          }
        }
      }
    },
    {
      category: 'OpenAI Token Usage',
      id: 5,
      title: 'Monthly Token Usage Comparison',
      subtitle:
        'Compares the token usage across embeddings, summaries, and chat services over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[5]
        ).value,
        datasets: [
          {
            label: 'Embedding Tokens',
            data: filteredData(
              openAI.value.embeddingDetails.values.map((d) => d.tokenCost),
              chartRanges.value[5]
            ).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Summary Tokens',
            data: filteredData(
              openAI.value.summaryDetails.values.map((d) => d.tokens),
              chartRanges.value[5]
            ).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Chat Tokens',
            data: filteredData(openAI.value.chatProTokens.values, chartRanges.value[5]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tokens Used'
            }
          }
        }
      }
    },
    {
      category: 'OpenAI Costs Comparison',
      id: 6,
      title: 'Embedding Cost vs. Summary Cost',
      subtitle: 'Compares the costs of embeddings and summaries over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[6]
        ).value,
        datasets: [
          {
            label: 'Embedding Cost',
            data: filteredData(openAI.value.embedding.values, chartRanges.value[6]).value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Summary Cost',
            data: filteredData(openAI.value.summary.values, chartRanges.value[6]).value,
            backgroundColor: rgba('lightGreen', 0.5)
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
      category: 'OpenAI Chat',
      id: 8,
      title: 'Chat Cost and Token Usage Correlation',
      subtitle: 'Shows the correlation between chat costs and the number of tokens used.',
      type: 'scatter',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[8]
        ).value,
        datasets: [
          {
            label: 'Free Chat Tokens vs. Cost',
            data: filteredData(openAI.value.chatFreeCost.values, chartRanges.value[8]).value.map(
              (cost, index) => ({
                x: cost,
                y: openAI.value.chatFreeTokens.values[index]
              })
            ),
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Pro Chat Tokens vs. Cost',
            data: filteredData(openAI.value.chatProCost.values, chartRanges.value[8]).value.map(
              (cost, index) => ({
                x: cost,
                y: openAI.value.chatProTokens.values[index]
              })
            ),
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Expert Chat Tokens vs. Cost',
            data: filteredData(openAI.value.chatExpertCost.values, chartRanges.value[8]).value.map(
              (cost, index) => ({
                x: cost,
                y: openAI.value.chatExpertTokens.values[index]
              })
            ),
            backgroundColor: rgba('lightOrange', 0.5)
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tokens Used'
            }
          }
        }
      }
    },
    {
      category: 'OpenAI Monthly Costs',
      id: 9,
      title: 'Monthly OpenAI Service Costs',
      subtitle: 'Shows the monthly costs for each OpenAI service.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[9]
        ).value,
        datasets: [
          {
            label: 'Embedding Cost',
            data: filteredData(openAI.value.embedding.values, chartRanges.value[9]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Summary Cost',
            data: filteredData(openAI.value.summary.values, chartRanges.value[9]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Chat Cost',
            data: filteredData(openAI.value.chatTotalCost.values, chartRanges.value[9]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
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
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
