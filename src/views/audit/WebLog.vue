<!-- ===========================================
     WebLog.vue - Web Access Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.web.title')"
      titleEn="Web Logs"
      :icon="Document"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item label="请求URL">
        <el-input v-model="searchForm.url" placeholder="输入URL关键词" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item :label="t('audit.web.method')">
        <el-select v-model="searchForm.method" :placeholder="t('common.all')" clearable style="width: 100px">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.web.statusCode')">
        <el-select v-model="searchForm.statusCode" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option label="2xx (成功)" value="2xx" />
          <el-option label="4xx (客户端错误)" value="4xx" />
          <el-option label="5xx (服务器错误)" value="5xx" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.web.clientIP')">
        <el-input v-model="searchForm.clientIP" placeholder="客户端IP" clearable style="width: 140px" />
      </el-form-item>
    </SearchBar>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">总请求数</span>
      </div>
      <div class="stat-item success">
        <span class="stat-value">{{ stats.success }}</span>
        <span class="stat-label">成功请求</span>
      </div>
      <div class="stat-item danger">
        <span class="stat-value">{{ stats.error }}</span>
        <span class="stat-label">错误请求</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.avgTime }}ms</span>
        <span class="stat-label">平均响应</span>
      </div>
    </div>

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
      <template #method="{ row }">
        <el-tag :type="getMethodTagType(row.method)" size="small" effect="plain">
          {{ row.method }}
        </el-tag>
      </template>
      <template #statusCode="{ row }">
        <el-tag :type="getStatusCodeTagType(row.statusCode)" size="small">
          {{ row.statusCode }}
        </el-tag>
      </template>
      <template #responseTime="{ row }">
        <span :class="getResponseTimeClass(row.responseTime)">
          {{ row.responseTime }}ms
        </span>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  url: '',
  method: '',
  statusCode: '',
  clientIP: ''
})

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10
})

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Stats
const stats = computed(() => {
  const data = tableData.value
  return {
    total: 12580,
    success: data.filter(d => d.statusCode < 300).length * 10,
    error: data.filter(d => d.statusCode >= 400).length * 10,
    avgTime: Math.round(data.reduce((sum, d) => sum + d.responseTime, 0) / data.length) || 0
  }
})

// Table columns
const columns: TableColumn[] = [
  { prop: 'timestamp', label: '访问时间', width: 170, type: 'datetime' },
  { prop: 'method', label: '方法', width: 80 },
  { prop: 'url', label: '请求URL', minWidth: 250, showOverflowTooltip: true },
  { prop: 'statusCode', label: '状态码', width: 90 },
  { prop: 'responseTime', label: '响应时间', width: 100 },
  { prop: 'clientIP', label: '客户端IP', width: 140 }
]

// Mock data generator
function generateMockData(): any[] {
  const methods = ['GET', 'GET', 'GET', 'POST', 'PUT', 'DELETE']
  const urls = ['/api/users', '/api/login', '/api/config', '/api/data', '/api/status']
  const statusCodes = [200, 200, 200, 201, 400, 401, 403, 404, 500]

  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString(),
    method: methods[Math.floor(Math.random() * methods.length)],
    url: urls[Math.floor(Math.random() * urls.length)],
    statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
    responseTime: Math.floor(Math.random() * 500) + 10,
    clientIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const mockData = generateMockData()
    let filtered = [...mockData]

    if (searchForm.url) {
      filtered = filtered.filter(item => item.url.includes(searchForm.url))
    }
    if (searchForm.method) {
      filtered = filtered.filter(item => item.method === searchForm.method)
    }
    if (searchForm.statusCode) {
      filtered = filtered.filter(item => {
        if (searchForm.statusCode === '2xx') return item.statusCode >= 200 && item.statusCode < 300
        if (searchForm.statusCode === '4xx') return item.statusCode >= 400 && item.statusCode < 500
        if (searchForm.statusCode === '5xx') return item.statusCode >= 500
        return true
      })
    }
    if (searchForm.clientIP) {
      filtered = filtered.filter(item => item.clientIP.includes(searchForm.clientIP))
    }

    total.value = filtered.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = filtered.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

// Get method tag type
function getMethodTagType(method: string): 'primary' | 'success' | 'warning' | 'danger' {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
    GET: 'primary', POST: 'success', PUT: 'warning', DELETE: 'danger'
  }
  return types[method] || 'primary'
}

// Get status code tag type
function getStatusCodeTagType(code: number): 'success' | 'warning' | 'danger' {
  if (code >= 200 && code < 300) return 'success'
  if (code >= 400 && code < 500) return 'warning'
  return 'danger'
}

// Get response time class
function getResponseTimeClass(time: number): string {
  if (time < 100) return 'time-fast'
  if (time < 300) return 'time-normal'
  return 'time-slow'
}

// Handlers
function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  Object.assign(searchForm, { url: '', method: '', statusCode: '', clientIP: '' })
  handleSearch()
}

function handlePageChange(page: number, limit: number) {
  pagination.page = page
  pagination.limit = limit
  fetchData()
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.stats-row {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: $spacing-md $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  min-width: 120px;

  &.success { .stat-value { color: $success-color; } }
  &.danger { .stat-value { color: $danger-color; } }

  .stat-value {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $text-primary;
  }

  .stat-label {
    font-size: $font-size-xs;
    color: $text-muted;
    margin-top: 4px;
  }
}

.time-fast { color: $success-color; }
.time-normal { color: $warning-color; }
.time-slow { color: $danger-color; }
</style>
