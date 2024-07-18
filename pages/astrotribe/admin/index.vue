<script setup lang="ts">
const { refreshData, months } = useFinancials()

import {
  AdminFinancialGrowth,
  AdminFinancialOperations,
  AdminFinancialMetrics,
  AdminFinancialTotals,
  AdminFinancialData,
  AdminFinancialEmployees,
  AdminFinancialStorage,
  AdminFinancialAnalytics,
  AdminFinancialDevOps,
  AdminFinancialOpenAI,
  AdminFinancialPayments,
  AdminFinancialLogging
} from '#components'

const financialTabs = [
  {
    title: 'Metrics',
    slotName: 'metrics',
    value: 0,
    component: AdminFinancialMetrics
  },
  {
    title: 'Totals',
    slotName: 'totals',
    value: 1,
    component: AdminFinancialTotals
  },
  {
    title: 'Growth',
    slotName: 'growth',
    value: 2,
    component: AdminFinancialGrowth
  },
  {
    title: 'Operations',
    slotName: 'operations',
    value: 3,
    component: AdminFinancialOperations
  },
  {
    title: 'Employees',
    slotName: 'employees',
    value: 4,
    component: AdminFinancialEmployees
  },
  {
    title: 'Storage',
    slotName: 'storage',
    value: 5,
    component: AdminFinancialStorage
  },
  {
    title: 'Analytics',
    slotName: 'analytics',
    value: 6,
    component: AdminFinancialAnalytics
  },
  {
    title: 'DevOps',
    slotName: 'devops',
    value: 7,
    component: AdminFinancialDevOps
  },
  {
    title: 'OpenAI',
    slotName: 'openai',
    value: 8,
    component: AdminFinancialOpenAI
  },
  {
    title: 'Payments',
    slotName: 'payments',
    value: 9,
    component: AdminFinancialPayments
  },
  {
    title: 'Logging',
    slotName: 'logging',
    value: 10,
    component: AdminFinancialLogging
  },
  {
    title: 'Data',
    slotName: 'data',
    value: 11,
    component: AdminFinancialData
  }
]

definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <button
      @click="refreshData"
      class="absolute right-4 top-4 rounded-lg bg-blue-500 px-3 py-1"
    >
      Refresh
    </button>
    <BaseTabView
      v-if="months.length > 0"
      ref="financialsTabView"
      :tabs="financialTabs"
      class="h-full w-full"
    >
      <template
        v-for="tab in financialTabs"
        v-slot:[tab.slotName]
      >
        <component
          :is="tab.component"
          class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8"
        />
      </template>
    </BaseTabView>
  </div>
</template>

<style scoped></style>
