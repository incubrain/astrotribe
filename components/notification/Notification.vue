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
</script>

<template>
  <PrimeToast
    position="bottom-right"
    group="cta"
    :pt="{
      content: 'border border-color rounded-md shadow-md flex'
    }"
  >
    <template #container="{ message, closeCallback }">
      <section class="flex p-3 gap-3 justify-start items-start w-full rounded-md shadow-md">
        <Icon :name="getIconName(message.severity)" />
        <div class="flex flex-col justify-start items-start gap-2 w-full">
          <p class="m-0 font-semibold text-base">{{ message.summary }}</p>
          <p class="m-0 text-base">{{ message.detail }}</p>
          <div
            class="mt-2"
          >
            <p class="text-lg font-bold text-white foreground px-3 py-1 rounded-md"> Premium Plan Coming Soon! </p>
            <!-- <NuxtLink :to="message.link">
                <PrimeButton>{{ message.buttonText }}</PrimeButton>
              </NuxtLink> -->
          </div>
        </div>
        <PrimeButton
          severity="contrast"
          @click="closeCallback"
          :pt="{ root: 'p-2 bg-red' }"
        >
          <Icon name="mdi:close"></Icon>
        </PrimeButton>
      </section>
    </template>
  </PrimeToast>
</template>

<style scoped></style>
