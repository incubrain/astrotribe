<script setup lang="ts">
const isOpen = ref(false)

const toggleModalOpen = () => {
  isOpen.value = !isOpen.value
}

const options = ref({
  isOpen,
  toggleModalOpen
})
</script>

<template>
  <div>
    <slot
      name="button"
      v-bind="options"
    />
    <PrimeDialog
      v-model:visible="isOpen"
      modal
      :pt="{
        root: 'max-w-2xl w-full',
        content: 'w-full aspect-square'
      }"
    >
      <template #header>
        <slot name="modal:header" />
      </template>
      <slot name="modal:default" />
      <template #footer>
        <slot
          name="modal:footer"
          v-bind="options"
        />
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped></style>
