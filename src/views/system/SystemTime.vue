<!-- ===========================================
     SystemTime.vue - System Time Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('system.time.title')"
      titleEn="System Time"
      :icon="Clock"
    />

    <div class="time-grid">
      <!-- Current Time Card -->
      <div class="time-card current-time-card">
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>{{ t('system.time.currentTime') }}</span>
        </div>
        <div class="time-display">
          <div class="time-value">{{ currentTime }}</div>
          <div class="date-value">{{ currentDate }}</div>
        </div>
        <div class="timezone-info">
          <span class="label">{{ t('system.time.timezone') }}:</span>
          <span class="value">{{ timezone }}</span>
        </div>
      </div>

      <!-- NTP Sync Card -->
      <div class="time-card">
        <div class="card-header">
          <el-icon><Connection /></el-icon>
          <span>NTP {{ t('system.time.sync') || '同步' }}</span>
        </div>
        <div class="card-body">
          <el-form label-width="100px">
            <el-form-item label="NTP服务">
              <el-switch v-model="ntpEnabled" />
            </el-form-item>
            <el-form-item :label="t('system.time.ntpServer')">
              <el-input v-model="ntpServer" :disabled="!ntpEnabled" placeholder="pool.ntp.org" />
            </el-form-item>
            <el-form-item label="同步状态">
              <el-tag :type="syncStatus ? 'success' : 'warning'" size="small">
                {{ syncStatus ? '已同步' : '未同步' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="上次同步">
              <span class="text-muted">{{ lastSyncTime || '-' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="card-footer">
          <el-button type="primary" :loading="syncing" :disabled="!ntpEnabled" @click="handleSyncNow">
            <el-icon><Refresh /></el-icon>
            {{ t('system.time.syncNow') }}
          </el-button>
        </div>
      </div>

      <!-- Manual Set Card -->
      <div class="time-card">
        <div class="card-header">
          <el-icon><Edit /></el-icon>
          <span>{{ t('system.time.manualSet') }}</span>
        </div>
        <div class="card-body">
          <el-form label-width="100px">
            <el-form-item label="设置时间">
              <el-date-picker
                v-model="manualTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="card-footer">
          <el-button type="primary" @click="handleManualSet" :disabled="ntpEnabled">
            {{ t('common.save') }}
          </el-button>
        </div>
      </div>

      <!-- Timezone Card -->
      <div class="time-card">
        <div class="card-header">
          <el-icon><Location /></el-icon>
          <span>{{ t('system.time.timezone') }}</span>
        </div>
        <div class="card-body">
          <el-form label-width="100px">
            <el-form-item :label="t('system.time.timezone')">
              <el-select v-model="selectedTimezone" style="width: 100%">
                <el-option label="Asia/Shanghai (UTC+8)" value="Asia/Shanghai" />
                <el-option label="Asia/Hong_Kong (UTC+8)" value="Asia/Hong_Kong" />
                <el-option label="Asia/Tokyo (UTC+9)" value="Asia/Tokyo" />
                <el-option label="America/New_York (UTC-5)" value="America/New_York" />
                <el-option label="America/Los_Angeles (UTC-8)" value="America/Los_Angeles" />
                <el-option label="Europe/London (UTC+0)" value="Europe/London" />
                <el-option label="UTC" value="UTC" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="card-footer">
          <el-button type="primary" @click="handleSaveTimezone">
            {{ t('common.save') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clock, Connection, Refresh, Edit, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Time state
const currentTime = ref('')
const currentDate = ref('')
const timezone = ref('Asia/Shanghai (UTC+8)')
const selectedTimezone = ref('Asia/Shanghai')

// NTP state
const ntpEnabled = ref(true)
const ntpServer = ref('pool.ntp.org')
const syncStatus = ref(true)
const lastSyncTime = ref('2024-01-15 10:30:00')
const syncing = ref(false)

// Manual time
const manualTime = ref<Date | null>(null)

// Timer
let timer: number | null = null

// Update time
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

// Handle sync now
async function handleSyncNow() {
  syncing.value = true
  await new Promise(r => setTimeout(r, 2000))
  syncStatus.value = true
  lastSyncTime.value = new Date().toLocaleString()
  syncing.value = false
  ElMessage.success('时间同步成功')
}

// Handle manual set
function handleManualSet() {
  if (manualTime.value) {
    ElMessage.success('时间设置成功')
    manualTime.value = null
  }
}

// Handle save timezone
function handleSaveTimezone() {
  const labels: Record<string, string> = {
    'Asia/Shanghai': 'Asia/Shanghai (UTC+8)',
    'Asia/Hong_Kong': 'Asia/Hong_Kong (UTC+8)',
    'Asia/Tokyo': 'Asia/Tokyo (UTC+9)',
    'America/New_York': 'America/New_York (UTC-5)',
    'America/Los_Angeles': 'America/Los_Angeles (UTC-8)',
    'Europe/London': 'Europe/London (UTC+0)',
    'UTC': 'UTC'
  }
  timezone.value = labels[selectedTimezone.value] || selectedTimezone.value
  ElMessage.success(t('common.saveSuccess'))
}

// Lifecycle
onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.time-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.time-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    font-weight: 600;
    color: $text-primary;

    .el-icon { color: $primary-color; }
  }

  .card-body {
    padding: $spacing-lg;
  }

  .card-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color;
    background: rgba(0, 212, 255, 0.02);
    text-align: right;
  }
}

.current-time-card {
  grid-row: span 2;

  .time-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-2xl;

    .time-value {
      font-size: 48px;
      font-weight: 700;
      color: $text-primary;
      font-family: $font-family-mono;
      background: $gradient-primary;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .date-value {
      font-size: $font-size-lg;
      color: $text-secondary;
      margin-top: $spacing-sm;
    }
  }

  .timezone-info {
    display: flex;
    justify-content: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    background: rgba(0, 212, 255, 0.02);
    border-top: 1px solid $border-color;

    .label { color: $text-muted; }
    .value { color: $text-primary; font-weight: 500; }
  }
}

.text-muted {
  color: $text-muted;
}
</style>
