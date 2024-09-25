<script setup lang="ts">
</script>

<template>
  <div class="border-b-2 border-color px-4 py-8">
    <div>
      <div class="space-y-4 pb-4">
        <div class="flex gap-4 items-center">
          <PrimeSkeleton
            :pt="{
              root: 'max-w-16 min-h-16 rounded-full',
            }"
          />

          <div class="w-full space-y-2">
            <PrimeSkeleton class="max-w-64 min-h-6 rounded-md" />
            <PrimeSkeleton class="max-w-48 h-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <PrimeSkeleton class="max-w-32 min-h-6 rounded-md" />
        <PrimeSkeleton class="max-w-16 min-h-6 rounded-md" />
      </div>
      <PrimeSkeleton class="w-full min-h-24 rounded-md" />

      <div class="w-full flex justify-between items-center pt-4">
        <PrimeSkeleton class="max-w-32 min-h-6 rounded-md" />
        <PrimeSkeleton class="max-w-24 min-h-10 rounded-md" />
      </div>
    </div>
  </div>
</template>
