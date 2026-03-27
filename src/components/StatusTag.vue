<!-- ===========================================
     StatusTag - Status Display Tag Component
     =========================================== -->

<template>
  <el-tag
    :type="tagType"
    :effect="effect"
    :size="size"
    :round="round"
    class="status-tag"
    :class="{ 'is-blinking': blinking }"
  >
    <el-icon v-if="showIcon" class="status-icon">
      <component :is="iconComponent" />
    </el-icon>
    <span>{{ displayText }}</span>
  </el-tag>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  CircleCheck,
  CircleClose,
  Warning,
  Loading,
  Minus
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface StatusConfig {
  label: string
  labelEn?: string
  type: TagType
}

interface Props {
  status: string | boolean | number
  statusMap?: Record<string, StatusConfig>
  text?: string
  textEn?: string
  type?: TagType
  size?: 'large' | 'default' | 'small'
  effect?: 'dark' | 'light' | 'plain'
  round?: boolean
  showIcon?: boolean
  blinking?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  size: 'default',
  effect: 'light',
  round: false,
  showIcon: false,
  blinking: false
})

const appStore = useAppStore()

const statusConfig = computed((): StatusConfig => {
  // Check custom status map first
  if (props.statusMap) {
    const key = String(props.status)
    if (props.statusMap[key]) {
      return props.statusMap[key]
    }
  }

  // Default status mappings
  const defaultMap: Record<string, StatusConfig> = {
    online: { label: '在线', labelEn: 'Online', type: 'success' },
    offline: { label: '离线', labelEn: 'Offline', type: 'danger' },
    active: { label: '启用', labelEn: 'Active', type: 'success' },
    inactive: { label: '禁用', labelEn: 'Inactive', type: 'danger' },
    enabled: { label: '已启用', labelEn: 'Enabled', type: 'success' },
    disabled: { label: '已禁用', labelEn: 'Disabled', type: 'danger' },
    running: { label: '运行中', labelEn: 'Running', type: 'success' },
    stopped: { label: '已停止', labelEn: 'Stopped', type: 'danger' },
    pending: { label: '待处理', labelEn: 'Pending', type: 'warning' },
    processing: { label: '处理中', labelEn: 'Processing', type: 'primary' },
    success: { label: '成功', labelEn: 'Success', type: 'success' },
    failed: { label: '失败', labelEn: 'Failed', type: 'danger' },
    error: { label: '错误', labelEn: 'Error', type: 'danger' },
    unknown: { label: '未知', labelEn: 'Unknown', type: 'info' },
    true: { label: '是', labelEn: 'Yes', type: 'success' },
    false: { label: '否', labelEn: 'No', type: 'danger' }
  }

  // Handle boolean status
  if (typeof props.status === 'boolean') {
    return defaultMap[String(props.status)]
  }

  return defaultMap[String(props.status).toLowerCase()] || {
    label: String(props.status),
    labelEn: String(props.status),
    type: 'info'
  }
})

const tagType = computed((): TagType | undefined => {
  if (props.type) return props.type
  return statusConfig.value.type
})

const displayText = computed(() => {
  if (props.text && props.textEn) {
    return appStore.language === 'en-US' ? props.textEn : props.text
  }
  if (props.text) return props.text

  const config = statusConfig.value
  if (config.labelEn && appStore.language === 'en-US') {
    return config.labelEn
  }
  return config.label
})

const iconComponent = computed((): Component => {
  const icons: Record<string, Component> = {
    success: CircleCheck,
    danger: CircleClose,
    warning: Warning,
    info: Minus,
    primary: Loading
  }
  return icons[tagType.value || 'info'] || Minus
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .status-icon {
    font-size: 12px;
  }

  &.is-blinking {
    animation: blink 1s ease-in-out infinite;
  }

  :deep(.el-tag__content) {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  // Custom tag styles
  &.el-tag--success {
    --el-tag-bg-color: rgba(16, 185, 129, 0.1);
    --el-tag-border-color: rgba(16, 185, 129, 0.3);
    --el-tag-text-color: #{$success-color};
  }

  &.el-tag--danger {
    --el-tag-bg-color: rgba(239, 68, 68, 0.1);
    --el-tag-border-color: rgba(239, 68, 68, 0.3);
    --el-tag-text-color: #{$danger-color};
  }

  &.el-tag--warning {
    --el-tag-bg-color: rgba(245, 158, 11, 0.1);
    --el-tag-border-color: rgba(245, 158, 11, 0.3);
    --el-tag-text-color: #{$warning-color};
  }

  &.el-tag--info {
    --el-tag-bg-color: rgba(6, 182, 212, 0.1);
    --el-tag-border-color: rgba(6, 182, 212, 0.3);
    --el-tag-text-color: #{$info-color};
  }

  &.el-tag--primary {
    --el-tag-bg-color: rgba(0, 212, 255, 0.1);
    --el-tag-border-color: rgba(0, 212, 255, 0.3);
    --el-tag-text-color: #{$primary-color};
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
