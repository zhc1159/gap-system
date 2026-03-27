<!-- ===========================================
     SystemStatus.vue - System Status Page
     =========================================== -->

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Monitor /></el-icon>
        {{ t('status.system.title') }}
      </h2>
    </div>

    <!-- System Info Cards -->
    <div class="info-grid">
      <div class="info-card" v-for="info in systemInfo" :key="info.label">
        <div class="info-label">{{ currentLocale === 'zh-CN' ? info.label : info.labelEn }}</div>
        <div class="info-value">{{ info.value }}</div>
      </div>
    </div>

    <!-- Resource Usage -->
    <div class="resource-section">
      <h3 class="section-title">{{ currentLocale === 'zh-CN' ? '资源使用' : 'Resource Usage' }}</h3>
      <div class="resource-grid">
        <div class="resource-card" v-for="resource in resources" :key="resource.label">
          <div class="resource-header">
            <span class="resource-label">{{ currentLocale === 'zh-CN' ? resource.label : resource.labelEn }}</span>
            <span class="resource-value">{{ resource.used }} / {{ resource.total }}</span>
          </div>
          <el-progress
            :percentage="resource.percent"
            :color="resource.color"
            :stroke-width="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
const appStore = useAppStore()
const currentLocale = computed(() => appStore.language)

const systemInfo = ref([
  { label: '主机名', labelEn: 'Hostname', value: 'GAP-SYSTEM-01' },
  { label: 'IP地址', labelEn: 'IP Address', value: '192.168.1.100' },
  { label: '系统版本', labelEn: 'Version', value: 'v1.0.0' },
  { label: '运行时间', labelEn: 'Uptime', value: '30天 12小时' },
  { label: 'MAC地址', labelEn: 'MAC Address', value: '00:11:22:33:44:55' },
  { label: '网络状态', labelEn: 'Network Status', value: '正常' }
])

const resources = ref([
  { label: 'CPU使用率', labelEn: 'CPU Usage', used: '45%', total: '100%', percent: 45, color: '#00d4ff' },
  { label: '内存使用', labelEn: 'Memory Usage', used: '4.2GB', total: '8GB', percent: 52.5, color: '#6366f1' },
  { label: '磁盘使用', labelEn: 'Disk Usage', used: '156GB', total: '500GB', percent: 31.2, color: '#10b981' }
])
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.info-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;

  .info-label {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
  }

  .info-value {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
  }
}

.resource-section {
  .section-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.resource-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;

  .resource-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-md;

    .resource-label {
      font-weight: 600;
      color: $text-primary;
    }

    .resource-value {
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }

  :deep(.el-progress) {
    .el-progress-bar__outer {
      background: $bg-darker;
    }
  }
}
</style>
