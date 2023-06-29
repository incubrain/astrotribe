<template>
  <div>
    <NuxtLink to="/" class="flex items-center">
      <UButton
        variant="link"
        :padded="false"
        @click="isOpen = true"
      >
        <UAvatar
          src="/astronera-logo.jpg"
          alt="Astron Era Logo"
          class="w-8 h-8 md:w-12 md:h-12"
        />
      </UButton>
    </NuxtLink>
    <USlideover
      v-model="isOpen"
      side="left"
    >
      <div class="border-r border-color">
        <div class="foreground w-full flex items-center justify-between p-8">
          <NuxtLink
            class="flex items-center gap-2"
            to="/"
            @click="isOpen = false"
          >
            <UAvatar
              src="/astronera-logo.jpg"
              alt="Astron Era Logo"
              class="w-8 h-8 md:w-12 md:h-12"
            />
            <h3>AstronEra</h3>
          </NuxtLink>
          <UButton
            variant="solid"
            icon="i-mdi-chevron-left"
            @click="isOpen = false"
          >
            Return
          </UButton>
        </div>
        <div v-show="links">
          <NuxtLink
            v-for="link in links"
            :key="link.id"
            :to="link.slug"
            class="w-full flex justify-end items-center border-b border-color py-3 px-8 text-xs font-medium"
            @click="isOpen = false"
          >
            {{ link.name }}
            <UIcon
              :name="getIcon(link.name)"
              class="ml-2 w-4 h-4"
            />
          </NuxtLink>
        </div>
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const getIcon = (val: string) => {
  if (val === 'Contact') return 'i-material-symbols-info'
  if (val === 'About') return 'i-material-symbols-call'
  if (val === 'Preview') return 'i-material-symbols-globe-asia'
}

defineProps({
  links: {
    type: Array as PropType<Object[]>,
    required: true
  }
})
</script>

<style scoped></style>
