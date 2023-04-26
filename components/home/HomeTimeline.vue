<template>
  <div class="flex flex-col gap-8 w-full py-home">
    <h2 class="head-2 text-dark w-full text-left">Timeline</h2>
    <div class="flex flex-col justify-center items-center w-full mx-auto">
      <div
        v-for="item in timeline"
        :key="item.id"
        class="flex flex-row text-dark"
      >
        <div class="text-right mt-16">
          <h4 class="head-4">{{ item.date }}</h4>
          <p class="p-body">{{ item.body }}</p>
        </div>
        <div class="w-[6px] flex bg-green-600 mx-8" />
        <!-- right  -->
        <div class="text-left mt-44">
          <h4 class="head-4">{{ item.date }}</h4>
          <p class="p-body">{{ item.body }}</p>
        </div>
      </div>
      <div class="w-full flex flex-col gap-8 text-left justify-between"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const timeline = [
  { id: 1, date: '2023 Q2', body: 'some information' },
  { id: 2, date: '2023 Q3', body: 'some information' },
  { id: 3, date: '2023 Q4', body: 'some information' },
  { id: 4, date: '2023 Q5', body: 'some information' },
  { id: 5, date: '2023 Q2', body: 'some information' },
  { id: 6, date: '2023 Q2', body: 'some information' }
]

// defineProps({
//   title: {
//     type: String as PropType<string>,
//     required: true
//   }
// })
</script>

<style scoped></style>
