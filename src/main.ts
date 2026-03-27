// ===========================================
// Main Entry File
// ===========================================

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import i18n from './locales'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// Element Plus Icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Normalize.css
import 'normalize.css/normalize.css'

// Global styles
import '@/styles/index.scss'

// Create app instance
const app = createApp(App)

// Register Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

// Mount app
app.mount('#app')
