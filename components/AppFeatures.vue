<script setup lang="ts">
const organization = {
  key: '1',
  label: 'CEO',
  type: 'person',
  styleClass: 'ui-person',
  expanded: true,
  data: { name: 'Walter White', title: 'CEO', image: 'images/organization/walter.jpg' },
  children: [
    {
      key: '2',
      label: 'CFO',
      type: 'person',
      styleClass: 'ui-person',
      expanded: true,
      data: { name: 'Saul Goodman', title: 'CFO', image: 'images/organization/saul.jpg' },
      children: [
        {
          key: '3',
          label: 'Tax',
          type: 'person',
          styleClass: 'ui-person',
          data: { name: 'Skyler White', title: 'Tax', image: 'images/organization/skyler.jpg' }
        },
        {
          key: '4',
          label: 'Legal',
          type: 'person',
          styleClass: 'ui-person',
          data: { name: 'Jesse Pinkman', title: 'Legal', image: 'images/organization/jesse.jpg' }
        }
      ]
    },
    {
      key: '5',
      label: 'COO',
      type: 'person',
      styleClass: 'ui-person',
      data: { name: 'Mike E.', title: 'COO', image: 'images/organization/mike.jpg' }
    },
    {
      key: '6',
      label: 'CTO',
      type: 'person',
      styleClass: 'ui-person',
      data: { name: 'Gus Fring', title: 'CTO', image: 'images/organization/gus.jpg' }
    }
  ]
}

const selection = ref([])
</script>

<template>
  <PrimeOrganizationChart
    v-model:selection-keys="selection"
    :value="organization"
  >
    <template #person="slotProps">
      <div class="flex flex-col items-center rounded-lg shadow-md">
        <span class="font-bold mb-2">{{ slotProps.node.data.name }}</span>
        <span>{{ slotProps.node.data.title }}</span>
      </div>
    </template>
    <template #default="slotProps">
      <span>{{ slotProps.node.label }}</span>
    </template>
  </PrimeOrganizationChart>
</template>

<style scoped></style>
