<!-- ===========================================
     DashboardIndex.vue - Dashboard Main Page
     =========================================== -->

<template>
  <div class="dashboard-page">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <StatCard
        :value="systemStats.cpu"
        label="CPU 使用率"
        labelEn="CPU Usage"
        suffix="%"
        :icon="Cpu"
        type="primary"
        :trend="systemStats.cpuTrend"
      />
      <StatCard
        :value="systemStats.memory"
        label="内存使用"
        labelEn="Memory Usage"
        suffix="%"
        :icon="Coin"
        type="success"
        :trend="systemStats.memoryTrend"
      />
      <StatCard
        :value="systemStats.connections"
        label="网络连接"
        labelEn="Connections"
        :icon="Connection"
        type="warning"
        :trend="systemStats.connectionsTrend"
      />
      <StatCard
        :value="systemStats.attacks"
        label="今日攻击拦截"
        labelEn="Attacks Blocked"
        :icon="Lock"
        type="danger"
        :trend="systemStats.attacksTrend"
      />
    </div>

    <!-- Main Charts Row -->
    <div class="charts-row">
      <!-- CPU & Memory Chart -->
      <div class="chart-card large">
        <div class="card-header">
          <span class="card-title">
            <el-icon><TrendCharts /></el-icon>
            {{ t('dashboard.resourceUsage') }}
          </span>
          <el-radio-group v-model="timeRange" size="small" @change="updateTimeRange">
            <el-radio-button label="1h">{{ t('dashboard.lastHour') }}</el-radio-button>
            <el-radio-button label="6h">{{ t('dashboard.last6Hours') }}</el-radio-button>
            <el-radio-button label="24h">{{ t('dashboard.last24Hours') }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-container" ref="cpuMemoryChartRef"></div>
      </div>

      <!-- Network Traffic Chart -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">
            <el-icon><DataLine /></el-icon>
            {{ t('dashboard.networkTraffic') }}
          </span>
        </div>
        <div class="chart-container" ref="networkChartRef"></div>
      </div>
    </div>

    <!-- Second Charts Row -->
    <div class="charts-row">
      <!-- Attack Distribution Pie -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">
            <el-icon><Warning /></el-icon>
            {{ t('dashboard.attackDistribution') }}
          </span>
        </div>
        <div class="chart-container" ref="attackChartRef"></div>
      </div>

      <!-- Connection Gauge -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">
            <el-icon><Connection /></el-icon>
            {{ t('dashboard.connectionStatus') }}
          </span>
        </div>
        <div class="chart-container gauge-container" ref="connectionGaugeRef"></div>
      </div>

      <!-- Link Status -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">
            <el-icon><Link /></el-icon>
            {{ t('dashboard.linkStatus') }}
          </span>
          <el-button type="primary" size="small" :loading="checkingLink" @click="checkLink">
            <el-icon><Refresh /></el-icon>
            {{ t('navbar.checkLink') }}
          </el-button>
        </div>
        <div class="link-status-content">
          <div class="link-item" v-for="link in linkStatusList" :key="link.name">
            <div class="link-icon" :class="link.status ? 'status-ok' : 'status-error'">
              <el-icon><component :is="link.icon" /></el-icon>
            </div>
            <div class="link-info">
              <div class="link-name">{{ link.label }}</div>
              <div class="link-state" :class="link.status ? 'ok' : 'error'">
                {{ link.status ? t('navbar.linkOk') : t('navbar.linkError') }}
              </div>
              <div class="link-latency" v-if="link.status">
                {{ link.latency }}ms
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="alerts-section">
      <div class="section-header">
        <span class="card-title">
          <el-icon><Bell /></el-icon>
          {{ t('dashboard.systemAlerts') }}
        </span>
        <el-button text type="primary" @click="viewAllAlerts">
          {{ t('dashboard.viewAll') }}
        </el-button>
      </div>
      <div class="alerts-list">
        <div
          class="alert-item"
          v-for="alert in systemAlerts"
          :key="alert.id"
          :class="`alert-${alert.level}`"
        >
          <el-icon class="alert-icon">
            <component :is="getAlertIcon(alert.level)" />
          </el-icon>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-time">{{ alert.time }}</div>
          </div>
          <el-tag :type="getAlertTagType(alert.level)" size="small">
            {{ alert.levelLabel }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Cpu,
  Coin,
  Connection,
  Lock,
  TrendCharts,
  DataLine,
  Warning,
  Link,
  Refresh,
  Bell,
  CircleCheck,
  CircleClose,
  InfoFilled,
  Monitor,
  Platform
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useAppStore } from '@/stores/app'
import StatCard from '@/components/StatCard.vue'

const { t } = useI18n()
const appStore = useAppStore()
const currentLocale = computed(() => appStore.language)

// Chart refs
const cpuMemoryChartRef = ref<HTMLElement>()
const networkChartRef = ref<HTMLElement>()
const attackChartRef = ref<HTMLElement>()
const connectionGaugeRef = ref<HTMLElement>()

// Chart instances
let cpuMemoryChart: echarts.ECharts | null = null
let networkChart: echarts.ECharts | null = null
let attackChart: echarts.ECharts | null = null
let connectionGauge: echarts.ECharts | null = null
let updateTimer: number | null = null

// Time range
const timeRange = ref('1h')

// System stats
const systemStats = ref({
  cpu: 45,
  memory: 68,
  connections: 128,
  attacks: 23,
  cpuTrend: 5.2,
  memoryTrend: -2.1,
  connectionsTrend: 12.5,
  attacksTrend: -8.3
})

// Link status
const checkingLink = ref(false)
const linkStatusList = ref([
  { name: 'intranet', label: '内网端', labelEn: 'Intranet', status: true, latency: 12, icon: Monitor },
  { name: 'extranet', label: '外网端', labelEn: 'Extranet', status: true, latency: 8, icon: Platform }
])

// System alerts
const systemAlerts = ref([
  { id: 1, title: '检测到异常登录尝试', titleEn: 'Abnormal login attempt detected', level: 'warning', levelLabel: '警告', time: '2分钟前', timeEn: '2 min ago' },
  { id: 2, title: '系统备份已完成', titleEn: 'System backup completed', level: 'info', levelLabel: '信息', time: '15分钟前', timeEn: '15 min ago' },
  { id: 3, title: 'DDoS攻击已拦截', titleEn: 'DDoS attack blocked', level: 'danger', levelLabel: '危险', time: '1小时前', timeEn: '1 hour ago' },
  { id: 4, title: 'SSL证书即将过期', titleEn: 'SSL certificate expiring soon', level: 'warning', levelLabel: '警告', time: '2小时前', timeEn: '2 hours ago' }
])

// Generate time labels
function generateTimeLabels(count: number, range: string): string[] {
  const labels: string[] = []
  const now = new Date()
  const interval = range === '1h' ? 5 : range === '6h' ? 30 : 60

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 1000)
    labels.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
  }
  return labels
}

