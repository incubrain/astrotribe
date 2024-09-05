<template>
  <div>
    <PrimeButton
      type="button"
      size="small"
      severity="secondary"
      :label="buttonLabel"
      @click="toggle"
    />
    <PrimePopover ref="popover">
      <slot></slot>
    </PrimePopover>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  buttonLabel: { type: String, required: true },
})

const popover = ref(null)

const toggle = (event) => {
  popover.value?.toggle(event)
}
</script>

<style scoped></style>
