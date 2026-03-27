<!-- ===========================================
     Forbidden.vue - 403 Page
     =========================================== -->

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">{{ currentLocale === 'zh-CN' ? '无访问权限' : 'Access Forbidden' }}</h2>
      <p class="error-description">
        {{ currentLocale === 'zh-CN'
          ? '抱歉，您没有权限访问此页面。'
          : 'Sorry, you do not have permission to access this page.'
        }}
      </p>
      <el-button type="primary" @click="goBack">
        <el-icon><Back /></el-icon>
        {{ currentLocale === 'zh-CN' ? '返回上一页' : 'Go Back' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()
const currentLocale = computed(() => appStore.language)

function goBack() {
  router.back()
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
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
