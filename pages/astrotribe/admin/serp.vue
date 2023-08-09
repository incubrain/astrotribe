<template>
  <div class="space-y-4 xl:space-y-8">
    <div class="space-x-4 xl:space-x-8">
      <UDropdown
        :items="[items]"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="white"
          :label="currentKeyword"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
      </UDropdown>
      <UButton @click="test"> Scrape </UButton>
    </div>
    <!-- <UTable
      :rows="rows"
      :columns="columns"
      @select="select"
    /> -->
  </div>
</template>

<script setup lang="ts">
import keywords from '@/server/utils/openai/categories.json'
const items = keywords.map((keyword) => {
  return {
    label: keyword.name,
    onClick: () => {
      currentKeyword.value = keyword.name
    }
  }
})

function select(row) {
  window.open(row.url, '_blank')
}

const test = async () => {
  await useFetch('/api/admin/scrape-search')
}

const currentKeyword = ref(keywords[0].name)
const rows = ref()
const columns = [
  {
    key: 'keyword',
    label: 'Keyword'
  },
  {
    key: 'url',
    label: 'URL',
    sortable: true
  },
  {
    key: 'title',
    label: 'Title'
  },
  {
    key: 'rank',
    label: 'Rank'
  }
]

// const { data, error } = await useFetch(
//   () => `/api/admin/get-search?keyword=${currentKeyword.value.toLowerCase().replaceAll(' ', '-')}`,
//   {
//     watch: [currentKeyword]
//   }
// )
// if (error.value) {
//   console.log(error.value)
// }

// watch(
//   data,
//   (newData) => {
//     if (newData) {
//       rows.value = newData.items.organic.map((item: any) => {
//         return {
//           keyword: currentKeyword.value,
//           url: item.link,
//           title: item.title,
//           rank: `${item.rank} / global ${item.global_rank}`
//         }
//       })
//     }
//   },
//   { immediate: true }
// )

definePageMeta({ name: 'Serp' })
</script>
