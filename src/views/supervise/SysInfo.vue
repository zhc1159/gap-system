<!-- ===========================================
     SysInfo.vue - System Information Monitor
     =========================================== -->

<template>
  <div class="sys-info-container">
    <!-- CPU and Memory Realtime Monitor -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Monitor /></el-icon>
              <span>{{ t('supervise.cpuUsage') }}</span>
            </div>
          </template>
          <div class="chart-wrapper">
            <div ref="cpuChartRef" class="chart-area"></div>
            <div class="statistic-info">
              <el-statistic :value="cpuUsage" suffix="%">
                <template #title>
                  <span class="stat-label">{{ t('supervise.currentUsage') }}</span>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Coin /></el-icon>
              <span>{{ t('supervise.memUsage') }}</span>
            </div>
          </template>
          <div class="chart-wrapper">
            <div ref="memChartRef" class="chart-area"></div>
            <div class="statistic-info">
              <el-statistic :value="memUsage" suffix="%">
                <template #title>
                  <span class="stat-label">{{ t('supervise.currentUsage') }}</span>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- System Info and Disk Usage -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><InfoFilled /></el-icon>
              <span>{{ t('supervise.systemInfo') }}</span>
            </div>
          </template>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">{{ t('supervise.cpuInfo') }}:</span>
              <span class="info-value">{{ systemInfo.cpuMsg }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('supervise.memInfo') }}:</span>
              <span class="info-value">{{ systemInfo.memMsg }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('supervise.uptime') }}:</span>
              <span class="info-value">{{ systemInfo.uptime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('supervise.license') }}:</span>
              <span class="info-value" :class="licenseClass">{{ systemInfo.licenseTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Folder /></el-icon>
              <span>{{ t('supervise.diskUsage') }}: {{ t('supervise.total') }} {{ totalDisk }}GB</span>
            </div>
          </template>
          <div ref="diskChartRef" class="chart-area disk-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Network Rate -->
    <el-card class="chart-card network-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Connection /></el-icon>
          <span>{{ t('supervise.networkRate') }}</span>
        </div>
      </template>
      <div ref="networkChartRef" class="chart-area large"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Coin, InfoFilled, Folder, Connection } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const { t } = useI18n()

// Refs
const cpuChartRef = ref<HTMLDivElement | null>(null)
const memChartRef = ref<HTMLDivElement | null>(null)
const diskChartRef = ref<HTMLDivElement | null>(null)
const networkChartRef = ref<HTMLDivElement | null>(null)

// Chart instances
let cpuChart: ECharts | null = null
let memChart: ECharts | null = null
let diskChart: ECharts | null = null
let networkChart: ECharts | null = null

// Data
const cpuUsage = ref(0)
const memUsage = ref(0)
const totalDisk = ref(0)
const cpuData = ref<{ time: number; value: number }[]>([])
const memData = ref<{ time: number; value: number }[]>([])

const systemInfo = reactive({
  cpuMsg: '',
  memMsg: '',
  uptime: '',
  licenseTime: '',
  licenseStatus: 'normal'
})

const licenseClass = computed(() => {
  return systemInfo.licenseStatus === 'normal' ? 'success-text' : 'error-text'
})

// Timers
let uptimeTimer: number | null = null
let realtimeTimer: number | null = null

// Initialize CPU Chart
const initCpuChart = () => {
  if (!cpuChartRef.value) return

  cpuChart = echarts.init(cpuChartRef.value)
  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      data: []
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: [],
      lineStyle: { color: '#409EFF', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ])
      }
    }]
  }
  cpuChart.setOption(option)
}

// Initialize Memory Chart
const initMemChart = () => {
  if (!memChartRef.value) return

  memChart = echarts.init(memChartRef.value)
  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      data: []
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: [],
      lineStyle: { color: '#67C23a', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
        ])
      }
    }]
  }
  memChart.setOption(option)
}

// Initialize Disk Chart
const initDiskChart = (data: { name: string; value: number }[]) => {
  if (!diskChartRef.value) return

  diskChart = echarts.init(diskChartRef.value)
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#242836',
      borderColor: '#2a2f3d',
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#909399' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#242836',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#fff' }
      },
      labelLine: { show: false },
      data: data,
      color: ['#409EFF', '#67C23a', '#E6A23C', '#F56C6C', '#909399']
    }]
  }
  diskChart.setOption(option)
}

