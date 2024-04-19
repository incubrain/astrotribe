<template>
  <PrimePassword
    id="password"
    class="flex flex-col relative"
  >
    <template #footer>
      <PrimeDivider />
      <p class="mt-2">Suggestions</p>
      <ul
        class="pl-2 ml-2 mt-0"
        style="line-height: 1.5"
      >
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </template>
  </PrimePassword>
</template>

<script setup lang="ts"></script>

<style scoped></style>
