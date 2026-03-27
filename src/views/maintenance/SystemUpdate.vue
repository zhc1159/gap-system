<!-- ===========================================
     SystemUpdate.vue - System Update
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.sysUpdate.title')"
      titleEn="System Update"
      :icon="Promotion"
    />

    <!-- File Upload Section -->
    <el-card class="tech-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><Upload /></el-icon>
          <span>{{ t('maintenance.sysUpdate.uploadPackage') }}</span>
        </div>
      </template>

      <div class="upload-section">
        <el-upload
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          accept=".deepnet"
          class="upload-area"
        >
          <el-input
            v-model="fileName"
            placeholder="Please upload .deepnet file"
            readonly
          >
            <template #append>
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                Upload
              </el-button>
            </template>
          </el-input>
        </el-upload>

        <el-button
          type="warning"
          class="rollback-btn"
          @click="handleRollbackInit"
        >
          <el-icon><RefreshLeft /></el-icon>
          {{ t('maintenance.sysUpdate.rollbackInit') }}
        </el-button>
      </div>

      <!-- Upload Progress -->
      <transition name="fade">
        <div v-if="uploading" class="progress-wrapper">
          <el-progress
            :percentage="uploadProgress"
            class="upload-progress"
          />
        </div>
      </transition>
    </el-card>

    <!-- Current Version Info -->
    <el-card class="tech-card version-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><InfoFilled /></el-icon>
          <span>{{ t('maintenance.sysUpdate.currentVersion') }}</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="Product Name">
          {{ currentVersion.title }}
        </el-descriptions-item>
        <el-descriptions-item label="System Version">
          SWOS-{{ currentVersion.systemVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="Kernel Version">
          {{ currentVersion.kernelVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="Software Version">
          {{ currentVersion.softwareVersion }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- History Version Table -->
    <el-card class="tech-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><Clock /></el-icon>
          <span>{{ t('maintenance.sysUpdate.upgradeHistory') }}</span>
        </div>
      </template>

      <CommonTable
        :data="historyVersions"
        :columns="historyColumns"
        :loading="historyLoading"
      >
        <template #changelog="{ row }">
          <el-button size="small" @click="showChangelog(row)">
            View
          </el-button>
        </template>
        <template #isCurrent="{ row }">
          <el-tag :type="row.isCurrent ? 'success' : 'info'" size="small">
            {{ row.isCurrent ? 'Current' : 'History' }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <template v-if="row.isCurrent">
            <el-button type="primary" size="small" disabled>
              Current Version
            </el-button>
          </template>
          <template v-else>
            <el-button type="info" size="small" @click="handleRollback(row.version)">
              Rollback
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row.version)">
              Delete
            </el-button>
          </template>
        </template>
      </CommonTable>
    </el-card>

    <!-- Changelog Dialog -->
    <el-dialog
      v-model="changelogDialogVisible"
      title="Version Update Notes"
      width="600px"
      class="tech-dialog"
    >
      <pre class="changelog-content">{{ currentChangelog }}</pre>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Promotion, Upload, RefreshLeft, InfoFilled, Clock } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Interfaces
interface SystemVersion {
  title: string
  systemVersion: string
  kernelVersion: string
  softwareVersion: string
}

interface HistoryVersion {
  index: number
  version: string
  changelog: string
  updateTime: string
  isCurrent: boolean
}

// State
const fileName = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const historyLoading = ref(false)
const changelogDialogVisible = ref(false)
const currentChangelog = ref('')

const currentVersion = ref<SystemVersion>({
  title: 'GAP Security System',
  systemVersion: '3.2.1',
  kernelVersion: '5.4.0-42-generic',
  softwareVersion: '2.1.0'
})

const historyVersions = ref<HistoryVersion[]>([])

// Table columns
const historyColumns: TableColumn[] = [
  { prop: 'index', label: 'No.', width: 80 },
  { prop: 'version', label: 'Version', width: 120 },
  { prop: 'changelog', label: 'Update Notes', width: 120 },
  { prop: 'updateTime', label: 'Update Time', width: 180 },
  { prop: 'isCurrent', label: 'Status', width: 120 }
]

// Methods
function beforeUpload(file: File) {
  const isValid = file.name.endsWith('.deepnet')
  if (!isValid) {
    ElMessage.error('Only .deepnet files are allowed')
  }
  return isValid
}

async function handleUpload(options: any) {
  const { file } = options
  fileName.value = file.name
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      uploadProgress.value = i
    }

    ElMessage.success('Upload successful')
    fetchHistoryData()
  } catch (error) {
    ElMessage.error('Upload failed')
  } finally {
    uploading.value = false
  }
}

async function handleRollbackInit() {
  await handleRollback('initial')
}

async function handleRollback(version: string) {
  try {
    await ElMessageBox.confirm(
      `Rollback to version ${version}?`,
      t('common.confirm'),
      { type: 'warning' }
    )

    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success('Rollback successful')
    fetchHistoryData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Rollback failed')
    }
  }
}

async function handleDelete(version: string) {
  try {
    await ElMessageBox.confirm(
      `Delete version ${version}?`,
      t('common.confirm'),
      { type: 'warning' }
    )

    historyVersions.value = historyVersions.value.filter(v => v.version !== version)
    ElMessage.success('Delete successful')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
    }
  }
}

