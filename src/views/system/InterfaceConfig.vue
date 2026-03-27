<!-- Placeholder View - Interface Config -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Setting /></el-icon>
        {{ $t('system.interface.title') }}
      </h2>
    </div>
    <div class="placeholder-content">
      <el-empty description="接口配置 - 开发中" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
</script>
<style scoped lang="scss">
.page-container { padding: $spacing-lg; }
.page-header { margin-bottom: $spacing-lg;
  .page-title { display: flex; align-items: center; gap: $spacing-sm; font-size: $font-size-3xl; font-weight: 700; color: $text-primary;
    .el-icon { color: $primary-color; }
  }
}
.placeholder-content { display: flex; align-items: center; justify-content: center; min-height: 400px; background: $bg-card; border: 1px solid $border-color; border-radius: $radius-lg; }
</style>
