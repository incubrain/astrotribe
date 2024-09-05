<template>
  <div class="event-logger">
    <h3>Event Log</h3>
    <ul>
      <li
        v-for="(event, index) in events"
        :key="index"
      >
        <strong>{{ event.name }}</strong>
        <span>{{ formatTimestamp(event.timestamp) }}</span>
        <pre>{{ JSON.stringify(event.payload, null, 2) }}</pre>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Event {
  name: string
  payload: any
  timestamp: Date
}

defineProps<{
  events: Event[]
}>()

const formatTimestamp = (timestamp: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  }).format(timestamp)
}
</script>

<style scoped>
.event-logger {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

strong {
  color: #333;
}

span {
  color: #666;
  font-size: 0.8em;
  margin-left: 10px;
}

pre {
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 4px;
  font-size: 0.9em;
  overflow-x: auto;
}
</style>
