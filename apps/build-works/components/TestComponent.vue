<template>
  <div>
    <PrimeButton>Test</PrimeButton>
  </div>
</template>

<script setup lang="ts">
import { useLogger } from '@ib/client'

// need to import this in all other places

const log = useLogger('TestComponent')

log.info('TestComponent loaded')
</script>

<style scoped></style>
