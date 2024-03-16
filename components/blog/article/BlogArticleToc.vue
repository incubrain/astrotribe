<template>
  <div class="relative text-base">
    <div class="flex gap-2">
      <UBadge
        :label="`Updated ${useDateFormat(updatedAt, 'DD MMM YYYY').value}`"
        color="primary"
        variant="subtle"
        size="sm"
      />
      {{ expanded }}
      <UBadge
        :label="`Version ${version}`"
        color="white"
        variant="soft"
        size="sm"
      />
    </div>
    <h2 class="text-2xl font-bold py-4 font-[Oswald]">Table of Contents</h2>
    <ul>
      <li
        v-for="item in toc"
        :key="item.id"
        class="py-1"
      >
        <NuxtLink
          class="text-lg font-[Oswald]"
          :class="{ 'text-primary-500 dark:text-primary-600': isActiveSection(item.id) }"
          :to="`#${item.id}`"
        >
          <h4>
            {{ item.text }}
          </h4>
        </NuxtLink>
        <ul
          v-if="item.children"
          :class="[
            'transition-all duration-700 ease-out overflow-hidden space-y-2 text-sm',
            isSectionOrChildActive(item) || expanded
              ? `max-h-[${Math.floor((item.children.length + 1) * 31)}px] pt-2`
              : 'max-h-[0px] py-0'
          ]"
        >
          <li
            v-for="child in item.children"
            :key="`toc-child${child.id}`"
            :class="{
              'ml-4 max-w-[80%]': child.depth === 3,
              'text-primary-500 dark:text-primary-600': isActiveSection(child.id)
            }"
            class="leading-tight"
          >
            <NuxtLink :to="`#${child.id}`">
              <h5>
                {{ child.text }}
              </h5>
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type TOCItem = {
  id: string
  depth: number
  text: string
  children?: TOCItem[]
}

const p = defineProps({
  toc: {
    type: Array as PropType<TOCItem[]>,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

const activeSection = ref('')

const onScroll = () => {
  let currentSection = ''
  p.toc.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element && window.scrollY >= element.offsetTop - 200) {
      currentSection = section.id
    }
    section.children?.forEach((child) => {
      const childElement = document.getElementById(child.id)
      if (childElement && window.scrollY >= childElement.offsetTop - 200) {
        currentSection = child.id
      }
    })
  })
  activeSection.value = currentSection
}

const isActiveSection = (sectionId: string) => {
  return activeSection.value === sectionId
}

const isSectionOrChildActive = (section: TOCItem) => {
  if (isActiveSection(section.id)) {
    return true
  }
  return section.children?.some((child) => isActiveSection(child.id)) ?? false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped></style>
