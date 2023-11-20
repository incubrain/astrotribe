<template>
  <div>
    <UButton
      variant="link"
      :padded="false"
      @click="isOpen = true"
    >
      <UIcon
        name="i-mdi-menu"
        class="w-6 h-6 text-black dark:text-white"
      />
    </UButton>
    <USlideover
      v-model="isOpen"
      side="left"
    >
      <div class="border-r border-color">
        <div class="foreground w-full flex items-center justify-between p-8">
          <NuxtLink
            class="flex items-center gap-4"
            to="/"
            @click="isOpen = false"
          >
            <div class="p-2 bg-white rounded-full aspect-square flex">
              <NuxtImg
                src="/astronera-logo.jpg"
                alt="Astron Era Logo"
                class="w-8 h-8 md:w-12 md:h-12"
              />
            </div>
            <h3 class="text-xl">AstronEra</h3>
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
            class="w-full flex justify-end items-center border-b border-color py-3 px-8 text-sm font-medium"
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
  if (val === 'Team') return 'i-material-symbols-emoji-people'
  if (val === 'Blog') return 'i-material-symbols-article'
  if (val === 'Community') return 'i-material-symbols-groups-rounded'
  if (val === 'Conference') return 'i-mdi-presentation'
}

defineProps({
  links: {
    type: Array as PropType<Object[]>,
    required: true
  }
})
</script>

<style scoped></style>
