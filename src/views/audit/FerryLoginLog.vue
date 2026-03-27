<!-- ===========================================
     FerryLoginLog.vue - Ferry Login Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.ferryLogin.title')"
      titleEn="Ferry Login Logs"
      :icon="User"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.ferryLogin.user')">
        <el-input v-model="searchForm.userName" :placeholder="t('audit.ferryLogin.userPlaceholder')" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item :label="t('audit.ferryLogin.ip')">
        <el-input v-model="searchForm.protocol" :placeholder="t('audit.ferryLogin.ipPlaceholder')" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.result" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option :label="t('common.failed')" value="0" />
          <el-option :label="t('common.success')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.ferryLogin.description')">
        <el-input v-model="searchForm.describ" :placeholder="t('audit.ferryLogin.descPlaceholder')" clearable style="width: 180px" />
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
          {{ row.REGION === 'internal' ? t('audit.ferryLogin.internal') : t('audit.ferryLogin.external') }}
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
import { User } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  userName: '',
  protocol: '',
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
  { prop: 'DATE', label: '时间', width: 170, type: 'datetime' },
  { prop: 'REGION', label: '区域', width: 100 },
  { prop: 'USER', label: '用户', width: 120 },
  { prop: 'IP', label: 'IP地址', width: 140 },
  { prop: 'OPERATE', label: '操作', width: 100 },
  { prop: 'RESULT', label: '结果', width: 100 },
  { prop: 'DESCRIBE', label: '描述', minWidth: 200 }
]

// Mock data generator
function generateMockData(): any[] {
  const users = ['admin', 'sysadm', 'auditor', 'user1', 'user2']
  const operations = ['登录', '注销', '认证']
  const regions = ['internal', 'external']

  return Array.from({ length: 80 }, (_, i) => ({
    ID: i + 1,
    DATE: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    REGION: regions[Math.floor(Math.random() * regions.length)],
    USER: users[Math.floor(Math.random() * users.length)],
    IP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    OPERATE: operations[Math.floor(Math.random() * operations.length)],
    RESULT: Math.random() > 0.15 ? 1 : 0,
    DESCRIBE: '文件摆渡系统登录操作日志记录'
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.userName) data = data.filter(i => i.USER.includes(searchForm.userName))
    if (searchForm.protocol) data = data.filter(i => i.IP.includes(searchForm.protocol))
    if (searchForm.result) data = data.filter(i => String(i.RESULT) === searchForm.result)
    if (searchForm.describ) data = data.filter(i => i.DESCRIBE.includes(searchForm.describ))
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { userName: '', protocol: '', result: '', describ: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }
function handleSelectionChange(rows: any[]) { selectedRows.value = rows }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
