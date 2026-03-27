<!-- ===========================================
     GapFileSync.vue - File Sync Monitor
     =========================================== -->

<template>
  <div class="gap-file-sync-container">
    <!-- Filter -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline>
        <el-form-item :label="t('supervise.direction')">
          <el-select v-model="filterForm.direction" class="direction-select">
            <el-option :label="t('supervise.outbound')" value="outbound" />
            <el-option :label="t('supervise.inbound')" value="inbound" />
            <el-option :label="t('supervise.sync')" value="sync" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Chart -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><TrendCharts /></el-icon>
          <span>{{ t('supervise.fileSyncSuccessCount') }}</span>
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
        @sort-change="handleSortChange"
      >
        <el-table-column
          prop="name"
          :label="t('supervise.policyName')"
          sortable
        />

        <el-table-column
          prop="startTime"
          :label="t('supervise.startTime')"
          width="180"
          sortable
        >
          <template #default="{ row }">
            {{ formatDate(row.startTime) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="success"
          :label="t('supervise.successCount')"
          width="120"
          sortable
        >
          <template #default="{ row }">
            {{ formatNumber(row.success) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="bytes"
          :label="t('supervise.totalFileSize')"
          width="150"
        >
          <template #default="{ row }">
            {{ formatBytes(row.bytes) }}
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
// Mock data type for file sync
interface FileSyncData {
  id: string
  name: string
  startTime: string
  success: number
  bytes: number
}

const { t } = useI18n()

// Refs
const chartRef = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

// Filter form
const filterForm = reactive({
  direction: 'outbound'
})

// Data
const tableData = ref<FileSyncData[]>([])
const loading = ref(false)

// Sort params
const sortParams = reactive({
  prop: 'name',
  order: 'ascending'
})

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

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// Format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

// Format number
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Initialize chart
const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

// Update chart
const updateChart = () => {
  if (!chart) return

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#242836',
      borderColor: '#2a2f3d',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' }
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 60,
      left: 60
    },
    xAxis: {
      type: 'category',
      data: tableData.value.map(item => item.name),
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: {
        color: '#909399',
        fontSize: 10,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: t('supervise.count'),
      nameTextStyle: { color: '#909399' },
      axisLine: { lineStyle: { color: '#3a3f4d' } },
      axisLabel: { color: '#909399', fontSize: 10 },
      splitLine: { lineStyle: { color: '#2a2f3d' } }
    },
    series: [{
      type: 'bar',
      data: tableData.value.map(item => item.success),
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#667eea' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 10
      }
    }]
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
      { id: '1', name: 'Policy-A', startTime: '2024-01-15 10:00:00', success: 150, bytes: 1048576 },
      { id: '2', name: 'Policy-B', startTime: '2024-01-15 11:00:00', success: 80, bytes: 524288 },
      { id: '3', name: 'Policy-C', startTime: '2024-01-15 12:00:00', success: 200, bytes: 2097152 }
    ]
    updateChart()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

// Handle sort change
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortParams.prop = prop
  sortParams.order = order
  fetchData()
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
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.gap-file-sync-container {
  padding: 20px;
  min-height: 100%;
}

.filter-card {
  background: #242836;
  border: 1px solid #2a2f3d;
  margin-bottom: 20px;

  .direction-select {
    width: 150px;
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
  height: 350px;
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
    }

    .el-table__empty-block {
      background: transparent;
    }
  }
}
</style>
