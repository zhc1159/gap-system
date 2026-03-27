<!-- ===========================================
     PageHeader - Page Title Component
     =========================================== -->

<template>
  <div class="page-header">
    <div class="header-left">
      <div class="title-wrapper">
        <el-icon v-if="icon" class="title-icon">
          <component :is="icon" />
        </el-icon>
        <h2 class="page-title">{{ displayTitle }}</h2>
      </div>
      <p v-if="description" class="page-description">{{ displayDescription }}</p>
    </div>
    <div class="header-right">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useAppStore } from '@/stores/app'

interface Props {
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  titleEn: '',
  description: '',
  descriptionEn: ''
})

const appStore = useAppStore()

const displayTitle = computed(() => {
  if (props.titleEn && appStore.language === 'en-US') {
    return props.titleEn
  }
  return props.title
})

const displayDescription = computed(() => {
  if (props.descriptionEn && appStore.language === 'en-US') {
    return props.descriptionEn
  }
  return props.description
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: $spacing-md;
  }
}

.header-left {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.title-icon {
  font-size: $font-size-2xl;
  color: $primary-color;
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-primary;
  margin: 0;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: $spacing-xs 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}
</style>
