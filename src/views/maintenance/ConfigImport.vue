<!-- ===========================================
     ConfigImport.vue - Configuration Import
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.configImport.title')"
      titleEn="Config Import"
      :icon="Document"
    />

    <!-- Action Buttons -->
    <el-card class="tech-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><Document /></el-icon>
          <span>{{ t('maintenance.configImport.title') }}</span>
        </div>
      </template>

      <div class="action-buttons">
        <el-button
          type="primary"
          class="tech-button"
          :icon="Download"
          @click="handleDownloadTemplate"
        >
          {{ t('maintenance.configImport.downloadTemplate') }}
        </el-button>

        <el-button
          type="primary"
          class="tech-button"
          :icon="Upload"
          @click="handleImport('in')"
        >
          {{ t('maintenance.configImport.importIntranet') }}
        </el-button>

        <el-button
          type="success"
          class="tech-button"
          :icon="Upload"
          @click="handleImport('out')"
        >
          {{ t('maintenance.configImport.importExtranet') }}
        </el-button>
      </div>
    </el-card>

    <!-- Import Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      class="tech-dialog"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :show-file-list="true"
        :limit="1"
        accept=".xlsx"
        :on-change="handleFileChange"
        class="tech-upload"
      >
        <template #trigger>
          <el-button type="primary">
            <el-icon><FolderOpened /></el-icon>
            {{ t('common.import') }}
          </el-button>
        </template>

        <template #tip>
          <div class="el-upload__tip">
            {{ t('maintenance.configImport.uploadPlaceholder') }}
          </div>
        </template>
      </el-upload>

      <!-- Upload Progress -->
      <transition name="fade">
        <div v-if="uploading" class="progress-wrapper">
          <el-progress
            :percentage="uploadProgress"
            :stroke-width="10"
            class="tech-progress"
          />
          <div class="progress-text">
            {{ t('maintenance.configImport.uploading') }}
          </div>
        </div>
      </transition>

      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="uploading"
          :disabled="!selectedFile"
          @click="handleUpload"
        >
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Download, Upload, Document, FolderOpened } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// State
const dialogVisible = ref(false)
const importType = ref<'in' | 'out'>('in')
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadRef = ref()

// Computed
const dialogTitle = computed(() => {
  const type = importType.value === 'in' ? t('maintenance.configImport.internal') : t('maintenance.configImport.external')
  return t('maintenance.configImport.uploadTitle', { type })
})

// Methods
async function handleDownloadTemplate() {
  try {
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
  } catch (error) {
    ElMessage.error(t('common.failed'))
  }
}

function handleImport(type: 'in' | 'out') {
  importType.value = type
  selectedFile.value = null
  uploadProgress.value = 0
  dialogVisible.value = true
}

function handleFileChange(file: any) {
  selectedFile.value = file.raw
}

async function handleUpload() {
  if (!selectedFile.value) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300))
      uploadProgress.value = i
    }

    ElMessage.success(t('maintenance.configImport.uploadSuccess'))
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(t('maintenance.configImport.uploadFailed'))
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: $spacing-lg;
  padding: $spacing-2xl 0;
}

.tech-button {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(0, 212, 255, 0.5);
  transition: all $transition-normal;
  padding: $spacing-md $spacing-xl;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%);
    box-shadow: $shadow-glow;
    transform: translateY(-2px);
  }
}

.tech-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
  }
}

.tech-upload {
  margin: $spacing-lg 0;
}

.progress-wrapper {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: rgba(0, 212, 255, 0.05);
  border-radius: $radius-md;
}

.progress-text {
  text-align: center;
  margin-top: $spacing-sm;
  color: $primary-color;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .tech-button {
    width: 100%;
    max-width: 300px;
    margin: $spacing-xs 0;
  }
}
</style>
