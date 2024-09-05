<script setup lang="ts"></script>

<template>
  <div class="flex gap-2 p-2 background rounded-md justify-center items-center">
    <NuxtLink to="/">
      <PrimeButton label="Go back">
        Go Home
      </PrimeButton>
    </NuxtLink>
    <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
      <Icon
        :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
        class="w-6 h-6 cursor-pointer"
        @click="toggle"
      />
    </AppThemeToggle> -->
  </div>
</template>

<style scoped></style>
