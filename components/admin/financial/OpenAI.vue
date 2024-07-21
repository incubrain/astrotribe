<script setup lang="ts">
const { months, openAI, rgba } = useFinancials()

const embeddingDetails = computed(() =>
  openAI.value.map((month) =>
    month.breakdown.reduce(
      (acc, detail) => {
        acc.totalCost += detail.embedding.totalCost
        acc.totalTokens += detail.embedding.tokens.total
        return acc
      },
      {
        totalCost: 0,
        totalTokens: 0,
        model: '',
        batch: ''
      }
    )
  )
)

const summaryDetails = computed(() =>
  openAI.value.map((month) =>
    month.breakdown.reduce(
      (acc, detail) => {
        acc.totalCost += detail.summary.cost.total
        acc.inputCost += detail.summary.cost.input
        acc.outputCost += detail.summary.cost.output
        acc.totalTokens += detail.summary.tokens.total
        acc.inputTokens += detail.summary.tokens.input
        acc.outputTokens += detail.summary.tokens.output
        return acc
      },
      {
        totalCost: 0,
        inputCost: 0,
        outputCost: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        model: '',
        batch: ''
      }
    )
  )
)

console.log('details', summaryDetails.value)
// embeddingDetails.value.flatMap((detail) =>
//   detail.map((d) => d.totalCost).reduce((a, b) => a + b, 0)
// )

