// ===========================================
// i18n Locale Registry
// 语言注册器 - 支持动态加载语言包
// ===========================================

import type { LocaleCode, LocaleMessages, LocaleChangeCallback } from './types'

/**
 * 语言模块加载器类型
 */
type LocaleLoader = () => Promise<LocaleMessages>

/**
 * 语言注册表
 */
const localeRegistry = new Map<LocaleCode, {
  loader?: LocaleLoader
  messages?: LocaleMessages
  loaded: boolean
}>()

/**
 * 语言切换回调列表
 */
const changeCallbacks: LocaleChangeCallback[] = []

/**
 * 注册语言包
 * @param code 语言代码
 * @param loader 语言模块加载器
 */
export function registerLocale(code: LocaleCode, loader: LocaleLoader): void {
  localeRegistry.set(code, {
    loader,
    loaded: false
  })
}

/**
 * 直接注册语言消息（同步方式）
 * @param code 语言代码
 * @param messages 语言消息
 */
export function registerLocaleMessages(code: LocaleCode, messages: LocaleMessages): void {
  localeRegistry.set(code, {
    messages,
    loaded: true
  })
}

/**
 * 加载语言包
 * @param code 语言代码
 */
export async function loadLocale(code: LocaleCode): Promise<LocaleMessages | null> {
  const entry = localeRegistry.get(code)

  if (!entry) {
    console.warn(`[i18n] Locale "${code}" is not registered`)
    return null
  }

  if (entry.loaded && entry.messages) {
    return entry.messages
  }

  if (entry.loader) {
    try {
      const messages = await entry.loader()
      entry.messages = messages
      entry.loaded = true
      return messages
    } catch (error) {
      console.error(`[i18n] Failed to load locale "${code}":`, error)
      return null
    }
  }

  return entry.messages || null
}

/**
 * 获取已注册的语言列表
 */
export function getRegisteredLocales(): LocaleCode[] {
  return Array.from(localeRegistry.keys())
}

/**
 * 检查语言是否已注册
 */
export function isLocaleRegistered(code: LocaleCode): boolean {
  return localeRegistry.has(code)
}

/**
 * 检查语言是否已加载
 */
export function isLocaleLoaded(code: LocaleCode): boolean {
  const entry = localeRegistry.get(code)
  return entry?.loaded ?? false
}

/**
 * 注册语言切换回调
 */
export function onLocaleChange(callback: LocaleChangeCallback): () => void {
  changeCallbacks.push(callback)

  // 返回取消注册函数
  return () => {
    const index = changeCallbacks.indexOf(callback)
    if (index > -1) {
      changeCallbacks.splice(index, 1)
    }
  }
}

/**
 * 触发语言切换事件
 */
export function notifyLocaleChange(code: LocaleCode): void {
  changeCallbacks.forEach(callback => {
    try {
      callback(code)
    } catch (error) {
      console.error('[i18n] Locale change callback error:', error)
    }
  })
}

/**
 * 清除语言缓存（用于重新加载）
 */
export function clearLocaleCache(code?: LocaleCode): void {
  if (code) {
    const entry = localeRegistry.get(code)
    if (entry) {
      entry.loaded = false
      entry.messages = undefined
    }
  } else {
    localeRegistry.forEach(entry => {
      entry.loaded = false
      entry.messages = undefined
    })
  }
}

// ==========================================
// 初始化默认语言包
// ==========================================

// 导入默认语言包
import zhCN from './zh-CN'
import enUS from './en-US'

// 同步注册中文和英文
registerLocaleMessages('zh-CN', zhCN)
registerLocaleMessages('en-US', enUS)

// 动态加载版本的注册示例（用于按需加载大型语言包）
// registerLocale('zh-TW', () => import('./zh-TW').then(m => m.default))
// registerLocale('ja-JP', () => import('./ja-JP').then(m => m.default))
