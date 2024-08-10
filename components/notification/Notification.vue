<script setup lang="ts">
const getIconName = (severity: string) => {
  switch (severity) {
    case 'success':
      return 'mdi:check-circle'
    case 'error':
      return 'mdi:close-circle'
    case 'info':
      return 'mdi:information'
    case 'warn':
      return 'mdi:alert-circle'
    default:
      return 'mdi:information'
  }
}

// :pt="{
//       content: 'border border-color rounded-md shadow-md flex'
//     }"
</script>

<template>
  <PrimeToast
    position="bottom-right"
    group="cta"
  >
    <template #container="{ message, closeCallback }">
      <section class="flex w-full items-start justify-start gap-3 rounded-md p-3 shadow-md">
        <Icon :name="getIconName(message.severity)" />
        <div class="flex w-full flex-col items-start justify-start gap-2">
          <p class="m-0 text-base font-semibold">{{ message.summary }}</p>
          <p class="m-0 text-base">{{ message.detail }}</p>
          <div class="mt-2">
            <p class="text-lg foreground rounded-md px-3 py-1 font-bold text-white">
              Premium Plan Coming Soon!
            </p>
            <!-- <NuxtLink :to="message.link">
                <PrimeButton>{{ message.buttonText }}</PrimeButton>
              </NuxtLink> -->
          </div>
        </div>
        <PrimeButton
          severity="contrast"
          @click="closeCallback"
        >
          <Icon name="mdi:close"></Icon>
        </PrimeButton>
      </section>
    </template>
  </PrimeToast>
</template>

<style scoped></style>
