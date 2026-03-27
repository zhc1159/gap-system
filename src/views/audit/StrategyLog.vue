<!-- ===========================================
     StrategyLog.vue - Strategy Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.strategy.title')"
      titleEn="Strategy Logs"
      :icon="Grid"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.strategy.user')">
        <el-input v-model="searchForm.userName" :placeholder="t('audit.strategy.userPlaceholder')" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item :label="t('audit.strategy.protocol')">
        <el-input v-model="searchForm.protocol" :placeholder="t('audit.strategy.protocolPlaceholder')" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item :label="t('audit.strategy.ip')">
        <el-input v-model="searchForm.ip" :placeholder="t('audit.strategy.ipPlaceholder')" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.result" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option :label="t('common.failed')" value="0" />
          <el-option :label="t('common.success')" value="1" />
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
      selectable
      @selection-change="handleSelectionChange"
    >
      <template #REGION="{ row }">
        <el-tag :type="row.REGION === 'internal' ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.REGION === 'internal' ? t('audit.strategy.internal') : t('audit.strategy.external') }}
        </el-tag>
      </template>
      <template #RESULT="{ row }">
        <el-tag :type="row.RESULT === 1 ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.RESULT === 1 ? t('common.success') : t('common.failed') }}
        </el-tag>
      </template>
      <template #DESCRIBE="{ row }">
        <el-tooltip v-if="row.DESCRIBE && row.DESCRIBE.length > 50" :content="row.DESCRIBE" placement="top">
          <span>{{ row.DESCRIBE.slice(0, 50) + '...' }}</span>
        </el-tooltip>
        <span v-else>{{ row.DESCRIBE }}</span>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Grid } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  userName: '',
  protocol: '',
  ip: '',
  result: ''
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

// Table columns - 10 columns with dual address fields
const columns: TableColumn[] = [
  { prop: 'DATE', label: '时间', width: 160, type: 'datetime' },
  { prop: 'REGION', label: '区域', width: 90 },
  { prop: 'USER', label: '用户', width: 100 },
  { prop: 'SIP', label: '源地址', width: 130 },
  { prop: 'DIP', label: '目的地址', width: 130 },
  { prop: 'PROTOCOL', label: '协议', width: 90 },
  { prop: 'OPERATE', label: '操作', width: 90 },
  { prop: 'RESULT', label: '结果', width: 90 },
  { prop: 'DESCRIBE', label: '描述', minWidth: 180 }
]

// Mock data generator
function generateMockData(): any[] {
  const users = ['admin', 'sysadm', 'auditor', 'user1']
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'FTP']
  const operations = ['启用', '禁用', '修改', '创建', '删除']
  const regions = ['internal', 'external']

  return Array.from({ length: 100 }, (_, i) => ({
    ID: i + 1,
    DATE: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    REGION: regions[Math.floor(Math.random() * regions.length)],
    USER: users[Math.floor(Math.random() * users.length)],
    SIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    DIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    PROTOCOL: protocols[Math.floor(Math.random() * protocols.length)],
    OPERATE: operations[Math.floor(Math.random() * operations.length)],
    RESULT: Math.random() > 0.15 ? 1 : 0,
    DESCRIBE: '策略操作日志记录，记录防火墙、ACL等策略的操作'
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.userName) data = data.filter(i => i.USER.includes(searchForm.userName))
    if (searchForm.protocol) data = data.filter(i => i.PROTOCOL.toLowerCase().includes(searchForm.protocol.toLowerCase()))
    if (searchForm.ip) data = data.filter(i => i.SIP.includes(searchForm.ip) || i.DIP.includes(searchForm.ip))
    if (searchForm.result) data = data.filter(i => String(i.RESULT) === searchForm.result)
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { userName: '', protocol: '', ip: '', result: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }
function handleSelectionChange(rows: any[]) { selectedRows.value = rows }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
