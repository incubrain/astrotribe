<script setup lang="ts">
import { useDateFormat } from '#imports'
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

<template>
  <div class="relative text-base">
    <div class="flex gap-2 pb-2">
      <PrimeTag :value="`Updated ${useDateFormat(updatedAt, 'DD MMM YYYY').value}`" />
      <PrimeTag
        :value="`Version ${version}`"
        severity="secondary"
      />
    </div>
    <PrimeAccordion value="0">
      <PrimeAccordionPanel value="0">
        <PrimeAccordionHeader class="flex gap-4 bg-primary-800 py-2 px-4 rounded-md items-center">
          <h3 class="text-lg font-semibold">
            Table of Contents
          </h3>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
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
                  'space-y-2 overflow-hidden text-sm transition-all duration-700 ease-out',
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
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<style scoped></style>
