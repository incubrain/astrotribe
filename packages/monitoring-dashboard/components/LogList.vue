    
    <script setup lang="ts">
    const logs = ref([]);
    
    onMounted(async () => {
      const response = await $fetch('/api/logs', { method: 'GET' });
      logs.value = response;
    });
    
    </script>
    
<template>
  <div>
    <h2>Logs</h2>
    <ul>
      <li v-for="log in logs" :key="log._time">
        {{ log._time }} - {{ log.message }}
      </li>
    </ul>
  </div>
</template>
