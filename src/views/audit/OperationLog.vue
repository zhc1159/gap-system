<!-- ===========================================
     OperationLog.vue - Operation Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.operation.title')"
      titleEn="Operation Logs"
      :icon="DocumentCopy"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.operation.operator')">
        <el-input v-model="searchForm.operator" placeholder="操作人" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item :label="t('audit.operation.module')">
        <el-select v-model="searchForm.module" :placeholder="t('common.all')" clearable style="width: 140px">
          <el-option label="系统管理" value="system" />
          <el-option label="权限管理" value="authority" />
          <el-option label="安全策略" value="security" />
          <el-option label="审计日志" value="audit" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('audit.operation.action')">
        <el-select v-model="searchForm.action" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option label="创建" value="create" />
          <el-option label="修改" value="update" />
          <el-option label="删除" value="delete" />
          <el-option label="登录" value="login" />
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
    >
      <template #module="{ row }">
        <el-tag type="info" size="small">{{ getModuleLabel(row.module) }}</el-tag>
      </template>
      <template #action="{ row }">
        <el-tag :type="getActionTagType(row.action)" size="small">
          {{ getActionLabel(row.action) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
          {{ row.status ? '成功' : '失败' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleViewDetail(row)">详情</el-button>
      </template>
    </CommonTable>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" title="操作详情" width="550px">
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item label="操作人">{{ currentDetail.operator }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ getModuleLabel(currentDetail.module) }}</el-descriptions-item>
        <el-descriptions-item label="操作">{{ getActionLabel(currentDetail.action) }}</el-descriptions-item>
        <el-descriptions-item label="时间">{{ currentDetail.time }}</el-descriptions-item>
        <el-descriptions-item label="IP">{{ currentDetail.ip }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentDetail.status ? 'success' : 'danger'" size="small">
            {{ currentDetail.status ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详情" :span="2">{{ currentDetail.detail }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { DocumentCopy } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({ operator: '', module: '', action: '' })

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Detail dialog
const detailVisible = ref(false)
const currentDetail = ref<any>(null)

// Table columns
const columns: TableColumn[] = [
  { prop: 'time', label: '操作时间', width: 170, type: 'datetime' },
  { prop: 'operator', label: '操作人', width: 100 },
  { prop: 'module', label: '模块', width: 100 },
  { prop: 'action', label: '操作', width: 90 },
  { prop: 'detail', label: '详情', minWidth: 200, showOverflowTooltip: true },
  { prop: 'ip', label: 'IP', width: 140 },
  { prop: 'status', label: '状态', width: 80 }
]

// Mock data
function generateMockData(): any[] {
  const operators = ['admin', 'sysadm', 'auditor']
  const modules = ['system', 'authority', 'security', 'audit']
  const actions = ['create', 'update', 'delete', 'login']
  const details = ['修改系统配置', '添加用户', '删除客户端', '登录系统', '导出日志']

  return Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    operator: operators[Math.floor(Math.random() * operators.length)],
    module: modules[Math.floor(Math.random() * modules.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    detail: details[Math.floor(Math.random() * details.length)],
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    status: Math.random() > 0.1
  }))
}

// Get labels
function getModuleLabel(m: string): string {
  return { system: '系统管理', authority: '权限管理', security: '安全策略', audit: '审计日志' }[m] || m
}
function getActionLabel(a: string): string {
  return { create: '创建', update: '修改', delete: '删除', login: '登录' }[a] || a
}
function getActionTagType(a: string): 'success' | 'warning' | 'danger' | 'primary' | 'info' {
  return { create: 'success', update: 'warning', delete: 'danger', login: 'primary' }[a] as 'success' | 'warning' | 'danger' | 'primary' | 'info' || 'info'
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.operator) data = data.filter(i => i.operator.includes(searchForm.operator))
    if (searchForm.module) data = data.filter(i => i.module === searchForm.module)
    if (searchForm.action) data = data.filter(i => i.action === searchForm.action)
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleViewDetail(row: any) { currentDetail.value = row; detailVisible.value = true }
function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { operator: '', module: '', action: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
