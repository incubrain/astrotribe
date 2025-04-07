<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
})

const tocLinks = computed(() => {
  return props.article.body?.toc?.links || []
})

const activeSection = ref('')

const onScroll = () => {
  let currentSection = ''
  tocLinks.value.forEach((section) => {
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

const isSectionOrChildActive = (section: any) => {
  if (isActiveSection(section.id)) {
    return true
  }
  return section.children?.some((child: any) => isActiveSection(child.id)) ?? false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    v-if="tocLinks.length"
    class="relative text-base lg:pb-8"
  >
    <div class="flex gap-2 pb-2">
      <PrimeTag
        v-if="article.updatedAt"
        :value="`Updated ${useDateFormat(article.updatedAt, 'DD MMM YYYY').value}`"
      />
    </div>
    <PrimeAccordion value="0">
      <PrimeAccordionPanel value="0">
        <PrimeAccordionHeader class="flex gap-4 bg-primary-800 py-2 px-4 rounded-md items-center">
          <h3 class="text-lg font-semibold">Table of Contents</h3>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <ul>
            <li
              v-for="link in tocLinks"
              :key="link.id"
              class="py-1"
            >
              <NuxtLink
                class="text-lg font-[Oswald]"
                :class="{ 'text-primary-600': isActiveSection(link.id) }"
                :to="`#${link.id}`"
              >
                <h4>
                  {{ link.text }}
                </h4>
              </NuxtLink>
              <ul
                v-if="link.children"
                :class="[
                  'space-y-2 overflow-hidden text-sm transition-all duration-700 ease-out',
                  isSectionOrChildActive(link) || expanded
                    ? `max-h-[${Math.floor((link.children.length + 1) * 31)}px] pt-2`
                    : 'max-h-[0px] py-0',
                ]"
              >
                <li
                  v-for="child in link.children"
                  :key="`toc-child${child.id}`"
                  :class="{
                    'ml-4 max-w-[80%]': child.depth === 3,
                    'text-primary-600': isActiveSection(child.id),
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
