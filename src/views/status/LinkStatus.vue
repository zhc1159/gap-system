<!-- ===========================================
     LinkStatus.vue - Link Detection Page
     =========================================== -->

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('status.link.title') }}
      </h2>
      <div class="page-actions">
        <el-button type="primary" @click="checkAllLinks" :loading="checking">
          <el-icon><Refresh /></el-icon>
          {{ checking ? t('navbar.linkChecking') : t('status.link.checkNow') }}
        </el-button>
      </div>
    </div>

    <!-- Link Cards -->
    <div class="link-grid">
      <div class="link-card" v-for="link in links" :key="link.id">
        <div class="link-header">
          <div class="link-icon" :class="link.status === 'OK' ? 'status-ok' : 'status-error'">
            <el-icon :size="24"><Connection /></el-icon>
          </div>
          <div class="link-info">
            <div class="link-name">{{ link.name }}</div>
            <div class="link-type">{{ link.type }}</div>
          </div>
        </div>
        <div class="link-status">
          <el-tag :type="link.status === 'OK' ? 'success' : 'danger'" size="small">
            {{ link.status === 'OK' ? t('navbar.linkOk') : t('navbar.linkError') }}
          </el-tag>
        </div>
        <div class="link-details">
          <div class="detail-item">
            <span class="label">{{ t('status.link.latency') }}:</span>
            <span class="value">{{ link.latency }}ms</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ t('status.link.lastCheck') }}:</span>
            <span class="value">{{ link.lastCheck }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection, Refresh } from '@element-plus/icons-vue'

const { t } = useI18n()

const checking = ref(false)

const links = ref([
  { id: 1, name: '内网链路', type: 'Intranet', status: 'OK', latency: 5, lastCheck: '2024-01-15 10:30:00' },
  { id: 2, name: '外网链路', type: 'Extranet', status: 'OK', latency: 8, lastCheck: '2024-01-15 10:30:00' },
  { id: 3, name: '数据通道', type: 'Data Channel', status: 'OK', latency: 3, lastCheck: '2024-01-15 10:30:00' }
])

async function checkAllLinks() {
  checking.value = true
  // Simulate check
  await new Promise(resolve => setTimeout(resolve, 2000))
  links.value.forEach(link => {
    link.status = Math.random() > 0.2 ? 'OK' : 'ERROR'
    link.latency = Math.floor(Math.random() * 20) + 1
    link.lastCheck = new Date().toLocaleString()
  })
  checking.value = false
}
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-lg;
}

.link-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  transition: all $transition-normal;

  &:hover {
    box-shadow: $shadow-lg;
    border-color: rgba(0, 212, 255, 0.3);
  }

  .link-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;

      &.status-ok {
        background: rgba(16, 185, 129, 0.2);
        color: $success-color;
      }

      &.status-error {
        background: rgba(239, 68, 68, 0.2);
        color: $danger-color;
      }
    }

    .link-info {
      .link-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
      }

      .link-type {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }

  .link-status {
    margin-bottom: $spacing-md;
  }

  .link-details {
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: $spacing-xs 0;
      font-size: $font-size-sm;

      .label {
        color: $text-secondary;
      }

      .value {
        color: $text-primary;
        font-weight: 500;
      }
    }
  }
}
</style>
