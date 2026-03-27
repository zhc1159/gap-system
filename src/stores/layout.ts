// ===========================================
// Layout Store - Pinia
// ===========================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ILayoutState, IUISetting } from '@/types'

export const useLayoutStore = defineStore('layout', () => {
  // State
  const state = ref<ILayoutState>({
    isCollapse: false,
    isMobile: false,
    device: 'desktop',
    theme: 'dark',
    size: 'default'
  })

  const uiSetting = ref<IUISetting>({
    browserTitle: 'GAP System',
    favicon: '/favicon.svg',
    copyright: '© 2024 Security Gap System',
    logo: '/logo.svg',
    systemName: '安全隔离网闸'
  })

  // Getters
  const isCollapse = computed(() => state.value.isCollapse)
  const isMobile = computed(() => state.value.isMobile)
  const device = computed(() => state.value.device)
  const theme = computed(() => state.value.theme)
  const size = computed(() => state.value.size)
  const sidebarWidth = computed(() =>
    state.value.isCollapse ? '64px' : '220px'
  )

  // Actions
  function toggleCollapse() {
    state.value.isCollapse = !state.value.isCollapse
  }

  function setCollapse(collapse: boolean) {
    state.value.isCollapse = collapse
  }

  function setDevice(device: 'desktop' | 'mobile' | 'tablet') {
    state.value.device = device
    state.value.isMobile = device === 'mobile'
  }

  function toggleTheme() {
    state.value.theme = state.value.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', state.value.theme)
  }

  function setTheme(theme: 'dark' | 'light') {
    state.value.theme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  function setComponentSize(size: 'default' | 'small' | 'large') {
    state.value.size = size
  }

  function updateUISetting(settings: Partial<IUISetting>) {
    uiSetting.value = { ...uiSetting.value, ...settings }
  }

  function handleResize() {
    const width = window.innerWidth
    if (width < 768) {
      setDevice('mobile')
      setCollapse(true)
    } else if (width < 1024) {
      setDevice('tablet')
    } else {
      setDevice('desktop')
    }
  }

  return {
    state,
    uiSetting,
    isCollapse,
    isMobile,
    device,
    theme,
    size,
    sidebarWidth,
    toggleCollapse,
    setCollapse,
    setDevice,
    toggleTheme,
    setTheme,
    setComponentSize,
    updateUISetting,
    handleResize
  }
})
