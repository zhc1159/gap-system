<!-- ===========================================
     SearchBar - Search and Filter Component
     =========================================== -->

<template>
  <div class="search-bar">
    <div class="search-fields">
      <slot />
    </div>
    <div class="search-actions">
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        {{ t('common.search') }}
      </el-button>
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>
        {{ t('common.reset') }}
      </el-button>
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Search, Refresh } from '@element-plus/icons-vue'

const emit = defineEmits<{
  search: []
  reset: []
}>()

const { t } = useI18n()

function handleSearch() {
  emit('search')
}

function handleReset() {
  emit('reset')
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  flex: 1;

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-editor) {
    width: 200px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: $spacing-md;

    .el-form-item__label {
      color: $text-secondary;
    }
  }
}

.search-actions {
  display: flex;
  gap: $spacing-sm;
  align-items: flex-start;

  .el-button {
    --el-button-bg-color: #{$bg-hover};
    --el-button-border-color: #{$border-color};
    --el-button-text-color: #{$text-primary};
    --el-button-hover-bg-color: #{rgba(0, 212, 255, 0.1)};
    --el-button-hover-border-color: #{$primary-color};
    --el-button-hover-text-color: #{$primary-color};

    &.el-button--primary {
      --el-button-bg-color: #{$primary-color};
      --el-button-border-color: #{$primary-color};
      --el-button-text-color: #{$bg-darker};
      --el-button-hover-bg-color: #{$primary-light};
      --el-button-hover-border-color: #{$primary-light};
      --el-button-hover-text-color: #{$bg-darker};
    }
  }
}
</style>
