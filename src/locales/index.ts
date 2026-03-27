// ===========================================
// Vue I18n Configuration
// 国际化配置 - 支持动态语言扩展
// ===========================================

import { createI18n } from 'vue-i18n'
import type { LocaleCode } from './types'
import { isSupportedLocale, detectBrowserLocale, SUPPORTED_LOCALES } from './types'
import zhCN from './zh-CN'
import enUS from './en-US'

// ==========================================
// 获取保存的语言设置
// ==========================================
function getSavedLanguage(): LocaleCode {
  const saved = localStorage.getItem('language')

  if (saved && isSupportedLocale(saved)) {
    return saved
  }

  // 检测浏览器语言
  return detectBrowserLocale()
}

// ==========================================
// 创建 i18n 实例
// ==========================================
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 启用模板中的 $t
  locale: getSavedLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  missingWarn: false,
  fallbackWarn: false
})

// ==========================================
// 导出默认实例
// ==========================================
export default i18n

// ==========================================
// 语言切换辅助函数
// ==========================================

/**
 * 设置当前语言
 * @param locale 语言代码
 */
export function setI18nLanguage(locale: LocaleCode): void {
  i18n.global.locale.value = locale as any
  localStorage.setItem('language', locale)

  // 设置 HTML lang 属性
  const htmlLang = locale.split('-')[0]
  document.documentElement.setAttribute('lang', htmlLang)

  // 设置 document title (可选)
  const title = document.title
  if (title.includes(' | ')) {
    // 保持页面标题结构
  }
}

/**
 * 获取当前语言
 */
export function getCurrentLanguage(): LocaleCode {
  return i18n.global.locale.value as LocaleCode
}

/**
 * 切换语言（中英文切换）
 */
export function toggleLanguage(): void {
  const current = getCurrentLanguage()
  const newLocale = current === 'zh-CN' ? 'en-US' : 'zh-CN'
  setI18nLanguage(newLocale)
}

/**
 * 切换到指定语言
 * @param locale 目标语言
 */
export async function switchToLocale(locale: LocaleCode): Promise<boolean> {
  if (!isSupportedLocale(locale)) {
    console.warn(`[i18n] Unsupported locale: ${locale}`)
    return false
  }

  // 检查是否已加载该语言
  if (!i18n.global.availableLocales.includes(locale)) {
    // 动态加载语言包（如果使用注册器）
    // const messages = await loadLocale(locale)
    // if (messages) {
    //   i18n.global.setLocaleMessage(locale, messages)
    // }
  }

  setI18nLanguage(locale)
  return true
}

/**
 * 获取支持的语言列表
 */
export function getSupportedLocales() {
  return SUPPORTED_LOCALES
}

/**
 * 检查是否为中文环境
 */
export function isChineseLocale(): boolean {
  return getCurrentLanguage().startsWith('zh')
}

/**
 * 翻译函数（用于非组件上下文）
 */
export function t(key: string, params?: Record<string, any>): string {
  return i18n.global.t(key, params as any) as string
}

// ==========================================
// 导出类型和工具
// ==========================================
export * from './types'
export { registerLocale, registerLocaleMessages, loadLocale, onLocaleChange } from './registry'
