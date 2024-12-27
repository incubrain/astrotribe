<script setup lang="ts">
import Fuse from 'fuse.js'
import type { FuseResult, IFuseOptions } from 'fuse.js'

interface Props<T> {
  modelValue: string
  placeholder?: string
  data: T[]
  fuseOptions?: IFuseOptions<T>
  debounceMs?: number
}

const props = withDefaults(defineProps<Props<any>>(), {
  placeholder: 'Search...',
  debounceMs: 300,
  fuseOptions: () => ({
    threshold: 0.3,
    shouldSort: true,
  }),
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'results': [results: FuseResult<any>[]]
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Debounced search function
const debouncedSearch = useDebounceFn((query: string) => {
  if (!query.trim()) {
    emit('results', [])
    return
  }

  const fuse = new Fuse(props.data, props.fuseOptions)
  const results = fuse.search(query)
  emit('results', results)
}, props.debounceMs)

// Watch for changes in search value or data
watch(
  [() => searchValue.value, () => props.data],
  ([newQuery]) => {
    debouncedSearch(newQuery)
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative flex-1 w-full">
    <PrimeIconField class="w-full">
      <PrimeInputText
        v-model="searchValue"
        :placeholder="placeholder"
        class="w-full !pr-10"
      />
      <Icon
        name="mdi:magnify"
        class="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
      />
    </PrimeIconField>
  </div>
</template>
