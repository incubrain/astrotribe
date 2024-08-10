<template>
  <div>
    <iframe
      src="https://status.astronera.org"
      width="1000"
      height="800"
    ></iframe>

    <iframe
      src="https://status.astronera.org/badge?theme=dark"
      width="250"
      height="30"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'AstronEra Status',
  meta: [
    {
      name: 'description',
      content: 'AstronEra status page'
    }
  ],
  script: [
    {
      src: 'https://uptime.betterstack.com/widgets/announcement.js',
      async: true,
      type: 'text/javascript'
    }
  ]
})
</script>

<style scoped></style>