// Generate random data
function generateData(count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

// Initialize CPU & Memory Chart
function initCpuMemoryChart() {
  if (!cpuMemoryChartRef.value) return

  cpuMemoryChart = echarts.init(cpuMemoryChartRef.value)
  const labels = generateTimeLabels(12, timeRange.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9' }
    },
    legend: {
      data: ['CPU', 'Memory'],
      textStyle: { color: '#cbd5e1' },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: generateData(12, 30, 60),
        lineStyle: { color: '#00d4ff', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        },
        itemStyle: { color: '#00d4ff' }
      },
      {
        name: 'Memory',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: generateData(12, 55, 80),
        lineStyle: { color: '#6366f1', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
          ])
        },
        itemStyle: { color: '#6366f1' }
      }
    ]
  }

  cpuMemoryChart.setOption(option)
}

// Initialize Network Chart
function initNetworkChart() {
  if (!networkChartRef.value) return

  networkChart = echarts.init(networkChartRef.value)
  const labels = generateTimeLabels(8, timeRange.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9' }
    },
    legend: {
      data: [t('dashboard.inbound'), t('dashboard.outbound')],
      textStyle: { color: '#cbd5e1' },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', formatter: '{value} MB' },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [
      {
        name: t('dashboard.inbound'),
        type: 'bar',
        barWidth: '35%',
        data: generateData(8, 100, 300),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#0099cc' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: t('dashboard.outbound'),
        type: 'bar',
        barWidth: '35%',
        data: generateData(8, 50, 200),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#4f46e5' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  networkChart.setOption(option)
}

// Initialize Attack Distribution Chart
function initAttackChart() {
  if (!attackChartRef.value) return

  attackChart = echarts.init(attackChartRef.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9' }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#cbd5e1' }
    },
    series: [
      {
        name: t('dashboard.attackType'),
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1e293b',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#f1f5f9'
          }
        },
        labelLine: { show: false },
        data: [
          { value: 45, name: t('dashboard.sqlInjection'), itemStyle: { color: '#ef4444' } },
          { value: 32, name: t('dashboard.xss'), itemStyle: { color: '#f59e0b' } },
          { value: 28, name: t('dashboard.ddos'), itemStyle: { color: '#8b5cf6' } },
          { value: 18, name: t('dashboard.bruteForce'), itemStyle: { color: '#06b6d4' } },
          { value: 12, name: t('dashboard.other'), itemStyle: { color: '#64748b' } }
        ]
      }
    ]
  }

  attackChart.setOption(option)
}

