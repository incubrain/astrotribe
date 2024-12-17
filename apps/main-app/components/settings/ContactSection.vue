<!-- components/settings/ContactSection.vue -->
<template>
  <SettingsCard
    :title="{
      main: 'Contact Us',
      subtitle: '',
    }"
  >
    <div class="h-full flex flex-col gap-3 md:max-w-48">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold"> Email </h3>
        <NuxtLink
          to="mailto:connectus@astronera.org"
          target="_blank"
        >
          connectus@astronera.org
        </NuxtLink>
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-semibold"> Phone </h3>
        <NuxtLink
          to="tel: +91-880-610-7510"
          target="_blank"
        >
          +91 880 610 7510
        </NuxtLink>
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-semibold"> Address </h3>
        <p>
          Prachi, 392/6B, Atreya Soc., Deep Bangla Chowk, Model Colony, Pune, Maharashtra 411016
        </p>
      </div>
    </div>
  </SettingsCard>
</template>
