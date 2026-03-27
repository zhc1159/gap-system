// ===========================================
// Vue I18n Configuration
// ===========================================

import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

// Get saved language from localStorage
function getSavedLanguage(): string {
  const saved = localStorage.getItem('language')
  if (saved && ['zh-CN', 'en-US'].includes(saved)) {
    return saved
  }
  // Detect browser language
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  globalInjection: true, // Enable $t in templates
  locale: getSavedLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  missingWarn: false,
  fallbackWarn: false
})

export default i18n

// Helper functions
export function setI18nLanguage(locale: string) {
  i18n.global.locale.value = locale as any
  localStorage.setItem('language', locale)
  document.documentElement.setAttribute('lang', locale === 'zh-CN' ? 'zh-CN' : 'en')
}

export function getCurrentLanguage(): string {
  return i18n.global.locale.value as string
}

export function toggleLanguage() {
  const current = getCurrentLanguage()
  setI18nLanguage(current === 'zh-CN' ? 'en-US' : 'zh-CN')
}
