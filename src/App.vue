<!-- ===========================================
     App.vue - Root Component
     =========================================== -->

<template>
  <el-config-provider
    :locale="elementLocale"
    :size="size"
  >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import enUs from 'element-plus/es/locale/lang/en'
import { useLayoutStore } from '@/stores/layout'
import { useAppStore } from '@/stores/app'

const { locale } = useI18n()
const layoutStore = useLayoutStore()
const appStore = useAppStore()

// Element Plus locale
const elementLocale = computed(() => locale.value === 'zh-CN' ? zhCn : enUs)

// Component size
const size = computed(() => layoutStore.size)

// Initialize on mount
onMounted(() => {
  // Set initial language
  locale.value = appStore.language

  // Handle window resize
  window.addEventListener('resize', layoutStore.handleResize)
  layoutStore.handleResize()
})
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
