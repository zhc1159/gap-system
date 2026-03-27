<!-- ===========================================
     AttackLog.vue - Anti-Attack Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.attack.title')"
      titleEn="Anti-Attack Logs"
      :icon="Lock"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.attack.attackType')">
        <el-select v-model="searchForm.attackType" :placeholder="t('common.all')" clearable style="width: 150px">
          <el-option label="SQL注入" value="sql_injection" />
          <el-option label="XSS攻击" value="xss" />
          <el-option label="DDoS攻击" value="ddos" />
          <el-option label="暴力破解" value="brute_force" />
          <el-option label="CSRF攻击" value="csrf" />
          <el-option label="命令注入" value="command_injection" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.attack.sourceIP')">
        <el-input v-model="searchForm.sourceIP" :placeholder="t('audit.attack.sourceIP')" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('common.time')">
        <el-date-picker
          v-model="searchForm.timeRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.blocked" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option :label="t('audit.attack.blocked')" :value="true" />
          <el-option :label="t('audit.attack.passed')" :value="false" />
        </el-select>
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
      @sort-change="handleSortChange"
    >
      <template #attackType="{ row }">
        <el-tag :type="getAttackTagType(row.attackType)" size="small">
          {{ getAttackTypeLabel(row.attackType) }}
        </el-tag>
      </template>
      <template #blocked="{ row }">
        <StatusTag :status="row.blocked" />
      </template>
      <template #severity="{ row }">
        <el-tag :type="getSeverityTagType(row.severity)" size="small" effect="dark">
          {{ getSeverityLabel(row.severity) }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleViewDetail(row)">
          <el-icon><View /></el-icon>
          {{ t('common.detail') || '详情' }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" :title="t('common.detail') || '攻击详情'" width="600px">
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item :label="t('audit.attack.attackType')">
          <el-tag :type="getAttackTagType(currentDetail.attackType)">
            {{ getAttackTypeLabel(currentDetail.attackType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.attack.sourceIP')">
          {{ currentDetail.sourceIP }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.attack.targetIP')">
          {{ currentDetail.targetIP }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.attack.attackTime')">
          {{ currentDetail.attackTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.attack.blocked')">
          <StatusTag :status="currentDetail.blocked" />
        </el-descriptions-item>
        <el-descriptions-item label="威胁等级">
          <el-tag :type="getSeverityTagType(currentDetail.severity)" effect="dark">
            {{ getSeverityLabel(currentDetail.severity) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="攻击URL" :span="2">
          {{ currentDetail.url }}
        </el-descriptions-item>
        <el-descriptions-item label="攻击载荷" :span="2">
          <el-input type="textarea" :rows="3" :model-value="currentDetail.payload" readonly />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Lock, View } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  attackType: '',
  sourceIP: '',
  timeRange: null as [Date, Date] | null,
  blocked: null as boolean | null
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

// Detail dialog
const detailVisible = ref(false)
const currentDetail = ref<any>(null)

// Table columns
const columns: TableColumn[] = [
  { prop: 'attackTime', label: '攻击时间', width: 170, sortable: true, type: 'datetime' },
  { prop: 'attackType', label: '攻击类型', width: 120 },
  { prop: 'sourceIP', label: '源IP', width: 140 },
  { prop: 'targetIP', label: '目标IP', width: 140 },
  { prop: 'url', label: '攻击URL', minWidth: 200, showOverflowTooltip: true },
  { prop: 'severity', label: '威胁等级', width: 100 },
  { prop: 'blocked', label: '处理状态', width: 100 }
]

// Mock data generator
function generateMockData(): any[] {
  const attackTypes = ['sql_injection', 'xss', 'ddos', 'brute_force', 'csrf', 'command_injection']
  const urls = [
    '/api/login',
    '/api/users',
    '/api/config',
    '/admin/settings',
    '/search?q=test',
    '/api/data/export'
  ]

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    attackTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
    sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    targetIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    url: urls[Math.floor(Math.random() * urls.length)],
    severity: Math.floor(Math.random() * 3) + 1, // 1-3
    blocked: Math.random() > 0.3,
    payload: 'UNION SELECT * FROM users--'
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const mockData = generateMockData()
    let filtered = [...mockData]

    // Apply filters
    if (searchForm.attackType) {
      filtered = filtered.filter(item => item.attackType === searchForm.attackType)
    }
    if (searchForm.sourceIP) {
      filtered = filtered.filter(item => item.sourceIP.includes(searchForm.sourceIP))
    }
    if (searchForm.blocked !== null) {
      filtered = filtered.filter(item => item.blocked === searchForm.blocked)
    }

    total.value = filtered.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = filtered.slice(start, start + pagination.limit)
    loading.value = false
  }, 500)
}

// Get attack type label
function getAttackTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    sql_injection: 'SQL注入',
    xss: 'XSS攻击',
    ddos: 'DDoS攻击',
    brute_force: '暴力破解',
    csrf: 'CSRF攻击',
    command_injection: '命令注入'
  }
  return labels[type] || type
}

// Get attack tag type
function getAttackTagType(type: string): 'danger' | 'warning' | 'info' {
  const types: Record<string, 'danger' | 'warning' | 'info'> = {
    sql_injection: 'danger',
    xss: 'warning',
    ddos: 'danger',
    brute_force: 'warning',
    csrf: 'warning',
    command_injection: 'danger'
  }
  return types[type] || 'info'
}

// Get severity label
function getSeverityLabel(severity: number): string {
  const labels: Record<number, string> = {
    1: '低',
    2: '中',
    3: '高'
  }
  return labels[severity] || '未知'
}

// Get severity tag type
function getSeverityTagType(severity: number): 'success' | 'warning' | 'danger' {
  const types: Record<number, 'success' | 'warning' | 'danger'> = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return types[severity] || 'warning'
}

// Handlers
function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  searchForm.attackType = ''
  searchForm.sourceIP = ''
  searchForm.timeRange = null
  searchForm.blocked = null
  handleSearch()
}

function handlePageChange(page: number, limit: number) {
  pagination.page = page
  pagination.limit = limit
  fetchData()
}

function handleSortChange({ prop, order }: { prop: string; order: string | null }) {
  console.log('Sort:', prop, order)
  fetchData()
}

function handleViewDetail(row: any) {
  currentDetail.value = row
  detailVisible.value = true
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
