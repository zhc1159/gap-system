<!-- ===========================================
     LoadProfile.vue - Profile Management
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.profile.title')"
      titleEn="Profile Management"
      :icon="FolderOpened"
    >
      <template #extra>
        <el-button type="primary" @click="openDialog('add')">
          <el-icon><Plus /></el-icon>
          {{ t('maintenance.profile.addProfile') }}
        </el-button>
        <el-button type="success" @click="openDialog('upload')">
          <el-icon><Upload /></el-icon>
          {{ t('maintenance.profile.uploadProfile') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Profile List Table -->
    <CommonTable
      :data="profileList"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #canRestore="{ row }">
        <el-tag :type="row.canRestore ? 'success' : 'info'" size="small">
          {{ row.canRestore ? t('maintenance.profile.current') : 'History' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <template v-if="row.canRestore">
          <el-button type="primary" text size="small" @click="handleRestore(row.lineNumber)">
            {{ t('maintenance.profile.restore') }}
          </el-button>
          <el-button type="danger" text size="small" @click="handleDelete(row.lineNumber)">
            {{ t('common.delete') }}
          </el-button>
          <el-button type="info" text size="small" @click="handleDownload(row.lineNumber)">
            {{ t('maintenance.profile.download') }}
          </el-button>
        </template>
        <template v-else>
          <el-button type="danger" text size="small" @click="handleDelete(row.lineNumber)">
            {{ t('common.delete') }}
          </el-button>
        </template>
      </template>
    </CommonTable>

    <!-- Add/Upload Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="actionType === 'add' ? t('maintenance.profile.addProfile') : t('maintenance.profile.uploadProfile')"
      width="600px"
      class="tech-dialog"
    >
      <!-- Add Profile: Description Input -->
      <el-form v-if="actionType === 'add'" label-width="100px">
        <el-form-item :label="t('maintenance.profile.description')">
          <el-input
            v-model="profileDescription"
            placeholder="Enter description"
          />
        </el-form-item>
      </el-form>

      <!-- Upload Profile -->
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        accept=".tgz"
        :on-change="handleFileChange"
      >
        <template #trigger>
          <el-button type="primary">
            <el-icon><FolderOpened /></el-icon>
            {{ t('common.import') }}
          </el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('maintenance.profile.uploadPlaceholder') }}
          </div>
        </template>
      </el-upload>

      <!-- Upload Progress -->
      <transition name="fade">
        <div v-if="uploading" class="progress-section">
          <el-progress
            :percentage="uploadProgress"
            :stroke-width="8"
          />
        </div>
      </transition>

      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="uploading"
          @click="handleSubmit"
        >
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FolderOpened, Plus, Upload } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Interfaces
interface Profile {
  lineNumber: number
  date: string
  description: string
  fileName: string
  canRestore: boolean
}

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const profileList = ref<Profile[]>([])

// Dialog
const dialogVisible = ref(false)
const actionType = ref<'add' | 'upload'>('add')
const profileDescription = ref('')
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)

// Table columns
const columns: TableColumn[] = [
  { prop: 'description', label: t('maintenance.profile.description'), minWidth: 200 },
  { prop: 'fileName', label: t('maintenance.profile.fileName'), minWidth: 200 },
  { prop: 'date', label: t('maintenance.profile.date'), width: 180 },
  { prop: 'canRestore', label: t('maintenance.profile.current'), width: 120 }
]

// Mock data generator
function generateMockData(): Profile[] {
  return Array.from({ length: 15 }, (_, i) => ({
    lineNumber: i + 1,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
    description: i === 0 ? 'Current configuration' : `Backup ${i}`,
    fileName: `profile_${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}.tgz`,
    canRestore: i === 0
  }))
}

// Methods
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const data = generateMockData()
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    profileList.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function openDialog(type: 'add' | 'upload') {
  actionType.value = type
  profileDescription.value = ''
  selectedFile.value = null
  uploadProgress.value = 0
  dialogVisible.value = true
}

function handleFileChange(file: any) {
  selectedFile.value = file.raw
}

async function handleSubmit() {
  if (actionType.value === 'add') {
    // Add profile
    if (!profileDescription.value) {
      ElMessage.warning('Please enter description')
      return
    }

    uploading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success(t('common.success'))
      dialogVisible.value = false
      fetchData()
    } catch (error) {
      ElMessage.error(t('common.failed'))
    } finally {
      uploading.value = false
    }
  } else {
    // Upload profile
    if (!selectedFile.value) {
      ElMessage.warning('Please select file')
      return
    }

    uploading.value = true
    uploadProgress.value = 0

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        uploadProgress.value = i
      }
      ElMessage.success(t('common.success'))
      dialogVisible.value = false
      fetchData()
    } catch (error) {
      ElMessage.error(t('common.failed'))
    } finally {
      uploading.value = false
    }
  }
}

async function handleRestore(lineNumber: number) {
  void lineNumber

  try {
    await ElMessageBox.confirm(
      t('maintenance.profile.restoreConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('maintenance.profile.restoreSuccess'))
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.failed'))
    }
  }
}

async function handleDelete(lineNumber: number) {
  void lineNumber
  try {
    await ElMessageBox.confirm(
      t('maintenance.profile.deleteConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    profileList.value = profileList.value.filter(item => item.lineNumber !== lineNumber)
    ElMessage.success(t('maintenance.profile.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.failed'))
    }
  }
}

async function handleDownload(lineNumber: number) {
  void lineNumber
  void lineNumber

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
  } catch (error) {
    ElMessage.error(t('common.failed'))
  }
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

.tech-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
  }
}

.progress-section {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: rgba(0, 212, 255, 0.05);
  border-radius: $radius-md;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
