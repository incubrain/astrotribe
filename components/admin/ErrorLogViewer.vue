<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

// Define a standard log entry interface
interface NormalizedLogEntry {
  source: string
  message: string
  timestamp: string
  count: number
  severity?: string
  domain?: string
  action?: string
  error?: string
  stack?: string
  [key: string]: any // Allow for additional fields
}

// Create normalizer functions for each source
const normalizeDatabaseLog = (log: any): NormalizedLogEntry => ({
  source: 'DB',
  message: log.event_message.split('ERROR:')[1] || log.body?.event_message || 'Unknown error',
  timestamp:
    log.timestamp || (log.body?.timestamp ? new Date(log.body.timestamp).toISOString() : ''),
  count: 1,
  severity: 'CRITICAL',
  domain: 'database',
  id: log.id || log.body?.id,
  // Note: 'error' and 'stack' fields are not present in the provided structure
  // You might want to extract these from the event_message if they're embedded there
})

const normalizeAPILog = (log: any): NormalizedLogEntry => ({
  source: 'API',
  message: log.message || log,
  timestamp: log.timestamp,
  count: 1,
  severity: log.level,
  domain: log.metadata?.service,
  action: log.endpoint,
  error: log.status_code?.toString(),
  stack: log.stack || JSON.stringify(log.metadata.context),
})

const normalizeFrontendLog = (log: any): NormalizedLogEntry => ({
  source: 'Frontend',
  message: log.message || 'Unknown error',
  timestamp: log.time,
  count: 1,
  severity: log.level,
  domain: log.component,
  action: log.action,
  error: log.type,
  stack: log.stack,
})

// Function to normalize logs from all sources
const normalizeAllLogs = (logs: { source: string, entries: any[] }[]): NormalizedLogEntry[] => {
  return logs.flatMap((sourceLog) => {
    console.log('sourceLog', sourceLog)
    const normalizer
      = sourceLog.source === 'DB'
        ? normalizeDatabaseLog
        : sourceLog.source === 'API'
          ? normalizeAPILog
          : sourceLog.source === 'Frontend'
            ? normalizeFrontendLog
            : (log: any) => ({ ...log, source: sourceLog.source, count: 1 }) // Default normalizer

    return sourceLog.entries.map(normalizer)
  })
}

const props = defineProps<{
  logs: { source: string, entries: any[] }[]
}>()

const normalizedLogs = computed(() => normalizeAllLogs(props.logs))

const uniqueLogs = computed(() => {
  const logMap = new Map()
  normalizedLogs.value.forEach((log) => {
    const key = `${log.source}-${log.message}`
    if (logMap.has(key)) {
      const existingLog = logMap.get(key)
      existingLog.count++
      if (new Date(log.timestamp) > new Date(existingLog.timestamp)) {
        existingLog.timestamp = log.timestamp
      }
    }
    else {
      logMap.set(key, { ...log })
    }
  })
  return Array.from(logMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

const copyErrorContext = (log: NormalizedLogEntry) => {
  const context = JSON.stringify(log, null, 2)
  navigator.clipboard.writeText(context)
  // You might want to add a toast notification here to inform the user that the context has been copied
}
</script>

<template>
  <div class="border-color overflow-x-auto rounded-lg border p-4">
    <PrimeAccordion
      :multiple="true"
      :active-index="[0]"
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
            toggleicon: 'mr-2',
          }"
          :pt-options="{ mergeSections: true, mergeProps: true }"
        >
          <template #default>
            <div class="w-full items-center justify-between rounded-md p-2">
              <div class="flex w-full items-center gap-2">
                <PrimeTag severity="warning">
                  {{ log.source }}
                </PrimeTag>
                <PrimeTag
                  v-if="log.count > 1"
                  severity="info"
                >
                  {{ log.count }} times
                </PrimeTag>

                <div class="tags-container flex flex-wrap items-center justify-center gap-2">
                  <PrimeTag
                    v-if="log.severity"
                    severity="danger"
                  >
                    {{ log.severity }}
                  </PrimeTag>
                  <PrimeTag
                    v-if="log.domain"
                    severity="info"
                  >
                    {{ log.domain }}
                  </PrimeTag>
                  <PrimeTag
                    v-if="log.action"
                    severity="success"
                  >
                    {{ log.action }}
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
            <p class="log-message mr-2 text-left text-yellow-600">
              {{ log.message }}
            </p>
            <PrimeButton
              severity="link"
              tooltip="Copy error context"
              @click.stop="copyErrorContext(log)"
            >
              <Icon name="mdi:content-copy" />
            </PrimeButton>
            <!-- Error Stack -->
            <div
              v-if="log.stack"
              class="mb-4"
            >
              <h3 class="text-lg mb-2 font-semibold">
                Error Stack
              </h3>
              <pre
                class="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-gray-800 p-4 text-sm"
              >{{ log.stack }}</pre>
            </div>

            <!-- Additional Fields -->
            <div
              v-for="(value, key) in log"
              :key="key"
              class="mb-2"
            >
              <template
                v-if="
                  ![
                    'source',
                    'message',
                    'timestamp',
                    'count',
                    'severity',
                    'domain',
                    'action',
                    'error',
                    'stack',
                  ].includes(key)
                "
              >
                <strong>{{ key }}:</strong> {{ value }}
              </template>
            </div>
          </div>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<style scoped></style>
