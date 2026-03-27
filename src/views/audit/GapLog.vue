<!-- ===========================================
     GapLog.vue - GAP System Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.gapLog.title')"
      titleEn="GAP System Logs"
      :icon="Document"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.gapLog.user')">
        <el-select v-model="searchForm.userId" :placeholder="t('common.all')" clearable style="width: 140px">
          <el-option v-for="user in userList" :key="user.value" :label="user.label" :value="user.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.result" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option :label="t('common.failed')" value="0" />
          <el-option :label="t('common.success')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.gapLog.description')">
        <el-input v-model="searchForm.describ" :placeholder="t('audit.gapLog.descPlaceholder')" clearable style="width: 180px" />
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
      selectable
      @selection-change="handleSelectionChange"
    >
      <template #region="{ row }">
        <el-tag :type="row.region === 'internal' ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.region === 'internal' ? t('audit.gapLog.internal') : t('audit.gapLog.external') }}
        </el-tag>
      </template>
      <template #result="{ row }">
        <el-tag :type="row.result === 1 ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.result === 1 ? t('common.success') : t('common.failed') }}
        </el-tag>
      </template>
      <template #describe="{ row }">
        <el-tooltip v-if="row.describe && row.describe.length > 50" :content="row.describe" placement="top">
          <span>{{ row.describe.slice(0, 50) + '...' }}</span>
        </el-tooltip>
        <span v-else>{{ row.describe }}</span>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// User list
const userList = ref([
  { label: 'admin', value: 'admin' },
  { label: 'sysadm', value: 'sysadm' },
  { label: 'auditor', value: 'auditor' },
  { label: 'user1', value: 'user1' }
])

// Search form
const searchForm = reactive({
  userId: '',
  result: '',
  describ: ''
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

// Table columns
const columns: TableColumn[] = [
  { prop: 'date', label: '时间', width: 170, type: 'datetime' },
  { prop: 'sip', label: '源IP', width: 140 },
  { prop: 'region', label: '区域', width: 100 },
  { prop: 'user', label: '用户', width: 120 },
  { prop: 'result', label: '结果', width: 100 },
  { prop: 'describe', label: '描述', minWidth: 200 },
  { prop: 'model', label: '失败原因', width: 150 }
]

// Mock data generator
function generateMockData(): any[] {
  const users = ['admin', 'sysadm', 'auditor', 'user1']
  const regions = ['internal', 'external']
  const descriptions = ['系统登录', '配置修改', '日志导出', '用户管理', '策略更新']
  const failReasons = ['', '', '', '', '认证失败', '权限不足', '会话超时']

  return Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    sip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    region: regions[Math.floor(Math.random() * regions.length)],
    user: users[Math.floor(Math.random() * users.length)],
    result: Math.random() > 0.2 ? 1 : 0,
    describe: descriptions[Math.floor(Math.random() * descriptions.length)],
    model: failReasons[Math.floor(Math.random() * failReasons.length)]
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.userId) data = data.filter(i => i.user === searchForm.userId)
    if (searchForm.result) data = data.filter(i => String(i.result) === searchForm.result)
    if (searchForm.describ) data = data.filter(i => i.describe.includes(searchForm.describ))
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { userId: '', result: '', describ: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }
function handleSelectionChange(rows: any[]) { selectedRows.value = rows }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
