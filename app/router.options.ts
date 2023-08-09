import type { RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return {
    //     top: 0,
    //     behavior: 'smooth'
    //   }
    // }
  }
}
