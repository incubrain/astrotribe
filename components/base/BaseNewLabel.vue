<script setup lang="ts">
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  maxAge: {
    type: Number,
    required: true
  }
})

const isWithinNumberOfDays = computed(() => {
  const currentDate = new Date()
  const itemDate = new Date(props.date)
  const differenceInDays = Math.floor(
    (currentDate.getTime() - itemDate.getTime()) / (1000 * 3600 * 24)
  )
  return differenceInDays <= props.maxAge
})
</script>

<template>
  <PrimeTag
    v-if="isWithinNumberOfDays"
    severity="success"
    value="NEW"
  />
</template>
