<template>
  <div class="card">
    <PrimeTabMenu :model="items">
      <template #item="{ item, props }">
        <nuxt-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            v-bind="props.action"
            @click="navigate"
          >
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ item.label }}</span>
          </a>
        </nuxt-link>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ item.label }}</span>
        </a>
      </template>
    </PrimeTabMenu>
  </div>
</template>

<script setup lang="ts">

const items = ref([
  { label: 'Router Link', icon: 'pi pi-home', route: '/tabmenu' },
  {
    label: 'Programmatic',
    icon: 'pi pi-palette',
    command: () => {
      // Replace this.$router with Vue Router's push method
      this.$router.push('/unstyled')
    }
  },
  { label: 'External', icon: 'pi pi-link', url: 'https://vuejs.org/' }
])
</script>

<style scoped></style>