// Initialize Connection Gauge
function initConnectionGauge() {
  if (!connectionGaugeRef.value) return

  connectionGauge = echarts.init(connectionGaugeRef.value)
  const used = systemStats.value.connections
  const total = 200

  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: total,
        splitNumber: 4,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#10b981' },
            { offset: 0.5, color: '#f59e0b' },
            { offset: 1, color: '#ef4444' }
          ])
        },
        progress: {
          show: true,
          width: 20
        },
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#1e293b']]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: {
          show: true,
          offsetCenter: [0, '30%'],
          fontSize: 14,
          color: '#94a3b8'
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-10%'],
          fontSize: 32,
          fontWeight: 'bold',
          formatter: '{value}',
          color: '#f1f5f9'
        },
        data: [
          {
            value: used,
            name: t('dashboard.activeConnections')
          }
        ]
      }
    ]
  }

  connectionGauge.setOption(option)
}

// Update time range
function updateTimeRange() {
  initCpuMemoryChart()
  initNetworkChart()
}

// Check link status
async function checkLink() {
  checkingLink.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  linkStatusList.value = linkStatusList.value.map(link => ({
    ...link,
    status: Math.random() > 0.15,
    latency: Math.floor(Math.random() * 50) + 5
  }))

  checkingLink.value = false
}

// View all alerts
function viewAllAlerts() {
  // Navigate to alerts page
  console.log('Navigate to alerts')
}

// Get alert icon
function getAlertIcon(level: string) {
  const icons: Record<string, any> = {
    danger: CircleClose,
    warning: Warning,
    info: InfoFilled,
    success: CircleCheck
  }
  return icons[level] || InfoFilled
}

// Get alert tag type
function getAlertTagType(level: string): 'danger' | 'warning' | 'info' | 'success' {
  const types: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    success: 'success'
  }
  return types[level] || 'info'
}

