<!-- ===========================================
     StatCard - Statistics Card Component
     =========================================== -->

<template>
  <div class="stat-card" :class="{ 'is-clickable': clickable }" @click="handleClick">
    <div class="stat-icon" :class="`stat-icon--${type}`">
      <el-icon :size="32">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-content">
      <div class="stat-value">
        <span class="value">{{ formattedValue }}</span>
        <span v-if="suffix" class="suffix">{{ suffix }}</span>
      </div>
      <div class="stat-label">{{ displayLabel }}</div>
      <div v-if="trend !== undefined" class="stat-trend" :class="trendClass">
        <el-icon>
          <component :is="trendIcon" />
        </el-icon>
        <span>{{ Math.abs(trend) }}%</span>
        <span class="trend-label">{{ t('common.vsLastPeriod') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { CaretTop, CaretBottom, Minus } from '@element-plus/icons-vue'

interface Props {
  value: number | string
  label: string
  labelEn?: string
  icon: Component
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  suffix?: string
  trend?: number
  format?: 'number' | 'percent' | 'currency' | 'none'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  format: 'number',
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const { t } = useI18n()
const appStore = useAppStore()

const displayLabel = computed(() => {
  if (props.labelEn && appStore.language === 'en-US') {
    return props.labelEn
  }
  return props.label
})

const formattedValue = computed(() => {
  if (props.format === 'none' || typeof props.value === 'string') {
    return props.value
  }

  const value = props.value as number

  switch (props.format) {
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'currency':
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
      }).format(value)
    default:
      return new Intl.NumberFormat('zh-CN').format(value)
  }
})

const trendClass = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'is-neutral'
  return props.trend > 0 ? 'is-up' : 'is-down'
})

const trendIcon = computed(() => {
  if (props.trend === undefined || props.trend === 0) return Minus
  return props.trend > 0 ? CaretTop : CaretBottom
})

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'

export default defineComponent({
  name: 'StatCard'
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  transition: all $transition-normal;

  &.is-clickable {
    cursor: pointer;

    &:hover {
      border-color: $primary-color;
      box-shadow: $shadow-glow;
      transform: translateY(-2px);
    }
  }

  &:hover {
    background: rgba(0, 212, 255, 0.02);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: $radius-lg;
  flex-shrink: 0;

  &--primary {
    background: rgba(0, 212, 255, 0.1);
    color: $primary-color;
  }

  &--success {
    background: rgba(16, 185, 129, 0.1);
    color: $success-color;
  }

  &--warning {
    background: rgba(245, 158, 11, 0.1);
    color: $warning-color;
  }

  &--danger {
    background: rgba(239, 68, 68, 0.1);
    color: $danger-color;
  }

  &--info {
    background: rgba(6, 182, 212, 0.1);
    color: $info-color;
  }
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;

  .value {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-primary;
    line-height: 1.2;
  }

  .suffix {
    font-size: $font-size-base;
    color: $text-muted;
  }
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: $spacing-sm;
  font-size: $font-size-xs;

  &.is-up {
    color: $success-color;
  }

  &.is-down {
    color: $danger-color;
  }

  &.is-neutral {
    color: $text-muted;
  }

  .trend-label {
    color: $text-muted;
    margin-left: 4px;
  }
}
</style>
