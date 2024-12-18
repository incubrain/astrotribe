<!-- components/SecurityMonitoring.vue -->
<template>
  <div class="space-y-4 p-4">
    <PrimeCard>
      <template #title>Security Overview</template>
      <template #content>
        <div
          v-if="isLoading"
          class="flex justify-content-center"
        >
          <PrimeProgressSpinner />
        </div>
        <div
          v-else
          class="grid"
        >
          <div class="col-12 md:col-4">
            <div class="surface-card border-1 border-round p-4">
              <div class="text-sm text-500">Total Blocked</div>
              <div class="text-2xl font-bold">{{ metrics.totalBlocked }}</div>
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="surface-card border-1 border-round p-4">
              <div class="text-sm text-500">Active Blocks</div>
              <div class="text-2xl font-bold">{{ metrics.activeBlocks }}</div>
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="surface-card border-1 border-round p-4">
              <div class="text-sm text-500">Suspicious Attempts</div>
              <div class="text-2xl font-bold">{{ metrics.suspiciousAttempts }}</div>
            </div>
          </div>
        </div>
      </template>
    </PrimeCard>

    <div class="grid">
      <div class="col-12 md:col-6">
        <PrimeCard>
          <template #title>Suspicious Activity Timeline</template>
          <template #content>
            <PrimeChart
              class="w-full h-full"
              type="line"
              :data="chartData"
              :options="chartOptions"
            />
          </template>
        </PrimeCard>
      </div>

      <div class="col-12 md:col-6">
        <PrimeCard>
          <template #title>High-Risk Referrers</template>
          <template #content>
            <PrimeDataTable
              :value="highRiskReferrers"
              stripedRows
              responsiveLayout="scroll"
              :loading="isLoading"
            >
              <PrimeColumn
                field="code"
                header="Referrer"
              />
              <PrimeColumn
                field="riskScore"
                header="Risk Score"
              >
                <template #body="slotProps">
                  <PrimeTag
                    :severity="getRiskSeverity(slotProps.data.riskScore)"
                    :value="slotProps.data.riskScore.toString()"
                  />
                </template>
              </PrimeColumn>
              <PrimeColumn
                field="suspiciousPercentage"
                header="Suspicious %"
              >
                <template #body="slotProps">
                  <PrimeProgressBar
                    :value="slotProps.data.suspiciousPercentage"
                    :showValue="true"
                  />
                </template>
              </PrimeColumn>
              <PrimeColumn header="Actions">
                <template #body="slotProps">
                  <PrimeButton
                    severity="danger"
                    size="small"
                    @click="handleBlockReferrer(slotProps.data.code)"
                    label="Block"
                  />
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </template>
        </PrimeCard>
      </div>
    </div>

    <PrimeCard>
      <template #title>Blocked IPs</template>
      <template #content>
        <PrimeDataTable
          :value="blockedIPs"
          :loading="isLoading"
          stripedRows
          responsiveLayout="scroll"
        >
          <PrimeColumn
            field="ip_address"
            header="IP Address"
          />
          <PrimeColumn
            field="blocked_until"
            header="Blocked Until"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.blocked_until) }}
            </template>
          </PrimeColumn>
          <PrimeColumn
            field="failed_attempts"
            header="Failed Attempts"
          />
          <PrimeColumn
            field="reason"
            header="Reason"
          />
          <PrimeColumn header="Actions">
            <template #body="slotProps">
              <PrimeButton
                severity="secondary"
                size="small"
                @click="handleUnblockIP(slotProps.data.ip_address)"
                label="Unblock"
              />
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { storeToRefs } from 'pinia'

const security = useReferralSecurity()
const store = useSecurityStore()
const confirm = useConfirm()

const { metrics, blockedReferrers, blockedIPs, isLoading } = storeToRefs(store)

const refreshInterval = ref<NodeJS.Timer>()

const chartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [
    {
      label: 'Suspicious Attempts',
      data: metrics.value.hourlySuspiciousActivity,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red background
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.formattedValue} suspicious attempts`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  maintainAspectRatio: false,
  height: 300,
}

// Compute high-risk referrers from blocked referrers
const highRiskReferrers = computed(() =>
  blockedReferrers.value.map((referrer) => ({
    code: referrer.referrer_code,
    riskScore: calculateRiskScore(referrer),
    suspiciousPercentage: calculateSuspiciousPercentage(referrer),
  })),
)

function getRiskSeverity(score: number): string {
  if (score >= 80) return 'danger'
  if (score >= 60) return 'warning'
  if (score >= 40) return 'info'
  return 'success'
}

function calculateRiskScore(referrer: any): number {
  // Implement risk score calculation based on your criteria
  return 75 // Example score
}

function calculateSuspiciousPercentage(referrer: any): number {
  // Implement suspicious percentage calculation
  return 65 // Example percentage
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(date).toLocaleString()
}

async function handleBlockReferrer(code: string) {
  confirm.require({
    message: `Are you sure you want to block referrer ${code}?`,
    header: 'Block Referrer',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await security.blockReferrer(code)
      await security.fetchSecurityData()
    },
  })
}

async function handleUnblockIP(address: string) {
  confirm.require({
    message: `Are you sure you want to unblock IP ${address}?`,
    header: 'Unblock IP',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await security.unblockIP(address)
      await security.fetchSecurityData()
    },
  })
}

onMounted(() => {
  security.fetchSecurityData()
  // Refresh data every 5 minutes
  refreshInterval.value = setInterval(() => {
    security.fetchSecurityData()
  }, 300000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>
