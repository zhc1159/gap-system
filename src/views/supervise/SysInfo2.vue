<!-- ===========================================
     SysInfo2.vue - System Information Monitor (Backup)
     =========================================== -->

<template>
  <div class="sys-info2-container">
    <!-- CPU and Memory Realtime Monitor (Collapsible) -->
    <el-card class="realtime-card" shadow="hover">
      <template #header>
        <div class="card-header-wrapper">
          <div class="card-header">
            <el-icon class="header-icon"><Monitor /></el-icon>
            <span>{{ t('supervise.cpuMemRealtime') }}</span>
          </div>
          <el-button
            :icon="collapsed ? Plus : Minus"
            @click="collapsed = !collapsed"
            circle
            size="small"
          />
        </div>
      </template>

      <div v-show="!collapsed" class="chart-container">
        <div ref="realtimeChartRef" class="chart-area"></div>
      </div>
    </el-card>

    <!-- CPU Core (Today + Week) -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="pie-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('supervise.cpuCoreToday') }}</span>
            </div>
          </template>
          <div ref="cpuCoreTodayRef" class="pie-chart"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="pie-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('supervise.cpuCoreWeek') }}</span>
            </div>
          </template>
          <div ref="cpuCoreWeekRef" class="pie-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- CPU User (Today + Week) -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="pie-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('supervise.cpuUserToday') }}</span>
            </div>
          </template>
          <div ref="cpuUserTodayRef" class="pie-chart"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="pie-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('supervise.cpuUserWeek') }}</span>
            </div>
          </template>
          <div ref="cpuUserWeekRef" class="pie-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Disk + Memory Stats -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="pie-card small" shadow="hover">
          <template #header>
            <div class="card-header small">
              <span>{{ t('supervise.diskUsage') }}</span>
            </div>
          </template>
          <div ref="diskRef" class="pie-chart-small"></div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="pie-card small" shadow="hover">
          <template #header>
            <div class="card-header small">
              <span>{{ t('supervise.memMax') }}</span>
            </div>
          </template>
          <div ref="memMaxRef" class="pie-chart-small"></div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="pie-card small" shadow="hover">
          <template #header>
            <div class="card-header small">
              <span>{{ t('supervise.memMin') }}</span>
            </div>
          </template>
          <div ref="memMinRef" class="pie-chart-small"></div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="pie-card small" shadow="hover">
          <template #header>
            <div class="card-header small">
              <span>{{ t('supervise.memMean') }}</span>
            </div>
          </template>
          <div ref="memMeanRef" class="pie-chart-small"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Plus, Minus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const { t } = useI18n()

// State
const collapsed = ref(false)

// Data interface for mock data
interface ChartData {
  labels: string[]
  data: number[]
}

interface SystemData {
  cpuDay: ChartData
  cpuWeek: ChartData
  cpuUserDay: ChartData
  cpuUserWeek: ChartData
  hardware: ChartData
  memMax: ChartData
  memMin: ChartData
  memMean: ChartData
  memDay: ChartData
}

const data = ref<SystemData | null>(null)

// Chart refs
const realtimeChartRef = ref<HTMLDivElement | null>(null)
const cpuCoreTodayRef = ref<HTMLDivElement | null>(null)
const cpuCoreWeekRef = ref<HTMLDivElement | null>(null)
const cpuUserTodayRef = ref<HTMLDivElement | null>(null)
const cpuUserWeekRef = ref<HTMLDivElement | null>(null)
const diskRef = ref<HTMLDivElement | null>(null)
const memMaxRef = ref<HTMLDivElement | null>(null)
const memMinRef = ref<HTMLDivElement | null>(null)
const memMeanRef = ref<HTMLDivElement | null>(null)

// Chart instances
const charts: ECharts[] = []

// Colors
const chartColors = ['#409EFF', '#67C23a', '#E6A23C', '#F56C6C', '#909399']

