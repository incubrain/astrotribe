<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'

const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research',
    isFlagged: false,
    limit: 100
  })
})

const isFlagged = ref(false)
const abstracts = computed(() =>
  isFlagged.value ? researchData.value.research.flagged : researchData.value.research.data
)

const showTable = ref(false)

const toggleView = () => {
  showTable.value = !showTable.value
}

interface Column {
  field: string
  header: string
  style: string
  editor?: string
  component?: string
  editorProps?: Record<string, unknown>
}

const columns: Column[] = [
  { field: 'id', header: 'ID', style: 'width: 5%' },
  { field: 'title', header: 'Title', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'abstract', header: 'Abstract', style: 'width: 10%', editor: 'PrimeInputText' },
  {
    field: 'abstract_url',
    header: 'URL',
    style: 'width: 10%',
    component: 'LinkButton',
    editor: 'PrimeInputText'
  },
  { field: 'is_flagged', header: 'Flagged', style: 'width: 10%', editor: 'PrimeToggleSwitch' }
]

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  abstract: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  abstract_url: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
})

const showLatex = ref(false)

const toggleLatex = () => {
  showLatex.value = !showLatex.value
}
</script>

<template>
  <div class="relative">
    <AdminResearchHeader>
      <PrimeButton @click="toggleView"> {{ showTable ? 'Grid' : 'Table' }} </PrimeButton>
      <PrimeButton @click="toggleLatex"> {{ showLatex ? 'LaTeX Shown' : 'No LaTeX' }} </PrimeButton>
      <p>Total Chunks: {{ abstracts.length }}</p>
    </AdminResearchHeader>
    <div v-if="abstracts.length">
      <BaseTableAdmin
        v-if="showTable"
        :columns="columns"
        :tableData="abstracts"
        :filters="filters"
        :filter-fields="['title', 'abstract', 'abstract_url']"
      >
        <template #header>
          <h3 class="text-lg font-semibold"> Manage Abstracts</h3>
        </template>
      </BaseTableAdmin>
      <div
        v-else
        class="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-8"
      >
        <AdminResearchCard
          v-for="doc in abstracts"
          :key="doc.id"
          :doc="{
            body: doc.abstract,
            url: doc.abstract_url,
            title: doc.title,
            id: doc.id,
            published_at: doc.published_at
          }"
          :show-latex="showLatex"
        >
          <template #header>
            <PrimeButton
              @click="
                researchStore.flagItem({
                  tableName: 'research',
                  itemId: doc.id,
                  isFlagged: doc.is_flagged
                })
              "
              :severity="doc.is_flagged ? 'danger' : 'primary'"
            >
              {{ doc.is_flagged ? 'Unflag' : 'Flag' }}
            </PrimeButton>
          </template>
          <template #tags>
            <PrimeTag>
              affiliations:
              {{ doc.affiliations?.length }}
            </PrimeTag>
            <PrimeTag>
              authors:
              {{ doc.authors?.length }}
            </PrimeTag>
            <PrimeTag>
              pages:
              {{ doc.page_count }}
            </PrimeTag>
            <PrimeTag>
              tables:
              {{ doc.table_count }}
            </PrimeTag>
            <PrimeTag>
              figures:
              {{ doc.figure_count }}
            </PrimeTag>
          </template>
          <template #content>
            <p class="font-semibold"> {{ doc.published_in }} </p>
            <p class="text-sm pt-4"> {{ doc.comments }} </p>
          </template>
        </AdminResearchCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
