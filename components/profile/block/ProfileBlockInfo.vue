<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 p-4 md:p-0">
    <div class="col-span-2 col-start-1 text-black">
      <h1 class="card-heading font-semibold">
        {{ props.user.given_name }} {{ props.user.surname }}
      </h1>
      <!-- <h4 class="text-lg">{{ props.user.profession }} {{ type === 'mentor' ?   `- Associated with: ${props.user.associated_companies}` : `` }}</h4> -->
      <h6
        v-if="home"
        class="text-sm md:text-base pt-3 flex items-center"
      >
        <Icon
          name="uil:location-point"
          class="mr-1 card-subheading"
          size="18px"
        />
        {{ home.city }}, {{ home.state }},
        {{ home.country }}
      </h6>
      <p class="pt-4">
        {{ props.user.introduction }}
      </p>
    </div>
    <div class="col-span-1 lg:col-start-2 flex flex-col gap-2"></div>
  </div>
</template>

<script setup lang="ts">
import type { UserFull } from '@/types'

const props = defineProps({
  user: {
    type: Object as PropType<UserFull>,
    required: true
  }
})

const home = props.user.user_locations?.find(
  (location) => location.is_home === true
)
</script>

<style scoped></style>
