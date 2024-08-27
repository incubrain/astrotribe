<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

const props = defineProps<{
  logs: string
}>()
const uniqueLogs = computed(() => {
  const logMap = new Map()
  props.logs.forEach((log) => {
    const key = `${log.message}-${log.metadata?.context?.error}`
    if (logMap.has(key)) {
      logMap.get(key).count++
      if (new Date(log.timestamp) > new Date(logMap.get(key).timestamp)) {
        logMap.get(key).timestamp = log.timestamp
      }
    } else {
      logMap.set(key, { ...log, count: 1 })
    }
  })
  return Array.from(logMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

const copyErrorContext = (log: any) => {
  const context = JSON.stringify(
    {
      message: log.message,
      error: log.metadata?.context?.error,
      stack: log.metadata?.context?.errorStack,
      domain: log.metadata?.context?.domain,
      action: log.metadata?.context?.action,
      severity: log.metadata?.context?.severity,
      status: log.metadata?.context?.status,
      timestamp: log.timestamp
    },
    null,
    2
  )
  navigator.clipboard.writeText(context)
  // You might want to add a toast notification here to inform the user that the context has been copied
}
</script>

<template>
  <div class="border-color overflow-x-auto rounded-lg border p-4">
    <div
      v-for="(log, index) in uniqueLogs"
      :key="index"
      class="log-entry background border-color mb-4 rounded-md border p-4"
    >
      <!-- Top Header -->
      <div class="log-header mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="log-timestamp text-sm text-gray-400">{{ useTimeAgo(log.timestamp) }}</span>
          <PrimeTag class="rounded-md px-2 py-1 text-xs font-bold">
            {{ log.level.toUpperCase() }}
          </PrimeTag>
          <span class="log-label font-bold text-primary">{{ log.label }}</span>
          <PrimeTag
            severity="info"
            v-if="log.count > 1"
            >{{ log.count }} occurrences</PrimeTag
          >
        </div>
        <div class="flex items-center gap-2">
          <PrimeButton
            icon="pi pi-copy"
            @click="copyErrorContext(log)"
            tooltip="Copy error context"
          />
          <BasePopover
            v-if="log.metadata?.context?.errorStack"
            buttonLabel="Error Stack"
          >
            <div class="w-full max-w-lg">
              <h3 class="text-lg mb-2 font-semibold">Error Stack</h3>
              <pre
                class="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-gray-800 p-4 text-sm"
                >{{ log.metadata.context.errorStack }}</pre
              >
            </div>
          </BasePopover>
        </div>
      </div>

      <!-- Body: Error and Message -->
      <div class="mb-4 rounded-md bg-gray-800 p-4 text-sm">
        <p class="log-message text-yellow-600">{{ log.message }}</p>
        <div
          class="log-error truncate-2-lines"
          v-tooltip.top="log.metadata?.context?.error"
        >
          {{ log.metadata?.context?.error || 'N/A' }}
        </div>
      </div>

      <!-- Bottom: Extra Tags -->
      <div class="log-footer">
        <div class="tags-container mb-2 flex flex-wrap gap-2">
          <PrimeTag
            v-if="log.metadata?.context?.domain"
            severity="info"
          >
            {{ log.metadata.context.domain }}
          </PrimeTag>
          <PrimeTag
            v-if="log.metadata?.context?.action"
            severity="success"
          >
            {{ log.metadata.context.action }}
          </PrimeTag>
          <PrimeTag
            v-if="log.metadata?.service"
            severity="warning"
          >
            {{ log.metadata.service }}
          </PrimeTag>
          <PrimeTag
            v-if="log.metadata?.context?.severity"
            severity="danger"
          >
            {{ log.metadata.context.severity }}
          </PrimeTag>
          <PrimeTag
            v-if="log.metadata?.context?.status"
            severity="warning"
          >
            {{ log.metadata.context.status }}
          </PrimeTag>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
