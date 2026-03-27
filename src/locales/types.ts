// ===========================================
// i18n Type Definitions
// 国际化类型定义 - 支持多语言扩展
// ===========================================

/**
 * 支持的语言代码
 * 可扩展添加更多语言
 */
export type LocaleCode =
  | 'zh-CN'  // 简体中文
  | 'en-US'  // English (US)
  // 以下为预留语言扩展
  // | 'zh-TW'  // 繁体中文
  // | 'ja-JP'  // 日本語
  // | 'ko-KR'  // 한국어
  // | 'de-DE'  // Deutsch
  // | 'fr-FR'  // Français
  // | 'es-ES'  // Español
  // | 'ru-RU'  // Русский

/**
 * 语言配置接口
 */
export interface LocaleConfig {
  code: LocaleCode
  name: string
  nativeName: string
  icon?: string
  rtl?: boolean // 从右到左的语言支持
}

/**
 * 语言消息类型
 */
export type LocaleMessages = Record<string, any>

/**
 * 语言切换回调
 */
export type LocaleChangeCallback = (locale: LocaleCode) => void

/**
 * 支持的语言列表
 */
export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'zh-CN',
    name: 'Chinese Simplified',
    nativeName: '简体中文',
    icon: '🇨🇳'
  },
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    icon: '🇺🇸'
  }
  // 预留扩展语言
  // {
  //   code: 'zh-TW',
  //   name: 'Chinese Traditional',
  //   nativeName: '繁體中文',
  //   icon: '🇹🇼'
  // },
  // {
  //   code: 'ja-JP',
  //   name: 'Japanese',
  //   nativeName: '日本語',
  //   icon: '🇯🇵'
  // }
]

/**
 * 获取语言配置
 */
export function getLocaleConfig(code: LocaleCode): LocaleConfig | undefined {
  return SUPPORTED_LOCALES.find(locale => locale.code === code)
}

/**
 * 检查语言代码是否支持
 */
export function isSupportedLocale(code: string): code is LocaleCode {
  return SUPPORTED_LOCALES.some(locale => locale.code === code)
}

/**
 * 从浏览器语言获取最接近的支持语言
 */
export function detectBrowserLocale(): LocaleCode {
  const browserLang = navigator.language || (navigator as any).userLanguage

  // 精确匹配
  if (isSupportedLocale(browserLang)) {
    return browserLang
  }

  // 语言前缀匹配 (如 'zh' -> 'zh-CN')
  const langPrefix = browserLang.split('-')[0]
  const matched = SUPPORTED_LOCALES.find(
    locale => locale.code.startsWith(langPrefix)
  )

  return matched?.code || 'en-US'
}
