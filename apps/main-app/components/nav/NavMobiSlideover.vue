<template>
  <div>
    <PrimeButton
      variant="link"
      :padded="false"
      @click="isOpen = true"
    >
      <Icon
        name="mdi:menu"
        class="text-black dark:text-white"
        size="24px"
      />
    </PrimeButton>
    <PrimeDrawer v-model:visible="isOpen">
      <div class="border-color border-r">
        <div class="foreground flex w-full items-center justify-between p-8">
          <NuxtLink
            class="flex items-center gap-4"
            to="/"
            @click="isOpen = false"
          >
            <div class="flex aspect-square rounded-full bg-white p-2">
              <IBImage
                :img="{
                  src: '/astronera-logo.jpg',
                  alt: 'Astron Era Logo',
                }"
                class="h-8 w-8 md:h-12 md:w-12"
              />
            </div>
            <h3 class="text-xl"> AstronEra </h3>
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
            class="border-color flex w-full items-center justify-end border-b px-8 py-3 text-sm font-medium"
            @click="isOpen = false"
          >
            {{ link.name }}
            <Icon
              :name="getIcon(link.name)"
              class="ml-2"
              size="24px"
            />
          </NuxtLink>
        </div>
      </div>
    </PrimeDrawer>
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
    type: Array as PropType<object[]>,
    required: true,
  },
})
</script>

<style scoped></style>
