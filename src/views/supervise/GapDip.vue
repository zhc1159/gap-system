<!-- ===========================================
     GapDip.vue - GAP Device IP Monitor
     =========================================== -->

<template>
  <div class="gap-dip-container">
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

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="tableData"
        v-loading="loading"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        stripe
      >
        <el-table-column
          prop="serverIp"
          :label="t('supervise.serverIP')"
          width="180"
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

        <el-table-column
          prop="newSessions"
          :label="t('supervise.newSessions')"
          width="150"
        >
          <template #default="{ row }">
            {{ formatNumber(row.newSessions) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GapDipItem } from '@/types/supervise/gapDip'

const { t } = useI18n()

// Filter form
const filterForm = reactive({
  timeRange: '10min',
  region: 'internal'
})

// Data
const tableData = ref<GapDipItem[]>([])
const loading = ref(false)

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
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

// Format number
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', name: 'Server-1', status: 'active', ip: '192.168.1.1', lastUpdate: '2024-01-15 10:00:00' },
      { id: '2', name: 'Server-2', status: 'active', ip: '192.168.1.2', lastUpdate: '2024-01-15 11:00:00' },
      { id: '3', name: 'Server-3', status: 'inactive', ip: '10.0.0.1', lastUpdate: '2024-01-15 12:00:00' }
    ]
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

// Watch filter changes
watch(filterForm, () => {
  fetchData()
}, { deep: true })

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.gap-dip-container {
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
