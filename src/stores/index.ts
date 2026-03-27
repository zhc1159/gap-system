// ===========================================
// Stores Entry File
// ===========================================

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// Re-export stores for convenience
export { useUserStore } from './user'
export { useLayoutStore } from './layout'
export { useMenuStore } from './menu'
export { useAppStore } from './app'
