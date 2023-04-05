<template>
    <div class="card">
        <h1 class="text-2xl pb-4 font-semibold">Skills</h1>
        <div class="flex flex-col gap-2">
            <div
              v-for="skill in skills"
              :key="skill.id"
              class="flex flex-col gap-4 border-b-2 text-gray-600 py-4"
              >
              <h3 class="text-md font-semibold">{{ skill.title }}</h3>
              <AppStars
                v-if="skill.total_endorsements > 0"
                :rating="skill.rating" />
              <span
                v-if="skill.total_endorsements > 0"
                class="text-sm font-thin z-40 m-0 flex items-center">
                <Icon name="fluent:people-team-16-filled" size="20px" class="mr-2" />  
                {{ skill.total_endorsements }} {{ endorsementText( skill.total_endorsements) }}</span>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import type { Skill } from '~~/types/index.js'


defineProps({
    skills: {
      type: Array as PropType<Skill[]>,
      required: true,
    }
})

const endorsementText = (num: number) => {
  if (num === 1) {
    return 'Endorsement'
  } else {
    return 'Endorsements'
  }
}


</script>

<style scoped>

</style>