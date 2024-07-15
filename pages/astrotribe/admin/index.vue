<script setup lang="ts">
import {
  AdminFinancialGrowth,
  AdminFinancialOperations,
  AdminFinancialMetrics,
  AdminFinancialTotals,
  AdminFinancialData,
  AdminFinancialEmployees
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
    title: 'Data',
    slotName: 'data',
    value: 5,
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
  <div class="h-full max-h-full">
    <BaseTabView
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
