<!-- ===========================================
BackupConfig.vue - Configuration Backup
=========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.backup.title')"
      titleEn="Backup Config"
      :icon="FolderAdd"
    >
      <template #extra>
        <el-button type="primary" @click="handleCreateBackup">
          <el-icon><Plus /></el-icon>
          {{ t('maintenance.backup.createBackup') }}
        </el-button>
        <el-upload
          ref="uploadRef"
          :show-file-list="false"
          :before-upload="handleRestoreUpload"
          accept=".bak,.tar,.gz"
        >
          <el-button type="warning">
            <el-icon><Upload /></el-icon>
            {{ t('maintenance.backup.restoreBackup') }}
          </el-button>
        </el-upload>
      </template>
    </PageHeader>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">备份总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formatSize(stats.totalSize) }}</span>
        <span class="stat-label">总大小</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.today }}</span>
        <span class="stat-label">今日备份</span>
      </div>
    </div>

    <!-- Backup List -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #size="{ row }">
        {{ formatSize(row.size) }}
      </template>
      <template #type="{ row }">
        <el-tag :type="row.type === 'auto' ? 'info' : 'primary'" size="small">
          {{ row.type === 'auto' ? '自动' : '手动' }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'failed' ? 'danger' : 'warning'" size="small">
          {{ row.status === 'completed' ? '完成' : row.status === 'failed' ? '失败' : '进行中' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleDownload(row)">
          <el-icon><Download /></el-icon>
          {{ t('maintenance.backup.downloadBackup') }}
        </el-button>
        <el-button type="warning" text size="small" @click="handleRestore(row)">
          {{ t('maintenance.backup.restoreBackup') }}
        </el-button>
        <el-button type="danger" text size="small" @click="handleDelete(row)">
          {{ t('common.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Create Backup Dialog -->
    <el-dialog v-model="createVisible" title="创建备份" width="500px">
      <el-form :model="createForm" label-width="100px" :rules="createRules" ref="createFormRef">
        <el-form-item label="备份名称" prop="name">
          <el-input v-model="createForm.name" placeholder="自动生成时间戳名称" />
        </el-form-item>
        <el-form-item label="备份内容" prop="modules">
          <el-checkbox-group v-model="createForm.modules">
            <el-checkbox label="system">系统配置</el-checkbox>
            <el-checkbox label="network">网络配置</el-checkbox>
            <el-checkbox label="security">安全策略</el-checkbox>
            <el-checkbox label="users">用户数据</el-checkbox>
            <el-checkbox label="logs">日志数据</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="createForm.remark" type="textarea" :rows="2" placeholder="备份说明（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitCreate" :loading="creating">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Restore Confirm Dialog -->
    <el-dialog v-model="restoreVisible" title="恢复确认" width="500px">
      <el-alert
        type="warning"
        title="警告：恢复备份将覆盖当前配置"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />
      <el-descriptions :column="1" border v-if="restoreTarget">
        <el-descriptions-item label="备份文件">{{ restoreTarget.name }}</el-descriptions-item>
        <el-descriptions-item label="备份时间">{{ restoreTarget.createTime }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ formatSize(restoreTarget.size) }}</el-descriptions-item>
        <el-descriptions-item label="备份内容">{{ restoreTarget.modules?.join(', ') }}</el-descriptions-item>
      </el-descriptions>
      <el-form style="margin-top: 20px">
        <el-form-item label="恢复选项">
          <el-checkbox v-model="restoreOptions.reboot">恢复后重启系统</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="restoreVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="warning" @click="confirmRestore" :loading="restoring">
          确认恢复
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { FolderAdd, Plus, Upload, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadInstance } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Upload ref
const uploadRef = ref<UploadInstance>()

// Stats
const stats = computed(() => ({
  total: tableData.value.length,
  totalSize: tableData.value.reduce((sum, item) => sum + item.size, 0),
  today: tableData.value.filter(item => {
    const today = new Date().toDateString()
    return new Date(item.createTime).toDateString() === today
  }).length
}))

// Create backup
const createVisible = ref(false)
const creating = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = reactive({
  name: '',
  modules: ['system', 'network', 'security'],
  remark: ''
})
const createRules: FormRules = {
  modules: [{ required: true, message: '请选择备份内容', trigger: 'change' }]
}

// Restore
const restoreVisible = ref(false)
const restoring = ref(false)
const restoreTarget = ref<any>(null)
const restoreOptions = reactive({ reboot: false })

// Table columns
const columns: TableColumn[] = [
  { prop: 'name', label: '备份名称', minWidth: 200 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'size', label: '大小', width: 120 },
  { prop: 'createTime', label: t('maintenance.backup.backupTime'), width: 180 },
  { prop: 'backupBy', label: t('maintenance.backup.backupBy'), width: 120 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'remark', label: '备注', minWidth: 150, showOverflowTooltip: true }
]

// Generate mock data
function generateMockData(): any[] {
  const modules = [['system', 'network'], ['system', 'security', 'users'], ['system', 'network', 'security', 'users', 'logs']]
  return Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `backup_${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}.tar.gz`,
    type: i % 5 === 0 ? 'auto' : 'manual',
    size: Math.floor(Math.random() * 50 + 10) * 1024 * 1024,
    createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
    backupBy: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'sysadm' : 'system',
    status: i === 0 ? 'pending' : i === 1 ? 'failed' : 'completed',
    remark: i % 4 === 0 ? '定期备份' : i % 4 === 1 ? '升级前备份' : '',
    modules: modules[i % 3]
  }))
}

// Format size
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const data = generateMockData()
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

// Handle create backup
function handleCreateBackup() {
  Object.assign(createForm, {
    name: `backup_${new Date().toISOString().slice(0, 10)}`,
    modules: ['system', 'network', 'security'],
    remark: ''
  })
  createVisible.value = true
}

async function submitCreate() {
  try {
    await createFormRef.value?.validate()
    creating.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    tableData.value.unshift({
      id: Date.now(),
      name: `${createForm.name}.tar.gz`,
      type: 'manual',
      size: Math.floor(Math.random() * 30 + 20) * 1024 * 1024,
      createTime: new Date().toLocaleString(),
      backupBy: 'admin',
      status: 'completed',
      remark: createForm.remark,
      modules: createForm.modules
    })
    ElMessage.success('备份创建成功')
    createVisible.value = false
  } finally {
    creating.value = false
  }
}

// Handle download
function handleDownload(row: any) {
  ElMessage.success(`正在下载 ${row.name}`)
  // In real app, would trigger file download
}

// Handle restore
function handleRestore(row: any) {
  restoreTarget.value = row
  restoreOptions.reboot = false
  restoreVisible.value = true
}

async function confirmRestore() {
  try {
    restoring.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('配置恢复成功' + (restoreOptions.reboot ? '，系统将重启' : ''))
    restoreVisible.value = false
  } finally {
    restoring.value = false
  }
}

// Handle restore upload
async function handleRestoreUpload(file: File) {
  const confirm = await ElMessageBox.confirm(
    `确定要从文件 "${file.name}" 恢复配置吗？这将覆盖当前配置。`,
    '恢复确认',
    { type: 'warning' }
  ).catch(() => false)

  if (confirm) {
    ElMessage.success('正在从上传文件恢复配置...')
    // In real app, would process uploaded file
  }
  return false // Prevent default upload behavior
}

// Handle delete
async function handleDelete(row: any) {
  await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
  tableData.value = tableData.value.filter(i => i.id !== row.id)
  ElMessage.success(t('common.deleteSuccess'))
}

// Handle page change
function handlePageChange(page: number, limit: number) {
  pagination.page = page
  pagination.limit = limit
  fetchData()
}

// Lifecycle
onMounted(() => fetchData())
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

  .stat-value {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $primary-color;
  }

  .stat-label {
    font-size: $font-size-xs;
    color: $text-muted;
    margin-top: 4px;
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

:deep(.el-checkbox) {
  margin-right: 0;
}
</style>
