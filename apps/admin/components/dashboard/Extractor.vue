<script setup lang="ts">
// 1. Imports
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 2. Component Options
defineOptions({
  name: 'DashboardExtractor',
})

// 3. Props and Emits
const props = defineProps<{
  dashboardUrl?: string
  refreshInterval?: number
  autoRefresh?: boolean
  darkMode?: boolean
}>()

const emit = defineEmits<{
  'metrics-update': [metrics: Record<string, any>]
  'error': [message: string]
}>()

// 4. Reactive Variables
const dashboardUrl = ref(props.dashboardUrl || 'http://localhost:3000')
const refreshInterval = ref(props.refreshInterval || 5000)
const autoRefresh = ref(props.autoRefresh !== false)
const darkMode = ref(props.darkMode !== false)
const isLoading = ref(true)
const error = ref<string | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const refreshTimer = ref<number | null>(null)

// 5. Methods
function startAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }

  if (autoRefresh.value) {
    refreshTimer.value = window.setInterval(() => {
      refreshDashboard()
    }, refreshInterval.value)
  }
}

function stopAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

function refreshDashboard() {
  if (iframeRef.value && iframeRef.value.contentWindow) {
    // Send refresh message to the iframe
    iframeRef.value.contentWindow.postMessage(
      {
        type: 'refresh-dashboard',
      },
      '*',
    )
  }
}

function handleIframeLoad() {
  isLoading.value = false
}

function toggleTheme() {
  darkMode.value = !darkMode.value

  if (iframeRef.value && iframeRef.value.contentWindow) {
    iframeRef.value.contentWindow.postMessage(
      {
        type: 'theme-change',
        darkMode: darkMode.value,
      },
      '*',
    )
  }
}

function handleMessage(event: MessageEvent) {
  // Process messages from the iframe
  if (event.data && event.data.type === 'metrics-update') {
    emit('metrics-update', event.data.metrics)
  } else if (event.data && event.data.type === 'dashboard-error') {
    error.value = event.data.message
    emit('error', event.data.message)
  }
}

// 6. Lifecycle Hooks
onMounted(() => {
  window.addEventListener('message', handleMessage)
  startAutoRefresh()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
  stopAutoRefresh()
})

// Watch props changes
watch(
  () => props.autoRefresh,
  (newValue) => {
    autoRefresh.value = newValue !== false
    if (autoRefresh.value) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  },
)

watch(
  () => props.refreshInterval,
  (newValue) => {
    if (newValue && newValue > 0) {
      refreshInterval.value = newValue
      if (autoRefresh.value) {
        startAutoRefresh()
      }
    }
  },
)

watch(
  () => props.darkMode,
  (newValue) => {
    darkMode.value = newValue !== false
    if (iframeRef.value && iframeRef.value.contentWindow) {
      iframeRef.value.contentWindow.postMessage(
        {
          type: 'theme-change',
          darkMode: darkMode.value,
        },
        '*',
      )
    }
  },
)
</script>

<template>
  <div
    class="astro-crawler-dashboard"
    :class="{ 'dark-mode': darkMode }"
  >
    <div class="dashboard-header">
      <h2 class="dashboard-title">Astronomy Data Crawler</h2>
      <div class="dashboard-controls">
        <PrimeButton
          icon="pi pi-refresh"
          class="p-button-text p-button-rounded p-button-sm"
          :disabled="isLoading"
          aria-label="Refresh"
          @click="refreshDashboard"
        />
        <PrimeInputSwitch
          v-model="autoRefresh"
          class="ml-2"
          :disabled="isLoading"
          aria-label="Auto refresh"
        />
        <span class="auto-refresh-label">Auto</span>
        <PrimeButton
          :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
          class="p-button-text p-button-rounded p-button-sm ml-2"
          aria-label="Toggle theme"
          @click="toggleTheme"
        />
      </div>
    </div>

    <div
      v-if="error"
      class="dashboard-error"
    >
      <PrimeMessage severity="error">{{ error }}</PrimeMessage>
    </div>

    <div class="dashboard-frame">
      <div
        v-if="isLoading"
        class="loading-overlay"
      >
        <PrimeProgressSpinner class="dashboard-spinner" />
        <div class="loading-text">Loading dashboard...</div>
      </div>
      <iframe
        ref="iframeRef"
        :src="dashboardUrl"
        frameborder="0"
        title="Astronomy Data Crawler Dashboard"
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.astro-crawler-dashboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: var(--surface-a);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dark-mode {
  --surface-a: #121212;
  --surface-b: #1e1e2e;
  --text-color: #e2e8f0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.dashboard-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.dashboard-controls {
  display: flex;
  align-items: center;
}

.auto-refresh-label {
  font-size: 0.875rem;
  margin-left: 0.5rem;
  color: var(--text-color-secondary);
}

.dashboard-error {
  margin: 0.5rem 1rem;
}

.dashboard-frame {
  position: relative;
  flex: 1;
  min-height: 500px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(var(--surface-a-rgb), 0.7);
  z-index: 1;
}

.dashboard-spinner {
  width: 50px;
  height: 50px;
}

.loading-text {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  min-height: inherit;
}
</style>
