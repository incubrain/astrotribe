<script setup lang="ts"></script>

<template>
  <div class="background flex items-center justify-center gap-2 rounded-md p-2">
    <NuxtLink to="/">
      <PrimeButton label="Go back"> Go Home </PrimeButton>
    </NuxtLink>
    <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
      <Icon
        :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
        class="cursor-pointer"
                      size="24px"

        @click="toggle"
      />
    </AppThemeToggle> -->
  </div>
</template>

<style scoped></style>
