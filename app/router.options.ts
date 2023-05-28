import type { RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    // if (savedPosition) {
    //   console.log('savedPosition', savedPosition)
    //   return savedPosition
    // } else {
    //   console.log('regularPosition')
    //   return {
    //     top: 0,
    //     behavior: 'smooth'
    //   }
    // }
  }
}
