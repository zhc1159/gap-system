<!-- AntiVirusUpdate.vue - Antivirus Database Update -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><FirstAidKit /></el-icon>
        {{ t('menu.maintenance.antivirus') || 'Antivirus Update' }}
      </h2>
      <p class="page-description">{{ t('maintenance.antivirus.description') || 'Update antivirus database' }}</p>
    </div>

    <el-card class="tech-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('maintenance.antivirus.currentStatus') || 'Current Status' }}</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('maintenance.antivirus.version') || 'Version'">
          {{ virusDbInfo.version }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('maintenance.antivirus.lastUpdate') || 'Last Update'">
          {{ virusDbInfo.lastUpdate }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('maintenance.antivirus.virusCount') || 'Virus Count'">
          {{ virusDbInfo.virusCount }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('maintenance.antivirus.status') || 'Status'">
          <el-tag :type="virusDbInfo.status === 'up-to-date' ? 'success' : 'warning'">
            {{ virusDbInfo.status }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="tech-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('maintenance.antivirus.updateSettings') || 'Update Settings' }}</span>
        </div>
      </template>

      <el-form :model="updateSettings" label-width="180px">
        <el-form-item :label="t('maintenance.antivirus.autoUpdate') || 'Auto Update'">
          <el-switch v-model="updateSettings.autoUpdate" />
        </el-form-item>
        <el-form-item :label="t('maintenance.antivirus.updateServer') || 'Update Server'">
          <el-input v-model="updateSettings.server" :placeholder="t('common.placeholder') || 'Enter server URL'" />
        </el-form-item>
        <el-form-item :label="t('maintenance.antivirus.updateInterval') || 'Update Interval'">
          <el-select v-model="updateSettings.interval" style="width: 200px;">
            <el-option label="Daily" value="daily" />
            <el-option label="Weekly" value="weekly" />
            <el-option label="Monthly" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="updating" @click="handleUpdate">
            {{ t('maintenance.antivirus.updateNow') || 'Update Now' }}
          </el-button>
          <el-button @click="handleCheckUpdate">
            {{ t('maintenance.antivirus.checkUpdate') || 'Check for Updates' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { FirstAidKit } from '@element-plus/icons-vue'

const { t } = useI18n()

const updating = ref(false)

const virusDbInfo = reactive({
  version: '2024.01.15',
  lastUpdate: '2024-01-15 10:30:00',
  virusCount: '15,234,567',
  status: 'up-to-date'
})

const updateSettings = reactive({
  autoUpdate: true,
  server: 'https://update.antivirus.example.com',
  interval: 'daily'
})

const handleUpdate = async () => {
  updating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 3000))
    virusDbInfo.version = '2024.01.16'
    virusDbInfo.lastUpdate = new Date().toLocaleString()
    ElMessage.success(t('common.success') || 'Update successful')
  } finally {
    updating.value = false
  }
}

const handleCheckUpdate = async () => {
  ElMessage.info(t('maintenance.antivirus.checking') || 'Checking for updates...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  ElMessage.success(t('maintenance.antivirus.upToDate') || 'Already up to date')
}

onMounted(() => {
  // Fetch initial data
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 600;
    color: #409eff;
    margin-bottom: 8px;
  }

  .page-description {
    color: #909399;
    font-size: 14px;
  }
}

.tech-card {
  background: #242836;
  border: 1px solid #2a2f3d;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #2a2f3d;
  }
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}
</style>
