<!-- ===========================================
     NotFound.vue - 404 Page
     =========================================== -->

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ currentLocale === 'zh-CN' ? '页面不存在' : 'Page Not Found' }}</h2>
      <p class="error-description">
        {{ currentLocale === 'zh-CN'
          ? '抱歉，您访问的页面不存在或已被删除。'
          : 'Sorry, the page you are looking for does not exist or has been removed.'
        }}
      </p>
      <el-button type="primary" @click="goHome">
        <el-icon><HomeFilled /></el-icon>
        {{ currentLocale === 'zh-CN' ? '返回首页' : 'Go Home' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()
const currentLocale = computed(() => appStore.language)

function goHome() {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $bg-primary;
}

.error-content {
  text-align: center;
  padding: $spacing-xl;

  .error-code {
    font-size: 120px;
    font-weight: 900;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: $spacing-md;
  }

  .error-title {
    font-size: $font-size-3xl;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  .error-description {
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    max-width: 400px;
  }
}
</style>
