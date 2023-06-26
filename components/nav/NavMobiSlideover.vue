<template>
  <div>
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
    <USlideover
      v-model="isOpen"
      side="left"
    >
      <div>
        <div class="foreground w-full flex justify-center items-center p-8">
          <UButton
            variant="solid"
            icon="i-mdi-chevron-left"
            @click="isOpen = false"
          >
            Return
          </UButton>
        </div>
        <NuxtLink
          v-for="link in links"
          :key="link.id"
          :to="link.slug"
          class="w-full flex justify-start border-b border-color p-4"
          @click="isOpen = false"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

defineProps({
  links: {
    type: Array as PropType<Object[]>,
    required: true
  }
})
</script>

<style scoped></style>