// Initialize Network Chart
const initNetworkChart = (interfaces: string[]) => {
  if (!networkChartRef.value) return

  networkChart = echarts.init(networkChartRef.value)
  const colors = ['#409EFF', '#67C23a', '#E6A23C', '#F56C6C']
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#242836',
      borderColor: '#2a2f3d',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: interfaces,
      textStyle: { color: '#909399' },
      top: 0
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 30,
      left: 60
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      data: []
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
      nameTextStyle: { color: '#909399' },
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: interfaces.map((name, index) => ({
      name,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: [],
      lineStyle: { color: colors[index % colors.length], width: 2 }
    }))
  }
  networkChart.setOption(option)
}

// Fetch uptime data
const fetchUptime = async () => {
  try {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 300))
    systemInfo.uptime = '10 days, 5 hours, 30 minutes'
    systemInfo.licenseTime = '2025-12-31'
    systemInfo.licenseStatus = 'normal'
  } catch (error) {
    console.error('Failed to fetch uptime:', error)
    systemInfo.uptime = t('supervise.fetchError')
  }
}

// Fetch main data
const fetchData = async () => {
  try {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 500))

    systemInfo.cpuMsg = 'Intel Xeon E5-2680 v4 @ 2.40GHz'
    systemInfo.memMsg = '32GB DDR4'
    totalDisk.value = 500

    // Initialize charts with mock data
    initDiskChart([
      { name: '/', value: 45 },
      { name: '/home', value: 30 },
      { name: '/var', value: 15 },
      { name: 'Free', value: 10 }
    ])
    initNetworkChart(['eth0', 'eth1'])

    // Update realtime data
    updateRealtimeData({ cpu: Math.random() * 30 + 20, memory: Math.random() * 40 + 30 })
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

// Update realtime data
const updateRealtimeData = (data: { cpu: number; memory: number }) => {
  const now = Date.now()

  // Update CPU data
  cpuData.value.push({ time: now, value: data.cpu })
  if (cpuData.value.length > 60) cpuData.value.shift()
  cpuUsage.value = data.cpu

  // Update Memory data
  memData.value.push({ time: now, value: data.memory })
  if (memData.value.length > 60) memData.value.shift()
  memUsage.value = data.memory

  // Update charts
  const timeLabels = cpuData.value.map(d =>
    new Date(d.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )

  if (cpuChart) {
    cpuChart.setOption({
      xAxis: { data: timeLabels },
      series: [{ data: cpuData.value.map(d => d.value) }]
    })
  }

  if (memChart) {
    memChart.setOption({
      xAxis: { data: timeLabels },
      series: [{ data: memData.value.map(d => d.value) }]
    })
  }
}

// Handle window resize
const handleResize = () => {
  cpuChart?.resize()
  memChart?.resize()
  diskChart?.resize()
  networkChart?.resize()
}

onMounted(() => {
  initCpuChart()
  initMemChart()
  fetchData()

  // Fetch uptime every 5 seconds
  uptimeTimer = window.setInterval(fetchUptime, 5000)
  fetchUptime()

  // Fetch realtime data every 3 seconds
  realtimeTimer = window.setInterval(async () => {
    try {
      // Mock realtime data
      updateRealtimeData({ cpu: Math.random() * 30 + 20, memory: Math.random() * 40 + 30 })
    } catch (error) {
      console.error('Failed to fetch realtime data:', error)
    }
  }, 3000)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (uptimeTimer) clearInterval(uptimeTimer)
  if (realtimeTimer) clearInterval(realtimeTimer)
  cpuChart?.dispose()
  memChart?.dispose()
  diskChart?.dispose()
  networkChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.sys-info-container {
  padding: 20px;
  min-height: 100%;
}

.chart-card,
.info-card {
  background: #242836;
  border: 1px solid #2a2f3d;
  border-radius: 8px;
  margin-bottom: 20px;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #2a2f3d;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #409eff;

  .header-icon {
    font-size: 18px;
  }
}

.chart-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;

  .chart-area {
    flex: 1;
    height: 150px;
  }

  .statistic-info {
    width: 120px;
    text-align: center;

    .stat-label {
      font-size: 12px;
      color: #909399;
    }
  }
}

.chart-area {
  width: 100%;
  height: 200px;

  &.disk-chart {
    height: 180px;
  }

  &.large {
    height: 300px;
  }
}

.info-card {
  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #2a2f3d;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        color: #909399;
        font-size: 14px;
      }

      .info-value {
        color: #ffffff;
        font-weight: 500;
        font-size: 14px;

        &.success-text {
          color: #67C23a;
        }

        &.error-text {
          color: #F56C6C;
        }
      }
    }
  }
}

.network-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}
</style>
