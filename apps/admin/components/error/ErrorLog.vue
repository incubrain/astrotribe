<script setup lang="ts">
import { format } from 'date-fns'
import type { ErrorLog } from '@/types/error-logs'

const { expandedLogId, toggleLogExpansion } = useErrorLogs()

const props = defineProps<{
  log: ErrorLog
  expanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const formatDate = (date: string) => {
  console.log('📜 Formatting date:', date)
  return format(new Date(date), 'MMM d, yyyy HH:mm:ss')
}

const getSeverityStyles = (severity: string) => {
  const styles = {
    critical: 'bg-red-500/20 text-red-300 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border border-green-500/30',
  }
  return styles[severity.toLowerCase()] || 'bg-zinc-800 text-zinc-300'
}
</script>

<template>
  <div
    :key="log.id"
    class="hover:bg-zinc-800/50 transition-colors cursor-pointer"
    @click="toggleLogExpansion(log.id)"
  >
    <!-- Compact Row -->
    <div class="px-4 py-2 flex items-center gap-4">
      <span
        :class="[
          'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
          getSeverityStyles(log.severity),
        ]"
      >
        {{ log.severity }}
      </span>

      <span class="text-sm font-medium text-zinc-200 whitespace-nowrap">
        {{ log.service_name }}
      </span>

      <span class="text-sm text-zinc-400 whitespace-nowrap">
        {{ log.error_type }}
      </span>

      <span class="text-sm text-zinc-300 flex-1 truncate">
        {{ log.message }}
      </span>

      <span class="text-sm text-zinc-400 whitespace-nowrap ml-4">
        {{ formatDate(log.created_at) }}
      </span>

      <Icon
        :name="expandedLogId === log.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="h-4 w-4 text-zinc-400"
      />
    </div>

    <!-- Expanded Details -->
    <div
      v-if="expandedLogId === log.id"
      class="px-4 py-4 bg-zinc-800/30 border-t border-zinc-800"
    >
      <!-- Stack Trace -->
      <div
        v-if="log.stack_trace"
        class="mb-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon
            name="mdi:console"
            class="h-4 w-4 text-zinc-400"
          />
          <span class="text-xs font-medium text-zinc-400">Stack Trace</span>
        </div>
        <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
          log.stack_trace
        }}</pre>
      </div>

      <!-- Metadata and Context -->
      <div
        v-if="log.metadata || log.context"
        class="grid grid-cols-2 gap-4"
      >
        <div
          v-if="log.metadata"
          class="space-y-2"
        >
          <div class="flex items-center gap-2">
            <Icon
              name="mdi:information"
              class="h-4 w-4 text-zinc-400"
            />
            <span class="text-xs font-medium text-zinc-400">Metadata</span>
          </div>
          <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
            JSON.stringify(log.metadata, null, 2)
          }}</pre>
        </div>

        <div
          v-if="log.context"
          class="space-y-2"
        >
          <div class="flex items-center gap-2">
            <Icon
              name="mdi:code-tags"
              class="h-4 w-4 text-zinc-400"
            />
            <span class="text-xs font-medium text-zinc-400">Context</span>
          </div>
          <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
            JSON.stringify(log.context, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
