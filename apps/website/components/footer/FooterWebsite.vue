<script setup>
const socials = ref([
  {
    id: 1,
    platform: 'twitter',
    icon: 'mdi:twitter',
    url: 'https://twitter.com/AstronEra',
    username: 'uk',
  },
  {
    id: 2,
    icon: 'mdi:linkedin',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/astronera',
    username: 'uk',
  },
  {
    id: 3,
    icon: 'mdi:instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com/astronera',
    username: 'uk',
  },
])

const websiteLinks = [
  {
    key: 'about-us',
    label: 'About Us',
    icon: 'material-symbols:info',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'about',
        label: 'About',
        icon: 'material-symbols:info',
        url: '/about',
        visible: true,
        disabled: false,
      },
      {
        key: 'team',
        label: 'Team',
        icon: 'material-symbols:emoji-people',
        url: '/team',
        visible: true,
        disabled: false,
      },
      {
        key: 'contact',
        label: 'Contact',
        icon: 'material-symbols:call',
        url: '/contact',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: 'material-symbols:work',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'dark-sky-conference-2023',
        label: 'Dark Sky Conference',
        icon: 'material-symbols:mic-rounded',
        url: '/projects/dark-sky-conference-2023',
        visible: true,
        disabled: false,
      },
      // {
      //   key: 'astrotribe',
      //   label: 'Astrotribe',
      //   icon: 'material-symbols:groups',
      //   url: 'projects/astrotribe',
      //   visible: true,
      //   disabled: false
      // },
    ],
  },
  // {
  //   key: 'events',
  //   label: 'Events',
  //   icon: 'material-symbols:event',
  //   visible: false,
  //   disabled: false,
  //   items: [
  //     {
  //       key: 'stargazing',
  //       label: 'Stargazing',
  //       icon: 'material-symbols:dark-mode',
  //       url: '/events/stargazing',
  //       visible: false,
  //       disabled: false
  //     }
  //   ]
  // },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'blog-home',
        label: 'All',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/all/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-dark-sky-conservation',
        label: 'Dark Sky Conservation',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/dark-sky-conservation/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-people-of-space',
        label: 'Peoples of Space',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/people-of-space/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-space-exploration',
        label: 'Space Exploration',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/space-exploration/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-sustainable-development',
        label: 'Sustainable Development',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/sustainable-development/page/1',
        visible: true,
        disabled: false,
      },
    ],
  },
]
</script>

<template>
  <footer class="relative flex flex-col items-start justify-start overflow-hidden pt-4 lg:pt-8">
    <div class="wrapper relative flex w-full items-start justify-between rounded-md lg:px-8">
      <div
        class="background mx-auto grid h-full w-full grid-cols-2 gap-4 rounded-t-md p-4 lg:grid-cols-[220px_2fr_220px] lg:gap-8 xl:p-8"
      >
        <div
          class="col-start-2 row-start-2 flex flex-shrink-0 items-start lg:col-start-1 lg:row-start-1 lg:justify-start lg:pr-4"
        >
          <NuxtLink
            to="/"
            class="flex items-center justify-center gap-4 font-semibold lg:flex-row"
          >
            <IBImage
              :img="{
                src: '/astronera-logo.jpg',
                alt: 'AstronEra Logo',
                width: '48',
                height: '48',
              }"
              class="overflow-hidden rounded-full p-1 bg-white"
            />
            AstronEra
          </NuxtLink>
        </div>
        <ul
          class="col-span-2 col-start-1 row-start-1 mx-auto flex items-start justify-between gap-2 text-sm lg:col-span-1 lg:col-start-2 lg:items-start"
        >
          <div
            v-for="link in websiteLinks"
            :key="link.label"
            class="space-y-2 px-3 pb-2 last:pr-0 lg:pb-0"
          >
            <h4
              class="text-nowrap pb-2 text-base font-bold underline decoration-primary-600 underline-offset-4"
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
          class="col-start-1 flex items-center justify-end gap-2 lg:col-start-3 lg:row-start-1 lg:items-start"
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
              class="flex-shrink-0 text-white"
              size="24px"
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
