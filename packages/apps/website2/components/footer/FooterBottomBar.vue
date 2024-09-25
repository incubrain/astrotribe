<script setup lang="ts">
const policies = ['privacy-policy', 'terms-of-use', 'cookies-policy', 'refund-policy']
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="py-5 background flex flex-col justify-center gap-4 text-sm w-full">
    <div class="flex gap-2 mx-auto">
      <NuxtLink
        v-for="policy in policies"
        :key="policy"
        :to="`/policies/${policy}`"
        class="text-center text-primary underline"
      >
        {{ policy.replace('-', ' ') }}
      </NuxtLink>
    </div>
    <p class="text-center">
      ©2018 - {{ currentYear }} AstronEra. All right reserved - Made with ❤️ by
      <a
        href="https://www.incubrain.org/"
        target="_blank"
      >
        Incubrain
      </a>
    </p>
  </div>
</template>
