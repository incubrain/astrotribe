<template>
  <div>
    <h1 class="card-heading pb-4 font-semibold">{{ title }}</h1>
    <p >
      {{ body }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  body: string
}

withDefaults(defineProps<Props>(), {
  title: 'Title',
  body: 'some body text'
})
</script>

<style scoped></style>
