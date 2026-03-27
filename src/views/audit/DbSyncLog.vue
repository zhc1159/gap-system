<!-- ===========================================
     DbSyncLog.vue - Database Sync Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.dbSync.title')"
      titleEn="Database Sync Logs"
      :icon="Coin"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.dbSync.ip')">
        <el-input v-model="searchForm.dbIp" :placeholder="t('audit.dbSync.ipPlaceholder')" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('audit.dbSync.direction')">
        <el-select v-model="searchForm.direction" :placeholder="t('common.all')" clearable style="width: 140px">
          <el-option :label="t('audit.dbSync.sourceDB')" value="0" />
          <el-option :label="t('audit.dbSync.destDB')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.result" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option :label="t('common.failed')" value="0" />
          <el-option :label="t('common.success')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.dbSync.dbType')">
        <el-select v-model="searchForm.dbType" :placeholder="t('common.all')" clearable style="width: 140px">
          <el-option label="MySQL" value="mysql" />
          <el-option label="SQLServer" value="sqlserver" />
          <el-option label="Oracle" value="oracle" />
          <el-option label="PostgreSQL" value="postgresql" />
          <el-option label="DB2" value="db2" />
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
      <template #region="{ row }">
        <el-tag :type="row.region === 'internal' ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.region === 'internal' ? t('audit.dbSync.internal') : t('audit.dbSync.external') }}
        </el-tag>
      </template>
      <template #direction="{ row }">
        {{ row.direction === '0' ? t('audit.dbSync.sourceDB') : t('audit.dbSync.destDB') }}
      </template>
      <template #result="{ row }">
        <el-tag :type="row.result === 1 ? 'success' : 'danger'" size="small" effect="dark">
          {{ row.result === 1 ? t('common.success') : t('common.failed') }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleViewDetail(row)">
          <el-icon><View /></el-icon>
          {{ t('common.detail') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" :title="t('common.detail')" width="600px">
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item :label="t('audit.dbSync.time')">{{ currentDetail.date }}</el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.region')">
          <el-tag :type="currentDetail.region === 'internal' ? 'success' : 'danger'" size="small" effect="dark">
            {{ currentDetail.region === 'internal' ? t('audit.dbSync.internal') : t('audit.dbSync.external') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.dbType')">{{ currentDetail.type }}</el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.direction')">
          {{ currentDetail.direction === '0' ? t('audit.dbSync.sourceDB') : t('audit.dbSync.destDB') }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.ip')">{{ currentDetail.ip }}</el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.database')">{{ currentDetail.db }}</el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.operation')">{{ currentDetail.operate }}</el-descriptions-item>
        <el-descriptions-item :label="t('common.status')">
          <el-tag :type="currentDetail.result === 1 ? 'success' : 'danger'" size="small" effect="dark">
            {{ currentDetail.result === 1 ? t('common.success') : t('common.failed') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('audit.dbSync.description')" :span="2">{{ currentDetail.describe }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Coin, View } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  dbIp: '',
  direction: '',
  result: '',
  dbType: ''
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

// Detail dialog
const detailVisible = ref(false)
const currentDetail = ref<any>(null)

// Table columns
const columns: TableColumn[] = [
  { prop: 'date', label: '时间', width: 170, type: 'datetime' },
  { prop: 'region', label: '区域', width: 100 },
  { prop: 'type', label: '数据库类型', width: 120 },
  { prop: 'direction', label: '方向', width: 120 },
  { prop: 'ip', label: 'IP地址', width: 140 },
  { prop: 'db', label: '数据库', width: 120 },
  { prop: 'operate', label: '操作', width: 100 },
  { prop: 'result', label: '结果', width: 100 }
]

// Mock data generator
function generateMockData(): any[] {
  const dbTypes = ['mysql', 'sqlserver', 'oracle', 'postgresql', 'db2']
  const operations = ['同步', '备份', '恢复', '迁移']
  const regions = ['internal', 'external']
  const directions = ['0', '1']

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    region: regions[Math.floor(Math.random() * regions.length)],
    type: dbTypes[Math.floor(Math.random() * dbTypes.length)],
    direction: directions[Math.floor(Math.random() * directions.length)],
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    db: `db_${Math.floor(Math.random() * 100)}`,
    operate: operations[Math.floor(Math.random() * operations.length)],
    result: Math.random() > 0.2 ? 1 : 0,
    describe: '数据库同步操作完成'
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.dbIp) data = data.filter(i => i.ip.includes(searchForm.dbIp))
    if (searchForm.direction) data = data.filter(i => i.direction === searchForm.direction)
    if (searchForm.result) data = data.filter(i => String(i.result) === searchForm.result)
    if (searchForm.dbType) data = data.filter(i => i.type === searchForm.dbType)
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleViewDetail(row: any) { currentDetail.value = row; detailVisible.value = true }
function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { dbIp: '', direction: '', result: '', dbType: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }
function handleSelectionChange(rows: any[]) { selectedRows.value = rows }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
