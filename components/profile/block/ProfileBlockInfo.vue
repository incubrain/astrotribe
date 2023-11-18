<template>
  <div class="grid grid-cols-1 p-4 lg:grid-cols-2 md:p-0">
    <div class="col-span-2 col-start-1">
      <h1 class="text-lg font-semibold md:text-xl xl:text-2xl">
        {{ props.user.given_name }} {{ props.user.surname }}
      </h1>
      <!-- <h4 class="text-lg">{{ props.user.profession }} {{ type === 'mentor' ?   `- Associated with: ${props.user.associated_companies}` : `` }}</h4> -->
      <!-- <h6
        v-if="home"
        class="flex items-center pt-3 text-sm md:text-base"
      >
        <UIcon
          name="i-material-symbols-location-on"
          class="w-5 h-5 mr-1"
        />
        {{ home.city }}, {{ home.state }},
        {{ home.country }}
      </h6> -->
      <p class="pt-4">
        {{ props.user.introduction }}
      </p>
    </div>
    <div class="flex flex-col col-span-1 gap-2 lg:col-start-2"></div>
  </div>
</template>

<script setup lang="ts">
import type { UserType } from '@/types/users'

const props = defineProps({
  user: {
    type: Object as PropType<UserType>,
    required: true
  }
})

// const home = props.user.user_locations?.find((location) => location.is_home === true)
</script>

<style scoped></style>
