<script setup lang="ts">
defineProps<{
  goals: Goal[]
}>()

const emits = defineEmits<{
  (e: 'toggle-completion', goal: Goal): void
}>()
</script>

<template>
  <PrimeFieldset
    legend="Upcoming Goals"
    :toggleable="true"
    collapsed
  >
    <ul class="upcoming-goals">
      <li
        v-for="goal in goals"
        :key="goal.id"
        :class="{ completed: goal.completed }"
      >
        <span>{{ goal.title }} ({{ goal.date }})</span>
        <PrimeButton @click="$emit('toggle-completion', goal)">
          {{ goal.completed ? 'Undo' : 'Complete' }}
        </PrimeButton>
      </li>
    </ul>
  </PrimeFieldset>
</template>

<style scoped>
.upcoming-goals {
  list-style-type: none;
  padding: 0;
}

.upcoming-goals li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upcoming-goals li.completed span {
  text-decoration: line-through;
  color: #888;
}
</style>
