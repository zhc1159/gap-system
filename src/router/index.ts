// ===========================================
// Vue Router Configuration
// ===========================================

import { createRouter, createWebHistory } from 'vue-router'
import routes, { staticRoutes, dynamicRoutes } from './routes'
import { setupRouteGuards } from './guards'

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Setup route guards
setupRouteGuards(router)

export default router

export { staticRoutes, dynamicRoutes }
