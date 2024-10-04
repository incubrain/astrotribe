<template>
  <button @click="click">CLICK ME</button>
</template>

<script>
definePageMeta({
  middleware: 'auth', // Specify the middleware here
})
export default {
  methods: {
    async click() {
      console.log('CLICKED')
    },
  },
}
</script>
