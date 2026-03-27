<!-- ===========================================
     Antivirus.vue - Antivirus Configuration
     =========================================== -->

<template>
  <div class="page-container antivirus-config">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="virus-scan-animation"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Cpu /></el-icon>
        <h2 class="title">{{ t('antivirus.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('antivirus.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="configList" stripe class="tech-table">
        <el-table-column prop="username" :label="t('antivirus.username')" min-width="120" />
        <el-table-column prop="enabled" :label="t('antivirus.switch')" width="100">
          <template #default="{ row }">
            <div class="switch-wrapper">
              <el-switch
                v-model="row.enabled"
                @change="(val: string | number | boolean) => handleToggle(row.id, !!val)"
                active-color="#00d4ff"
                inactive-color="#4a5568"
              />
              <span :class="['status-text', row.enabled ? 'on' : 'off']">
                {{ row.enabled ? t('antivirus.on') : t('antivirus.off') }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="handleMode" :label="t('antivirus.handleMode')" width="120">
          <template #default="{ row }">
            <el-tag :type="getHandleModeTagType(row.handleMode)">
              {{ t(`antivirus.handleModes.${row.handleMode.toLowerCase()}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scanCount" :label="t('antivirus.scanCount')" width="120">
          <template #default="{ row }">
            <span class="stat-number">{{ row.scanCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="virusCount" :label="t('antivirus.virusCount')" width="120">
          <template #default="{ row }">
            <span class="stat-number virus">{{ row.virusCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('antivirus.deleteConfirm')" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small" link>
                  <el-icon><Delete /></el-icon>
                  {{ t('common.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('antivirus.editTitle') : t('antivirus.addTitle')"
      width="500px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('antivirus.username')" prop="username">
          <el-input v-model="formData.username" :placeholder="t('antivirus.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('antivirus.scanSwitch')" prop="enabled">
          <el-radio-group v-model="formData.enabled">
            <el-radio :value="true">{{ t('antivirus.on') }}</el-radio>
            <el-radio :value="false">{{ t('antivirus.off') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('antivirus.handleMode')" prop="handleMode">
          <el-select v-model="formData.handleMode" class="w-full">
            <el-option :label="t('antivirus.handleModes.quarantine')" value="QUARANTINE" />
            <el-option :label="t('antivirus.handleModes.delete')" value="DELETE" />
            <el-option :label="t('antivirus.handleModes.allow')" value="ALLOW" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Cpu, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type HandleMode = 'QUARANTINE' | 'DELETE' | 'ALLOW'

interface AntivirusConfig {
  id: string
  username: string
  enabled: boolean
  handleMode: HandleMode
  scanCount: number
  virusCount: number
  createTime: string
}

interface AntivirusFormData {
  id?: string
  username: string
  enabled: boolean
  handleMode: HandleMode
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const configList = ref<AntivirusConfig[]>([
  { id: '1', username: 'admin', enabled: true, handleMode: 'QUARANTINE', scanCount: 1250, virusCount: 3, createTime: '2024-01-10 09:00:00' },
  { id: '2', username: 'user01', enabled: true, handleMode: 'DELETE', scanCount: 856, virusCount: 1, createTime: '2024-01-12 14:30:00' },
  { id: '3', username: 'user02', enabled: false, handleMode: 'ALLOW', scanCount: 432, virusCount: 0, createTime: '2024-01-15 11:00:00' }
])

const formData = reactive<AntivirusFormData>({
  id: undefined,
  username: '',
  enabled: true,
  handleMode: 'QUARANTINE'
})

const formRules: FormRules = {
  username: [{ required: true, message: t('antivirus.usernameRequired'), trigger: 'blur' }],
  handleMode: [{ required: true, message: t('antivirus.handleModeRequired'), trigger: 'change' }]
}

// Methods
const getHandleModeTagType = (mode: HandleMode): 'warning' | 'danger' | 'success' => {
  const types: Record<HandleMode, 'warning' | 'danger' | 'success'> = {
    QUARANTINE: 'warning',
    DELETE: 'danger',
    ALLOW: 'success'
  }
  return types[mode]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { id: undefined, username: '', enabled: true, handleMode: 'QUARANTINE' })
  dialogVisible.value = true
}

const handleEdit = (row: AntivirusConfig) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    enabled: row.enabled,
    handleMode: row.handleMode
  })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = configList.value.findIndex(item => item.id === id)
  if (index > -1) {
    configList.value.splice(index, 1)
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleToggle = async (id: string, enabled: boolean) => {
  const config = configList.value.find(item => item.id === id)
  if (config) {
    config.enabled = enabled
    ElMessage.success(t('common.success'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const config = configList.value.find(item => item.id === formData.id)
      if (config) {
        config.username = formData.username
        config.enabled = formData.enabled
        config.handleMode = formData.handleMode
      }
      ElMessage.success(t('common.success'))
    } else {
      const newConfig: AntivirusConfig = {
        id: Date.now().toString(),
        username: formData.username,
        enabled: formData.enabled,
        handleMode: formData.handleMode,
        scanCount: 0,
        virusCount: 0,
        createTime: new Date().toLocaleString()
      }
      configList.value.push(newConfig)
      ElMessage.success(t('common.success'))
    }
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  // Fetch initial data
})
</script>

<style scoped lang="scss">
.antivirus-config {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .virus-scan-animation {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.02) 0%, transparent 60%);
    }
  }

  .page-header {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    .title-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 28px;
        color: $primary-color;
      }

      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .action-card,
  .table-card {
    background: $bg-card;
    border: 1px solid $border-color;
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
  }

  .tech-table {
    .switch-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-text {
        font-size: 12px;
        &.on { color: $primary-color; }
        &.off { color: #909399; }
      }
    }

    .stat-number {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: $primary-color;

      &.virus { color: #f56c6c; }
    }

    :deep(th) {
      background: rgba(0, 212, 255, 0.1) !important;
      color: $primary-color !important;
    }

    :deep(td) {
      background: transparent;
      color: $text-primary;
    }
  }
}

.w-full {
  width: 100%;
}
</style>
