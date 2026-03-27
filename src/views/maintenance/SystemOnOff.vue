<!-- ===========================================
     SystemOnOff.vue - System Power Control
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.powerControl.title')"
      titleEn="System Power Control"
      :icon="Monitor"
    />

    <el-card class="tech-card power-card">
      <div class="power-content">
        <div class="power-icon">
          <el-icon :size="80"><Monitor /></el-icon>
        </div>

        <div class="button-group">
          <el-button
            type="warning"
            size="large"
            class="tech-button reboot-button"
            :loading="rebooting"
            @click="handleReboot"
          >
            <el-icon><RefreshRight /></el-icon>
            {{ t('maintenance.powerControl.reboot') }}
          </el-button>

          <el-button
            type="danger"
            size="large"
            class="tech-button shutdown-button"
            :loading="shuttingDown"
            @click="handleShutdown"
          >
            <el-icon><SwitchButton /></el-icon>
            {{ t('maintenance.powerControl.shutdown') }}
          </el-button>
        </div>

        <div class="power-tips">
          <el-alert
            type="warning"
            :closable="false"
            show-icon
          >
            <template #title>
              {{ t('maintenance.powerControl.warning') }}
            </template>
          </el-alert>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Monitor, RefreshRight, SwitchButton } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// State
const rebooting = ref(false)
const shuttingDown = ref(false)

// Methods
async function handleReboot() {
  try {
    await ElMessageBox.confirm(
      t('maintenance.powerControl.rebootConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    rebooting.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success(t('maintenance.powerControl.rebootSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.failed'))
    }
  } finally {
    rebooting.value = false
  }
}

async function handleShutdown() {
  try {
    await ElMessageBox.confirm(
      t('maintenance.powerControl.shutdownConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    shuttingDown.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success(t('maintenance.powerControl.shutdownSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.failed'))
    }
  } finally {
    shuttingDown.value = false
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
}

.power-card {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.power-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: $spacing-2xl;
}

.power-icon {
  color: $primary-color;
  margin-bottom: $spacing-2xl;
  opacity: 0.8;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-2xl;
  margin-bottom: $spacing-2xl;
}

.tech-button {
  min-width: 180px;
  height: 60px;
  font-size: $font-size-lg;
  border-radius: $radius-xl;
  transition: all $transition-normal;
}

.reboot-button {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 2px solid rgba(245, 158, 11, 0.5);

  &:hover {
    box-shadow: $shadow-glow-warning;
    transform: translateY(-3px);
  }
}

.shutdown-button {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
  border: 2px solid rgba(239, 68, 68, 0.5);

  &:hover {
    box-shadow: $shadow-glow-danger;
    transform: translateY(-3px);
  }
}

.power-tips {
  width: 100%;
  max-width: 500px;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    gap: $spacing-lg;
  }

  .tech-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
