<template>
  <div>
    <PrimeButton
      variant="link"
      :padded="false"
      @click="isOpen = true"
    >
      <Icon
        name="mdi:menu"
        class="w-6 h-6 text-black dark:text-white"
      />
    </PrimeButton>
    <PrimeSidebar v-model:visible="isOpen">
      <div class="border-r border-color">
        <div class="foreground w-full flex items-center justify-between p-8">
          <NuxtLink
            class="flex items-center gap-4"
            to="/"
            @click="isOpen = false"
          >
            <div class="p-2 bg-white rounded-full aspect-square flex">
              <BaseImage
                :img="{
                  src: '/astronera-logo.jpg',
                  alt: 'Astron Era Logo'
                }"
                class="w-8 h-8 md:w-12 md:h-12"
              />
            </div>
            <h3 class="text-xl">AstronEra</h3>
          </NuxtLink>
          <PrimeButton
            variant="solid"
            icon="mdi:chevron-left"
            @click="isOpen = false"
          >
            Return
          </PrimeButton>
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
            <Icon
              :name="getIcon(link.name)"
              class="ml-2 w-4 h-4"
            />
          </NuxtLink>
        </div>
      </div>
    </PrimeSidebar>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const getIcon = (val: string) => {
  if (val === 'Contact') return 'material-symbols:info'
  if (val === 'About') return 'material-symbols:call'
  if (val === 'Preview') return 'material-symbols:globe-asia'
  if (val === 'Team') return 'material-symbols:emoji-people'
  if (val === 'Blog') return 'material-symbols:article'
  if (val === 'Community') return 'material-symbols:groups-rounded'
  if (val === 'Conference') return 'mdi:presentation'
}

defineProps({
  links: {
    type: Array as PropType<Object[]>,
    required: true
  }
})
</script>

<style scoped></style>
