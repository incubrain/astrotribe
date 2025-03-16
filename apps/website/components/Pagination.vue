<script setup lang="ts">
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center my-8"
  >
    <div class="flex gap-2">
      <!-- Previous page -->
      <NuxtLink
        v-if="currentPage > 1"
        :to="
          currentPage === 2 && baseUrl.includes('/page')
            ? baseUrl.replace('/page', '')
            : `${baseUrl}/${currentPage - 1}`
        "
        class="px-4 py-2 rounded bg-primary-800 hover:bg-primary-700"
      >
        <Icon
          name="i-lucide-chevron-left"
          class="w-5 h-5"
        />
      </NuxtLink>

      <!-- Page numbers -->
      <template
        v-for="page in totalPages"
        :key="page"
      >
        <NuxtLink
          v-if="page === 1 && baseUrl.includes('/page')"
          :to="baseUrl.replace('/page', '')"
          :class="[
            'px-4 py-2 rounded',
            currentPage === 1 ? 'bg-primary-600' : 'bg-primary-800 hover:bg-primary-700',
          ]"
        >
          {{ page }}
        </NuxtLink>
        <NuxtLink
          v-else
          :to="page === 1 ? baseUrl : `${baseUrl}/${page}`"
          :class="[
            'px-4 py-2 rounded',
            currentPage === page ? 'bg-primary-600' : 'bg-primary-800 hover:bg-primary-700',
          ]"
        >
          {{ page }}
        </NuxtLink>
      </template>

      <!-- Next page -->
      <NuxtLink
        v-if="currentPage < totalPages"
        :to="`${baseUrl}/${currentPage + 1}`"
        class="px-4 py-2 rounded bg-primary-800 hover:bg-primary-700"
      >
        <Icon
          name="i-lucide-chevron-right"
          class="w-5 h-5"
        />
      </NuxtLink>
    </div>
  </div>
</template>
