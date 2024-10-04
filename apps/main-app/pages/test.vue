<template>
  <button @click="click">CLICK ME</button>
</template>

<script>
export default {
  methods: {
    async click() {
      console.log('CLICKED')
      fetch('/api/check/checkAuth', { method: 'POST' })
    },
  },
}
</script>
