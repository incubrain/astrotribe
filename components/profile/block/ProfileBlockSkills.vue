<template>
  <div>
    <h1 class="pb-4 text-lg font-semibold md:text-xl xl:text-2xl"> Skills </h1>
    <div class="flex flex-col gap-2">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="flex flex-col gap-4 py-4 border-b-2 border-color"
      >
        <h3 class="font-semibold text-md">
          {{ skill.title }}
        </h3>
        <AppStars
          v-if="skill.avg_rating"
          :rating="skill.avg_rating"
        />
        <span
          v-if="skill.total_endorsements !== 0"
          class="z-40 flex items-center m-0 font-thin"
        >
          <Icon
            name="material-symbols:group"
            class="mr-2"
          />
          {{ skill.total_endorsements }}
          {{ endorsementText(skill.total_endorsements) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSkillType } from '@/types/users'

defineProps({
  skills: {
    type: Array as PropType<UserSkillType[]>,
    required: true
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

<style scoped></style>
