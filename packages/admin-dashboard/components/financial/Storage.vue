<script setup lang="ts">
const { months, storage, rgba } = useFinancials()

const storageDetails = computed(() => storage.value?.flatMap((m) => m.storage.data.details) || [])

const charts = computed(() => {
  if (!months.value || !storage.value) {
    return []
  }

  return [
    {
      title: 'Storage Costs Breakdown',
      subtitle: 'Shows the breakdown of storage costs for the selected time period.',
      type: 'bar',
      data: {
        labels: [
          'Storage Base Cost',
          'Storage MAU Cost',
          'Database Cost',
          'Bandwidth Cost',
          'File Storage Cost',
          'Compute Cost',
        ],
        datasets: [
          {
            label: 'Total Storage Costs',
            valueType: 'currency',
            data: [
              storage.value.flatMap((m) => m.storage.cost.base).reduce((a, b) => a + b, 0),
              storage.value.flatMap((m) => m.storage.cost.mau).reduce((a, b) => a + b, 0),
              storage.value.flatMap((m) => m.storage.cost.db).reduce((a, b) => a + b, 0),
              storage.value.flatMap((m) => m.storage.cost.bandwidth).reduce((a, b) => a + b, 0),
              storage.value.flatMap((m) => m.storage.cost.fileStorage).reduce((a, b) => a + b, 0),
              storage.value.flatMap((m) => m.compute.cost.total).reduce((a, b) => a + b, 0),
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('lightBlue', 0.5),
              rgba('darkRed', 0.5),
              rgba('lightRed', 0.5),
              rgba('darkCyan', 0.5),
            ],
          },
        ],
      },
    },
    {
      title: 'Storage Data Breakdown',
      subtitle: 'Shows the breakdown of storage data over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Database Data',
            valueType: 'storage',
            data: storage.value.flatMap((m) => m.storage.data.db),
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2),
          },
          {
            label: 'Vector Data',
            valueType: 'storage',
            data: storage.value.flatMap((m) => m.storage.data.vector),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2),
          },
        ],
      },
    },
    {
      title: 'Compute Costs',
      subtitle: 'Shows the compute costs over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Hourly Cost',
            valueType: 'currency',
            data: storage.value.flatMap((m) => m.compute.cost.hourly),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Monthly Cost',
            valueType: 'currency',
            data: storage.value.flatMap((m) => m.compute.cost.monthly),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
        ],
      },
    },
    {
      title: 'Storage Requirements by Content Type',
      subtitle: 'Shows the requirements of storage in GB by content type over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'News',
            valueType: 'storage',
            data: storageDetails.value.flatMap((detail) =>
              detail.content.type === 'NEWS' ? detail.storage.total : [],
            ),
            borderColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Research Abstracts',
            valueType: 'storage',
            data: storageDetails.value.flatMap((detail) =>
              detail.content.type === 'RESEARCH_ABSTRACTS' ? detail.storage.total : [],
            ),
            borderColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Research Papers',
            valueType: 'storage',
            data: storageDetails.value.flatMap((detail) =>
              detail.content.type === 'RESEARCH_PAPERS' ? detail.storage.total : [],
            ),
            borderColor: rgba('lightBlue', 0.5),
          },
          {
            label: 'Jobs',
            valueType: 'storage',
            data: storageDetails.value.flatMap((detail) =>
              detail.content.type === 'JOBS' ? detail.storage.total : [],
            ),
            borderColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Companies',
            valueType: 'storage',
            data: storageDetails.value.flatMap((detail) =>
              detail.content.type === 'COMPANIES' ? detail.storage.total : [],
            ),
            borderColor: rgba('lightRed', 0.5),
          },
        ],
      },
    },
    {
      title: 'Storage Costs vs. Data Usage',
      subtitle: 'Shows the correlation between storage costs and data usage over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Cost',
            valueType: 'number',
            data: storage.value.flatMap((m) => m.totalCost),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
          {
            label: 'Compute Cost',
            valueType: 'number',
            data: storage.value.flatMap((m) => m.compute.cost.total),
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('lightOrange', 0.2),
          },
          {
            label: 'Storage Cost',
            valueType: 'number',
            data: storage.value.flatMap((m) => m.storage.cost.total),
            borderColor: rgba('lightYellow', 0.5),
            backgroundColor: rgba('lightYellow', 0.2),
          },
          {
            label: 'Total Data',
            valueType: 'storage',
            type: 'bar',
            data: storage.value.flatMap((m) => m.storage.data.total),
            borderColor: rgba('darkGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
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
