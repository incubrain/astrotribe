<template>
  <div>
    <div class="wrapper py-4 xl:py-8 flex gap-4">
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
