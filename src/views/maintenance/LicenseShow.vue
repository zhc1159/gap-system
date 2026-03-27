<!-- ===========================================
     LicenseShow.vue - License Management
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.license.title')"
      titleEn="License Management"
      :icon="Key"
    />

    <!-- License Status Card -->
    <el-card class="tech-card status-card">
      <div class="status-content">
        <div class="status-icon">
          <el-icon :size="60"><Key /></el-icon>
        </div>
        <h3 class="status-label">{{ t('maintenance.license.status') }}:</h3>
        <div class="status-value">{{ licenseTime }}</div>
        <el-button
          type="primary"
          class="tech-button"
          @click="showDeviceCode"
        >
          <el-icon><View /></el-icon>
          {{ t('maintenance.license.viewDeviceCode') }}
        </el-button>
      </div>
    </el-card>

    <!-- File Upload Area -->
    <el-card class="tech-card upload-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><Upload /></el-icon>
          <span>{{ t('maintenance.license.uploadArea') }}</span>
        </div>
      </template>

      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :show-file-list="true"
        :limit="1"
        accept=".crt,.der,.pfx,.lic"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        class="tech-upload-dragger"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          {{ t('maintenance.license.uploadArea') }} <em>{{ t('maintenance.license.selectFile') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            Support formats: .crt, .der, .pfx, .lic
          </div>
        </template>
      </el-upload>

      <!-- Upload Progress -->
      <transition name="fade">
        <div v-if="uploading" class="progress-section">
          <el-progress
            :percentage="uploadProgress"
            :stroke-width="8"
            :show-text="true"
            class="tech-progress"
          />
        </div>
      </transition>

      <!-- Action Buttons -->
      <div v-if="fileList.length > 0" class="upload-actions">
        <el-button
          type="primary"
          :loading="uploading"
          @click="handleUpload"
        >
          {{ uploading ? 'Uploading...' : 'Start Upload' }}
        </el-button>
        <el-button @click="clearFiles">
          Clear
        </el-button>
      </div>
    </el-card>

    <!-- Device Code Dialog -->
    <el-dialog
      v-model="deviceCodeDialogVisible"
      :title="t('maintenance.license.deviceCode')"
      width="550px"
      class="tech-dialog"
    >
      <div class="device-code-content">
        <el-input
          v-model="deviceCode"
          type="textarea"
          :rows="10"
          readonly
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="copyDeviceCode">
          <el-icon><DocumentCopy /></el-icon>
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Key, View, Upload, UploadFilled, DocumentCopy } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// State
const licenseTime = ref('')
const deviceCode = ref('')
const deviceCodeDialogVisible = ref(false)
const fileList = ref<File[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadRef = ref()

let updateTimer: number | null = null

// Mock device code
const mockDeviceCode = `-----BEGIN DEVICE CODE-----
MIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiUMA0G
CSqGSIb3DQEBBQUAMEUxCzAJBgNVBAYTAlVT
MRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYD
VQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBM
dGQwHhcNMTcwNzE5MTExOTA1WhcNMjcwNzE5
MTExOTA1WjBFMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwY
SW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIB
-----END DEVICE CODE-----`

// Methods
function fetchLicenseTime() {
  // Simulate license time countdown
  const days = Math.floor(Math.random() * 365) + 30
  licenseTime.value = t('maintenance.license.remainingTime', { days })
}

function showDeviceCode() {
  deviceCode.value = mockDeviceCode
  deviceCodeDialogVisible.value = true
}

function copyDeviceCode() {
  navigator.clipboard.writeText(deviceCode.value)
    .then(() => {
      ElMessage.success(t('maintenance.license.copySuccess'))
    })
    .catch(() => {
      ElMessage.error(t('common.failed'))
    })
}

function handleFileChange(_file: any, files: any[]) {
  fileList.value = files.map(f => f.raw)
}

function handleFileRemove(_file: any, files: any[]) {
  fileList.value = files.map(f => f.raw)
}

async function handleUpload() {
  if (fileList.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300))
      uploadProgress.value = i
    }

    ElMessage.success(t('maintenance.license.uploadSuccess'))
    clearFiles()
    fetchLicenseTime()
  } catch (error) {
    ElMessage.error(t('maintenance.license.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function clearFiles() {
  fileList.value = []
  uploadRef.value?.clearFiles()
  uploadProgress.value = 0
}

// Lifecycle
onMounted(() => {
  fetchLicenseTime()
  // Update license status every second
  updateTimer = window.setInterval(fetchLicenseTime, 60000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
  backdrop-filter: blur(10px);
  margin-bottom: $spacing-lg;
}

.status-card {
  text-align: center;
  padding: $spacing-2xl;
}

.status-content {
  max-width: 500px;
  margin: 0 auto;
}

.status-icon {
  color: $primary-color;
  margin-bottom: $spacing-lg;
}

.status-label {
  font-size: $font-size-base;
  color: $text-muted;
  margin-bottom: $spacing-sm;
}

.status-value {
  font-size: $font-size-3xl;
  font-weight: 600;
  color: $primary-color;
  margin-bottom: $spacing-lg;
}

.tech-button {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(0, 212, 255, 0.5);

  &:hover {
    box-shadow: $shadow-glow;
  }
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

.tech-upload-dragger {
  :deep(.el-upload-dragger) {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%);
    border: 2px dashed rgba(0, 212, 255, 0.4);
    border-radius: $radius-xl;
    transition: all $transition-normal;

    &:hover {
      border-color: $primary-color;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
      box-shadow: $shadow-glow;
    }
  }

  .el-icon--upload {
    color: $primary-color;
    font-size: 67px;
    margin-bottom: 16px;
  }
}

.progress-section {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: rgba(0, 212, 255, 0.05);
  border-radius: $radius-md;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  margin-top: $spacing-lg;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
  }
}

.device-code-content {
  padding: $spacing-sm;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
