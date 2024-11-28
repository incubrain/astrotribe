<!-- components/metrics/StatCard.vue -->
<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon: string
  color: 'yellow' | 'purple' | 'orange' | 'green' | 'blue'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const colorClasses = computed(() => ({
  yellow: 'border-yellow-500/20 bg-yellow-500/5 shadow-yellow-500/10',
  purple: 'border-purple-500/20 bg-purple-500/5 shadow-purple-500/10',
  orange: 'border-orange-500/20 bg-orange-500/5 shadow-orange-500/10',
  green: 'border-green-500/20 bg-green-500/5 shadow-green-500/10',
  blue: 'border-blue-500/20 bg-blue-500/5 shadow-blue-500/10',
}))

const iconColors = computed(() => ({
  yellow: 'text-yellow-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
}))
</script>

<template>
  <div
    class="foreground rounded-xl p-6 border-4 shadow-lg"
    :class="colorClasses[color]"
  >
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-sm font-medium opacity-70">{{ title }}</h3>
        <p
          v-if="!loading"
          class="text-4xl font-bold mt-2"
        >
          {{ value }}
        </p>
        <div
          v-else
          class="h-10 w-20 animate-pulse bg-gray-700 rounded mt-2"
        />
      </div>
      <Icon
        :name="icon"
        size="34px"
        class="h-10 w-10"
        :class="iconColors[color]"
      />
    </div>
    <slot name="footer" />
  </div>
</template>
