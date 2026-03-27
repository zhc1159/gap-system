// ===========================================
// App Store - Pinia
// ===========================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ISystemConfig } from '@/types'
import { getSystemConfig } from '@/api/system'

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref<boolean>(false)
  const language = ref<'zh-CN' | 'en-US'>(
    (localStorage.getItem('language') as 'zh-CN' | 'en-US') || 'zh-CN'
  )
  const systemConfig = ref<ISystemConfig>({
    version: '1.0.0',
    gapWhere: 'intranet',
    linkState: 'OK'
  })

  // Getters
  const version = computed(() => systemConfig.value.version)
  const gapWhere = computed(() => systemConfig.value.gapWhere)
  const linkState = computed(() => systemConfig.value.linkState)
  const isLinkOk = computed(() => systemConfig.value.linkState === 'OK')

  // Actions
  function setLanguage(lang: 'zh-CN' | 'en-US') {
    language.value = lang
    localStorage.setItem('language', lang)
    document.documentElement.setAttribute('lang', lang === 'zh-CN' ? 'zh-CN' : 'en')
  }

  function toggleLanguage() {
    setLanguage(language.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  async function loadSystemConfig() {
    try {
      const config = await getSystemConfig()
      systemConfig.value = config
    } catch (error) {
      console.error('Failed to load system config:', error)
    }
  }

  function updateLinkState(state: 'OK' | 'ERROR') {
    systemConfig.value.linkState = state
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  return {
    loading,
    language,
    systemConfig,
    version,
    gapWhere,
    linkState,
    isLinkOk,
    setLanguage,
    toggleLanguage,
    loadSystemConfig,
    updateLinkState,
    setLoading
  }
})
