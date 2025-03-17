<template>
  <div>
    <div class="wrapper p-4 xl:p-8 flex gap-4">
      <BlogFilter />
      <BlogSearch
        button-label="Search"
        placeholder="Search all blogs..."
        :result-limit="10"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
