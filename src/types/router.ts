// Route Meta Type Extension
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    titleEn?: string
    icon?: string
    hidden?: boolean
    alwaysShow?: boolean
    noCache?: boolean
    affix?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    roles?: string[]
    permissions?: string[]
    requiresAuth?: boolean
  }
}
