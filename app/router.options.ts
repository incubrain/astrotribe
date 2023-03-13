// This is a workaround for the issue with the scrollBehavior still present in Nuxt 3.0
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior () {
    return false
  },
  routes: (_routes) => {
    if (process.env.NODE_ENV === 'production') {
      _routes = _routes.filter((route) => !route.path.includes('partials'))
    }
    return _routes
  }
}
