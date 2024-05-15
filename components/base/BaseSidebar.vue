<script setup lang="ts">
const isSideVisible = ref(true)
</script>
<template>
  <div class="md:sticky top-0 p-8 space-y-4">
    <div class="flex flex-col justify-center md:justify-start">
      <div class="flex gap-4">
        <!-- <PrimeToggleButton
          v-model="isSideVisible"
          on-label="Hide"
          off-label="Show"
        >
          <Icon :name="isSideVisible ? 'mdi:eye' : 'mdi:sun'" />
        </PrimeToggleButton> -->
        <!-- <Transition name="slide-fade">
          <PrimeInlineMessage
            v-show="isSideVisible"
            severity="info"
            :pt="{ root: '', text: 'text-sm text-left' }"
          >
            Filters Coming Soon
          </PrimeInlineMessage>
        </Transition> -->
      </div>
        <BaseFeedback v-show="isSideVisible" />
    </div>
  </div>
</template>

<style scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-top-enter-active {
  transition: all 0.3s ease-out;
}

.slide-top-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-top-enter-from,
.slide-top-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