// Update charts data periodically
function startRealTimeUpdate() {
  updateTimer = window.setInterval(() => {
    // Update stats
    systemStats.value.cpu = Math.floor(Math.random() * 30) + 35
    systemStats.value.memory = Math.floor(Math.random() * 20) + 60
    systemStats.value.connections = Math.floor(Math.random() * 50) + 100

    // Update gauge
    if (connectionGauge) {
      connectionGauge.setOption({
        series: [{ data: [{ value: systemStats.value.connections }] }]
      })
    }
  }, 5000)
}

// Handle resize
function handleResize() {
  cpuMemoryChart?.resize()
  networkChart?.resize()
  attackChart?.resize()
  connectionGauge?.resize()
}

// Watch locale change
watch(currentLocale, () => {
  initCpuMemoryChart()
  initNetworkChart()
  initAttackChart()
  initConnectionGauge()
})

// Lifecycle
onMounted(() => {
  initCpuMemoryChart()
  initNetworkChart()
  initAttackChart()
  initConnectionGauge()
  startRealTimeUpdate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cpuMemoryChart?.dispose()
  networkChart?.dispose()
  attackChart?.dispose()
  connectionGauge?.dispose()
  window.removeEventListener('resize', handleResize)
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.dashboard-page {
  padding: $spacing-lg;
  min-height: 100%;
}

// Stats grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// Charts row
.charts-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-normal;

  &:hover {
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: $shadow-glow;
  }

  &.large {
    grid-column: span 2;

    @media (max-width: 1400px) {
      grid-column: span 2;
    }

    @media (max-width: 900px) {
      grid-column: span 1;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;

    .card-title {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      color: $text-primary;
      font-weight: 600;
      font-size: $font-size-base;

      .el-icon {
        color: $primary-color;
      }
    }

    :deep(.el-radio-group) {
      .el-radio-button__inner {
        background: $bg-secondary;
        border-color: $border-color;
        color: $text-secondary;
        padding: 5px 12px;

        &:hover {
          color: $primary-color;
        }
      }

      .el-radio-button__original-radio:checked + .el-radio-button__inner {
        background: $primary-color;
        border-color: $primary-color;
        color: $bg-darker;
        box-shadow: none;
      }
    }
  }

  .chart-container {
    height: 280px;
    padding: $spacing-md;

    &.gauge-container {
      height: 240px;
    }
  }
}

// Link status content
.link-status-content {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.link-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: $bg-hover;
  }

  .link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 20px;

    &.status-ok {
      background: rgba(16, 185, 129, 0.15);
      color: $success-color;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
    }

    &.status-error {
      background: rgba(239, 68, 68, 0.15);
      color: $danger-color;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
    }
  }

  .link-info {
    flex: 1;

    .link-name {
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 2px;
    }

    .link-state {
      font-size: $font-size-sm;

      &.ok {
        color: $success-color;
      }

      &.error {
        color: $danger-color;
      }
    }

    .link-latency {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-top: 2px;
    }
  }
}

// Alerts section
.alerts-section {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;

    .card-title {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      color: $text-primary;
      font-weight: 600;

      .el-icon {
        color: $primary-color;
      }
    }
  }
}

.alerts-list {
  padding: $spacing-md;
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
  transition: all $transition-fast;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: $bg-hover;
  }

  &.alert-danger {
    background: rgba(239, 68, 68, 0.08);
    border-left: 3px solid $danger-color;

    .alert-icon {
      color: $danger-color;
    }
  }

  &.alert-warning {
    background: rgba(245, 158, 11, 0.08);
    border-left: 3px solid $warning-color;

    .alert-icon {
      color: $warning-color;
    }
  }

  &.alert-info {
    background: rgba(6, 182, 212, 0.08);
    border-left: 3px solid $info-color;

    .alert-icon {
      color: $info-color;
    }
  }

  .alert-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .alert-content {
    flex: 1;
    min-width: 0;

    .alert-title {
      color: $text-primary;
      font-size: $font-size-sm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-time {
      color: $text-muted;
      font-size: $font-size-xs;
      margin-top: 2px;
    }
  }
}
</style>
