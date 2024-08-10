<script setup>
const { socials, websiteLinks } = usePages()

// again use the categories to consolidate the links, but list them all vertically under categories
</script>

<template>
  <footer class="relative flex flex-col items-start justify-start overflow-hidden pt-4 lg:pt-8">
    <div class="wrapper relative flex w-full items-start justify-between rounded-md lg:px-8">
      <div
        class="background mx-auto grid h-full w-full grid-cols-2 gap-4 rounded-t-md p-4 lg:grid-cols-[220px_2fr_220px] lg:gap-8 xl:p-8"
      >
        <div
          class="col-start-2 row-start-2 flex flex-shrink-0 items-start  lg:col-start-1 lg:row-start-1 lg:justify-start lg:pr-4"
        >
          <NuxtLink
            to="/"
            class="flex items-center justify-center gap-4 font-semibold lg:flex-row"
          >
            <BaseImage
              :img="{
                src: '/astronera-logo.jpg',
                alt: 'AstronEra Logo',
                width: '48',
                height: '48'
              }"
              class="overflow-hidden rounded-full p-1 dark:bg-white"
            />
            AstronEra
          </NuxtLink>
        </div>
        <ul
          class="col-span-2 col-start-1 row-start-1 flex mx-auto items-start justify-between gap-2 text-sm lg:col-span-1 lg:col-start-2 lg:items-start"
        >
          <div
            v-for="link in websiteLinks"
            :key="link.label"
            class="space-y-2 px-3 pb-2 last:pr-0 lg:pb-0"
          >
            <h4
              class="pb-2 text-base font-bold underline decoration-primary-600 underline-offset-4 text-nowrap"
            >
              {{ link.label }}
            </h4>
            <NuxtLink
              v-for="child in link.items"
              :key="child.label"
              :to="child.url"
              class="flex items-center text-sm font-normal"
            >
            <li>
              {{ child.label }}
            </li>
            </NuxtLink>
          </div>
        </ul>
        <div
          class="col-start-1 flex gap-2 lg:col-start-3 lg:row-start-1 items-center lg:items-start justify-end"
        >
          <NuxtLink
            v-for="social in socials"
            :key="social.label"
            :to="social.url"
            target="_blank"
            class="flex items-center"
          >
            <Icon
              :name="social.icon"
              class="h-7 w-7 flex-shrink-0 dark:text-white"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="wrapper w-full lg:px-8">
      <FooterBottomBar class="border-color min-w-full border-t" />
    </div>
  </footer>
</template>
