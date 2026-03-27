<!-- ===========================================
     DashboardIndex.vue - Dashboard Main Page
     =========================================== -->

<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Odometer /></el-icon>
        {{ t('menu.status.title') }}
      </h2>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon :size="28"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-title">{{ currentLocale === 'zh-CN' ? stat.title : stat.titleEn }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- CPU & Memory Chart -->
      <div class="chart-card">
        <div class="card-header">
          <span>{{ currentLocale === 'zh-CN' ? 'CPU & 内存使用率' : 'CPU & Memory Usage' }}</span>
        </div>
        <div class="chart-container" ref="cpuMemoryChartRef"></div>
      </div>

      <!-- Network Traffic Chart -->
      <div class="chart-card">
        <div class="card-header">
          <span>{{ currentLocale === 'zh-CN' ? '网络流量' : 'Network Traffic' }}</span>
        </div>
        <div class="chart-container" ref="networkChartRef"></div>
      </div>
    </div>

    <!-- Link Status -->
    <div class="link-status-card">
      <div class="card-header">
        <span>{{ currentLocale === 'zh-CN' ? '链路状态' : 'Link Status' }}</span>
        <el-button type="primary" size="small" @click="checkLink">
          <el-icon><Connection /></el-icon>
          {{ t('navbar.checkLink') }}
        </el-button>
      </div>
      <div class="link-status-content">
        <div class="link-item">
          <div class="link-icon" :class="linkStatus.intranet ? 'status-ok' : 'status-error'">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="link-info">
            <div class="link-name">{{ t('navbar.intranet') }}</div>
            <div class="link-state">{{ linkStatus.intranet ? t('navbar.linkOk') : t('navbar.linkError') }}</div>
          </div>
        </div>
        <div class="link-item">
          <div class="link-icon" :class="linkStatus.extranet ? 'status-ok' : 'status-error'">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="link-info">
            <div class="link-name">{{ t('navbar.extranet') }}</div>
            <div class="link-state">{{ linkStatus.extranet ? t('navbar.linkOk') : t('navbar.linkError') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Odometer, Connection, Cpu, Coin, DataLine, TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
const appStore = useAppStore()

// Computed
const currentLocale = computed(() => appStore.language)

// Refs
const cpuMemoryChartRef = ref<HTMLElement>()
const networkChartRef = ref<HTMLElement>()
let cpuMemoryChart: echarts.ECharts | null = null
let networkChart: echarts.ECharts | null = null

// Stats data
const stats = ref([
  { title: 'CPU使用率', titleEn: 'CPU Usage', value: '45%', icon: Cpu, color: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)' },
  { title: '内存使用', titleEn: 'Memory Usage', value: '68%', icon: Coin, color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
  { title: '网络连接', titleEn: 'Connections', value: '128', icon: DataLine, color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { title: '在线用户', titleEn: 'Online Users', value: '5', icon: TrendCharts, color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
])

// Link status
const linkStatus = ref({
  intranet: true,
  extranet: true
})

// Check link
function checkLink() {
  // Simulate check
  linkStatus.value = {
    intranet: Math.random() > 0.2,
    extranet: Math.random() > 0.2
  }
}

// Initialize charts
function initCharts() {
  if (cpuMemoryChartRef.value) {
    cpuMemoryChart = echarts.init(cpuMemoryChartRef.value)
    cpuMemoryChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['CPU', 'Memory'], textStyle: { color: '#cbd5e1' } },
      xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
      yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#334155' } } },
      series: [
        { name: 'CPU', type: 'line', smooth: true, data: [30, 35, 45, 50, 40, 45], lineStyle: { color: '#00d4ff' }, areaStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
        { name: 'Memory', type: 'line', smooth: true, data: [60, 62, 68, 72, 65, 68], lineStyle: { color: '#6366f1' }, areaStyle: { color: 'rgba(99, 102, 241, 0.1)' } }
      ]
    })
  }

  if (networkChartRef.value) {
    networkChart = echarts.init(networkChartRef.value)
    networkChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: [currentLocale.value === 'zh-CN' ? '入站' : 'Inbound', currentLocale.value === 'zh-CN' ? '出站' : 'Outbound'], textStyle: { color: '#cbd5e1' } },
      xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#334155' } } },
      series: [
        { name: currentLocale.value === 'zh-CN' ? '入站' : 'Inbound', type: 'bar', data: [120, 180, 250, 300, 220, 180], itemStyle: { color: '#00d4ff' } },
        { name: currentLocale.value === 'zh-CN' ? '出站' : 'Outbound', type: 'bar', data: [80, 120, 180, 220, 150, 120], itemStyle: { color: '#6366f1' } }
      ]
    })
  }
}

// Handle resize
function handleResize() {
  cpuMemoryChart?.resize()
  networkChart?.resize()
}

// Lifecycle
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cpuMemoryChart?.dispose()
  networkChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: $spacing-lg;
  min-height: 100%;
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

// Stats grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba(0, 212, 255, 0.3);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: $radius-lg;
    color: white;
  }

  .stat-content {
    .stat-value {
      font-size: $font-size-3xl;
      font-weight: 700;
      color: $text-primary;
      line-height: 1;
    }

    .stat-title {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: $spacing-xs;
    }
  }
}

// Charts row
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.chart-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    color: $text-primary;
    font-weight: 600;
  }

  .chart-container {
    height: 300px;
    padding: $spacing-md;
  }
}

// Link status card
.link-status-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    color: $text-primary;
    font-weight: 600;
  }

  .link-status-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-lg;
    padding: $spacing-lg;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    background: $bg-secondary;
    border-radius: $radius-md;

    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      font-size: 20px;

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
        font-weight: 600;
        color: $text-primary;
      }

      .link-state {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}
</style>