function showChangelog(row: HistoryVersion) {
  currentChangelog.value = row.changelog
  changelogDialogVisible.value = true
}

function fetchHistoryData() {
  historyLoading.value = true
  setTimeout(() => {
    historyVersions.value = [
      {
        index: 1,
        version: 'V3.2.1',
        changelog: '- Fixed security vulnerability CVE-2024-0001\n- Improved system stability\n- Updated network driver',
        updateTime: '2024-01-15 10:30:00',
        isCurrent: true
      },
      {
        index: 2,
        version: 'V3.2.0',
        changelog: '- Added new diagnostic tools\n- Optimized database performance\n- Bug fixes',
        updateTime: '2024-01-10 14:20:00',
        isCurrent: false
      },
      {
        index: 3,
        version: 'V3.1.5',
        changelog: '- Initial release for this branch\n- Core system modules',
        updateTime: '2024-01-05 09:00:00',
        isCurrent: false
      }
    ]
    historyLoading.value = false
  }, 400)
}

// Lifecycle
onMounted(() => {
  fetchHistoryData()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
  margin-bottom: $spacing-lg;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: $font-size-lg;
  font-weight: 600;
}

.tech-icon {
  color: $primary-color;
  font-size: $font-size-xl;
  margin-right: $spacing-sm;
}

.upload-section {
  display: flex;
  gap: $spacing-md;
  align-items: center;

  .upload-area {
    flex: 1;
  }

  .rollback-btn {
    flex-shrink: 0;
  }
}

.progress-wrapper {
  margin-top: $spacing-md;
}

.upload-progress {
  :deep(.el-progress-bar__outer) {
    background-color: rgba(0, 212, 255, 0.1);
  }

  :deep(.el-progress-bar__inner) {
    background: $gradient-primary;
  }
}

.version-card {
  :deep(.el-descriptions) {
    background: transparent;
  }

  :deep(.el-descriptions__label) {
    color: $text-muted;
    background: rgba(0, 212, 255, 0.05);
  }

  :deep(.el-descriptions__content) {
    color: $text-primary;
  }
}

.tech-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
  }
}

.changelog-content {
  white-space: pre-wrap;
  word-break: break-word;
  background: $bg-darker;
  padding: $spacing-md;
  border-radius: $radius-md;
  max-height: 400px;
  overflow-y: auto;
  color: $text-secondary;
  font-family: $font-family-mono;
  font-size: $font-size-sm;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
