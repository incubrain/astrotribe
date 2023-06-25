<template>
  <div class="grid w-full grid-cols-2">
    <div class="p-8 space-y-1 rounded-md shadow-md foreground">
      <h1 class="pb-4 text-4xl font-semibold"> Welcome 👋</h1>
      <h3 class="pb-4 text-xl font-semibold">AstroTribe Is Currently In Closed Alpha</h3>
      <p>This means we have limited functionality, navigate around to preview the application</p>
      <p>The good news is that we will be rolling out new features every month!</p>
      <p class="font-semibold">
        Interested in joining the beta waitlist?
        <NuxtLink
          to="auth/register-interest"
          class="link"
        >
          register your interest here.
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
