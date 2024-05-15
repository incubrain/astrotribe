<template>
  <div class="border-b border-color">
    <div class="p-6 flex gap-4">
      <PrimeSkeleton
        :pt="{
          root: 'max-w-16 min-h-16 rounded-full'
        }"
      />
    </div>
    <div class="overflow-hidden w-full">
      <PrimeSkeleton class="w-full min-h-[220px] rounded-md" />
    </div>
    <div class="flex flex-col gap-4 p-4">
      <PrimeSkeleton class="w-32 h-4 rounded-md" />
      <PrimeSkeleton class="max-w-64 h-4 rounded-md" />
      <PrimeSkeleton class="max-w-32 h-4 rounded-md" />
      <div class="w-full flex justify-end p-2">
        <PrimeSkeleton class="max-w-32 min-h-12 rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
