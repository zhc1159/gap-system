<!-- ===========================================
     ConfirmDialog - Confirmation Dialog Component
     =========================================== -->

<template>
  <el-dialog
    v-model="visible"
    :title="displayTitle"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :center="center"
    :destroy-on-close="destroyOnClose"
    @closed="handleClosed"
  >
    <div class="confirm-content">
      <el-icon v-if="type" class="confirm-icon" :class="type">
        <component :is="iconComponent" />
      </el-icon>
      <div class="confirm-message">
        <p v-if="message">{{ message }}</p>
        <slot v-else />
      </div>
    </div>

    <template #footer>
      <div class="confirm-footer">
        <el-button @click="handleCancel">
          {{ cancelText || t('common.cancel') }}
        </el-button>
        <el-button :type="confirmType" :loading="loading" @click="handleConfirm">
          {{ confirmText || t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Warning, CircleCheck, CircleClose, InfoFilled, QuestionFilled } from '@element-plus/icons-vue'

interface Props {
  modelValue: boolean
  title?: string
  titleEn?: string
  message?: string
  type?: 'warning' | 'success' | 'danger' | 'info' | 'question'
  width?: string | number
  confirmText?: string
  cancelText?: string
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  center?: boolean
  destroyOnClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  width: '420px',
  confirmType: 'primary',
  loading: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  center: false,
  destroyOnClose: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  closed: []
}>()

const { t } = useI18n()
const appStore = useAppStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const displayTitle = computed(() => {
  if (props.titleEn && appStore.language === 'en-US') {
    return props.titleEn
  }
  return props.title
})

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    warning: Warning,
    success: CircleCheck,
    danger: CircleClose,
    info: InfoFilled,
    question: QuestionFilled
  }
  return icons[props.type || 'warning']
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  visible.value = false
  emit('cancel')
}

function handleClosed() {
  emit('closed')
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'

export default defineComponent({
  name: 'ConfirmDialog'
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.confirm-content {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  padding: $spacing-md 0;
}

.confirm-icon {
  font-size: 48px;
  flex-shrink: 0;

  &.warning {
    color: $warning-color;
  }

  &.success {
    color: $success-color;
  }

  &.danger {
    color: $danger-color;
  }

  &.info {
    color: $info-color;
  }

  &.question {
    color: $primary-color;
  }
}

.confirm-message {
  flex: 1;
  color: $text-secondary;
  line-height: 1.6;

  p {
    margin: 0;
  }
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-sm;

  .el-button {
    --el-button-bg-color: #{$bg-hover};
    --el-button-border-color: #{$border-color};
    --el-button-text-color: #{$text-primary};

    &:hover {
      --el-button-hover-bg-color: #{rgba(0, 212, 255, 0.1)};
      --el-button-hover-border-color: #{$primary-color};
    }

    &.el-button--primary,
    &.el-button--success,
    &.el-button--warning,
    &.el-button--danger {
      --el-button-text-color: white;
    }
  }
}

:deep(.el-dialog) {
  --el-dialog-bg-color: #{$bg-card};
  --el-dialog-title-font-size: #{$font-size-lg};
  --el-dialog-content-font-size: #{$font-size-base};
  --el-dialog-border-radius: #{$radius-lg};
  border: 1px solid $border-color;

  .el-dialog__header {
    border-bottom: 1px solid $border-color;
    padding: $spacing-md $spacing-lg;

    .el-dialog__title {
      color: $text-primary;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: $text-muted;

        &:hover {
          color: $primary-color;
        }
      }
    }
  }

  .el-dialog__body {
    padding: $spacing-lg;
    color: $text-secondary;
  }

  .el-dialog__footer {
    border-top: 1px solid $border-color;
    padding: $spacing-md $spacing-lg;
  }
}
</style>
