<script setup>
const { socials, websiteLinks } = usePages()

// again use the categories to consolidate the links, but list them all vertically under categories
</script>

<template>
  <footer class="flex flex-col justify-start items-start relative overflow-hidden">
    <div class="relative wrapper padded-x flex justify-between rounded-md w-full items-start">
      <div
        class="grid grid-cols-2 lg:grid-cols-3 rounded-t-md w-full h-full gap-4 lg:gap-8 p-4 xl:p-8 mx-auto background"
      >
        <div
          class="flex flex-shrink-0 row-start-2 lg:row-start-1 col-start-2 lg:col-start-1 justify-center items-start lg:justify-start lg:pr-4"
        >
          <NuxtLink
            to="/"
            class="flex lg:flex-row items-center justify-center gap-4 font-semibold"
          >
            <BaseImage
              :img="{
                src: '/astronera-logo.jpg',
                alt: 'AstronEra Logo',
                width: '48',
                height: '48'
              }"
              class="dark:bg-white rounded-full overflow-hidden p-1"
            />
            AstronEra
          </NuxtLink>
        </div>
        <ul
          class="flex row-start-1 justify-between col-start-1 col-span-2 lg:col-span-1 lg:col-start-2 gap-2 items-start lg:items-start text-sm"
        >
          <div
            v-for="link in websiteLinks"
            :key="link.label"
            class="last:pr-0 pb-2 lg:pb-0 space-y-2 px-3"
          >
            <h4
              class="font-bold text-base underline underline-offset-4 decoration-primary-600 pb-2"
            >
              {{ link.label }}
            </h4>
            <NuxtLink
              v-for="child in link.items"
              :key="child.label"
              :to="child.url"
              class="flex items-center text-sm font-normal"
            >
              {{ child.label }}
            </NuxtLink>
          </div>
        </ul>
        <div
          class="flex items-end lg:justify-end lg:items-start lg:row-start-1 col-start-1 lg:col-start-3 gap-2"
        >
          <NuxtLink
            v-for="social in socials"
            :key="social.label"
            :to="social.slug"
            target="_blank"
            class="flex items-center"
          >
            <Icon
              :name="social.icon"
              class="flex-shrink-0 h-5 w-5 dark:text-white"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="wrapper padded-x w-full">
      <FooterBottomBar class="min-w-full  border-t border-color" />
    </div>
  </footer>
</template>