// Initialize realtime chart
const initRealtimeChart = () => {
  if (!realtimeChartRef.value || !data.value) return

  const chart = echarts.init(realtimeChartRef.value)
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#242836',
      borderColor: '#2a2f3d',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['CPU', 'Memory'],
      textStyle: { color: '#909399' },
      top: 0
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      data: data.value.cpuDay.labels
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: data.value.cpuDay.data,
        lineStyle: { color: '#409EFF', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        }
      },
      {
        name: 'Memory',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: data.value.memDay.data,
        lineStyle: { color: '#67C23a', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ])
        }
      }
    ]
  }
  chart.setOption(option)
  charts.push(chart)
}

// Initialize pie chart
const initPieChart = (
  el: HTMLDivElement | null,
  chartData: { labels: string[]; data: number[] },
  _title: string
) => {
  if (!el || !chartData) return

  const chart = echarts.init(el)
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
      textStyle: { color: '#909399', fontSize: 10 }
    },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#242836',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 10, fontWeight: 'bold', color: '#fff' }
      },
      labelLine: { show: false },
      data: chartData.labels.map((label, index) => ({
        name: label,
        value: chartData.data[index]
      })),
      color: chartColors
    }]
  }
  chart.setOption(option)
  charts.push(chart)
}

// Fetch data
const fetchData = async () => {
  try {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 500))
    data.value = {
      cpuDay: { labels: ['User', 'System', 'Idle'], data: [30, 20, 50] },
      cpuWeek: { labels: ['User', 'System', 'Idle'], data: [35, 25, 40] },
      cpuUserDay: { labels: ['root', 'admin', 'other'], data: [50, 30, 20] },
      cpuUserWeek: { labels: ['root', 'admin', 'other'], data: [45, 35, 20] },
      hardware: { labels: ['Used', 'Free'], data: [60, 40] },
      memMax: { labels: ['Max', 'Available'], data: [90, 10] },
      memMin: { labels: ['Min', 'Available'], data: [20, 80] },
      memMean: { labels: ['Used', 'Free'], data: [55, 45] },
      memDay: { labels: ['Used', 'Free'], data: [50, 50] }
    }

    // Initialize all charts
    initRealtimeChart()
    if (data.value) {
      initPieChart(cpuCoreTodayRef.value, data.value.cpuDay, t('supervise.cpuCoreToday'))
      initPieChart(cpuCoreWeekRef.value, data.value.cpuWeek, t('supervise.cpuCoreWeek'))
      initPieChart(cpuUserTodayRef.value, data.value.cpuUserDay, t('supervise.cpuUserToday'))
      initPieChart(cpuUserWeekRef.value, data.value.cpuUserWeek, t('supervise.cpuUserWeek'))
      initPieChart(diskRef.value, data.value.hardware, t('supervise.diskUsage'))
      initPieChart(memMaxRef.value, data.value.memMax, t('supervise.memMax'))
      initPieChart(memMinRef.value, data.value.memMin, t('supervise.memMin'))
      initPieChart(memMeanRef.value, data.value.memMean, t('supervise.memMean'))
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

// Handle resize
const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  charts.forEach(chart => chart.dispose())
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.sys-info2-container {
  padding: 20px;
  min-height: 100%;
}

.realtime-card,
.pie-card {
  background: #242836;
  border: 1px solid #2a2f3d;
  border-radius: 8px;
  margin-bottom: 20px;

  :deep(.el-card__header) {
    padding: 12px 20px;
    border-bottom: 1px solid #2a2f3d;
  }
}

.card-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  &.small {
    font-size: 14px;
  }
}

.chart-container {
  .chart-area {
    width: 100%;
    height: 280px;
  }
}

.pie-card {
  &.small {
    :deep(.el-card__header) {
      padding: 10px 16px;
    }
  }
}

.pie-chart {
  width: 100%;
  height: 200px;
}

.pie-chart-small {
  width: 100%;
  height: 150px;
}
</style>
