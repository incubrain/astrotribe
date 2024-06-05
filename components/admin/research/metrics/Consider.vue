<template>
  <div>

  </div>
</template>

<script setup lang="ts">

// export interface ChunkMetrics {
//   averageLengthBefore: number
//   averageLengthAfter: number
//   averageDifference: number
//   averageItemsCleaned: number
//   longestLengthBefore: number
//   longestLengthAfter: number
//   shortestLengthBefore: number
//   shortestLengthAfter: number
//   medianLengthBefore: number
//   medianLengthAfter: number
//   standardDeviationBefore: number
//   standardDeviationAfter: number
// }


// function calculateMetrics(chunks) {
//     console.log('calculateMetrics:', chunks)
//     const metrics = {
//       totalLengthBefore: 0,
//       totalLengthAfter: 0,
//       totalItemsCleaned: 0,
//       longestLengthBefore: 0,
//       longestLengthAfter: 0,
//       shortestLengthBefore: Infinity,
//       shortestLengthAfter: Infinity,
//       lengthsBefore: [],
//       lengthsAfter: []
//     }

//     chunks.forEach((embed) => {
//       const lengthBefore = embed.chunk.length
//       const cleanedText = cleanText(embed.chunk)
//       const lengthAfter = cleanedText.length
//       const itemsCleaned = embed.chunk.match(/\[.*?\(\d+[^\)]*\)\]/g)?.length || 0

//       metrics.totalLengthBefore += lengthBefore
//       metrics.totalLengthAfter += lengthAfter
//       metrics.totalItemsCleaned += itemsCleaned

//       if (lengthBefore > metrics.longestLengthBefore) {
//         metrics.longestLengthBefore = lengthBefore
//       }
//       if (lengthAfter > metrics.longestLengthAfter) {
//         metrics.longestLengthAfter = lengthAfter
//       }
//       if (lengthBefore < metrics.shortestLengthBefore) {
//         metrics.shortestLengthBefore = lengthBefore
//       }
//       if (lengthAfter < metrics.shortestLengthAfter) {
//         metrics.shortestLengthAfter = lengthAfter
//       }

//       metrics.lengthsBefore.push(lengthBefore)
//       metrics.lengthsAfter.push(lengthAfter)
//     })

//     const averageLengthBefore = metrics.totalLengthBefore / chunks.length
//     const averageLengthAfter = metrics.totalLengthAfter / chunks.length
//     const averageDifference = (metrics.totalLengthBefore - metrics.totalLengthAfter) / chunks.length
//     const averageItemsCleaned = metrics.totalItemsCleaned / chunks.length

//     const medianLengthBefore = calculate.median(metrics.lengthsBefore)
//     const medianLengthAfter = calculate.median(metrics.lengthsAfter)

//     const standardDeviationBefore = calculate.standardDeviation(metrics.lengthsBefore)
//     const standardDeviationAfter = calculate.standardDeviation(metrics.lengthsAfter)

//     return {
//       averageLengthBefore,
//       averageLengthAfter,
//       averageDifference,
//       averageItemsCleaned,
//       longestLengthBefore: metrics.longestLengthBefore,
//       longestLengthAfter: metrics.longestLengthAfter,
//       shortestLengthBefore: metrics.shortestLengthBefore,
//       shortestLengthAfter: metrics.shortestLengthAfter,
//       medianLengthBefore,
//       medianLengthAfter,
//       standardDeviationBefore,
//       standardDeviationAfter
//     }
//   }

</script>

<style scoped>

</style>