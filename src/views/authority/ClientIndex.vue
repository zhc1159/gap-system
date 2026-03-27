<!-- ===========================================
     ClientIndex.vue - Client Management
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('menu.authority.client')"
      titleEn="Client Management"
      :icon="Connection"
    >
      <template #extra>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('common.add') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item label="客户端名称">
        <el-input v-model="searchForm.name" placeholder="名称" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="searchForm.ip" placeholder="IP地址" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('common.status')">
        <el-select v-model="searchForm.status" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option label="在线" value="online" />
          <el-option label="离线" value="offline" />
        </el-select>
      </el-form-item>
    </SearchBar>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">总客户端</span>
      </div>
      <div class="stat-item online">
        <span class="stat-value">{{ stats.online }}</span>
        <span class="stat-label">在线</span>
      </div>
      <div class="stat-item offline">
        <span class="stat-value">{{ stats.offline }}</span>
        <span class="stat-label">离线</span>
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
      <template #status="{ row }">
        <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small">
          {{ row.status === 'online' ? '在线' : '离线' }}
        </el-tag>
      </template>
      <template #lastSeen="{ row }">
        {{ formatTime(row.lastSeen) }}
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </el-button>
        <el-button type="danger" text size="small" @click="handleDelete(row)">
          {{ t('common.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px" :rules="formRules" ref="formRef">
        <el-form-item label="客户端名称" prop="name">
          <el-input v-model="form.name" placeholder="输入客户端名称" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="192.168.1.100" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="form.port" :min="1" :max="65535" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="客户端描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({ name: '', ip: '', status: '' })

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Stats
const stats = computed(() => ({
  total: 24,
  online: tableData.value.filter(d => d.status === 'online').length,
  offline: tableData.value.filter(d => d.status === 'offline').length
}))

// Dialog
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({ id: 0, name: '', ip: '', port: 8080, description: '' })

const dialogTitle = computed(() => isEdit.value ? t('common.edit') : t('common.add'))

// Form rules
const formRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
}

// Table columns
const columns: TableColumn[] = [
  { prop: 'name', label: '客户端名称', minWidth: 150 },
  { prop: 'ip', label: 'IP地址', width: 140 },
  { prop: 'port', label: '端口', width: 80 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'lastSeen', label: '最后在线', width: 170 },
  { prop: 'description', label: '描述', minWidth: 150, showOverflowTooltip: true }
]

// Mock data
function generateMockData(): any[] {
  const names = ['内网客户端A', '内网客户端B', '外网客户端C', '数据采集端', '备份服务器']
  const statuses = ['online', 'offline']

  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + '-' + (i + 1),
    ip: `192.168.${Math.floor(i / 10) + 1}.${(i % 255) + 1}`,
    port: 8080 + (i % 10),
    status: i < 8 ? 'online' : statuses[Math.floor(Math.random() * 2)],
    lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    description: '业务系统客户端'
  }))
}

// Format time
function formatTime(date: Date): string {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = generateMockData()
    if (searchForm.name) data = data.filter(i => i.name.includes(searchForm.name))
    if (searchForm.ip) data = data.filter(i => i.ip.includes(searchForm.ip))
    if (searchForm.status) data = data.filter(i => i.status === searchForm.status)
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

// Reset form
function resetForm() {
  Object.assign(form, { id: 0, name: '', ip: '', port: 8080, description: '' })
}

// Handlers
function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { name: '', ip: '', status: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }

function handleAdd() { resetForm(); isEdit.value = false; dialogVisible.value = true }
function handleEdit(row: any) { Object.assign(form, row); isEdit.value = true; dialogVisible.value = true }

async function handleDelete(row: any) {
  await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
  tableData.value = tableData.value.filter(i => i.id !== row.id)
  ElMessage.success(t('common.deleteSuccess'))
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    if (isEdit.value) {
      const idx = tableData.value.findIndex(i => i.id === form.id)
      if (idx > -1) tableData.value[idx] = { ...form }
    } else {
      tableData.value.push({ ...form, id: Date.now(), status: 'offline', lastSeen: new Date() })
    }
    ElMessage.success(t('common.saveSuccess'))
    dialogVisible.value = false
  } catch {}
}

onMounted(() => { fetchData() })
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
  min-width: 100px;

  &.online { .stat-value { color: $success-color; } }
  &.offline { .stat-value { color: $text-muted; } }

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
</style>
