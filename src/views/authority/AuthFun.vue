<!-- ===========================================
     AuthFun.vue - 认证功能配置
     =========================================== -->

<template>
  <div class="page-container auth-fun-page">
    <PageHeader
      :title="t('authFun.title')"
      titleEn="Authentication Module Management"
      :icon="Lock"
    />

    <div class="status-card">
      <p class="status-label">{{ t('authFun.currentStatus') }}</p>

      <div :class="['status-display', isEnabled ? 'enabled' : 'disabled']">
        <el-icon v-if="isEnabled"><CircleCheck /></el-icon>
        <el-icon v-else><CircleClose /></el-icon>
        {{ isEnabled ? t('authFun.enabled') : t('authFun.disabled') }}
      </div>

      <el-button
        v-if="isEnabled"
        type="danger"
        class="action-btn disable"
        :loading="loading"
        @click="handleToggle"
      >
        <el-icon v-if="!loading"><VideoPause /></el-icon>
        {{ t('authFun.disableAuth') }}
      </el-button>

      <el-button
        v-else
        type="success"
        class="action-btn enable"
        :loading="loading"
        @click="handleToggle"
      >
        <el-icon v-if="!loading"><VideoPlay /></el-icon>
        {{ t('authFun.enableAuth') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock, CircleCheck, CircleClose, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

const loading = ref(false)
const enabled = ref(0) // 0 = enabled, 1 = disabled

const isEnabled = computed(() => enabled.value === 0)

const fetchStatus = async () => {
  loading.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    enabled.value = 0
  } finally {
    loading.value = false
  }
}

const handleToggle = async () => {
  const newStatus = enabled.value === 1 ? 0 : 1
  const confirmMsg = newStatus === 0
    ? t('authFun.confirmEnable')
    : t('authFun.confirmDisable')

  try {
    await ElMessageBox.confirm(confirmMsg, t('common.confirm'), { type: 'warning' })
  } catch {
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    enabled.value = newStatus
    ElMessage.success(t('authFun.operationSuccess'))
  } catch {
    ElMessage.error(t('authFun.operationFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatus()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.auth-fun-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;

  .status-card {
    width: 500px;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
    padding: $spacing-2xl;
    text-align: center;

    .status-label {
      font-size: $font-size-base;
      color: $text-secondary;
      margin-bottom: $spacing-lg;
    }

    .status-display {
      padding: $spacing-xl;
      border-radius: $radius-lg;
      margin-bottom: $spacing-xl;
      font-size: $font-size-2xl;
      font-weight: bold;
      letter-spacing: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;

      &.enabled {
        background: rgba($success-color, 0.15);
        border: 2px solid rgba($success-color, 0.5);
        color: $success-color;
        box-shadow: $shadow-glow-success;
      }

      &.disabled {
        background: rgba($danger-color, 0.15);
        border: 2px solid rgba($danger-color, 0.5);
        color: $danger-color;
        box-shadow: $shadow-glow-warning;
      }

      .el-icon {
        font-size: 28px;
      }
    }

    .action-btn {
      min-width: 200px;
      height: 48px;
      font-size: $font-size-lg;
      font-weight: 600;
      border-radius: $radius-md;
      border: none;
      letter-spacing: 2px;
      transition: all $transition-normal;

      &.enable {
        background: $gradient-success;

        &:hover {
          box-shadow: $shadow-glow-success;
          transform: translateY(-2px);
        }
      }

      &.disable {
        background: $gradient-danger;

        &:hover {
          box-shadow: $shadow-glow-warning;
          transform: translateY(-2px);
        }
      }
    }
  }
}
</style>
