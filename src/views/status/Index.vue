<!-- ===========================================
     Placeholder View Template
     =========================================== -->

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><component :is="icon" /></el-icon>
        {{ title }}
      </h2>
    </div>

    <div class="placeholder-content">
      <div class="placeholder-icon">
        <el-icon :size="64"><component :is="icon" /></el-icon>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Component } from 'vue'

interface Props {
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: Component
}

const props = defineProps<Props>()
// i18n
const appStore = useAppStore()

const title = computed(() => appStore.language === 'zh-CN' ? props.title : props.titleEn)
const description = computed(() => appStore.language === 'zh-CN' ? props.description : props.descriptionEn)
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
  min-height: calc(100vh - 100px);
}

.page-header {
  margin-bottom: $spacing-lg;

  .page-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-primary;

    .el-icon {
      color: $primary-color;
    }
  }
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  min-height: 400px;

  .placeholder-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 50%;
    margin-bottom: $spacing-lg;
    color: $primary-color;
  }

  h3 {
    font-size: $font-size-2xl;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  p {
    color: $text-secondary;
    text-align: center;
  }
}
</style>
