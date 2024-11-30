<script setup lang="ts">
const { socials } = useSocialLinks()

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
        label: 'Conference',
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
        label: 'Conservation',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/dark-sky-conservation/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-people-of-space',
        label: 'People',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/people-of-space/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-space-exploration',
        label: 'Exploration',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category/space-exploration/page/1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-sustainable-development',
        label: 'Sustainability',
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
  <footer class="container py-8 gap-8 w-full relative flex">
    <LandingGlass
      hover-effect="glow"
      glow-color="purple"
      gradient="mixed"
      intensity="low"
      interactive
    >
      <!-- Content -->
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-[180px_3fr_180px] gap-8 w-full">
        <!-- Logo Section -->
        <div class="flex items-start">
          <NuxtLink
            to="/"
            class="flex items-center gap-4 group"
          >
            <div class="hidden gap-4 rounded-md p-1 lg:flex">
              <div
                class="relative flex h-[36px] w-[36px] items-center justify-center rounded-md border bg-white p-1 md:h-[44px] md:w-[44px]"
              >
                <IBImage
                  :img="{
                    src: '/astronera-logo.jpg',
                  }"
                  class="h-full w-full opacity-90"
                />
              </div>
              <div class="flex justify-center">
                <h1
                  class="mt-[2px] flex cursor-pointer flex-col items-start justify-start pr-2 text-sm font-bold uppercase leading-none tracking-normal"
                >
                  Astron
                  <strong class="font-extrabold text-primary-400"> Era </strong>
                </h1>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Links Section -->
        <div class="grid grid-cols-3 gap-8 mx-auto">
          <div
            v-for="link in websiteLinks"
            :key="link.key"
            class="space-y-4"
          >
            <h4 class="font-space text-lg text-white">
              {{ link.label }}
            </h4>
            <ul class="space-y-2">
              <li
                v-for="item in link.items"
                :key="item.key"
              >
                <NuxtLink
                  :to="item.url"
                  class="text-gray-400 hover:text-sky-400 transition-colors duration-300 text-sm max-w-xl text-wrap"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Social Links -->
        <div class="flex flex-col items-end gap-4">
          <NuxtLink
            v-for="social in socials"
            :key="social.id"
            :to="social.url"
            target="_blank"
            class="group relative p-2 rounded-lg transition-all duration-300 hover:bg-sky-500/10"
          >
            <Icon
              :name="social.icon"
              class="text-gray-400 group-hover:text-sky-400 transition-colors duration-300"
              size="24px"
            />
          </NuxtLink>
        </div>
      </div>
    </LandingGlass>
    <FooterBottomBar class="relative z-10" />
  </footer>
</template>

<style>
@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.1),
      0 0 8px rgba(74, 222, 255, 0.1),
      inset 0 0 4px rgba(74, 222, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.2),
      0 0 16px rgba(74, 222, 255, 0.2),
      inset 0 0 8px rgba(74, 222, 255, 0.2);
  }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
}
</style>
