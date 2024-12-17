<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="max-w-md mx-auto p-8 background rounded-xl shadow-lg text-center space-y-6 w-full">
      <!-- Achievements Header with Icon -->
      <div class="flex flex-col items-center">
        <Icon
          name="mdi:star-circle-outline"
          size="48px"
          class="text-yellow-500 text-6xl mb-4"
        />
        <h1 class="text-3xl font-bold">Achievements</h1>
      </div>
      <!-- Coming Soon Notice with Icon -->
      <div class="flex flex-col items-center">
        <Icon
          name="material-symbols:hourglass-empty-rounded"
          class="text-blue-500 text-5xl mb-2"
        />
        <p class="text-xl">Coming Soon!</p>
      </div>
      <!-- Game Related Icon for Flair -->
      <div class="flex justify-center space-x-4 mt-6">
        <Icon
          name="game-icons:laurels-trophy"
          class="text-red-500 text-4xl"
        />
        <Icon
          name="game-icons:achievement"
          class="text-green-500 text-4xl"
        />
        <Icon
          name="mdi:firework"
          class="text-orange-500 text-4xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
