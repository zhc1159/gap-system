// ===========================================
// Route Guards
// ===========================================

import type { Router, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMenuStore } from '@/stores/menu'
import { useLayoutStore } from '@/stores/layout'
import { useAppStore } from '@/stores/app'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

// White list - no auth required
const whiteList = ['/login', '/403', '/404']

/**
 * Setup route guards
 */
export function setupRouteGuards(router: Router) {
  // Before each route
  router.beforeEach(async (to: RouteLocationNormalized, _from, next) => {
    // Start progress bar
    NProgress.start()

    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const layoutStore = useLayoutStore()
    const appStore = useAppStore()

    // Set page title
    const title = appStore.language === 'zh-CN' ? to.meta.title : (to.meta.titleEn || to.meta.title)
    document.title = title ? `${title} | GAP System` : 'GAP System'

    // Check if route requires auth
    const requiresAuth = to.meta.requiresAuth !== false

    if (whiteList.includes(to.path)) {
      // White list - always allow
      next()
    } else if (!userStore.isLoggedIn) {
      // Not logged in - redirect to login
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      NProgress.done()
    } else if (!requiresAuth) {
      // No auth required - allow
      next()
    } else {
      // Auth required - check permissions
      try {
        // Load menu if not loaded
        if (menuStore.menuList.length === 0) {
          await menuStore.loadMenu()
        }

        // Check role permission
        const roles = to.meta.roles
        if (roles && roles.length > 0) {
          if (!roles.includes(userStore.role as any)) {
            // No permission - redirect to 403
            next('/403')
            NProgress.done()
            return
          }
        }

        // Set active menu
        menuStore.setActiveMenu(to.path)

        // Handle mobile layout
        if (layoutStore.isMobile && !layoutStore.isCollapse) {
          layoutStore.setCollapse(true)
        }

        next()
      } catch (error) {
        console.error('Route guard error:', error)
        // Clear user state and redirect to login
        userStore.logout()
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        NProgress.done()
      }
    }
  })

  // After each route
  router.afterEach(() => {
    // Finish progress bar
    NProgress.done()
  })

  // Handle errors
  router.onError((error) => {
    console.error('Router error:', error)
    NProgress.done()
  })
}

/**
 * Check if user has permission to access route
 */
export function hasRoutePermission(
  to: RouteLocationNormalized,
  userRole: string
): boolean {
  const roles = to.meta.roles

  // No role restriction
  if (!roles || roles.length === 0) {
    return true
  }

  // Check if user role is allowed
  return roles.includes(userRole as any)
}
