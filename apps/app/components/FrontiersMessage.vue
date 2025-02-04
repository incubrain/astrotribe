<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'close': []
}>()

const message = {
  header: 'Starter Plan: A Little More Time, A Lot More Magic',
  body: `
  We know you're eagerly waiting for the launch of our Stardust Plan, and trust us—we're just as excited! But we've decided to hold off the release just a little longer, because why rush when we can make it even better?
  The new launch date is February 5, 2025, and we promise it'll be worth the wait. We're taking this extra time to add some final touches that will make your experience even more extraordinary.
  Thanks for your patience—big things are coming!
  `,
}

const handleClose = () => {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<template>
  <PrimeDialog
    :visible="isOpen"
    @update:visible="handleClose"
    modal
    :header="message.header"
    class="w-[50%]"
  >
    {{ message.body }}
  </PrimeDialog>
</template>

<style scoped></style>
