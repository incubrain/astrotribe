<template>
  <PrimeConfirmDialog>
    <template #message="slotProps">
      <div class="flex items-start gap-3">
        <Icon
          v-if="slotProps.message?.icon"
          :name="slotProps.message.icon"
          class="text-2xl"
        />
        <p>{{ slotProps.message?.message }}</p>
      </div>
    </template>
  </PrimeConfirmDialog>
</template>
