<template>
  <div class="border-b border-color">
    <!-- Avatar skeleton -->
    <div class="p-6 flex gap-4">
      <PrimeSkeleton
        shape="circle"
        size="4rem"
        class="flex-shrink-0"
      />
    </div>

    <!-- Image skeleton -->
    <div class="overflow-hidden w-full">
      <PrimeSkeleton
        width="100%"
        height="220px"
        class="mb-2"
      />
    </div>

    <!-- Text content skeletons -->
    <div class="flex flex-col gap-4 p-4">
      <PrimeSkeleton
        width="8rem"
        height="1rem"
      />
      <PrimeSkeleton
        width="16rem"
        height="1rem"
      />
      <PrimeSkeleton
        width="8rem"
        height="1rem"
      />

      <!-- Button skeleton -->
      <div class="w-full flex justify-end p-2">
        <PrimeSkeleton
          width="8rem"
          height="3rem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
