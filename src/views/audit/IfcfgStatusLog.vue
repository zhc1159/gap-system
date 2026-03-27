<!-- ===========================================
     IfcfgStatusLog.vue - Interface Config Status Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.ifcfgStatus.title')"
      titleEn="Interface Status Logs"
      :icon="Connection"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('common.time')">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
        />
      </el-form-item>
    </SearchBar>

    <!-- Table -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #region="{ row }">
        <el-tag :type="row.region.includes('in') ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.region.includes('in') ? t('audit.ifcfgStatus.internal') : t('audit.ifcfgStatus.external') }}
        </el-tag>
      </template>
      <template #describe="{ row }">
        <pre class="log-content">{{ row.describe }}</pre>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  dateRange: null as [Date, Date] | null
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Table columns - Simplified 3 columns
const columns: TableColumn[] = [
  { prop: 'date', label: '时间', width: 180, type: 'datetime' },
  { prop: 'region', label: '区域', width: 120 },
  { prop: 'describe', label: '日志内容', minWidth: 500 }
]

// Mock data generator
function generateMockData(): any[] {
  const regions = ['internal', 'external', 'intra', 'extra']
  const configs = [
    'eth0: Link Up - 1000Mbps Full Duplex\nIP: 192.168.1.100\nNetmask: 255.255.255.0\nGateway: 192.168.1.1',
    'eth1: Link Down\nInterface disabled',
    'eth2: Link Up - 100Mbps Full Duplex\nIP: 10.0.0.50\nNetmask: 255.255.0.0',
    'lo: Loopback\nIP: 127.0.0.1\nStatus: Running'
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
    region: regions[Math.floor(Math.random() * regions.length)],
    describe: configs[Math.floor(Math.random() * configs.length)]
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { searchForm.dateRange = null; handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.log-content {
  margin: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #67c23a;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
