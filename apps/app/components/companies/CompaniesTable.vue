<script setup lang="ts">
import { navigateTo } from 'nuxt/app'

interface Company {
  id: string
  name: string
  description: string
  logo_url: string
  category: string
  url: string
  is_government: boolean
  keywords: Array<string>
}

const getFallbackAvatarUrl = (name: string) => {
  const initials =
    name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'U'
  return `https://ui-avatars.com/api/?name=${initials}&background=random&size=128`
}

defineProps({
  companies: Array<Company>,
})
</script>

<template>
  <table
    class="min-w-full select-none border-collapse text-primary-500 table-auto bg-transparent rounded-lg"
  >
    <tbody>
      <tr
        v-for="company in companies"
        :key="company.id"
        class="relative p-5 mt-1 mb-1 border border-primary-500 rounded-xl gap-2 hover:bg-primary-500 text-lg text-white cursor-pointer shadow-md"
        @click="navigateTo(company.url, { external: true, open: { target: '_blank' } })"
      >
        <td class="px-4 py-3 text-center"
          ><IBImage
            :img="{ src: company.logo_url, width: '200', height: '200' }"
            class="rounded-xl bg-white p-2"
        /></td>
        <td class="px-4 py-3"
          ><h3>{{ company.name }}</h3></td
        >
        <td class="px-4 py-3 whitespace-wrap max-w-xs text-center"
          ><p v-if="company.description"
            >{{ company.description.slice(0, 1).toUpperCase()
            }}{{ company.description.slice(1, 241) }}...</p
          >
        </td>
        <td
          v-if="company.is_government"
          class="absolute text-xs top-2 right-2 p-2 bg-gray-600 text-black rounded-xl"
          ><h3>Government</h3></td
        >
      </tr>
    </tbody>
  </table>
</template>
