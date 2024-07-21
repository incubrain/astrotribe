<script setup lang="ts">
const { refreshData, updateGlobalRange, months } = useFinancials()

import {
  LazyAdminFinancialEmployees,
  LazyAdminFinancialDevOps,
  LazyAdminFinancialOperations,
  LazyAdminFinancialTotals,
  LazyAdminFinancialData,
  LazyAdminFinancialStorage,
  LazyAdminFinancialAnalytics,
  LazyAdminFinancialOpenAI,
  LazyAdminFinancialPayments,
  LazyAdminFinancialLogging
} from '#components'

const financialTabs = [
  {
    title: 'Totals',
    slotName: 'totals',
    value: '0',
    component: LazyAdminFinancialTotals
  },
  {
    title: 'Operations',
    slotName: 'operations',
    value: '2',
    component: LazyAdminFinancialOperations
  },
  {
    title: 'Employees',
    slotName: 'employees',
    value: '4',
    component: LazyAdminFinancialEmployees
  },
  {
    title: 'Storage',
    slotName: 'storage',
    value: '5',
    component: LazyAdminFinancialStorage
  },
  {
    title: 'Analytics',
    slotName: 'analytics',
    value: '6',
    component: LazyAdminFinancialAnalytics
  },
  {
    title: 'DevOps',
    slotName: 'devops',
    value: '7',
    component: LazyAdminFinancialDevOps
  },
  {
    title: 'OpenAI',
    slotName: 'openai',
    value: '8',
    component: LazyAdminFinancialOpenAI
  },
  {
    title: 'Payments',
    slotName: 'payments',
    value: '9',
    component: LazyAdminFinancialPayments
  },
  {
    title: 'Logging',
    slotName: 'logging',
    value: '10',
    component: LazyAdminFinancialLogging
  },
  {
    title: 'Data',
    slotName: 'data',
    value: '11',
    component: LazyAdminFinancialData
  }
]
const dataIsReady = ref(false)

onMounted(async () => {
  if (!months.value.length) {
    await refreshData()
  }
  dataIsReady.value = true
})

const sliderValue = ref([0, 12])

watch(
  sliderValue,
  (newVal) => {
    updateGlobalRange({ start: newVal[0], end: newVal[1] })
  },
  { deep: true }
)

definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <BaseTabView
      v-if="dataIsReady"
      ref="financialsTabView"
      :tabs="financialTabs"
      class="h-full w-full"
    >
      <template
        v-for="tab in financialTabs"
        v-slot:[tab.slotName]
      >
        <div class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8">
          <div class="flex gap-4 h-full">
            <div class="flex gap-2 items-center flex-col">
              <p class="text-sm font-semibold">Start</p>
              <PrimeInputNumber
                showButtons
                buttonLayout="vertical"
                style="width: 3rem"
                v-model="sliderValue[0]"
                inputId="minmax"
                :min="1"
                :max="23"
              />
            </div>
            <div class="flex flex-col gap-2 items-center">
              <p class="text-sm font-semibold">End</p>
              <PrimeInputNumber
                showButtons
                buttonLayout="vertical"
                style="width: 3rem"
                v-model="sliderValue[1]"
                inputId="minmax"
                :min="2"
                :max="24"
              />
            </div>
            <div class="flex flex-col gap-4">
              <p class="text-sm font-semibold">Month Range Selector</p>
              <PrimeSlider
                v-model="sliderValue"
                range
                class="w-56"
                :min="0"
                :max="24"
                :step="1"
              />
            </div>
          </div>
          <component :is="tab.component" />
        </div>
      </template>
    </BaseTabView>
  </div>
</template>

<style scoped></style>