const charts = computed(() => {
  if (!months.value.length) {
    return []
  }

  return [
    {
      title: 'OpenAI Costs Breakdown',
      subtitle: 'Shows the breakdown of OpenAI costs for the selected time period.',
      type: 'bar',
      data: {
        labels: ['Total Cost', 'Embedding Cost', 'Summary Cost', 'Chat Cost'],
        datasets: [
          {
            label: 'Total OpenAI Costs',
            valueType: 'currency',
            data: [
              openAI.value.map((month) => month.cost.total).reduce((a, b) => a + b, 0),
              openAI.value.map((month) => month.cost.embedding).reduce((a, b) => a + b, 0),
              openAI.value.map((month) => month.cost.summary).reduce((a, b) => a + b, 0),
              openAI.value.map((month) => month.cost.chat).reduce((a, b) => a + b, 0)
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
      }
    },
    {
      title: 'OpenAI Token Breakdown',
      subtitle: 'Shows the breakdown of OpenAI token usage for the selected time period.',
      type: 'bar',
      data: {
        labels: [
          'Free Chat Input',
          'Free Chat Output',
          'Pro Chat Input',
          'Pro Chat Output',
          'Expert Chat Input',
          'Expert Chat Output',
          'Embeddings',
          'Summary Input',
          'Summary Output'
        ],
        datasets: [
          {
            label: 'Token Usage',
            valueType: 'number',
            data: [
              openAI.value
                .flatMap((month) => month.chat.free.tokens.input)
                .reduce((a, b) => a + b, 0),
              openAI.value
                .flatMap((month) => month.chat.free.tokens.output)
                .reduce((a, b) => a + b, 0),
              openAI.value
                .flatMap((month) => month.chat.pro.tokens.input)
                .reduce((a, b) => a + b, 0),
              openAI.value
                .flatMap((month) => month.chat.pro.tokens.output)
                .reduce((a, b) => a + b, 0),
              openAI.value
                .flatMap((month) => month.chat.expert.tokens.input)
                .reduce((a, b) => a + b, 0),
              openAI.value
                .flatMap((month) => month.chat.expert.tokens.output)
                .reduce((a, b) => a + b, 0),
              embeddingDetails.value.map((d) => d.totalTokens).reduce((a, b) => a + b, 0),
              summaryDetails.value.map((d) => d.inputTokens).reduce((a, b) => a + b, 0),
              summaryDetails.value.map((d) => d.outputTokens).reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5)
            ]
          }
        ]
      }
    },
    {
      title: 'OpenAI Cost Breakdown',
      subtitle: 'Shows the total cost breakdown for OpenAI services over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Cost',
            valueType: 'currency',
            type: 'line',
            data: openAI.value.flatMap((month) => month.cost.total),
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Embedding Cost',
            stack: 'stack1',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.embedding),
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Summary Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: openAI.value.flatMap((month) => month.cost.summary),
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Free Chat Cost',
            valueType: 'currency',
            stack: 'stack2',
            data: openAI.value.flatMap((month) => month.chat.free.cost.total),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Pro Chat Cost',
            valueType: 'currency',
            stack: 'stack2',
            data: openAI.value.flatMap((month) => month.chat.pro.cost.total),
            backgroundColor: rgba('darkPink', 0.5)
          },
          {
            label: 'Expert Chat Cost',
            valueType: 'currency',
            stack: 'stack2',
            data: openAI.value.flatMap((month) => month.chat.expert.cost.total),
            backgroundColor: rgba('darkPurple', 0.5)
          }
        ]
      }
    },
    {
      title: 'Embedding Details',
      subtitle: 'Shows detailed embedding costs and usage over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Embedding Total Cost',
            valueType: 'currency',
            data: embeddingDetails.value.map((detail) => detail.totalCost),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Token Usage',
            valueType: 'number',
            type: 'bar',
            data: embeddingDetails.value.map((detail) => detail.totalTokens),
            backgroundColor: rgba('darkOrange', 0.3)
          }
        ]
      }
    },
    {
      title: 'Summary Details',
      subtitle: 'Shows detailed summary costs and usage over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Summary Total Cost',
            valueType: 'currency',
            data: summaryDetails.value.map((d) => d.totalCost),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Input Cost',
            valueType: 'currency',
            data: summaryDetails.value.map((d) => d.inputCost),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Output Cost',
            valueType: 'currency',
            data: summaryDetails.value.map((d) => d.outputCost),
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2)
          },
          {
            label: 'Tokens Used',
            valueType: 'number',
            type: 'bar',
            data: summaryDetails.value.map((d) => d.totalTokens),
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2)
          }
        ]
      }
    },
    {
      title: 'Chat Cost Breakdown',
      subtitle: 'Shows the breakdown of chat costs for free, pro, and expert users over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Free Chat Total Cost',
            type: 'line',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.free.cost.total),
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Pro Chat Total Cost',
            type: 'line',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.pro.cost.total),
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Expert Chat Total Cost',
            type: 'line',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.expert.cost.total),
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Pro Chat Input Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.pro.cost.input),
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Pro Chat Output Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.pro.cost.output),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Expert Chat Input Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.expert.cost.input),
            backgroundColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Expert Chat Output Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.chat.expert.cost.output),
            backgroundColor: rgba('darkBlue', 0.5)
          }
        ]
      }
    },
    {
      title: 'Chat Usage',
      subtitle:
        'Shows the token usage and request counts for free, pro, and expert chat users over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Free Chat Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.free.tokens.total),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Free Chat Requests',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.free.requests.total),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Pro Chat Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.pro.tokens.total),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Pro Chat Requests',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.pro.requests.total),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Expert Chat Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.expert.tokens.total),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Expert Chat Requests',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.chat.expert.requests.total),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      }
    },
    {
      title: 'Monthly Token Usage Comparison',
      subtitle:
        'Compares the token usage across embeddings, summaries, and chat services over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Embedding Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((detail) => detail.tokens.embedding),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Summary Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((detail) => detail.tokens.summary),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Chat Tokens',
            valueType: 'number',
            data: openAI.value.flatMap((month) => month.tokens.chat),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Total Tokens',
            valueType: 'number',
            type: 'bar',
            data: openAI.value.flatMap((month) => month.tokens.total),
            backgroundColor: rgba('darkOrange', 0.3)
          }
        ]
      }
    },
    {
      title: 'Embedding Cost vs. Summary Cost',
      subtitle: 'Compares the costs of embeddings and summaries over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Embedding Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.embedding),
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Summary Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.summary),
            backgroundColor: rgba('lightGreen', 0.5)
          }
        ]
      }
    },
    {
      title: 'Monthly OpenAI Service Costs',
      subtitle: 'Shows the monthly costs for each OpenAI service.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Embedding Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.embedding),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Summary Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.summary),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Chat Cost',
            valueType: 'currency',
            data: openAI.value.flatMap((month) => month.cost.chat),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
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
