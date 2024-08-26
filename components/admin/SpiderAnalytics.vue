<script setup lang="ts">
import { useServerAnalytics } from '@/composables/useServerAnalytics'

const { metrics, haveMetrics, isConnected } = useServerAnalytics()

watch(
  metrics,
  (newMetrics) => {
    console.log('Metrics updated:', newMetrics)
  },
  { deep: true }
)

const urlDepthChart = ref(null)
const protocolChart = ref(null)

// Common chart options
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false, // Disable default animations
  transitions: {
    active: {
      animation: {
        duration: 300
      }
    },
    resize: {
      animation: {
        duration: 500,
        easing: 'easeOutQuad'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      }
    }
  }
}

const urlDepthChartOptions = {
  ...commonChartOptions,
  scales: {
    x: {
      ticks: {
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      }
    }
  }
}

const protocolChartOptions = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    legend: {
      ...commonChartOptions.plugins.legend,
      position: 'bottom'
    }
  }
}

const urlDepthChartData = computed(() => {
  const depthStats = metrics.spiderMetrics?.depthStats ?? {}
  return {
    labels: Object.keys(depthStats),
    datasets: [
      {
        label: 'New URLs',
        data: Object.values(depthStats).map((stat: any) => stat?.new ?? 0),
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Allowed URLs',
        data: Object.values(depthStats).map((stat: any) => stat?.allowed ?? 0),
        backgroundColor: '#FFCE56'
      }
    ]
  }
})

const protocolChartData = computed(() => ({
  labels: ['HTTP', 'HTTPS'],
  datasets: [
    {
      data: [
        metrics.spiderMetrics?.protocolDistribution?.http ?? 0,
        metrics.spiderMetrics?.protocolDistribution?.https ?? 0
      ],
      backgroundColor: ['#FF6384', '#36A2EB']
    }
  ]
}))

const isSpiderActive = computed(() => !!metrics.spiderMetrics.crawlDuration)
</script>

<template>
  <div class="metrics-display">
    <div v-if="isConnected">Connected</div>
    <div v-else>Disconnected</div>

    <div v-if="haveMetrics && isSpiderActive">
      <div class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold">Spider Metrics</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PrimeCard class="shadow-md">
            <template #title>Crawl Duration</template>
            <template #content>
              <div class="text-4xl font-bold"
                >{{ (metrics.spiderMetrics.crawlDuration / 1000).toFixed(2) }}s</div
              >
            </template>
          </PrimeCard>
          <PrimeCard class="shadow-md">
            <template #title>URLs per Second</template>
            <template #content>
              <div class="text-4xl font-bold">{{
                metrics.spiderMetrics.urlsPerSecond.toFixed(2)
              }}</div>
            </template>
          </PrimeCard>
          <PrimeCard class="shadow-md">
            <template #title>Avg Response Time</template>
            <template #content>
              <div class="text-4xl font-bold"
                >{{ metrics.spiderMetrics.responseTimeStats.average.toFixed(2) }}ms</div
              >
            </template>
          </PrimeCard>
        </div>
        <PrimeCard class="shadow-md">
          <template #title>Total URLs</template>
          <template #content>
            <div class="text-4xl font-bold">{{ metrics.spiderMetrics.urlCounts.total }}</div>
          </template>
        </PrimeCard>
        <PrimeCard class="shadow-md">
          <template #title>New URLs</template>
          <template #content>
            <div class="text-4xl font-bold">{{ metrics.spiderMetrics.urlCounts.new }}</div>
          </template>
        </PrimeCard>
        <PrimeCard class="shadow-md">
          <template #title>Allowed URLs</template>
          <template #content>
            <div class="text-4xl font-bold">{{ metrics.spiderMetrics.urlCounts.allowed }}</div>
          </template>
        </PrimeCard>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PrimeChart
          ref="urlDepthChart"
          type="bar"
          :data="urlDepthChartData"
          :options="urlDepthChartOptions"
          class="h-64"
        />
        <PrimeChart
          ref="protocolChart"
          type="doughnut"
          :data="protocolChartData"
          :options="protocolChartOptions"
          class="h-64"
        />
      </div>
    </div>
    <div v-else>
      <div class="background border-color rounded-md border p-2 text-2xl font-semibold">
        Spider is not active
      </div>
    </div>
  </div>
</template>
