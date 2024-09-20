<script setup lang="ts">
import {
  AdminFinancialTotals,
  AdminFinancialOperations,
  AdminFinancialEmployees,
  AdminFinancialStorage,
  AdminFinancialAnalytics,
  AdminFinancialDevOps,
  AdminFinancialOpenAI,
  AdminFinancialPayments,
  AdminFinancialLogging,
  // AdminFinancialData
} from '#components'

definePageMeta({
  layoutTransition: false,
  name: 'AdminFinancials',
  layout: 'admin',
  middleware: 'is-admin',
})

const { updateGlobalRange, haveData } = useFinancials()

const financialTabs = [
  {
    title: 'Totals',
    slotName: 'totals',
    value: '0',
    component: AdminFinancialTotals,
  },
  {
    title: 'Operations',
    slotName: 'operations',
    value: '2',
    component: AdminFinancialOperations,
  },
  {
    title: 'Employees',
    slotName: 'employees',
    value: '4',
    component: AdminFinancialEmployees,
  },
  {
    title: 'Storage',
    slotName: 'storage',
    value: '5',
    component: AdminFinancialStorage,
  },
  {
    title: 'Analytics',
    slotName: 'analytics',
    value: '6',
    component: AdminFinancialAnalytics,
  },
  {
    title: 'DevOps',
    slotName: 'devops',
    value: '7',
    component: AdminFinancialDevOps,
  },
  {
    title: 'OpenAI',
    slotName: 'openai',
    value: '8',
    component: AdminFinancialOpenAI,
  },
  {
    title: 'Payments',
    slotName: 'payments',
    value: '9',
    component: AdminFinancialPayments,
  },
  {
    title: 'Logging',
    slotName: 'logging',
    value: '10',
    component: AdminFinancialLogging,
  },
  // {
  //   title: 'Data',
  //   slotName: 'data',
  //   value: '11',
  //   component: AdminFinancialData,
  // }
]

const range = ref([0, 12])

watch(
  range,
  (newVal) => {
    console.log('range', newVal)
    updateGlobalRange({ start: newVal[0], end: newVal[1] })
  },
  { deep: true },
)

const visibleRight = ref(false)
</script>

<template>
  <div class="relative h-full max-h-full">
    <IbTabView
      v-if="haveData"
      ref="financialsTabView"
      :tabs="financialTabs"
      class="h-full w-full"
    >
      <template
        v-for="tab in financialTabs"
        :key="tab.slotName"
        #[tab.slotName]
      >
        <div class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8">
          <div>
            <PrimeButton @click="visibleRight = true"> Options </PrimeButton>
          </div>

          <PrimeDrawer
            v-model:visible="visibleRight"
            header="Right Drawer"
            position="right"
          >
            <div class="flex h-full gap-4">
              <div class="flex flex-col items-center gap-2">
                <p class="text-sm font-semibold"> Start </p>
                <PrimeInputNumber
                  v-model="range[0]"
                  show-buttons
                  button-layout="vertical"
                  style="width: 3rem"
                  input-id="minmax"
                  :min="1"
                  :max="23"
                />
              </div>
              <div class="flex flex-col items-center gap-2">
                <p class="text-sm font-semibold"> End </p>
                <PrimeInputNumber
                  v-model="range[1]"
                  show-buttons
                  button-layout="vertical"
                  style="width: 3rem"
                  input-id="minmax"
                  :min="2"
                  :max="24"
                />
              </div>
            </div>
          </PrimeDrawer>
          <component
            :is="tab.component"
            lazy
          />
        </div>
      </template>
    </IbTabView>
  </div>
</template>

<style scoped></style>
