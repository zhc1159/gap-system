<!-- ===========================================
SystemUpgrade.vue - System Upgrade
=========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.upgrade.title')"
      titleEn="System Upgrade"
      :icon="Top"
    />

    <div class="upgrade-layout">
      <!-- Current Version Card -->
      <div class="version-card current">
        <div class="version-header">
          <el-icon><Monitor /></el-icon>
          <span>{{ t('maintenance.upgrade.currentVersion') }}</span>
        </div>
        <div class="version-body">
          <div class="version-number">v{{ currentVersion.version }}</div>
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="发布日期">{{ currentVersion.releaseDate }}</el-descriptions-item>
            <el-descriptions-item label="构建号">{{ currentVersion.build }}</el-descriptions-item>
            <el-descriptions-item label="更新说明">{{ currentVersion.notes }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- New Version Card -->
      <div class="version-card new" v-if="newVersion">
        <div class="version-header">
          <el-icon><Star /></el-icon>
          <span>{{ t('maintenance.upgrade.newVersion') }}</span>
        </div>
        <div class="version-body">
          <div class="version-number">v{{ newVersion.version }}</div>
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="发布日期">{{ newVersion.releaseDate }}</el-descriptions-item>
            <el-descriptions-item label="文件大小">{{ formatSize(newVersion.size) }}</el-descriptions-item>
          </el-descriptions>
          <div class="changelog">
            <div class="changelog-title">更新内容</div>
            <ul class="changelog-list">
              <li v-for="(item, idx) in newVersion.changelog" :key="idx">{{ item }}</li>
            </ul>
          </div>
        </div>
        <div class="version-footer">
          <el-button type="primary" @click="handleUpgrade" :loading="upgrading">
            <el-icon><Top /></el-icon>
            {{ t('maintenance.upgrade.upgradeNow') }}
          </el-button>
        </div>
      </div>

      <!-- No New Version -->
      <div class="version-card" v-else>
        <div class="version-header">
          <el-icon><Check /></el-icon>
          <span>系统状态</span>
        </div>
        <div class="version-body" style="text-align: center; padding: 40px;">
          <el-icon :size="60" color="#10b981"><CircleCheckFilled /></el-icon>
          <div style="margin-top: 16px; color: $success-color;">已是最新版本</div>
        </div>
      </div>
    </div>

    <!-- Upload Section -->
    <div class="upload-section">
      <div class="section-header">
        <el-icon><Upload /></el-icon>
        <span>{{ t('maintenance.upgrade.uploadPackage') }}</span>
      </div>
      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :file-list="fileList"
        accept=".tar,.gz,.pkg"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          拖拽升级包到此处，或 <em>点击选择文件</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">支持格式：.tar, .gz, .pkg，最大 500MB</div>
        </template>
      </el-upload>
      <div class="upload-actions" v-if="fileList.length">
        <el-button type="primary" @click="handleUploadUpgrade" :loading="uploading">
          开始升级
        </el-button>
        <el-button @click="fileList = []">清除文件</el-button>
      </div>
    </div>

    <!-- Upgrade History -->
    <div class="history-section">
      <div class="section-header">
        <el-icon><Clock /></el-icon>
        <span>{{ t('maintenance.upgrade.upgradeHistory') }}</span>
      </div>
      <el-table :data="historyData" style="width: 100%">
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column prop="upgradeTime" label="升级时间" width="180" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="method" label="升级方式" width="120">
          <template #default="{ row }">
            <el-tag :type="row.method === 'online' ? 'primary' : 'warning'" size="small">
              {{ row.method === 'online' ? '在线升级' : '本地上传' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      </el-table>
    </div>

    <!-- Upgrade Progress Dialog -->
    <el-dialog v-model="progressVisible" title="系统升级" width="500px" :close-on-click-modal="false" :show-close="false">
      <div class="progress-content">
        <div class="progress-step" :class="{ active: progressStep >= 1, done: progressStep > 1 }">
          <el-icon v-if="progressStep > 1"><CircleCheckFilled /></el-icon>
          <span v-else>1</span>
          <span>验证升级包</span>
        </div>
        <div class="progress-step" :class="{ active: progressStep >= 2, done: progressStep > 2 }">
          <el-icon v-if="progressStep > 2"><CircleCheckFilled /></el-icon>
          <span v-else>2</span>
          <span>备份当前配置</span>
        </div>
        <div class="progress-step" :class="{ active: progressStep >= 3, done: progressStep > 3 }">
          <el-icon v-if="progressStep > 3"><CircleCheckFilled /></el-icon>
          <span v-else>3</span>
          <span>安装升级包</span>
        </div>
        <div class="progress-step" :class="{ active: progressStep >= 4, done: progressStep > 4 }">
          <el-icon v-if="progressStep > 4"><CircleCheckFilled /></el-icon>
          <span v-else>4</span>
          <span>验证升级结果</span>
        </div>
        <div class="progress-step" :class="{ active: progressStep >= 5 }">
          <el-icon v-if="progressStep > 5"><CircleCheckFilled /></el-icon>
          <span v-else>5</span>
          <span>重启服务</span>
        </div>
      </div>
      <el-progress :percentage="progressPercent" :status="progressStep > 5 ? 'success' : undefined" />
      <div class="progress-text">{{ progressText }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Top,
  Monitor,
  Star,
  Check,
  Upload,
  UploadFilled,
  Clock,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { ElMessage, type UploadInstance, type UploadFile, type UploadUserFile } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Current version info
const currentVersion = reactive({
  version: '2.1.0',
  releaseDate: '2024-01-15',
  build: '2024011501',
  notes: '性能优化，安全增强'
})

// New version info (null if no new version)
const newVersion = ref<any>(null)

// Upload
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const uploading = ref(false)

// Upgrade progress
const progressVisible = ref(false)
const upgrading = ref(false)
const progressStep = ref(0)
const progressPercent = computed(() => (progressStep.value / 5) * 100)
const progressText = computed(() => {
  const texts = ['准备验证...', '验证升级包完整性...', '备份系统配置...', '安装升级文件...', '验证升级结果...', '重启服务中...']
  return texts[progressStep.value] || '升级完成'
})

// Upgrade history
const historyData = ref<any[]>([])

// Generate mock history
function generateHistory(): any[] {
  return [
    { version: '2.1.0', upgradeTime: '2024-01-15 14:30:00', operator: 'admin', method: 'online', status: 'success', remark: '常规升级' },
    { version: '2.0.5', upgradeTime: '2023-12-10 09:15:00', operator: 'sysadm', method: 'local', status: 'success', remark: '安全补丁' },
    { version: '2.0.4', upgradeTime: '2023-11-20 16:45:00', operator: 'admin', method: 'online', status: 'success', remark: '' },
    { version: '2.0.3', upgradeTime: '2023-10-05 11:00:00', operator: 'sysadm', method: 'local', status: 'failed', remark: '文件损坏，重试成功' }
  ]
}

// Format size
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check for new version
function checkNewVersion() {
  // Simulate checking for new version
  // Set to null if no new version
  newVersion.value = {
    version: '2.2.0',
    releaseDate: '2024-03-20',
    size: 128 * 1024 * 1024,
    changelog: [
      '新增入侵检测模块',
      '优化流量分析算法',
      '修复已知安全漏洞',
      '提升系统稳定性',
      '更新管理界面'
    ]
  }
}

// Handle file change
function handleFileChange(file: UploadFile) => { // void file {
  fileList.value = [file]
  return false
}

// Handle upload upgrade
async function handleUploadUpgrade() {
  if (!fileList.value.length) {
    ElMessage.warning('请先选择升级文件')
    return
  }

  await ElMessageBox.confirm('确定要从上传的文件升级系统吗？升级过程中请勿断电。', '升级确认', { type: 'warning' })

  uploading.value = true
  progressVisible.value = true
  progressStep.value = 0

  // Simulate upgrade process
  for (let i = 1; i <= 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    progressStep.value = i
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  uploading.value = false
  progressVisible.value = false
  fileList.value = []

  // Add to history
  historyData.value.unshift({
    version: '2.2.0',
    upgradeTime: new Date().toLocaleString(),
    operator: 'admin',
    method: 'local',
    status: 'success',
    remark: '手动上传升级'
  })

  ElMessage.success('系统升级成功')
  currentVersion.version = '2.2.0'
  newVersion.value = null
}

// Handle online upgrade
async function handleUpgrade() {
  if (!newVersion.value) return

  await ElMessageBox.confirm(
    `确定要升级到版本 v${newVersion.value.version} 吗？升级过程中系统将暂时无法访问。`,
    '升级确认',
    { type: 'warning' }
  )

  upgrading.value = true
  progressVisible.value = true
  progressStep.value = 0

  // Simulate upgrade process
  for (let i = 1; i <= 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    progressStep.value = i
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  upgrading.value = false
  progressVisible.value = false

  // Add to history
  historyData.value.unshift({
    version: newVersion.value.version,
    upgradeTime: new Date().toLocaleString(),
    operator: 'admin',
    method: 'online',
    status: 'success',
    remark: '在线升级'
  })

  ElMessage.success('系统升级成功')
  currentVersion.version = newVersion.value.version
  newVersion.value = null
}

// Lifecycle
onMounted(() => {
  checkNewVersion()
  historyData.value = generateHistory()
})

// Import ElMessageBox
import { ElMessageBox } from 'element-plus'
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.upgrade-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.version-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;

  &.current {
    .version-header { background: rgba(0, 212, 255, 0.1); }
  }

  &.new {
    border-color: $primary-color;
    .version-header { background: rgba(16, 185, 129, 0.1); }
    .version-number { color: $success-color; }
  }

  .version-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    font-weight: 600;
    color: $text-primary;
    border-bottom: 1px solid $border-color;

    .el-icon { color: $primary-color; }
  }

  .version-body {
    padding: $spacing-lg;
  }

  .version-number {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: $spacing-md;
  }

  .version-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color;
    text-align: right;
  }
}

.changelog {
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;

  .changelog-title {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .changelog-list {
    margin: 0;
    padding-left: $spacing-lg;
    color: $text-secondary;
    font-size: $font-size-sm;

    li { margin: 4px 0; }
  }
}

.upload-section,
.history-section {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.section-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $border-color;

  .el-icon { color: $primary-color; }
}

.upload-actions {
  margin-top: $spacing-md;
  text-align: right;
}

.progress-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: $text-muted;
  font-size: $font-size-xs;

  span:first-child {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-secondary;
    border: 2px solid $border-color;
  }

  .el-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  &.active {
    color: $primary-color;
    span:first-child {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  &.done {
    color: $success-color;
    .el-icon {
      background: $success-color;
      color: white;
    }
  }
}

.progress-text {
  text-align: center;
  margin-top: $spacing-md;
  color: $text-secondary;
}
</style>
