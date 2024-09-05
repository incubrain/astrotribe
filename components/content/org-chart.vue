<template>
  <div class="card overflow-x-auto">
    <PrimeOrganizationChart
      :value="data"
      collapsible
    >
      <template #person="slotProps">
        <div class="flex flex-col">
          <div class="flex flex-col items-center">
            <NuxtImg
              :alt="slotProps.node.data.name"
              :src="slotProps.node.data.image"
              width="80"
              height="80"
              class="rounded-full"
            />
            <h4 class="pb-2 text-xl font-bold">
              {{ slotProps.node.data.name }}
            </h4>
            <span>{{ slotProps.node.data.title }}</span>
          </div>
        </div>
      </template>
      <template #default="slotProps">
        <span>{{ slotProps.node.label }}</span>
      </template>
    </PrimeOrganizationChart>
  </div>
</template>

<script setup lang="ts">
const data = ref({
  key: '0',
  type: 'person',
  styleClass: 'bg-indigo-900 text-white border-round-xl',
  data: {
    image: 'images/team/shweta-kulkarni.jpg',
    name: 'Shweta Kulkarni',
    title: 'CEO'
  },
  children: [
    {
      key: '0_0',
      type: 'person',
      styleClass: 'bg-teal-900 text-white border-round-xl',
      data: {
        image: 'images/team/drew-macgibbon.jpg',
        name: 'Drew MacGibbon',
        title: 'CTO'
      },
      children: [
        {
          label: 'DevOps Engineers',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        },
        {
          label: 'Frontend Developers',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        },
        {
          label: 'Backend Developers',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        },
        {
          label: 'AI Specialists',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        },
        {
          label: 'UI/UX Developers',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        },
        {
          label: 'Data Processors / QA',
          styleClass: 'bg-teal-900 text-white border-round-xl'
        }
      ]
    },
    {
      key: '0_1',
      type: 'person',
      styleClass: 'bg-purple-900 text-white border-round-xl',
      data: {
        image: 'images/team/gunashri-vesikar.jpg',
        name: 'Gunashri Vesikar',
        title: 'CFO'
      },
      children: [
        {
          label: 'Accountants',
          styleClass: 'bg-purple-900 text-white border-round-xl'
        }
      ]
    },
    {
      key: '0_2',
      type: 'person',
      styleClass: 'bg-orange-900 text-white border-round-xl',
      data: {
        image: 'images/team/unknown.jpg',
        name: 'Unknown',
        title: 'COO'
      },
      children: [
        {
          label: 'Content Writers',
          styleClass: 'bg-orange-900 text-white border-round-xl'
        },
        {
          label: 'Social Media Managers',
          styleClass: 'bg-orange-900 text-white border-round-xl'
        },
        {
          label: 'Customer Support Agents',
          styleClass: 'bg-orange-900 text-white border-round-xl'
        },
        {
          label: 'Sales People',
          styleClass: 'bg-orange-900 text-white border-round-xl'
        }
      ]
    }
  ]
})
</script>
