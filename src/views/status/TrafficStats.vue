<!-- ===========================================
     TrafficStats.vue - Traffic Statistics Page
     =========================================== -->

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><TrendCharts /></el-icon>
        {{ t('status.traffic.title') }}
      </h2>
      <div class="page-actions">
        <el-select v-model="timeRange" size="default" style="width: 150px">
          <el-option :label="t('status.traffic.lastHour')" value="hour" />
          <el-option :label="t('status.traffic.lastDay')" value="day" />
          <el-option :label="t('status.traffic.lastWeek')" value="week" />
        </el-select>
      </div>
    </div>

    <!-- Traffic Chart -->
    <div class="chart-card">
      <div class="chart-container" ref="chartRef"></div>
    </div>

    <!-- Traffic Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon inbound">
          <el-icon><Download /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">{{ t('status.traffic.inbound') }}</div>
          <div class="stat-value">{{ formatBytes(trafficStats.inbound) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon outbound">
          <el-icon><Upload /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">{{ t('status.traffic.outbound') }}</div>
          <div class="stat-value">{{ formatBytes(trafficStats.outbound) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon total">
          <el-icon><DataLine /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">{{ t('status.traffic.total') }}</div>
          <div class="stat-value">{{ formatBytes(trafficStats.total) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon connections">
          <el-icon><Connection /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">{{ t('status.traffic.connections') }}</div>
          <div class="stat-value">{{ trafficStats.connections }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendCharts, Download, Upload, DataLine, Connection } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const { t } = useI18n()

const timeRange = ref('day')
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const trafficStats = ref({
  inbound: 1024 * 1024 * 1024 * 15, // 15GB
  outbound: 1024 * 1024 * 1024 * 8, // 8GB
  total: 1024 * 1024 * 1024 * 23, // 23GB
  connections: 1280
})

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function initChart() {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()
  }
}

function updateChart() {
  if (!chart) return

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const inboundData = Array.from({ length: 24 }, () => Math.random() * 1000 + 500)
  const outboundData = Array.from({ length: 24 }, () => Math.random() * 800 + 200)

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: [t('status.traffic.inbound'), t('status.traffic.outbound')], textStyle: { color: '#cbd5e1' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: hours, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#334155' } } },
    series: [
      { name: t('status.traffic.inbound'), type: 'line', smooth: true, data: inboundData, lineStyle: { color: '#00d4ff' }, areaStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
      { name: t('status.traffic.outbound'), type: 'line', smooth: true, data: outboundData, lineStyle: { color: '#6366f1' }, areaStyle: { color: 'rgba(99, 102, 241, 0.1)' } }
    ]
  })
}

function handleResize() {
  chart?.resize()
}

watch(timeRange, () => {
  updateChart()
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
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

.chart-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  margin-bottom: $spacing-lg;

  .chart-container {
    height: 400px;
    padding: $spacing-md;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: $spacing-lg;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 20px;

    &.inbound { background: rgba(0, 212, 255, 0.2); color: $primary-color; }
    &.outbound { background: rgba(99, 102, 241, 0.2); color: $secondary-color; }
    &.total { background: rgba(16, 185, 129, 0.2); color: $success-color; }
    &.connections { background: rgba(245, 158, 11, 0.2); color: $warning-color; }
  }

  .stat-content {
    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }

    .stat-value {
      font-size: $font-size-xl;
      font-weight: 700;
      color: $text-primary;
    }
  }
}
</style>
