<!-- ===========================================
     GapIneth.vue - Internal Network Interface Monitor
     =========================================== -->

<template>
  <div class="gap-ineth-container">
    <!-- Filter -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline>
        <el-form-item :label="t('supervise.timeRange')">
          <el-select v-model="filterForm.timeRange" class="time-select">
            <el-option :label="t('supervise.10min')" value="10min" />
            <el-option :label="t('supervise.1hour')" value="1hour" />
            <el-option :label="t('supervise.1day')" value="1day" />
            <el-option :label="t('supervise.1week')" value="1week" />
            <el-option :label="t('supervise.1month')" value="1month" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('supervise.region')">
          <el-select v-model="filterForm.region" class="region-select">
            <el-option :label="t('supervise.internal')" value="internal" />
            <el-option :label="t('supervise.external')" value="external" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Chart -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><TrendCharts /></el-icon>
          <span>{{ t('supervise.interfaceTraffic') }}</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-area"></div>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="tableData"
        v-loading="loading"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        @current-change="handleCurrentChange"
        highlight-current-row
      >
        <el-table-column width="55">
          <template #default="{ row }">
            <el-radio v-model="selectedInterface" :value="row.ethName">
              {{ '' }}
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column
          prop="ethName"
          :label="t('supervise.interfaceName')"
        />

        <el-table-column
          prop="txBytes"
          :label="t('supervise.txBytes')"
          width="150"
        >
          <template #default="{ row }">
            {{ formatBytes(row.txBytes) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="rxBytes"
          :label="t('supervise.rxBytes')"
          width="150"
        >
          <template #default="{ row }">
            {{ formatBytes(row.rxBytes) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="totalBytes"
          :label="t('supervise.totalBytes')"
          width="150"
        >
          <template #default="{ row }">
            {{ formatBytes(row.totalBytes) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
// Local interface extending the base type
interface GapInethRow {
  id: string
  ethName: string
  ip: string
  status: string
  rxBytes: number
  txBytes: number
  totalBytes: number
}

const { t } = useI18n()

// Refs
const chartRef = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

// Filter form
const filterForm = reactive({
  timeRange: '10min',
  region: 'internal'
})

// Data
const tableData = ref<GapInethRow[]>([])
const loading = ref(false)
const selectedInterface = ref<string>('')
const chartData = ref<any>(null)

// Table styles
const headerStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  fontWeight: 'bold'
}

const cellStyle = {
  background: '#242836',
  color: '#ffffff'
}

// Format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

// Initialize chart
const initChart = () => {
  if (!chartRef.value || !chartData.value) return

  chart = echarts.init(chartRef.value)
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
      data: chartData.value.datasets?.map((d: any) => d.label) || [],
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
      data: chartData.value.labels || []
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: (chartData.value.datasets || []).map((dataset: any, index: number) => ({
      name: dataset.label,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: dataset.data,
      lineStyle: { color: colors[index % colors.length], width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${colors[index % colors.length]}40` },
          { offset: 1, color: `${colors[index % colors.length]}10` }
        ])
      }
    }))
  }
  chart.setOption(option)
}

// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', ethName: 'eth0', ip: '192.168.1.1', status: 'UP', rxBytes: 1048576, txBytes: 2097152, totalBytes: 3145728 },
      { id: '2', ethName: 'eth1', ip: '10.0.0.1', status: 'UP', rxBytes: 524288, txBytes: 1048576, totalBytes: 1572864 },
      { id: '3', ethName: 'eth2', ip: '172.16.0.1', status: 'DOWN', rxBytes: 0, txBytes: 0, totalBytes: 0 }
    ]
    chartData.value = {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [
        { label: 'eth0 TX', data: [10, 15, 20, 25, 30, 20] },
        { label: 'eth0 RX', data: [5, 8, 12, 15, 18, 12] }
      ]
    }

    if (!selectedInterface.value && tableData.value.length > 0) {
      selectedInterface.value = tableData.value[0].ethName
    }

    initChart()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

// Handle current change
const handleCurrentChange = (row: GapInethRow | null) => {
  if (row) {
    selectedInterface.value = row.ethName
  }
}

// Watch filter changes
watch(filterForm, () => {
  fetchData()
}, { deep: true })

// Handle resize
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.gap-ineth-container {
  padding: 20px;
  min-height: 100%;
}

.filter-card {
  background: #242836;
  border: 1px solid #2a2f3d;
  margin-bottom: 20px;

  .time-select,
  .region-select {
    width: 120px;
  }
}

.chart-card {
  background: #242836;
  border: 1px solid #2a2f3d;
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

.chart-area {
  width: 100%;
  height: 280px;
}

.table-card {
  background: #242836;
  border: 1px solid #2a2f3d;

  :deep(.el-table) {
    background: transparent;

    .el-table__header-wrapper th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .el-table__body-wrapper {
      tr:hover > td {
        background: #2a2f3d !important;
      }

      tr.current-row > td {
        background: #3a3f4d !important;
      }
    }

    .el-table__empty-block {
      background: transparent;
    }
  }
}
</style>
