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
      stack: log.metadata?.context?.stack,
      domain: log.metadata?.context?.domain,
      action: log.metadata?.context?.action,
      severity: log.metadata?.context?.severity,
      status: log.metadata?.context?.status,
      timestamp: log.timestamp,
      count: log.count
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
    <PrimeAccordion
      :multiple="true"
      :activeIndex="[0]"
      class="w-full space-y-4"
    >
      <PrimeAccordionPanel
        v-for="(log, index) in uniqueLogs"
        :key="index"
        :value="`${index}`"
      >
        <PrimeAccordionHeader
          :pt="{
            root: 'w-full flex items-center justify-between p-2 rounded-md background',
            toggleicon: 'mr-2'
          }"
          :ptOptions="{ mergeSections: true, mergeProps: true }"
        >
        <template #default>

          <div class="w-full items-center justify-between rounded-md p-2">
            <div class="flex w-full items-center gap-2">
              <PrimeTag
                severity="info"
                v-if="log.count > 1"
                >{{ log.count }} times</PrimeTag
              >

              <div class="tags-container flex flex-wrap items-center justify-center gap-2">
                <PrimeTag
                  v-if="log.metadata?.context?.severity"
                  severity="danger"
                >
                  {{ log.metadata.context.severity }}
                </PrimeTag>
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

                <span class="log-timestamp text-sm text-gray-400">
                  {{ useTimeAgo(log.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </template>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <div class="log-entry mb-4 rounded-md p-4">
            <span class="log-label text-sm font-bold text-primary">{{ log.label }}</span>

            <p class="log-message mr-2 text-left text-yellow-600">{{ log.message }}</p>
            <PrimeButton
              severity="link"
              @click.stop="copyErrorContext(log)"
              tooltip="Copy error context"
            >
              <Icon name="mdi:content-copy" />
            </PrimeButton>
            <!-- Error Stack -->
            <div class="mb-4">
              <h3 class="text-lg mb-2 font-semibold">Error Stack</h3>
              <pre
                class="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-gray-800 p-4 text-sm"
              >
          {{ log.metadata.context?.stack || '' }}
          {{ log.metadata?.context?.error || 'N/A' }}
              </pre>
            </div>

            <!-- Extra Tags -->
            <div class="log-footer"> </div>
          </div>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<style scoped></style>
